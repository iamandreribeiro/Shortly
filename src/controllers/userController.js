import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { connectionDB } from "../database/db.js";
import { v4 } from "uuid";

export async function signIn(req, res) {
  const {email} = req.body;  
  const token = v4();
  const date = dayjs().format("YYYY-MM-DD");

    try {
      const {rows} = await connectionDB.query(
        `SELECT * FROM users WHERE email=$1;`,
        [email]
      );

      const userId = rows[0].id;

      await connectionDB.query(
        `INSERT INTO sessions (token, "userId", "createdAt") VALUES ($1, $2, $3);`,
        [token, userId, date]
      );
      
      return res.status(200).send(token);
      
    } catch (error) {
      return res.status(500).send(error.message);
    }
}

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  const encryptedPassword = bcrypt.hashSync(password, 10);
  const date = dayjs().format("YYYY-MM-DD");

  try {
    await connectionDB.query(
      `INSERT INTO users (name, email, password, "createdAt") VALUES ($1, $2, $3, $4);`,
      [name, email, encryptedPassword, date]
    );

    return res.sendStatus(201);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}
