import doctorDB from "../models/doctorsDB.js";
import usersBD from "../models/authDB.js";
import type { Doctor } from "../models/doctorsDB.js";
import DoctorValidation from "../Validation/doctors.js";

class DoctorService {
  async createDoctor(info: Doctor) {
    const check = DoctorValidation.validate(info);
    if (!check.success) return check;
    try {
      const user = await usersBD.getUserById(info.user_id);
      if (!user) return { success: false, message: "User not found" };
      if (user.role !== "doctor")
        return { success: false, message: "User is not a doctor" };
      const existingDoctor = await doctorDB.getDoctorByUserId(info.user_id);
      if (existingDoctor)
        return {
          success: false,
          message: "Doctor profile already exists for this user",
        };
      const newDoctor = await doctorDB.createDoctor(info);
      return { success: true, data: newDoctor };
    } catch (error) {
      return { success: false, message: "Error checking user" };
    }
  }

  async getDoctorById(user_id: number) {
    const check = DoctorValidation.validateUserId(user_id);
    if (!check.success) return check;
    try {
      const doctor = await doctorDB.getDoctorByUserId(user_id);
      if (!doctor) return { success: false, message: "Doctor not found" };
      return { success: true, data: doctor };
    } catch (error) {
      return { success: false, message: "Error fetching doctor" };
    }
  }

  async getAllDoctors() {
    try {
      const doctors = await doctorDB.getAllDoctors();
      return { success: true, data: doctors };
    } catch (error) {
      return { success: false, message: "Error fetching doctors" };
    }
  }

  async updateDoctor(user_id: number, info: Partial<Doctor>) {
    if (isNaN(user_id) || user_id <= 0) {
      return { success: false, message: "Invalid user_id" };
    }
    if (info.user_id) {
      return { success: false, message: "Cannot change user_id" };
    }
    if (info.specialization) {
      const checkSpec = DoctorValidation.validateSpecialization(
        info.specialization
      );
      if (!checkSpec.success) return checkSpec;
    }
    if (info.bio) {
      const checkBio = DoctorValidation.validateBio(info.bio);
      if (!checkBio.success) return checkBio;
    }
    if (info.schedule) {
      const checkSchedule = DoctorValidation.validateSchedule(info.schedule);
      if (!checkSchedule.success) return checkSchedule;
    }
    
    if (info.licenseNumber) {
      const checkLicense = DoctorValidation.validateLicenseNumber(
        info.licenseNumber
      );
      if (!checkLicense.success) return checkLicense;
    }
    try {
      const doctor = await doctorDB.getDoctorByUserId(user_id);
      if (!doctor) return { success: false, message: "Doctor not found" };
      const updatedDoctor = await doctorDB.updateDoctor(user_id, info);
      return { success: true, data: updatedDoctor };
    } catch (error) {
      return { success: false, message: "Error updating doctor" };
    }
  }

  async deleteDoctor(user_id: number) {
    const checkId = DoctorValidation.validateUserId(user_id);
    if (!checkId.success) return checkId;
    try {
      const doctor = await doctorDB.getDoctorByUserId(user_id);
      if (!doctor) return { success: false, message: "Doctor not found" };
      await doctorDB.deleteDoctor(user_id);
      return { success: true, message: "Doctor deleted successfully" };
    } catch (error) {
      return { success: false, message: "Error deleting doctor" };
    }
  }
}


export default DoctorService;
