export type LoginFormValues = {
  email: string;
  password: string;
};

export type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  isVenueManager: boolean;
  avatarUrl: string;
};

export type UpdateProfilePictureFormValues = {
  avatarUrl: string;
  avatarAlt?: string;
};

export type FormImage = { url: string };

export type VenueFormValues = {
  name: string;
  description: string;
  images: FormImage[];
  maxGuests: number;
  price: number;
  city: string;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
};
