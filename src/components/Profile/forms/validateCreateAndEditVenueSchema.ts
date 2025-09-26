import * as yup from 'yup';
import type { TVenueFormValues } from '../../../types/formTypes';

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 25;

/**
 * City name pattern:
 * - Must start with a capital letter (A–Z/ÆØÅ)
 * - Allows letters from any language (`\p{L}`), spaces, dot, apostrophe and hyphen
 */
export const CITY_NAME_REGEX = /^[A-ZÆØÅ][\p{L} .'-]*$/u;

/**
 * Yup validation schema for creating/editing a venue.
 * Notes:
 * - `images` requires at least 2 entries with valid `url`.
 * - `meta` defaults all booleans to `false`.
 * - There are known message/limit mismatches on `name` and `description` max rules;
 *   messages are left as-is to avoid functional/UI changes.
 */
export const venueSchema: yup.ObjectSchema<TVenueFormValues> = yup
  .object({
    name: yup.string().required('Venue name is required').max(40, 'Max 40 characters'),
    description: yup.string().required('Description is required').max(600, 'Max 600 characters'),
    images: yup
      .array()
      .of(
        yup
          .object({
            url: yup.string().url('Enter a valid URL').required('Image URL is required'),
          })
          .required()
      )
      .min(2, 'Add at least 2 images')
      .required(),
    maxGuests: yup
      .number()
      .typeError('Enter a number')
      .integer('Whole number')
      .min(MIN_GUESTS, 'At least 1 guest')
      .max(MAX_GUESTS, `Max ${MAX_GUESTS} guests`)
      .required('Max guests is required'),
    price: yup
      .number()
      .typeError('Enter a number')
      .min(1, 'Enter price per night')
      .max(100000, 'That seems too high')
      .required('Price per night is required'),
    city: yup
      .string()
      .required('City is required')
      .matches(CITY_NAME_REGEX, 'Start with a capital letter, e.g. Oslo'),
    meta: yup
      .object({
        wifi: yup.boolean().default(false),
        parking: yup.boolean().default(false),
        breakfast: yup.boolean().default(false),
        pets: yup.boolean().default(false),
      })
      .default({ wifi: false, parking: false, breakfast: false, pets: false }),
  })
  .required();
