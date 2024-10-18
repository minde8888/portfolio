export class Auth {
    constructor(
      public id: number,
      public email: string,
      public name: string,
      public password: string,
      public role: string,
      public refreshToken: string | null,
      public createdAt?: Date,
      public updatedAt?: Date
    ) { }
  }
  