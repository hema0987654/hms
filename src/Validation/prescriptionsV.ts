import type { Prescription } from "../models/prescriptions.js";

class PrescriptionValidation {
  validateDoctorId(doctorId?: number) {
    if (!doctorId && doctorId !== 0)
      return { success: false, message: "Doctor ID is required" };
    if (doctorId <= 0)
      return { success: false, message: "Doctor ID must be a positive number" };
    return { success: true };
  }

  validatePatientId(patientId?: number) {
    if (!patientId && patientId !== 0)
      return { success: false, message: "Patient ID is required" };
    if (patientId <= 0)
      return {
        success: false,
        message: "Patient ID must be a positive number",
      };
    return { success: true };
  }

  validateAppointmentId(appointmentId?: number) {
    if (!appointmentId && appointmentId !== 0)
      return { success: false, message: "Appointment ID is required" };
    if (appointmentId <= 0)
      return {
        success: false,
        message: "Appointment ID must be a positive number",
      };
    return { success: true };
  }

  validateAdvice(advice?: string) {
    if (!advice) return { success: false, message: "Advice is required" };
    if (advice.length > 2000)
      return { success: false, message: "Advice is too long" };
    if (advice.length <= 5) {
      return { success: false, message: "Advice is too short" };
    }
    return { success: true };
  }

  validate(prescription: Prescription) {
    let result = this.validateDoctorId(prescription.doctor_id);
    if (!result.success) return result;

    result = this.validatePatientId(prescription.patient_id);
    if (!result.success) return result;

    result = this.validateAppointmentId(prescription.appointment_id);
    if (!result.success) return result;

    result = this.validateAdvice(prescription.advice);
    if (!result.success) return result;

    return { success: true, message: "All prescription validations passed" };
  }
}

export default new PrescriptionValidation();
