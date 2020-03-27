# Xuper Wallet —— Web
A sample wallet using JS SDK

## Prerequires

- Nodejs (ver.10+)

## How to use?

1. Install dependencies

    > npm install

2. Building static files

    > npm run build

3. Deploy the output (`build / static`[1](#f1)) directory to the server

### Nginx conf

Example:
```
location / {
    root /home/work/webroot;
    index static/xuper-wallet-web/page/index.html;
}
```

### Dev server (webpack-dev-server)

PORT: 8080 [2](#f2)

*Run*
> npm start

## Current Status
- Implements xuper accout and transaction
- Support for browse transaction history

<a name="f1">1</a>: scripts/extension.js -> [l:37]

<a name="f2">2</a>:  scripts/webpack.dev.js -> [l:29]
