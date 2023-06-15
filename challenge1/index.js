import express from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { body } from "express-validator";

const app = express();
app.use(express.json());

app.post(
  "/calculate",
  [
    body("x").exists().isInt({ min: 1, max: 50 }),
    body("y").exists().isInt({ min: 1, max: 50 }),
    body("operation").exists().isIn(["+", "-", "*", "/"]),
  ],
  validateResultMiddleware,
  (req, res, next) => {
    const { x, y, operation } = req.body;
    let result;
    switch (operation) {
      case "+":
        result = x + y;
        break;
      case "*":
        result = x * y;
        break;
      case "-":
        result = x - y;
        break;
      case "/":
        result = x / y;
        break;
    }
    res.status(200).json({ result });
  }
);

function validateResultMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  }
  next();
}

app.listen(3000, () => {
  console.log("Server started");
});