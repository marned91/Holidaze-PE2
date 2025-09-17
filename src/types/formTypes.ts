export type TLoginFormValues = {
  email: string;
  password: string;
};

export type TSignUpFormValues = {
  name: string;
  email: string;
  password: string;
  isVenueManager: boolean;
  avatarUrl: string;
};

export type TUpdateProfilePictureFormValues = {
  avatarUrl: string;
  avatarAlt?: string;
};

export type TFormImage = { url: string };

export type TVenueFormValues = {
  name: string;
  description: string;
  images: TFormImage[];
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
