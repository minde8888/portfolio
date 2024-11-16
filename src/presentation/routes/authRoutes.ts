import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';

import { container } from "../../infrastructure/di/container";
import { IContainerResult } from "../../infrastructure/interfaces/IContainerResult";
import { asyncHandler } from "../../infrastructure/utils/asyncHandler";
import { IJwtConfig } from "../../infrastructure/types";

import { loginSchema, registerSchema } from "../validation/validateRequest";
import { isDeletedMiddleware } from "../middlewares/deletedEntityMiddleware";

export default async (router: Router, config?: Partial<IJwtConfig>): Promise<void> => {
  const { authController }: IContainerResult = await container(config);
  const validateBody = (schema: any) => expressYupMiddleware({
    schemaValidator: {
      schema: schema
    },
  });

  router.post(
    "/login",
    validateBody(loginSchema),
    isDeletedMiddleware,
    asyncHandler(authController.login.bind(authController))
  );

  router.post(
    "/register",
    validateBody(registerSchema),
    asyncHandler(authController.register)
  );

  router.post("/refresh-token", asyncHandler(authController.refreshToken));
};