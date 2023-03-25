import { ZodError } from "zod";
import HttpException from "./http-exception";

const applyValidator = <T>(schema: any) => {
  return (data: T) => {
    try {
      schema.parse(data);
    } catch (err) {
      const { errors } = err as ZodError;

      throw new HttpException(
        {
          success: false,
          data: null,
          messages: errors.map((e) => e.message),
        },
        400
      );
    }
  };
};

export default applyValidator;
