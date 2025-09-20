import appointmentsV from "../Validation/appointmentsV.js";
import type { Appointment } from "../models/appointments.js";
import appointmentsDB from "../models/appointments.js";
import doctorDB from "../models/doctorsDB.js";
import patientDB from "../models/patientDB.js";
import usersBD from "../models/authDB.js";
import {
  sendEmailToPatient,
  sendEmailToDoctor,
  sendEmailRejection,
} from "../utils/sendOTP.js";

class AppointmentsService {
  async create(appointment: Appointment) {
    const check = appointmentsV.validate(appointment);
    if (!check.success) return check;

    try {
      const findDoctor = await usersBD.getUserById(appointment.doctor_user_id);
      const findPatient = await usersBD.getUserById(
        appointment.patient_user_id
      );
      const patient = await patientDB.getPatientByUserId(
        appointment.patient_user_id
      );

      if (!findDoctor) return { success: false, message: "Doctor not found" };
      if (!findPatient) return { success: false, message: "Patient not found" };

      if (findDoctor.role !== "doctor")
        return { success: false, message: "This user is not a doctor" };
      if (findPatient.role !== "patient")
        return { success: false, message: "This user is not a patient" };

      const startTime = new Date(appointment.starts_at);
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      appointment.ends_at = endTime.toISOString();

      const doctor = await doctorDB.getDoctorByUserId(
        appointment.doctor_user_id
      );
      if (!doctor || !doctor.schedule) {
        return { success: false, message: "Doctor schedule not found" };
      }

      const schedule = doctor.schedule;
      const dayName = startTime.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const slots: string[] = schedule[dayName];
      console.log(slots);

      if (!slots) {
        return {
          success: false,
          message: "Doctor is not available on this day",
        };
      }

      let isInSlot = false;

      for (const slot of slots) {
        const [slotStart, slotEnd] = slot.split("-");

        const dateOnly = startTime.toISOString().split("T")[0];

        const slotStartDate = new Date(`${dateOnly}T${slotStart}:00.000Z`);
        const slotEndDate = new Date(`${dateOnly}T${slotEnd}:00.000Z`);

        if (startTime >= slotStartDate && endTime <= slotEndDate) {
          isInSlot = true;
          break;
        }
      }

      if (!isInSlot) {
        return {
          success: false,
          message: "Appointment not within doctor's schedule",
        };
      }
      const patientAppointments = await appointmentsDB.getByPatientId(
        appointment.patient_user_id
      );
      const existingPatientAppointment = patientAppointments.find(
        (appt: any) => appt.doctor_user_id === appointment.doctor_user_id
      );

      if (existingPatientAppointment) {
        return {
          success: false,
          message: `You already have an appointment with Dr. ${
            findDoctor.name
          } on ${new Date(
            existingPatientAppointment.starts_at
          ).toLocaleString()}`,
        };
      }

      const overlapping = await appointmentsDB.findOverlapping(
        appointment.doctor_user_id,
        appointment.starts_at,
        appointment.ends_at
      );

      if (overlapping.length > 0) {
        return {
          success: false,
          message: "This slot is already booked for the doctor",
        };
      }

      const existingAppointments = await appointmentsDB.getByDoctorId(
        appointment.doctor_user_id
      );

      for (const appt of existingAppointments) {
        const apptStart = new Date(appt.starts_at);
        const apptEnd = new Date(appt.ends_at);

        if (
          (startTime >= apptStart && startTime < apptEnd) ||
          (endTime > apptStart && endTime <= apptEnd) ||
          (startTime <= apptStart && endTime >= apptEnd)
        ) {
          return { success: false, message: "Time slot already booked" };
        }

        const diffStart =
          Math.abs(startTime.getTime() - apptStart.getTime()) / (1000 * 60);
        const diffEnd =
          Math.abs(endTime.getTime() - apptEnd.getTime()) / (1000 * 60);

        if (diffStart < 30 || diffEnd < 30) {
          return {
            success: false,
            message: "Appointments must be at least 30 minutes apart",
          };
        }
      }
      const newAppointment = await appointmentsDB.create({
        ...appointment,
        status: "Pending",
      });
      const startMinus3 = new Date(
        new Date(appointment.starts_at).getTime() - 3 * 60 * 60 * 1000
      );
      const endMinus3 = new Date(
        new Date(appointment.ends_at).getTime() - 3 * 60 * 60 * 1000
      );

      await sendEmailToDoctor(
        findDoctor.email,
        findDoctor.name,
        findPatient.name,
        patient.age,
        patient.gender,
        startMinus3,
        endMinus3,
        newAppointment.id,
        appointment.doctor_user_id
      );
      return { success: true, data: newAppointment };
    } catch (err) {
      console.error("Error creating appointment:", err);
      return { success: false, message: "Server error" };
    }
  }

  async updateAppointmentStatus(
    appointmentId: number,
    doctorId: number,
    status: "Confirmed" | "Canceled"
  ) {
    const appointment = await appointmentsDB.getById(appointmentId);

    if (!appointment)
      return { success: false, message: "Appointment not found" };
    if (appointment.doctor_user_id !== doctorId) {
      return { success: false, message: "Not authorized" };
    }

    let updated;

    if (status === "Confirmed") {
      updated = await appointmentsDB.update(appointmentId, { status });

      const patient = await usersBD.getUserById(appointment.patient_user_id);
      const doctor = await usersBD.getUserById(appointment.doctor_user_id);

      await sendEmailToPatient(
        patient.email,
        patient.name,
        doctor.name,
        new Date(updated.starts_at),
        new Date(updated.ends_at)
      );
    } else if (status === "Canceled") {
      await appointmentsDB.delete(appointmentId);

      const patient = await usersBD.getUserById(appointment.patient_user_id);
      const doctor = await usersBD.getUserById(appointment.doctor_user_id);
      const startMinus3 = new Date(
        new Date(appointment.starts_at).getTime() - 3 * 60 * 60 * 1000
      );
      const endMinus3 = new Date(
        new Date(appointment.ends_at).getTime() - 3 * 60 * 60 * 1000
      );
      await sendEmailRejection(
        patient.email,
        patient.name,
        doctor.name,
        startMinus3,
        endMinus3
      );

      return { success: true, message: "Appointment rejected and deleted" };
    }

    return { success: true, data: updated };
  }

  async getAll() {
    try {
      const all = await appointmentsDB.getAll();
      return { success: true, data: all };
    } catch (err) {
      console.error("Error in getAll:", err);
      return { success: false, message: "Server error" };
    }
  }

  async getById(userId: number) {
    try {
      if (isNaN(userId)) {
        return { success: false, message: "Invalid userId" };
      }

      const all = await appointmentsDB.getById(userId);

      if (!all || all.length === 0) {
        return { success: false, message: "No appointments found" };
      }

      return { success: true, data: all };
    } catch (err) {
      console.error("Error in getAllById:", err);
      return { success: false, message: "Server error" };
    }
  }

  async getdoctorByid(doctor_user_id: number) {
    try {
      const check = appointmentsV.validatePatientId(doctor_user_id);
      if (!check.success) {
        return check;
      }
      const doctorAppointments = await appointmentsDB.getByDoctorId(
        doctor_user_id
      );

      if (!doctorAppointments || doctorAppointments.length === 0) {
        return {
          success: false,
          message: "No appointments found for this doctor",
        };
      }

      return { success: true, data: doctorAppointments };
    } catch (err) {
      console.error("Error in getdoctorByid:", err);
      return { success: false, message: "Server error" };
    }
  }

  async getpatientByid(patient_user_id: number) {
    try {
      const check = appointmentsV.validatePatientId(patient_user_id);
      if (!check.success) {
        return check;
      }

      const patientAppointments = await appointmentsDB.getByPatientId(
        patient_user_id
      );

      if (!patientAppointments || patientAppointments.length === 0) {
        return {
          success: false,
          message: "No appointments found for this patient",
        };
      }

      return { success: true, data: patientAppointments };
    } catch (err) {
      console.error("Error in getpatientByid:", err);
      return { success: false, message: "Server error" };
    }
  }
}

export default AppointmentsService;
