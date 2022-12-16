import { nanoid } from "nanoid";

export async function urlPost(req, res) {
    const {url} = req.body;

    console.log(url);
    console.log(nanoid());
}