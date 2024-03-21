import {Core} from "../App/Core/Controller";
import {ModelsTelegram} from "../Models/Telegram";

export class ControllersTelegram extends Core.Controller {
  Data = require("../Data/Data.json");
  Config = require("../Config/Config.json");
  telegram;

  constructor(telegram) {
    super();
    this.telegram = telegram;
    this.model = new ModelsTelegram();
  }

  public async Welcome(id) {
    let btn = await this.model.LoadButtonMenuList();
    await this.telegram.sendAnimation(id, this.Data.ANIMATION.WELCOME);
    await this.telegram.sendMessage(id, this.Data.MESSAGE.WELCOME, {
      reply_markup: btn,
      parse_mode: "Markdown",
    }, true);
  }

  public async TrashBasket(id) {
    await this.model.TrashBasket(id);
    await this.Welcome(id);
  }

  public async SuccessfulPayment(chat_id) {
    let order_id = await this.model.CloseOrder(chat_id);
    if (order_id == undefined) {
      await this.Welcome(chat_id);
      return;
    }
    let DrinkList = await this.GetDrinkListForOrderId(order_id);
    let Button = {
      inline_keyboard: [
        [
          {
            text: "Сделать новый заказ",
            callback_data: "start",
          },
        ],
      ],
    };
    let Order = await this.model.GetOrderForId(order_id);
    let lead_time = await Order.lead_time;
    let list_msg =
      "Оплата успешно прошла! ☺️\n" +
      "Ваш напиток будет ждать вас точно ко времени!";
    await this.telegram.bot.sendAnimation(chat_id, "https://i.ibb.co/XFkBgYq/coffee-dribbble-final.gif");
    await this.telegram.bot.sendMessage(chat_id, list_msg, {
      reply_markup: Button,
      parse_mode: "Markdown",
    });

    let msg =
      "Поступил новый заказ \n" +
      "Номер заказа #" + order_id + "\n" +
      "Время ожидания: " + await Order.lead_time + "мин.\n";

    msg += DrinkList;
    await this.telegram.bot.sendMessage(this.Config.botConfig.admin_id, msg);

  }

  public async GetDrinkListForChatId(chat_id, price = false) {
    let order_id = await this.model.GetOrderId(chat_id)
    return this.GetDrinkListForOrderId(order_id, price);
  }

  public async GetDrinkListForOrderId(order_id, price = false) {
    let Basket = await this.model.GetBasketForOrderId(await order_id);
    let list = "";
    for (const item of await Basket) {
      let Drink = await this.model.GetDrinkForId(item.item_id);
      if (price)
        list += (await item.price) + "₽" + "   " + (await Drink.title) + " (" + item.type + ")" + "\n\n";
      else
        list += (await Drink.title) + " (" + item.type + ")" + "\n";
    }
    return list;
  }

  public async AddBasket(id, drink_type, drink_id) {
    let Drink = await this.model.GetDrinkForId(drink_id);

    await this.model.AddToBasket(
      id,
      drink_type,
      Drink[drink_type + "_price"],
      drink_id
    );

    this.telegram.bot.sendChatAction(id, "typing");
    setTimeout(() => {
      this.GetBasket(id);
    }, 1200);
  }

  public async GetMenuForId(id, menu_id) {
    let msg = await this.model.GetLabelMenu(menu_id);
    let btn = await this.model.LoadButtonDrinkList(menu_id);
    await this.telegram.sendPhoto(id, msg.img_src);
    await this.telegram.sendMessage(id, msg.text.toString(), {
      reply_markup: btn,
      parse_mode: "Markdown",
    }, true);
  }

  public async GetDrinkForId(id, drink_id) {
    let price = await this.model.GetDrinkForId(drink_id);

    let Button = {
      inline_keyboard: [
        [
          {
            text: "250мл: " + price.small_price + "₽",
            callback_data: "add_basket_small_" + price._id,
          },
          {
            text: "350мл: " + price.middle_price + "₽",
            callback_data: "add_basket_middle_" + price._id,
          },
        ],
      ],
    };
    await this.telegram.sendMessage(id, "Выберите объем напитка", {
      reply_markup: Button,
      parse_mode: "Markdown",
    });
  }

  public async GetBasket(id) {
    let BasketTable = `Ваша Корзина:\n-----------\n`;
    BasketTable += await this.GetDrinkListForChatId(id, true);
    let Sum = 0;
    let Basket = await this.model.GetBasket(id);

    for (const item of await Basket) {
      Sum += item.price;
    }

    let Button = {
      inline_keyboard: [
        [
          {
            text: "Оплатить: " + Sum + "₽",
            callback_data: "pay",
          },
        ],
        [
          {
            text: "Очистить Корзину",
            callback_data: "trash_basket",
          },
          {
            text: "Продолжить покупки",
            callback_data: "start",
          },
        ],
      ],
    };

    await this.telegram.sendMessage(id, BasketTable, {
      reply_markup: Button,
      parse_mode: "Markdown",
    });
  }

  public async MenuForChoosingCookingTime(id) {
    let Button = {
      inline_keyboard: [
        [
          {
            text: "15мин",
            callback_data: "time_pay_15",
          },
          {
            text: "20мин",
            callback_data: "time_pay_20",
          },
          {
            text: "30мин",
            callback_data: "time_pay_30",
          },
        ],
        [
          {
            text: "40мин",
            callback_data: "time_pay_40",
          },
          {
            text: "50мин",
            callback_data: "time_pay_50",
          },
        ],
      ],
    };

    await this.telegram.sendMessage(
      id,
      "Выберите время через которое заберете заказ",
      {reply_markup: Button, parse_mode: "Markdown"}
    );
  }

  public async IssueCheck(id, time) {
    let order_id = await this.model.CreateOrder(id, time);
    let SUM = 0;
    let Basket = await this.model.GetBasket(id);
    if (Basket.length >= 1) {
      let Order = await this.model.GetOrderForId(order_id);
      let msg = "Время ожидания: " + await Order.lead_time + "мин.\n Корзина: \n";
      let DrinkList = await this.GetDrinkListForOrderId(order_id);
      for (const item of Basket) {
        SUM += item.price;
      }
      msg += DrinkList;
      let signature = "Номер заказа #" + order_id;
      await this.telegram.sendInvoice(id, signature, DrinkList, SUM, msg);
    } else {
      await this.Welcome(id);
    }

  }
}
