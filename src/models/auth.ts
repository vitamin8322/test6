export interface ILoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ILoginValidation {
  email: string;
  password: string;
}

export interface Auth{
  email: string,
  password: string,
  id: number,
  avatar: string, 
  name: string,
  state: string,
  region: string,
  gender: string
}

export interface RegisterFormFields{
  email: string;
  password: string;
  repeatPassword: string;
  name: string;
  gender: string;
  state: number;
  region: number;
}
