import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js"
import urlRoute from "./routes/urlRoute.js"

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use(userRoute);
app.use(urlRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running in PORT: ${PORT}`));