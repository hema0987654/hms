import patientDB from "../models/patientDB.js";
import authDb from "../models/authDB.js";
import PatientValidation from "../Validation/patientV.js";
import type { Patient } from "../models/patientDB.js";
import jwt from "jsonwebtoken";

const patientValidation = new PatientValidation();


class PatientService {
  constructor() {}
  private generateToken(patient: any) {
  const payload = {
    id: patient.userId,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    address: patient.address,
    emergencyContact: patient.emergencyContact,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
}


  async setPatient(info: Patient) {
    const validation = patientValidation.validate(info);
    if (!validation.success) {
      return { success: false, message: validation.message };
    }

    try {
      const user = await authDb.getUserById(info.userId);
      if (!user) {
        return { success: false, message: "User not found" };
      }
      if (user.role !== "patient") {
        return { success: false, message: "User is not a patient" };
      }
      const existingPatient = await patientDB.getPatientByUserId(info.userId);
      if (existingPatient) {
        return { success: false, message: "Patient already exists" };
      }
      const newpatient = await patientDB.setPatient(info);
      const token = this.generateToken(newpatient);
      return { success: true, data: newpatient, token };
    } catch (error: any) {
      return { success: false, message: error.message || "Database error" };
    }
  }

  async getPatientByUserId(userId: number) {
    try {
      const patient = await patientDB.getPatientByUserId(userId);
      if (!patient) {
        return { success: false, message: "Patient not found" };
      }
      return { success: true, data: patient };
    } catch (error: any) {
      return { success: false, message: error.message || "Database error" };
    }
  }

  async getAllPatients() {
    try {
      const patients = await patientDB.getAllPatients();
      return { success: true, data: patients };
    } catch (error: any) {
      return { success: false, message: error.message || "Database error" };
    }
  }

  async updatePatient(userId: number, info: Partial<Patient>) {
    try {
      if (info.age) {
        const ageValidation = patientValidation.validateAge(info.age);
        if (!ageValidation.success) {
          return { success: false, message: ageValidation.message };
        }
      }

      if (info.emergencyContact) {
        const contactValidation = patientValidation.validateEmergencyContact(
          info.emergencyContact
        );
        if (!contactValidation.success) {
          return { success: false, message: contactValidation.message };
        }
      }
      if (info.address) {
        const addressValidation = patientValidation.validateAddress(
          info.address
        );
        if (!addressValidation.success) {
          return { success: false, message: addressValidation.message };
        }
      }
      if (info.gender) {
        const genderValidation = patientValidation.validateGender(info.gender);
        if (!genderValidation.success) {
          return { success: false, message: genderValidation.message };
        }
      }
      if (info.userId) {
        return { success: false, message: "Cannot update userId" };
      }
      const updatedPatient = await patientDB.updatePatient(userId, info);
      if (!updatedPatient) {
        return { success: false, message: "Patient not found or not updated" };
      }
      return { success: true, data: updatedPatient };
    } catch (error: any) {
      return { success: false, message: error.message || "Database error" };
    }
  }

  async deletePatient(userId: number) {
    try {
      const deletedPatient = await patientDB.deletePatient(userId);
      if (!deletedPatient) {
        return {
          success: false,
          message: "Patient not found or already deleted",
        };
      }
      return { success: true, data: deletedPatient };
    } catch (error: any) {
      return { success: false, message: error.message || "Database error" };
    }
  }
}

export default PatientService;
