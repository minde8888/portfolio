import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';
import { container } from "../../infrastructure/di/container";
import { userSchema, userUpdateSchema } from "../middlewares/validateRequest";

export default (router: Router): void => {
  const { createUser, getAllUsers, getUserById, updateUser } = container();

  const validateBody = (schema: any) => expressYupMiddleware({
    schemaValidator: {
      schema: schema
    },
  });

  router.post(
    "/v1/users",
    validateBody(userSchema),
    createUser
  );

  router.get("/v1/users", getAllUsers);

  router.get("/v1/users/:id", getUserById);

  router.put(
    "/v1/users/:id",
    validateBody(userUpdateSchema),
    updateUser
  );
};