import dbInstance from "@/backend/db";
import HttpException from "@/backend/utility/http-exception";
import { RouteHandler } from "@/backend/utility/route-handler";
import { validateCreateStudentRequest } from "@/backend/validators/student";
import { getCookie } from "cookies-next";

export default RouteHandler({
  async GET(req, res) {
    const sessionId = getCookie("session", { req, res });
    const students = await dbInstance.student.findMany({
      where: {
        sessionId: sessionId?.toString(),
      },
    });
    res.status(200).send(students);
  },
  async POST(req, res) {
    const sessionId = getCookie("session", { req, res });

    validateCreateStudentRequest(req.body);

    try {
      await dbInstance.student.create({
        data: {
          sessionId: sessionId!.toString(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          grade: req.body.grade,
        },
      });

      res.status(201).send("Student successfully created.");
    } catch (err) {
      console.log(err);

      throw new HttpException(
        {
          data: null,
          success: false,
          messages: [
            "An error occurred while creating the student. Please try again later.",
          ],
        },
        500
      );
    }
  },
});
