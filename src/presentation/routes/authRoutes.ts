import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';
import { container } from "../../infrastructure/di/container";
import { loginSchema, registerSchema } from "../middlewares/validateRequest";
import { IContainerResult } from "../../infrastructure/interfaces/IContainerResult";

export default async (router: Router): Promise<void> => {
  // const { authController } = container();
  const { authController }: IContainerResult = await container();
  const validateBody = (schema: any) => expressYupMiddleware({
    schemaValidator: {
      schema: schema
    },
  });

  router.post(
    "/v1/auth/login",
    validateBody(loginSchema),
    authController.login
  );

  router.post(
    "/v1/auth/register",
    validateBody(registerSchema),
    authController.register
  );

  router.post("/v1/auth/refresh-token", authController.refreshToken);
};