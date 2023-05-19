import { z } from "zod";

export const studentFormSchema = z.object({
  firstName: z.string().nonempty({ message: "First name is required" }),
  lastName: z.string().nonempty({ message: "Last name is required" }),
  grade: z.string().nonempty({ message: "Please select a grade" }),
});

export const userDetailsSchema = z.object({
  firstName: z.string().nonempty({ message: "First name is required" }),
  lastName: z.string().nonempty({ message: "Last name is required" }),
  email: z
    .string()
    .nonempty({ message: "Email address is required" })
    .email({ message: "Please provide a valid email address" }),
});
