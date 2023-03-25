import { DateTime } from "luxon";
const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
const stubSize = 4;

const generateStub = () => {
  let result = "";

  for (var i = 0; i < stubSize; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const generateOrderId = () => {
  const now = DateTime.now().toFormat("yyMMdd");
  return now + "-" + generateStub();
};

export default generateOrderId;
