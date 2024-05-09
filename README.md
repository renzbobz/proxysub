# proxysub

Proxy service provider url builder

## Installation

```
npm i proxysub
```

## Usage

```js
import Proxysub from "proxysub";

const proxy = new Proxysub(options);
```

### Options object:

| name     | type    | description                                    |
| -------- | ------- | ---------------------------------------------- |
| provider | string  | Proxy provider name                            |
| config   | object  | Proxy provider connection settings             |
| params   | object  | Proxy provider connection params               |
| session  | boolean | if true, this will auto-generate session param |

### Currently supported proxy providers:

- `mango_proxy`
- `packet_stream`
- `bright_data`
- `lightning_proxies`

### Methods

```ts
// Get session id that was used
getSessionId(): string;
// Get proxy provider name
getName(): string;
// Get created proxy url
getUrl(): string;
getUsername(): string;
getHost(): string;
getProtocol(): string;
getPort(): number;
```

## Example usage

```js
import { HttpsProxyAgent } from "https-proxy-agent";
import Proxysub from "proxysub";

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
// then fetch target url with proxyAgent present
```
Check [tests](https://github.com/renzbobz/proxysub/tree/main/test)
