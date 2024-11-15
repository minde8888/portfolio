import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';

import { container } from "../../infrastructure/di/container";
import { IContainerResult } from "../../infrastructure/interfaces/IContainerResult";
import { asyncHandler } from "../../infrastructure/utils/asyncHandler";

import { loginSchema, registerSchema } from "../validation/validateRequest";
import { isDeletedMiddleware } from "../middlewares/deletedEntityMiddleware";
import { IJwtConfig } from "src/infrastructure/types";

export default async (router: Router, config?: Partial<IJwtConfig>): Promise<void> => {
  const { authController }: IContainerResult = await container(config);
  const validateBody = (schema: any) => expressYupMiddleware({
    schemaValidator: {
      schema: schema
    },
  });

  router.post(
    "login",
    validateBody(loginSchema),
    isDeletedMiddleware, 
    asyncHandler(authController.login)
  );

  router.post(
    "register",
    validateBody(registerSchema),
    asyncHandler(authController.register)
  );

  router.post("refresh-token", asyncHandler(authController.refreshToken));
};