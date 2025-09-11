import type { Patient } from "../models/patientDB.js";

class PatientValidation {
  private genderValues = ["Male", "Female"];
  private phoneRegex = /^[0-9]{10,15}$/;

  validateAge(age?: number) {
    if (age === undefined || age === null)
      return { success: false, message: "Age is required" };
    if (age <= 0)
      return { success: false, message: "Age must be greater than 0" };
    if (age > 120)
      return { success: false, message: "Age is unrealistic" };
    return { success: true };
  }

  validateGender(gender?: string) {
    if (!gender)
      return { success: false, message: "Gender is required" };
    if (!this.genderValues.includes(gender))
      return {
        success: false,
        message: `Invalid gender, must be one of: ${this.genderValues.join(", ")}`
      };
    return { success: true };
  }

  validateAddress(address?: string) {
    if (!address || !address.trim())
      return { success: false, message: "Address is required" };
    if (address.length > 255)
      return { success: false, message: "Address is too long" };
    return { success: true };
  }

  validateEmergencyContact(contact?: string) {
    if (!contact)
      return { success: false, message: "Emergency contact is required" };
    if (!this.phoneRegex.test(contact))
      return { success: false, message: "Emergency contact must be a valid phone number" };
    return { success: true };
  }

  validate(patient: Patient) {
    let result = this.validateAge(patient.age);
    if (!result.success) return result;

    result = this.validateGender(patient.gender);
    if (!result.success) return result;

    result = this.validateAddress(patient.address);
    if (!result.success) return result;

    result = this.validateEmergencyContact(patient.emergencyContact);
    if (!result.success) return result;

    return { success: true, message: "All patient validations passed" };
  }
}

export default PatientValidation;
