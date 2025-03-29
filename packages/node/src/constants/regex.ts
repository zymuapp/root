export const Regex = {
  // matches a valid email address
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
  // matches a name with only letters, numbers, spaces
  name: /^[a-zA-ZÀ-ÿ0-9-\s]+$/,
  bio: /^[a-zA-ZÀ-ÿ0-9-.,;:!?'"()@#$%^&*()_+\-=\[\]{}|\\~` ]+$/,
  // matches a username with lowercase letters, numbers, underscores, and dots
  //  - must be 3 to 48 characters long
  //  - cannot have consecutive dots
  //  - cannot start or end with a dot
  username: /^(?!\.)(?!.*\.\.)(?!.*\.$)[a-z0-9_.]{3,48}$/,
  // matches an international phone number
  phoneNumber: /^\+(?:[0-9] ?){6,14}[0-9]$/,
  // matches a password with at least 8 characters, one uppercase letter, one lowercase letter and one number or special character
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d\W]).{8,}$/,
  // matches a password with at least 8 characters
  passwordMinLength: /^.{8,}$/,
  // matches a password with one uppercase letter
  passwordUppercase: /^(?=.*[A-Z])/,
  // matches a password with one lowercase letter
  passwordLowercase: /^(?=.*[a-z])/,
  // matches a password with one number or special character
  PasswordNumberSpecial: /^(?=.*[\d\W])/,
  // matches an image url
  imageUrl:
    /^(https:\/\/|http:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&//=]*)\.(jpg|jpeg|gif|png|bmp|tiff|tga|svg)$/i,
};
