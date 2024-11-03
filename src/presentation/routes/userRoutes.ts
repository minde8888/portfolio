import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';

import { container } from "../../infrastructure/di/container";
import { IContainerResult } from "../../infrastructure/interfaces/IContainerResult";

import { userUpdateSchema } from "../validation/validateRequest";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { isDeletedMiddleware } from "../middlewares/deletedEntityMiddleware";

export default async (router: Router): Promise<void> => {
  const { userController }: IContainerResult = await container();

  const validateBody = (schema: any) => expressYupMiddleware({
    schemaValidator: {
      schema: schema
    },
  });

  router.get("/v1/users", 
    authMiddleware, 
    isDeletedMiddleware, 
    roleMiddleware(['user','admin']), 
    userController.getAllUsers);

  router.get("/v1/users/:id", 
    isDeletedMiddleware, 
    authMiddleware, 
    roleMiddleware(['user']), 
    userController.getUserById);

  router.put(
    "/v1/users/:id",
    authMiddleware,
    roleMiddleware(['user', 'admin']),
    validateBody(userUpdateSchema),
    userController.updateUser
  );

  router.delete("/v1/users/:id",
    authMiddleware,
    roleMiddleware(['user', 'admin']),
    userController.removeUser);
};