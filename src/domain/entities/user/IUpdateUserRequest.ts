export interface IUpdateUserRequest {
    params: {
      id: string;
    };
    body: {
      email?: string;
      name?: string;
      password?: string;
    };
  }