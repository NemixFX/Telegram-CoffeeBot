import {ControllersMenu} from "../Controllers/Menu";

console.log("Welc");

import {Telegram} from "../App/Telegram/Telegram";
import {ControllersTelegram} from "../Controllers/Telegram";

const TelegramBot = new Telegram();
let CTelegram = new ControllersTelegram(TelegramBot);

TelegramBot.bot.on("text", async (msg) => {
  const {
    chat: {id},
    from: {id: userId},
    text,
  } = msg;
  if (text.includes("/start")) {
    await CTelegram.Welcome(id);
    return;
  }
  if (text.includes("/basket")) {
    await CTelegram.GetBasket(id);
    return;
  }
  if (text.includes("/test")) {
    await CTelegram.SuccessfulPayment(id);
    return;
  }
});

TelegramBot.bot.on("callback_query", async (msg) => {
  const {
    message: {
      chat: {id},
    },
    data: query,
  } = msg;
  if (query.startsWith("start")) {
    await CTelegram.Welcome(id);
    return;
  }
  if (query.startsWith("trash_basket")) {
    await CTelegram.TrashBasket(id);
    return;
  }
  if (query.startsWith("time_pay_")) {
    let time = query.replace("time_pay_", "");
    await CTelegram.IssueCheck(id, time);
    return;
  }

  if (query.startsWith("pay")) {
    await CTelegram.MenuForChoosingCookingTime(id);
    return;
  }

  if (query.startsWith("basket")) {
    await CTelegram.GetBasket(id);
    return;
  }
  if (query.startsWith("menu_id_")) {
    let menu_id = query.replace("menu_id_", "");
    await CTelegram.GetMenuForId(id, menu_id);
    return;
  }
  if (query.startsWith("drink_id_")) {
    let drink_id = query.replace("drink_id_", "");
    await CTelegram.GetDrinkForId(id, drink_id);
    return;
  }

  if (query.startsWith("add_basket_")) {
    let type_and_id = query.replace("add_basket_", "");
    let drink_type = "middle";
    if (type_and_id.startsWith("small_")) drink_type = "small";

    let drink_id = type_and_id.replace("small_", "").replace("middle_", "");
    await CTelegram.AddBasket(id, drink_type, drink_id);
    return;
  }
});

TelegramBot.bot.on("successful_payment", async (msg) => {
  await CTelegram.SuccessfulPayment(msg.chat.id);
});
