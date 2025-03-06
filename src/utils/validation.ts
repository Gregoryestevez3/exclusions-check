import { z } from 'zod';

// Address schema
const addressSchema = z.object({
  street: z.string()
    .min(1, 'Street address is required')
    .max(100, 'Street address must be less than 100 characters'),
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City must be less than 50 characters'),
  state: z.string()
    .min(2, 'State is required')
    .max(2, 'Use state abbreviation (e.g., NY)'),
  zipCode: z.string()
    .min(5, 'Zip code must be at least 5 digits')
    .max(10, 'Zip code is too long')
    .regex(/^\d{5}(-\d{4})?$/, 'Zip code must be in format 12345 or 12345-6789')
});

// Date of birth validation
const ageInYears = (date: Date) => {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Main exclusion schema
export const exclusionSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email is too short')
    .max(100, 'Email is too long'),
  
  dateOfBirth: z.string()
    .refine(val => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, 'Invalid date format')
    .refine(val => {
      const date = new Date(val);
      const age = ageInYears(date);
      return age >= 18;
    }, 'Person must be at least 18 years old')
    .refine(val => {
      const date = new Date(val);
      const age = ageInYears(date);
      return age <= 120;
    }, 'Date of birth is too far in the past'),
  
  documentType: z.string().optional(),
  
  identificationNumber: z.string()
    .min(4, 'Identification number is too short')
    .max(20, 'Identification number is too long'),
  
  address: addressSchema
});

// Export type for form data
export type ExclusionFormData = z.infer<typeof exclusionSchema>;
