import { validate } from "uuid";
import { urlSchema } from "../models/urlModel.js";

export async function urlValidation(req, res, next) {
  const { authorization } = req.headers;
  const { url } = req.body;

  if (!authorization || !validate(authorization)) {
    return res.sendStatus(401);
  }

  const validation = urlSchema.validate({ url });

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(422).send(errors);
  }

  next();
}
