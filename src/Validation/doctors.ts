import type { Doctor } from "../models/doctorsDB.js";

class DoctorValidation {
  private licenseRegex = /^[A-Z0-9-]{5,20}$/; 
  private clinicRoomRegex = /^[A-Za-z0-9\s-]{1,50}$/; 

  validateUserId(userId?: number) {
    if (!userId && userId !== 0)
      return { success: false, message: "User ID is required" };
    if (userId <= 0)
      return { success: false, message: "User ID must be a positive number" };
    return { success: true };
  }

  validateSpecialization(specialization?: string) {
    if (!specialization || !specialization.trim())
      return { success: false, message: "Specialization is required" };
    if (specialization.length < 2)
      return { success: false, message: "Specialization must be at least 2 characters" };
    if (specialization.length > 100)
      return { success: false, message: "Specialization is too long" };
    return { success: true };
  }

  validateBio(bio?: string) {
    if (bio && bio.length > 1000)
      return { success: false, message: "Bio is too long" };
    return { success: true };
  }

  validateSchedule(schedule?: Record<string, string[]>) {
  if (!schedule) 
    return { success: false, message: "Schedule is required" };

  const days = Object.keys(schedule);
  if (days.length === 0)
    return { success: false, message: "Schedule must contain at least one day" };

  for (const [day, slots] of Object.entries(schedule)) {
    if (!Array.isArray(slots) || slots.length === 0) {
      return { success: false, message: `Schedule for ${day} must contain time slots` };
    }
    for (const slot of slots) {
      if (!/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(slot)) {
        return { success: false, message: `Invalid time format in ${day}: ${slot}` };
      }
    }
  }
  return { success: true };
}

  validateLicenseNumber(licenseNumber?: string) {
    if (!licenseNumber)
      return { success: false, message: "License number is required" };
    if (!this.licenseRegex.test(licenseNumber))
      return { success: false, message: "License number format is invalid" };
    return { success: true };
  }

  validateClinicRoom(clinicRoom?: string) {
    if (!clinicRoom) return { success: true }; 
    if (!this.clinicRoomRegex.test(clinicRoom))
      return { success: false, message: "Clinic room format is invalid" };
    return { success: true };
  }

  validate(doctor: Doctor) {
    let result = this.validateUserId(doctor.user_id);
    if (!result.success) return result;

    result = this.validateSpecialization(doctor.specialization);
    if (!result.success) return result;

    result = this.validateBio(doctor.bio);
    if (!result.success) return result;

    result = this.validateSchedule(doctor.schedule);
    if (!result.success) return result;

    result = this.validateLicenseNumber(doctor.licenseNumber);
    if (!result.success) return result;

    result = this.validateClinicRoom(doctor.clinicRoom);
    if (!result.success) return result;

    return { success: true, message: "All doctor validations passed" };
  }
}

export default  new DoctorValidation(); 
