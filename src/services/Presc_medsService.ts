import presc_medsDB from "../models/presc_meds.js";
import type { Presc_meds } from "../models/presc_meds.js";
import Presc_medsv from "../Validation/Presc_medsv.js";
import prescriptionDB from "../models/prescriptions.js";
import usersBD from "../models/authDB.js";

class Presc_medsService {
  constructor() {}

  async create(info: Presc_meds) {
    const check = Presc_medsv.validate(info);
    if (!check.success) return { success: false, message: check.message };

    try {
      const findPrescription = await prescriptionDB.getById(
        info.prescription_id
      );
      if (!findPrescription.success) {
        return { success: false, message: "Prescription not found" };
      }

      const created = await presc_medsDB.create(info);
      return {
        success: true,
        data: {
          medicine: created,
          prescription: findPrescription.data,
        },
      };
    } catch (error) {
      console.error("Error in create Presc_meds:", error);
      return { success: false, message: "Server error" };
    }
  }

  async all() {
    try {
      const meds = await presc_medsDB.getAll();
      return { success: true, data: meds };
    } catch (error) {
      console.error("Error in getAll Presc_meds:", error);
      return { success: false, message: "Server error" };
    }
  }

  async getById(prescription_id: number) {
    const check = Presc_medsv.validatePrescriptionId(prescription_id);
    if (!check.success) return { success: false, message: check.message };

    try {
      const meds = await presc_medsDB.getByPrescriptionId(prescription_id);
      if (!meds || meds.length === 0) {
        return {
          success: false,
          message: "No medicines found for this prescription",
        };
      }
      return { success: true, data: meds };
    } catch (error) {
      console.error("Error in getById Presc_meds:", error);
      return { success: false, message: "Server error" };
    }
  }

  async update(id: number, info: Partial<Presc_meds>) {
    if (isNaN(id)) {
      return { success: false, message: "Invalid medicine ID" };
    }

    if (info.name) {
      const checkName = Presc_medsv.validateName(info.name);
      if (!checkName.success) return checkName;
    }

    if (info.dosage) {
      const checkDosage = Presc_medsv.validateDosage(info.dosage);
      if (!checkDosage.success) return checkDosage;
    }

    if (info.duration_days !== undefined) {
      const check = Presc_medsv.validateDuration(info.duration_days);
      if (!check.success) return { success: false, message: check.message };
    }

    if (info.frequency_unit) {
      const check = Presc_medsv.validateFrequencyUnit(info.frequency_unit);
      if (!check.success) return { success: false, message: check.message };
    }

    if (info.prescription_id) {
      return { success: false, message: "Prescription ID cannot be changed" };
    }

    if (info.frequency_count !== undefined) {
      const check = Presc_medsv.validateFrequencyCount(info.frequency_count);
      if (!check.success) return { success: false, message: check.message };
    }

    try {
      const updated = await presc_medsDB.update(id, info);
      if (!updated) {
        return { success: false, message: "Medicine not found" };
      }
      return { success: true, data: updated };
    } catch (error) {
      console.error("Error in update Presc_meds:", error);
      return { success: false, message: "Server error" };
    }
  }
}

export default Presc_medsService;
