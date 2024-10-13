import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';
import { container } from "../../infrastructure/di/container";
import { userSchema } from "../middlewares/validateRequest";

export default (router: Router): void => {
  const { createUser, getAllUsers, getUserById } = container();

  router.post(
    "/v1/users",
    expressYupMiddleware({
      schemaValidator: {
        schema: {
          body: {
            yupSchema: userSchema
          }
        }
      },
    }),
    createUser
  );

  router.get("/v1/users", getAllUsers);

  router.get("/v1/users/:id", getUserById);
};