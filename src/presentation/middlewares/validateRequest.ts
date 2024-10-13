import * as Yup from "yup";

export const userSchema = Yup.object({
  body: Yup.object({
    email: Yup.string().email().required(),
    name: Yup.string().min(3).required(),
  }),
});

export const userUpdateSchema = Yup.object({
  params: Yup.object({
    id: Yup.number().required().positive().integer(),
  }),
  body: Yup.object({
    email: Yup.string().email(),
    name: Yup.string().min(3),
  }).test('at-least-one-field', 'At least one field (email or name) must be provided', (value) => {
    return value.email !== undefined || value.name !== undefined;
  }),
});