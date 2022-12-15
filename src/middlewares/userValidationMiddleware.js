import { connectionDB } from "../database/db.js";
import { signInSchema, signUpSchema } from "../models/userModel.js";
import bcrypt from "bcrypt";

export async function signInValidation(req, res, next) {
  const { email, password } = req.body;

  const validation = signInSchema.validate({ email, password });

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(422).send(errors);
  }

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (rows.length === 0 ) {
      return res.sendStatus(401);
    } else if(!bcrypt.compareSync(password, rows[0].password)) {
        return res.sendStatus(401);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }

  next();
}

export async function signUpValidation(req, res, next) {
  const { name, email, password, confirmPassword } = req.body;

  const validation = signUpSchema.validate({
    name,
    email,
    password,
    confirmPassword,
  });

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(422).send(errors);
  }

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );
    if (rows.length > 0) {
      return res.sendStatus(409);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }

  next();
}
