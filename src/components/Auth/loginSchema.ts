import * as yup from 'yup';
import type { TLoginFormValues } from '../../types/formTypes';

export const loginSchema: yup.ObjectSchema<TLoginFormValues> = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});
