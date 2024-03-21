import { Core } from "../App/Core/Controller";
import { ModelsMenu } from "../Models/Menu";

export class ControllersMenu extends Core.Controller {
  constructor() {
    super();
    this.model = new ModelsMenu();
  }

  public async LoadMenuList() {
    return {
      ok: !0,
      result: await this.model.LoadMenuList(),
    };
  }

  public TrashMenu(arg) {
    this.model.TrashMenu(arg.id);
    return {
      ok: true,
    };
  }

  public CreateMenu(arg) {
    this.model.CreateMenu(arg.title, arg.text, arg.img_src);
    return {
      ok: true,
    };
  }

  public async ChangeMenu(arg) {
    await this.model.ChangeMenu(arg.id, arg.title, arg.text, arg.img_src);
    return {
      ok: true,
    };
  }
}
