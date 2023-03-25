import applyValidator from "../utility/apply-validator";
import { z } from "zod";

const schema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .nonempty({ message: "First name cannot be empty" }),
  lastName: z
    .string({ required_error: "Last name is required" })
    .nonempty({ message: "Last name cannot be empty" }),
  grade: z
    .string({ required_error: "Grade is required" })
    .nonempty({ message: "Grade cannot be empty" }),
});

type T = z.infer<typeof schema>;

export const validateCreateStudentRequest = applyValidator<T>(schema);
