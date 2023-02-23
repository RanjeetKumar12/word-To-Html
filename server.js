import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

import {
	convertBufferToBase64,
	getGoogleAccessToken,
	getGoogleConsentUrl,
	getGoogleDocsInHtml,
} from "./utils/index.js";

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cors());
app.use(helmet());

app.get("/generateUrl", (req, res) => {
	const url = getGoogleConsentUrl();
	res.send({ url });
});

app.post("/getAccessToken", async (req, res) => {
	const { code } = req.body;
	const accessToken = await getGoogleAccessToken(code);
	res.send({ accessToken });
});

app.post("/getDocument", async (req, res) => {
	const { accessToken, documentId } = req.body;
	const htmlDoc = await getGoogleDocsInHtml(accessToken, documentId);
	convertBufferToBase64(htmlDoc);
	res.send({ htmlDoc });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

console.log(process.env.PORT);
