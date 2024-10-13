import { Router } from "express";
import { expressYupMiddleware } from 'express-yup-middleware'
import { container } from "../../infrastructure/di/container";
import { userSchema } from "../middlewares/validateRequest";


export default (router: Router): void => {
  const userController = container();

  router.post("/v1/users", expressYupMiddleware({
    schemaValidator: {
      schema: {
        body: {
          yupSchema: userSchema
        }
      }
    },
  }), (req, res) => userController.createUser(req, res));
};