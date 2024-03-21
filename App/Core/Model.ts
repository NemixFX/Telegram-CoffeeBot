import { ConnectOptions, model } from "mongoose";

export namespace Core {
  export class Model {
    db = require("mongoose");
    config = require("../../Config/Config.json");

    static SchemaMenuList;
    static SchemaDrinkList;
    static SchemaShoppingBasket;
    static SchemaOrder;

    constructor() {
      this.dbConnect().then();
      if (typeof Model.SchemaMenuList === "undefined")
        this.SchemaCreate().then();
    }

    private async dbConnect() {
      await this.db.connect(this.config.dbConfig.url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      } as ConnectOptions);
    }

    public GetSchemaMenuList() {
      return Model.SchemaMenuList;
    }

    public GetSchemaDrinkList() {
      return Model.SchemaDrinkList;
    }

    public GetSchemaShoppingBasket() {
      return Model.SchemaShoppingBasket;
    }

    public GetSchemaOrder() {
      return Model.SchemaOrder;
    }

    private async SchemaCreate() {
      const MenuList = new this.db.Schema({
        title: { type: String, trim: true },
        text: { type: String, trim: true },
        img_src: { type: String, trim: true },
      });
      const DrinkList = new this.db.Schema({
        title: {
          type: String,
          trim: true,
        },
        small_price: {
          type: Number,
          trim: true,
        },
        middle_price: {
          type: Number,
          trim: true,
        },
        menu_id: {
          type: String,
          trim: true,
        },
      });
      const ShoppingBasket = new this.db.Schema({
        order_id: {
          type: String,
          trim: true,
        },
        user_id: {
          type: String,
          trim: true,
        },
        type: {
          type: String,
          trim: true,
        },
        price: {
          type: Number,
        },
        item_id: {
          type: String,
        },
        done: {
          type: Boolean,
        },
        time: {
          type: Date,
        },
      });
      const Order = new this.db.Schema({
        order_id: {
          type: String,
          trim: true,
        },
        done: {
          type: Boolean,
        },
        time: {
          type: Date,
          default: Date.now,
        },
        lead_time: {
          type: Number,
        },
      });

      Model.SchemaMenuList = this.db.model("Menu", MenuList);
      Model.SchemaDrinkList = this.db.model("Drink", DrinkList);
      Model.SchemaShoppingBasket = this.db.model(
        "shopping_basket",
        ShoppingBasket
      );
      Model.SchemaOrder = this.db.model("order", Order);
    }
  }
}
