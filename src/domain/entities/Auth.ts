export class Auth {
    constructor(
      public id: string,
      public email: string,
      public name: string,
      public password: string,
      public role: string,
      public refreshToken: string | null,
      public createdAt?: Date,
      public updatedAt?: Date
    ) { }
  }
  