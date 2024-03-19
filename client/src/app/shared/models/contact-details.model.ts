export interface ContactDetails {
  _id: string | number;
  phone: string[];
  email: string[];
  socialMediaLinks: {
      facebook: string,
      twitter: string,
      instagram: string
  };
}

