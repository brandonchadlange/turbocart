import dbInstance from "@/backend/db";
import { RouteHandler } from "@/backend/utility/route-handler";

export default RouteHandler({
  async DELETE(req, res) {
    const studentId = req.query.id as string;

    try {
      await dbInstance.student.delete({
        where: {
          id: studentId,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Failed to delete student");
    }

    res.status(200).send("Student successfully deleted");
  },
});
