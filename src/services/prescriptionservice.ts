import type { Prescription } from "../models/prescriptions.js";
import prescriptionsV from "../Validation/prescriptionsV.js";
import usersBD from "../models/authDB.js";
import prescriptionDB from "../models/prescriptions.js";
import Appointment from '../models/appointments.js'
class PrescriptionService {
  constructor() {}

  async create(info: Prescription) {
    const check = prescriptionsV.validate(info);
    if (!check.success) {
      return { success: false, message: check.message };
    }

    try {
      const doctor = await usersBD.getUserById(info.doctor_id);
      if (!doctor || doctor.role !== "doctor") {
        return { success: false, message: "Doctor not found or invalid" };
      }

      const patient = await usersBD.getUserById(info.patient_id);
      if (!patient || patient.role !== "patient") {
        return { success: false, message: "Patient not found or invalid" };
      }
      const appointment = await Appointment.getById(info.appointment_id)
      if (!appointment ) {
        return { success: false, message: "appointment not found or invalid" };
      }

      const newPrescription = await prescriptionDB.create(info);

      return { success: true, data: newPrescription };
    } catch (error) {
      console.error("Error in create prescription:", error);
      return { success: false, message: "Server error" };
    }
  }

  async getAll() {
    try {
      const all = await prescriptionDB.getAll();
      return { success: true, data: all };
    } catch (error) {
      console.error("Error in getAll prescriptions:", error);
      return { success: false, message: "Server error" };
    }
  }

  async getById(id: number) {
    if (isNaN(id)) {
      return { success: false, message: "Invalid prescription ID" };
    }

    try {
      const prescription = await prescriptionDB.getById(id);
      if (!prescription.success) {
        return { success: false, message: "Prescription not found" };
      }

      return { data: prescription };
    } catch (error) {
      console.error("Error in getById prescription:", error);
      return { success: false, message: "Server error" };
    }
  }

  async update(id: number, advice: string) {
    if (isNaN(id)) {
      return { success: false, message: "Invalid prescription ID" };
    }

    const checkAdvice = prescriptionsV.validateAdvice(advice);
    if (!checkAdvice.success) {
      return { success: false, message: checkAdvice.message };
    }

    try {
      const updated = await prescriptionDB.update(id, advice);

      if (!updated.success) {
        return { success: false, message: "Prescription not found" };
      }

      return {data: updated };
    } catch (error) {
      console.error("Error in update prescription:", error);
      return { success: false, message: "Server error" };
    }
  }
}

export default  PrescriptionService;
