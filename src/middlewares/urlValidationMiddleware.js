import { validate } from "uuid";
import { connectionDB } from "../database/db.js";
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

export async function urlExist(req, res, next) {
  const {id} = req.params;

  try {
    const {rows} = await connectionDB.query(
      `SELECT * FROM urls WHERE id=$1;`,
      [id]
    );

    if(rows.length === 0) {
      return res.sendStatus(404);
    }
  } catch (error){
    return res.status(500).send(error.message);
  }

  next();
}

export async function shortenUrlExist(req, res, next) {
  const {shortUrl} = req.params;
  
  try {
    const {rows} = await connectionDB.query(
      `SELECT * FROM urls WHERE "shortenUrl"=$1`,
      [shortUrl]
    );

    if(rows.length === 0) {
      return res.sendStatus(404);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }

  next();
}

export async function urlDeleteValidation(req, res, next) {
  const {authorization} = req.headers;
  const {id} = req.params;

  if (!authorization || !validate(authorization)) {
    return res.sendStatus(401);
  }

  try {
    const urls = await connectionDB.query(
      `SELECT * FROM urls WHERE id=$1`,
      [id]
    );

    const sessions = await connectionDB.query(
      `SELECT * FROM sessions WHERE token=$1`,
      [authorization]
    );

    const userUrlId = urls.rows[0].userId;
    const userSessionId = sessions.rows[0].userId;

    if(urls.rows.length === 0) {
      return res.sendStatus(404);
    }

    if(userSessionId !== userUrlId) {
      return res.sendStatus(401);
    }

  } catch (error) {
    return res.status(500).send(error.message);
  }
  
  next();
}