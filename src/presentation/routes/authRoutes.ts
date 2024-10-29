import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware';

import { container } from "../../infrastructure/di/container";
import { IContainerResult } from "../../infrastructure/interfaces/IContainerResult";
import { adaptMiddleware } from "../../infrastructure/http/middleware/ExpressMiddlewareAdapter";

import { loginSchema, registerSchema } from "../middlewares/validateRequest";
import { isDeletedMiddleware } from "../middlewares/deletedEntityMiddleware";


export default async (router: Router): Promise<void> => {
  const { authController }: IContainerResult = await container();
  const validateBody = (schema: any) => expressYupMiddleware({
    schemaValidator: {
      schema: schema
    },
  });

  router.post(
    "/v1/login",
    validateBody(loginSchema),
    isDeletedMiddleware, 
    authController.login
  );

  router.post(
    "/v1/register",
    validateBody(registerSchema),
    authController.register
  );

  router.post("/v1/refresh-token", authController.refreshToken);
};