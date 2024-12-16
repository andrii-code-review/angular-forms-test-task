export interface CheckUserNameResponseData {
  isAvailable: boolean;
}

export interface CreateUserDataParams {
  birthday: string;
  country: string;
  username: string;
}

export interface CreateUserDataResponse {
  result: string;
}
