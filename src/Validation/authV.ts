import { type Info } from "../models/authDB.js";

class ValidationResult {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
  private phoneRegex = /^[0-9]{10,15}$/;
  private validRoles = ["admin", "doctor", "nurse", "patient"];

  validateEmail(email?: string) {
    const trimmed = email?.trim();
    if (!trimmed) return { success: false, message: "Email is required" };
    if (!this.emailRegex.test(trimmed))
      return { success: false, message: "Email format is invalid" };
    return { success: true };
  }

  validatePassword(password?: string) {
    if (!password) return { success: false, message: "Password is required" };
    if (password.length < 8)
      return { success: false, message: "Password too short" };
    if (password.length > 20)
      return { success: false, message: "Password too long" };
    if (!this.passwordRegex.test(password))
      return {
        success: false,
        message:
          "Password must include uppercase, lowercase, number, and special character",
      };
    return { success: true };
  }

  validateName(name?: string) {
    const trimmed = name?.trim();
    if (!trimmed) return { success: false, message: "Name is required" };
    if (trimmed.length > 50)
      return { success: false, message: "Name too long" };
    return { success: true };
  }

  validatePhone(phone?: string) {
    const trimmed = phone?.trim();
    if (!trimmed) return { success: false, message: "Phone is required" };
    if (!this.phoneRegex.test(trimmed))
      return { success: false, message: "Phone must be a valid number" };
    return { success: true };
  }

  validateRole(role?: string) {
    if (!role) return { success: false, message: "Role is required" };
    if (!this.validRoles.includes(role))
      return {
        success: false,
        message: `Invalid role, must be one of: ${this.validRoles.join(", ")}`,
      };
    return { success: true };
  }

  validate(info: Info) {
    let result = this.validateEmail(info.email);
    if (!result.success) return result;

    result = this.validatePassword(info.password);
    if (!result.success) return result;

    result = this.validateName(info.name);
    if (!result.success) return result;

    result = this.validatePhone(info.phone);
    if (!result.success) return result;

    result = this.validateRole(info.role);
    if (!result.success) return result;

    return { success: true, message: "All validations passed" };
  }
}

export default ValidationResult;
