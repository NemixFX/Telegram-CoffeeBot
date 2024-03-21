export namespace Core {
  export class Controller {
    public request;
    public model;
    public response;

    constructor() {}

    public send(msg: string, status: number = 200): void {}
  }
}
