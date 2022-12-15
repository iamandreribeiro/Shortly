import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { connectionDB } from "../database/db.js";
import { v4 } from "uuid";

export async function signIn(req, res) {
    const token = v4();
    res.status(200).send(token);
}

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  const encryptedPassword = bcrypt.hashSync(password, 10);
  const date = dayjs().format("YYYY-MM-DD");

  try {
    await connectionDB.query(
      `INSERT INTO users (name, email, password, createdat) VALUES ($1, $2, $3, $4);`,
      [name, email, encryptedPassword, date]
    );

    return res.status(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
