// Authentication types
export interface signInRequestType {
  email: string;
  password: string;
}

export interface SignInResponseType {
  token: string;
}
