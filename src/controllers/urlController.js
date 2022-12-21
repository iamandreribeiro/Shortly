import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { connectionDB } from "../database/db.js";

export async function urlPost(req, res) {
    const {url} = req.body;
    const { authorization } = req.headers;
    const shortenUrl = nanoid();
    const date = dayjs().format("YYYY-MM-DD");

    try {
        const {rows} = await connectionDB.query(
            `SELECT * FROM sessions WHERE token=$1;`,
            [authorization]
        );

        const userId = rows[0].userId;

        await connectionDB.query(
            `INSERT INTO urls (url, "shortenUrl", "userId", "createdAt") VALUES ($1, $2, $3, $4);`,
            [url, shortenUrl, userId, date]
        );

        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}