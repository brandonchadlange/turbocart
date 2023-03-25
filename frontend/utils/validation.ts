import { z } from "zod";

export const studentFormSchema = z.object({
  firstName: z.string().nonempty({ message: "First name is required" }),
  lastName: z.string().nonempty({ message: "Last name is required" }),
  grade: z.string().nonempty({ message: "Please select a grade" }),
});
