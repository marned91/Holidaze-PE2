import * as yup from 'yup';
import type { SignUpFormValues } from '../../types/formTypes';

function isNoroffStudentEmail(email?: string): boolean {
  if (!email) return false;
  return /^[^@]+@stud\.noroff\.no$/i.test(email.trim());
}

export const signUpSchema: yup.ObjectSchema<SignUpFormValues> = yup
  .object({
    name: yup
      .string()
      .required('Name is required')
      .max(20, 'Name cannot be greater than 20 characters')
      .matches(
        /^[A-Za-z0-9_ ]+$/,
        'Only letters, numbers, spaces, and underscore are allowed'
      ),
    email: yup
      .string()
      .required('Email is required')
      .email('Enter a valid email')
      .test(
        'noroff',
        'Email must be a @stud.noroff.no address',
        isNoroffStudentEmail
      ),
    password: yup
      .string()
      .required('Password is required')
      .min(8, 'At least 8 characters'),
    isVenueManager: yup.boolean().default(false),
    avatarUrl: yup
      .string()
      .required('Image URL is required')
      .url('Enter a valid URL'),
  })
  .required();
