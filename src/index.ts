import randomString from "randomstring";
import providers from "./providers.json" with { type: "json" };

type ProviderName = "mango_proxy" | "packet_stream" | "lightning_proxies" | "bright_data";

interface Config {
  host: string;
  port: number;
  username: string;
  password: string;
  protocol?: string;
}

interface Param {
  [key: string]: string;
}

interface Provider {
  name: string;
  session_id_opts: randomString.GenerateOptions;
  opts: {
    session_key: string;
    to_append_key: "username" | "password";
    to_append_key_prefix?: string;
    and_to_append_key_separator: string;
    key_value_separator: string;
  };
}

interface Opt {
  /** Proxy provider name */
  provider: ProviderName;
  /** 
   * if set to true, this will automatically generate session param
   * (this will overwrite session param if it's falsy)
   */
  session?: boolean;
  /** Proxy provider connection config */
  config: Config;
  /** Proxy provider connection params */
  params?: Param;
}

export default class Proxysub {
  #url!: string;
  #config: Config;
  #params: Param;
  #provider: Provider;

  constructor(opts: Opt) {
    if (!opts) throw new Error("opts required");
    const provider = providers.find((provider) => provider.name == opts.provider) as (Provider|undefined);
    if (!provider) throw new Error("provider not found");
    if (!opts.config) throw new Error("opts.config required");
    this.#provider = provider;
    this.#config = { ...opts.config };
    this.#params = { ...(opts.params ?? {}) };
    this.#init(opts);
  }

  #generateSessionId() {
    return randomString.generate(this.#provider.session_id_opts);
  }

  #encodeThisParams() {
    const {
      key_value_separator,
      and_to_append_key_separator,
    } = this.#provider.opts;
    const encodedParams = Object.entries(this.#params)
      .filter((p) => p[1])
      .map((p) => p[0] + key_value_separator + p[1])
      .join(and_to_append_key_separator);
    return encodedParams;
  }

  #init(opts: Opt) {
    const {
      session_key,
      to_append_key,
      to_append_key_prefix,
      and_to_append_key_separator,
    } = this.#provider.opts;

    // if opt.session is true and params.session is falsy, this will generate a session param
    if (opts.session && !this.#params[session_key]) {
      this.#params[session_key] = this.#generateSessionId();
    }
    
    const encodedParams = this.#encodeThisParams();

    const paramsToAppendKeyValue = this.#config[to_append_key];

    const a = to_append_key_prefix ? to_append_key_prefix + paramsToAppendKeyValue : paramsToAppendKeyValue;
    const b = encodedParams ? and_to_append_key_separator + encodedParams : "";
    this.#config[to_append_key] = a + b;

    this.#initUrl();
  }

  #initUrl() {
    const { host, port, username, password } = this.#config;
    const protocol = this.getProtocol();
    this.#url = `${protocol}://${username}:${password}@${host}:${port}`;
  }

  getUsername() {
    return this.#config.username;
  }

  getHost() {
    return this.#config.host;
  }

  getProtocol() {
    return this.#config.protocol || "http";
  }

  getPort() {
    return this.#config.port;
  }

  getName() {
    return this.#provider.name;
  }

  getSessionId() {
    const session_key = this.#provider.opts.session_key;
    return this.#params[session_key];
  }

  getUrl() {
    return this.#url;
  }

}
