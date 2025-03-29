import { Client, type ClientOptions } from "./rest";
import { auth } from "./sdk";

export class zymu {
  readonly client: Client;

  readonly auth;

  constructor(options: ClientOptions) {
    this.client = new Client(options);

    this.auth = auth(this.client);
  }
}
