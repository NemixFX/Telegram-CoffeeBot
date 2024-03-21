// @ts-ignore
const TelegramApi = require("node-telegram-bot-api");
import {ModelsMenu} from "../../Models/Menu";

const MESSAGE = {
  WELCOME: "welcomeMessage",
};

export class Telegram {
  config = require("../../Config/Config.json");
  bot;
  msg = {};
  ModelMenu;

  constructor() {
    this.bot = new TelegramApi(this.config.botConfig.token, {polling: true});
    this.ModelMenu = new ModelsMenu();
  }

  public async DeleteLastMessage(chat_id, new_id) {
    if (this.msg[chat_id] != undefined)
      for (const element of this.msg[chat_id])
        await this.bot.deleteMessage(chat_id, element);
    this.msg[chat_id] = [];
  }

  public AddMessageStackList(chat_id, msg_id) {
    if (this.msg[chat_id] == undefined)
      this.msg[chat_id] = [];
    this.msg[chat_id].push(msg_id);
  }

  public async ClearChat(chat_id, msg_id, continue_trash = false) {
    if (!continue_trash)
      await this.DeleteLastMessage(chat_id, msg_id);
    this.AddMessageStackList(chat_id, msg_id);
  }

  public async sendMessage(chat_id, msg, arg = {}, continue_trash = false) {
    let msg_res = await this.bot.sendMessage(chat_id, msg, arg);
    await this.ClearChat(chat_id, msg_res.message_id, continue_trash);
    return msg_res;
  }

  public async sendAnimation(chat_id, animation, continue_trash = false) {
    let msg_res = await this.bot.sendAnimation(chat_id, animation);
    await this.ClearChat(chat_id, msg_res.message_id, continue_trash);
    return msg_res;
  }

  public async sendInvoice(chat_id, signature, title, sum, msg, continue_trash = false) {
    let msg_res = await this.bot.sendInvoice(
      chat_id,
      signature,
      msg,
      this.config.payment.providerToken,
      this.config.payment.providerToken,
      "get_access",
      "RUB",
      [{label: title, amount: sum * 100}],
      {
        payload: {
          unique_id: `${chat_id}_${Number(new Date())}`,
          provider_token: this.config.payment.providerToken,
        },
        photo_url:
          "https://i.ibb.co/bHZJFmH/004-gravity-paper-hot-cup-branding-coffee-drink-psd-mockup.jpg",
        photo_width: 800,
        photo_height: 600,
      }
    );
    await this.ClearChat(chat_id, msg_res.message_id, continue_trash);
    return msg_res;
  }

  public async sendPhoto(chat_id, photo, continue_trash = false) {
    let msg_res = await this.bot.sendPhoto(chat_id, photo);
    await this.ClearChat(chat_id, msg_res.message_id, continue_trash);
    return msg_res;
  }
}
