import { Core } from "../App/Core/Model";

export class ModelsMenu extends Core.Model {
  public async LoadMenuList() {
    return await this.GetSchemaMenuList().find({});
  }

  public TrashMenu(id: String) {
    this.GetSchemaMenuList().deleteMany({ _id: id }, function (err, _) {
      if (err) {
        return console.log(err);
      }
    });
  }

  public CreateMenu(title: String, text: String, img_src: String) {
    const NewMenuItem = new (this.GetSchemaMenuList())({
      title: title,
      text: text,
      img_src: img_src,
    });
    NewMenuItem.save();
  }

  public async ChangeMenu(
    id: String,
    title: String,
    text: String,
    img_src: String
  ) {
    let key = await this.GetSchemaMenuList().findByIdAndUpdate(id, {
      title: title,
      text: text,
      img_src: img_src,
    });
    return console.log(await key);
  }
}
