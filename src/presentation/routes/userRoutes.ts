import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';

import { container } from "../../infrastructure/di/container";
import { IContainerResult } from "../../infrastructure/interfaces/IContainerResult";
import { IJwtConfig } from "../../infrastructure/types";

import { userUpdateSchema } from "../validation/validateRequest";

import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { isDeletedMiddleware } from "../middlewares/deletedEntityMiddleware";

export default async (router: Router, config?: Partial<IJwtConfig>, use_redis?: boolean, redis_url?: string): Promise<void> => {
  const { userController }: IContainerResult = await container(config, use_redis, redis_url);

  const validateBody = (schema: any) => expressYupMiddleware({
    schemaValidator: {
      schema: schema
    },
  });

  router.get("/users",
    authMiddleware,
    isDeletedMiddleware,
    userController.getAllUsers);

  router.get("/users/:id",
    isDeletedMiddleware,
    authMiddleware,
    roleMiddleware(['user']),
    userController.getUserById);

  router.put(
    "/users/:id",
    authMiddleware,
    roleMiddleware(['user', 'admin']),
    validateBody(userUpdateSchema),
    userController.updateUser
  );

  router.delete("/users/:id",
    authMiddleware,
    roleMiddleware(['user', 'admin']),
    userController.removeUser);
};