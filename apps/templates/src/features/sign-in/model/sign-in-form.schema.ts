import { z } from "zod";

const formSchema = z.object({
  email: z.email({
    message: "Invalid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

type SignInFormData = z.infer<typeof formSchema>;

export { formSchema, type SignInFormData };
