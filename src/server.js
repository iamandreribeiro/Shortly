import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js"
import urlRoute from "./routes/urlRoute.js"

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRoute);
app.use(urlRoute);

app.listen(4000, () => console.log(`Server running in PORT: 4000`));