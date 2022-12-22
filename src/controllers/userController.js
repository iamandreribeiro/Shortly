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

export async function getUsersLink(req, res) {
  try {
    const userId = res.locals.user.userId;

    const queryUser = await connectionDB.query(
      `SELECT users.name, users.id, urls.* FROM users JOIN urls ON users.id = urls."userId" WHERE users.id=$1`,
      [userId]
    );
    
    let totalVisitors = 0;
    let shortenedUrls = [];
    const name = queryUser.rows[0].name;
    const id = queryUser.rows[0].id;

    queryUser.rows.forEach((url) => {
      totalVisitors += url.visitCount;

      shortenedUrls.push({
        id: url.id,
			  shortUrl: url.shortenUrl,
			  url: url.url,
			  visitCount: url.visitCount
      });
    });


    const allUserLinks = {
      id: id,
      name: name,
      visitCount: totalVisitors,
      shortenedUrls
    }

    return res.status(200).send(allUserLinks);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}