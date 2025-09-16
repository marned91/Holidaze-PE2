import * as yup from 'yup';
import type { VenueFormValues } from '../../../types/formTypes';

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 25;
export const CITY_NAME_REGEX = /^[A-ZÆØÅ][\p{L} .'\-]*$/u;

export const venueSchema: yup.ObjectSchema<VenueFormValues> = yup
  .object({
    name: yup
      .string()
      .required('Venue name is required')
      .max(100, 'Max 40 characters'),
    description: yup
      .string()
      .required('Description is required')
      .max(1000, 'Max 600 characters'),
    images: yup
      .array()
      .of(
        yup
          .object({
            url: yup
              .string()
              .url('Enter a valid URL')
              .required('Image URL is required'),
          })
          .required()
      )
      .min(2, 'Add at least 2 images')
      .required(),
    maxGuests: yup
      .number()
      .typeError('Select a number')
      .integer('Whole number')
      .min(MIN_GUESTS, `At least ${MIN_GUESTS} guest`)
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
