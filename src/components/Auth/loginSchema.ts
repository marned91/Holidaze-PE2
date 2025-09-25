import * as yup from 'yup';
import type { TLoginFormValues } from '../../types/formTypes';

/**
 * Validation schema for login form.
 *
 * Behavior:
 * - Requires a valid email.
 * - Requires a password.
 */
export const loginSchema: yup.ObjectSchema<TLoginFormValues> = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});
