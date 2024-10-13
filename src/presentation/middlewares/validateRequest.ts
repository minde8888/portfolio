import * as Yup from 'yup';

export const userSchema = Yup.object({
  body: Yup.object({
    email: Yup.string().email().required(),
    name: Yup.string().min(3).required(),
  }),
});

