import {Core} from "../App/Core/Model";
import {ModelsMenu} from "./Menu";

export class ModelsTelegram extends Core.Model {
  public async GetBasket(user_id) {
    return await this.GetSchemaShoppingBasket().find({
      user_id: user_id,
      done: false,
    });
  }

  public async GetBasketForOrderId(order_id) {
    return await this.GetSchemaShoppingBasket().find({order_id: order_id});
  }

  public async GetOrderId(user_id) {
    let Basket = await this.GetBasket(user_id);
    let order_id;
    if ((await Basket.length) >= 1) return await Basket[0].order_id;
    else return undefined;
  }

  public async CloseOrder(id) {
    let Basket = await this.GetBasket(id);
    let order_id;
    if ((await Basket.length) >= 1) order_id = await Basket[0].order_id;
    else return undefined;

    (await this.GetSchemaShoppingBasket().find({order_id: order_id})).forEach(
      function (doc) {
        doc.done = true;
        doc.save();
      }
    );
    (await this.GetSchemaOrder().find({order_id: order_id})).forEach(
      function (doc) {
        doc.done = true;
        doc.save();
      }
    );

    return order_id;
  }

  public async AddToBasket(user_id, type, price, item_id) {
    let order_id;
    let Basket = await this.GetBasket(user_id);
    if (Basket.length >= 1) order_id = Basket[0].order_id;
    else order_id = user_id + "_" + Math.random().toString().substr(2, 6);
    const item = new (this.GetSchemaShoppingBasket())({
      order_id: order_id,
      user_id: user_id,
      type: type,
      price: price,
      item_id: item_id,
      done: false,
    });
    item.save();
  }

  public async GetLabelMenu(key) {
    return await this.GetSchemaMenuList().findById(key);
  }

  public async LoadMenuList() {
    return await this.GetSchemaMenuList().find({});
  }

  public async LoadButtonMenuList() {
    let Button = {inline_keyboard: []};
    let res = await this.GetSchemaMenuList().find({});
    await res.forEach((element) =>
      Button.inline_keyboard.push([
        {
          text: element.title,
          callback_data: "menu_id_" + element._id,
        },
      ])
    );
    return Button;
  }

  public async CreateOrder(user_id, lead_time) {
    let Basket = await this.GetBasket(user_id);
    if (!(Basket.length >= 1)) return undefined;
    let order_id = Basket[0].order_id;
    const NewOrder = new (this.GetSchemaOrder())({
      order_id: order_id,
      done: false,
      lead_time: lead_time,
    });

    NewOrder.save();
    return await order_id;
  }

  public async GetOrderForId(order_id) {
    return await this.GetSchemaOrder().findOne({order_id: order_id});
  }

  public async GetDrinkForId(id) {
    return await this.GetSchemaDrinkList().findById(id);
  }

  public async TrashBasket(user_id) {
    await this.GetSchemaShoppingBasket().deleteMany({
      user_id: user_id,
      done: false,
    });
  }

  public async LoadButtonDrinkList(id) {
    let Button = {inline_keyboard: []};
    let res = await this.GetSchemaDrinkList().find({menu_id: id});
    await res.forEach((element) =>
      Button.inline_keyboard.push([
        {
          text: element.title,
          callback_data: "drink_id_" + element._id,
        },
      ])
    );
    return Button;
  }
}
