export type AccountType = 'customer' | 'venueManager';

export type TAvatar = {
  url: string;
  alt?: string;
};

export type TBanner = {
  url: string;
  alt?: string;
};

export type TLoginResponse = {
  name: string;
  email: string;
  avatar?: TAvatar | null;
  banner?: TBanner | null;
  accessToken: string;
  venueManager?: boolean;
};

export type TRegisterResponse = {
  name: string;
  email: string;
  bio?: string;
  avatar?: TAvatar | null;
  banner?: TBanner | null;
  venueManager?: boolean;
};

export type TRegisterData = {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: TAvatar;
  banner?: TBanner;
  venueManager?: boolean;
};
