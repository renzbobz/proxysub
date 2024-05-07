import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import Proxysub from "../lib/index.js";

const proxy = new Proxysub({
  provider: "lightning_proxies",
  config: {
    host: "host",
    port: 69,
    username: "username",
    password: "password",
  },
  params: {
    region: "ph",
  },
});

const proxyUrl = proxy.getUrl();
const proxyAgent = new HttpsProxyAgent(proxyUrl);
console.log(proxyAgent);

const targetUrl = "https://ident.me/ip";
const response = await fetch(targetUrl, { agent: proxyAgent });
console.log(await response.text());
