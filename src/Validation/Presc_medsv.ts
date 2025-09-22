import type { Presc_meds } from "../models/presc_meds.js";

class Presc_medsV {

  validatePrescriptionId(prescription_id?: number) {
    if (prescription_id === undefined || prescription_id === null)
      return { success: false, message: "Prescription ID is required" };

    if (isNaN((prescription_id))) {
      return { success: false, message: "Prescription ID must be a number" };
    }
    if (prescription_id<=0)
      return {
        success: false,
        message: "Prescription ID must be a positive integer",
      };
    return { success: true };
  }

  validateName(name?: string) {
    if (!name || name.trim() === "")
      return { success: false, message: "Medicine name is required" };
    if (name.length > 50)
      return { success: false, message: "Medicine name is too long" };
    if(name.length<=2) return {success:false,message : "Medicine name is too short"}
    return { success: true };
  }

  validateDosage(dosage?: string) {
    if (!dosage) return { success: false, message: "Dosage is required" };
    const regex = /^\d+\s?(mg|g|ml|IU)$/i;
    if (!regex.test(dosage))
      return { success: false, message: "Dosage format is invalid" };
    return { success: true };
  }

  validateFrequencyUnit(unit?: string) {
    const allowed = ["day", "week", "month"];
    if (!unit) return { success: false, message: "Frequency unit is required" };
    if (!allowed.includes(unit))
      return {
        success: false,
        message: `Invalid frequency unit. Allowed: ${allowed.join(", ")}`,
      };
    return { success: true };
  }

  validateFrequencyCount(count?: number) {
    if (count === undefined || count === null)
      return { success: false, message: "Frequency count is required" };
    if (!Number.isInteger(count) || count <= 0)
      return {
        success: false,
        message: "Frequency count must be a positive integer",
      };
    if (count > 10)
      return { success: false, message: "Frequency count seems too high" };
    return { success: true };
  }

  validateDuration(duration?: number) {
    if (duration === undefined || duration === null)
      return { success: false, message: "Duration is required" };
    if (duration <= 0)
      return {
        success: false,
        message: "Duration must be a positive number of days",
      };
    if (duration > 365)
      return { success: false, message: "Duration seems too long" };
    return { success: true };
  }

  validate(med: Presc_meds) {
    let result = this.validatePrescriptionId(med.prescription_id);
    if (!result.success) return result;

    result = this.validateName(med.name);
    if (!result.success) return result;

    result = this.validateDosage(med.dosage);
    if (!result.success) return result;

    result = this.validateFrequencyUnit(med.frequency_unit);
    if (!result.success) return result;

    result = this.validateFrequencyCount(med.frequency_count);
    if (!result.success) return result;

    result = this.validateDuration(med.duration_days);
    if (!result.success) return result;

    return {
      success: true,
      message: "All prescription medicine validations passed",
    };
  }

  validateUpdate(med: Partial<Presc_meds>) {
    if (med.name) {
      const res = this.validateName(med.name);
      if (!res.success) return res;
    }
    if (med.dosage) {
      const res = this.validateDosage(med.dosage);
      if (!res.success) return res;
    }
    if (med.frequency_unit) {
      const res = this.validateFrequencyUnit(med.frequency_unit);
      if (!res.success) return res;
    }
    if (med.frequency_count !== undefined) {
      const res = this.validateFrequencyCount(med.frequency_count);
      if (!res.success) return res;
    }
    if (med.duration_days) {
      const res = this.validateDuration(med.duration_days);
      if (!res.success) return res;
    }
    return { success: true, message: "All update validations passed" };
  }
}

export default new Presc_medsV();
