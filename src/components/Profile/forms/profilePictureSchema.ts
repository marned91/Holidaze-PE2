import * as yup from 'yup';
import type { TUpdateProfilePictureFormValues } from '../../../types/formTypes';

export const profilePictureSchema: yup.ObjectSchema<TUpdateProfilePictureFormValues> =
  yup
    .object({
      avatarUrl: yup
        .string()
        .transform((value) =>
          typeof value === 'string' ? value.trim() : value
        )
        .url('Enter a valid URL')
        .required('Image URL is required'),
      avatarAlt: yup
        .string()
        .transform((value) =>
          typeof value === 'string' ? value.trim() : value
        )
        .max(120, 'Max 120 characters')
        .optional(),
    })
    .required();
