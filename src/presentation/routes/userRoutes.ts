import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';
import { container } from "../../infrastructure/di/container";
import { userSchema, userUpdateSchema } from "../middlewares/validateRequest";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

export default (router: Router): void => {
  const { userController } = container();

  const validateBody = (schema: any) => expressYupMiddleware({
    schemaValidator: {
      schema: schema
    },
  });

  // router.post(
  //   "/v1/users",
  //   authMiddleware,
  //   roleMiddleware(['admin']),
  //   validateBody(userSchema),
  //   userController.createUser
  // );

  router.get("/v1/users", authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);

  router.get("/v1/users/:id", authMiddleware, userController.getUserById);

  router.put(
    "/v1/users/:id",
    authMiddleware,
    validateBody(userUpdateSchema),
    userController.updateUser
  );

  router.delete("/v1/users/:id", authMiddleware, roleMiddleware(['admin']), userController.removeUser);
};