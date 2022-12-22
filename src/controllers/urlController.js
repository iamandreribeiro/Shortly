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

export async function getUrlById(req, res) {
    const {id} = req.params;

    try {
        const {rows} = await connectionDB.query(
          `SELECT * FROM urls WHERE id=$1`,
          [id]
        );

        return res.status(200).send(rows[0]);
      } catch (error){
        return res.status(500).send(error.message);
      }
}

export async function getShortenUrlById(req, res) {
    const {shortUrl} = req.params;

    try {
        const {rows} = await connectionDB.query(
          `SELECT * FROM urls WHERE "shortenUrl"=$1`,
          [shortUrl]
        );
    
        const incVisits = rows[0].visitCount + 1;
        const link = rows[0].url;

        await connectionDB.query(
            `UPDATE urls SET "visitCount"=$1 WHERE "shortenUrl"=$2`,
            [incVisits, shortUrl]
        );

        res.redirect(link);
      } catch (error) {
        return res.status(500).send(error.message);
      }
}

export async function deleteUrl(req, res) {
    const {id} = req.params;

    try {
        await connectionDB.query(
            `DELETE * FROM urls WHERE id=$1`,
            [id]
        );

        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}