/**
 * Email validation
 * @param email - Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * URL validation
 * @param url - URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

/**
 * Phone number validation (basic)
 * @param phone - Phone number to validate
 * @returns Boolean indicating if the phone number is valid
 */
export const validatePhone = (phone: string): boolean => {
  // This is a simple validation that allows various formats
  // For production, consider using a more robust library or specific country format
  const phoneRegex = /^\+?[0-9() -]{8,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Password strength validation
 * @param password - Password to validate
 * @returns Object with validation results
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
} => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  const isValid = minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  
  return {
    isValid,
    hasMinLength: minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar
  };
};

/**
 * Required field validation
 * @param value - Value to check
 * @returns Boolean indicating if the value is not empty
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  return true;
};

/**
 * Maximum length validation
 * @param value - String to check
 * @param maxLength - Maximum allowed length
 * @returns Boolean indicating if the value is within the maximum length
 */
export const maxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Minimum length validation
 * @param value - String to check
 * @param minLength - Minimum allowed length
 * @returns Boolean indicating if the value meets the minimum length
 */
export const minLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Numeric value validation
 * @param value - Value to check
 * @returns Boolean indicating if the value is numeric
 */
export const isNumeric = (value: string): boolean => {
  return /^[0-9]+$/.test(value);
};

/**
 * Date validation (for format YYYY-MM-DD)
 * @param date - Date string to validate
 * @returns Boolean indicating if the date is valid and in the correct format
 */
export const isValidDate = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}; 