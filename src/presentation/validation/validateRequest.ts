import * as Yup from "yup";

export const userSchema = Yup.object({
  body: Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
    name: Yup.string().required(),
  }),
});

export const userUpdateSchema = Yup.object({
  params: Yup.object({
    id: Yup.string()
      .required('User ID is required')
      .uuid('Invalid UUID format'),
  }),
  body: Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .trim(),
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .trim(),
    role: Yup.string()
      .oneOf(['admin', 'user'], 'Role must be either admin or user')
      .trim(),
  }).test('at-least-one-field', 
    'At least one field (email or name) must be provided', (value) => {
    return value.email !== undefined || value.name !== undefined;
  }),
});

export const loginSchema = Yup.object({
  email: Yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
}).required();

export const registerSchema = Yup.object({
  email: Yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  name: Yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
}).required();