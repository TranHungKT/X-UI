export interface UserDetails {
  id: String;
  email: String;
  fullName: String;
  username: String;
  location: String;
  about: String;
  confirmed: Boolean;
  avatar: Avatar;
}

export interface Avatar {
  imageId: String;
  imageSrc: String;
}
