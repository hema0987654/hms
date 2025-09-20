import type { Appointment } from "../models/appointments.js";

class AppointmentValidation {
  validatePatientId(patientId?: number) {
    if (!patientId && patientId !== 0)
      return { success: false, message: "Patient ID is required" };
    if (patientId <= 0)
      return { success: false, message: "Patient ID must be a positive number" };
    return { success: true };
  }

  validateDoctorId(doctorId?: number) {
    if (!doctorId && doctorId !== 0)
      return { success: false, message: "Doctor ID is required" };
    if (doctorId <= 0)
      return { success: false, message: "Doctor ID must be a positive number" };
    return { success: true };
  }

  validateStartsAt(startsAt?: string) {
    if (!startsAt) return { success: false, message: "Start time is required" };
    if (isNaN(Date.parse(startsAt)))
      return { success: false, message: "Start time is invalid" };
    return { success: true };
  }



  validateStatus(status?: string) {
    const allowed = ["Pending", "Confirmed", "Completed"];
    if (status && !allowed.includes(status))
      return { success: false, message: `Status must be one of: ${allowed.join(", ")}` };
    return { success: true };
  }

  validateNotes(notes?: string) {
    if (notes && notes.length > 1000)
      return { success: false, message: "Notes are too long" };
    return { success: true };
  }




  validate(appointment: Appointment) {
    let result = this.validatePatientId(appointment.patient_user_id);
    if (!result.success) return result;

    result = this.validateDoctorId(appointment.doctor_user_id);
    if (!result.success) return result;

    result = this.validateStartsAt(appointment.starts_at);
    if (!result.success) return result;


    result = this.validateStatus(appointment.status);
    if (!result.success) return result;

    result = this.validateNotes(appointment.notes);
    if (!result.success) return result;

    return { success: true, message: "All appointment validations passed" };
  }
}

export default new AppointmentValidation();
