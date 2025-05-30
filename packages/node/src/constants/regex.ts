export const Regex = {
  email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,

  name: /^[a-zA-ZÀ-ÿ0-9-\s]+$/,

  bio: /^[a-zA-ZÀ-ÿ0-9-.,;:!?'"()@#$%^&*()_+\-=\[\]{}|\\~` ]+$/,

  username: /^(?!\.)(?!.*\.\.)(?!.*\.$)[a-z0-9_.]{3,48}$/,
  phoneNumber: /^\+(?:[0-9] ?){6,14}[0-9]$/,

  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d\W]).{8,}$/,
  passwordMinLength: /^.{8,}$/,
  passwordUppercase: /^(?=.*[A-Z])/,
  passwordLowercase: /^(?=.*[a-z])/,
  PasswordNumberSpecial: /^(?=.*[\d\W])/,

  imageUrl:
    /^(https:\/\/|http:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&//=]*)\.(jpg|jpeg|gif|png|bmp|tiff|tga|svg)$/i,
};
