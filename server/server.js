// my-server.js
import { handler } from '../build/handler.js';
import express from 'express';
import cors from 'cors'
import * as dotenv from 'dotenv';
import {
	handleTitTokAccessTokenPOST,
	handleTitTokAdvertiserDetailsGET,
	handleAdminPasswordCheck,
	handleMetaLongTermAccessTokenPOST,
	handleCountryNamesListGET,
	handleCountryDetailGET
} from './handlers.js';
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.post("/server/tiktok/ad_account_details", handleTitTokAdvertiserDetailsGET);
app.post("/server/tiktok/accessToken", handleTitTokAccessTokenPOST);
app.post("/server/meta/accessToken", handleMetaLongTermAccessTokenPOST);
app.post("/server/admin/password_check", handleAdminPasswordCheck);
app.get("/server/data/countries", handleCountryNamesListGET);
app.get("/server/data/country", handleCountryDetailGET);
app.use(handler);

app.listen(PORT, () => {
	console.log(`listening on port http://localhost:${PORT}`);
});
