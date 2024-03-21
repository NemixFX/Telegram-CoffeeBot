const express = require("express");
const Routes = require("./Router/Routes");
const config = require("./Config/Config.json");
const PORT = process.env.PORT || 80;
const app = express();
//import {Telegram} from "./App/Telegram/Telegram"

//const TelegramBot = new Telegram();
//TelegramBot.Router();
app.use(Routes);

app.listen(PORT, () => {
  console.log("Welcome to the gey club");
});

require("./Router/TelegramRoutes");
