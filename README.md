<p align="center">
  <img src="https://i.imgur.com/5VacA1K.png" width="150"/>
  <h1 align="center">FixedFloat API</h1>
  
  <p align="center"><img src="https://img.shields.io/npm/v/fixedfloat-api.svg?label=version&style=flat-square"/> <img src="https://img.shields.io/bundlephobia/minzip/fixedfloat-api?label=size&style=flat-square"/> <img src="https://img.shields.io/npm/l/fixedfloat-api?style=flat-square"/>
  <br>Simple FixedFloat API wrapper (unofficial)
  <br><a href="https://fixedfloat.com/api">Docs</a> | <a href="https://fixedfloat.com/">Website</a> | <a href="https://fixedfloat.com/faq">FAQ</a></p>
  <p align="center"></p>
</p>

## Installation
With NPM
```bash
npm i fixedfloat-api
```

With Yarn
```bash
yarn add fixedfloat-api
```

## Usage
```javascript
const FixedFloat = require("fixedfloat-api");
const fixed = new FixedFloat('API_KEY', 'API_SECRET');
```

## Methods

* [constructor(settings)](#constructorsettings)
* [.getCurrencies()](#getcurrencies)
* [.getPrice(from, to, type)](#getpricefrom-to-type)
* [.getOrder(id, token)](#getorderid-token)
* [.setEmergency(id, token, choice, address)](#setemergencyid-token-choice-address)
* [.createOrder(from, to, toAddress, type, extra)](#createorderfrom-to-toaddress-type-extra)
* [.\_request(req_method, api_method, body)](#requestreqmethod-apimethod-body)

### constructor(settings)

Create instance.

```javascript
const fixed = new FixedFloat('API_KEY', 'API_SECRET');
```

### .getCurrencies()

Getting a list of all currencies that are available. [Official docs](https://fixedfloat.com/api#method_getCurrencies)

```js
const response = await fixed.getCurrencies();
```

### .getPrice(from, to, type)

Information about a currency pair with a set amount of funds. [Official docs](https://fixedfloat.com/api#method_getPrice)

```js
// Simple float
const response = await fixed.getPrice('0.1 ETH', 'BTC');

// Reversive fixed
const response = await fixed.getPrice('ETH', '0.1 BTC', 'fixed');
```

### .getOrder(id, token)

Receiving information about the order. [Official docs](https://fixedfloat.com/api#method_getOrder)
> Modified original response: added a `response.statusText` (see [Order states](#order-states) section)

```js
const response = await fixed.getOrder('ORDER_ID', 'ORDER_TOKEN');
```

### .setEmergency(id, token, choice, address)

Emergency Action Choice. [Official docs](https://fixedfloat.com/api#method_setEmergency)

```js
await fixed.setEmergency('ORDER_ID', 'ORDER_TOKEN', 'EXCHANGE or REFUND', 'ADDRESS for refund');
```

### .createOrder(from, to, toAddress, type, extra)

Creating exchange order. [Official docs](https://fixedfloat.com/api#method_createOrder)
> Modified original response: added a `response.statusText` (see [Order states](#order-states) section)

```js
const response = await fixed.createOrder('0.1 ETH', 'BTC', 'BTC address');
```

### .\_request(req_method, api_method, body)

Call method manually.
> Attention: this is a utility method

```js
// GET query or POST body
const body = new URLSearchParams({
    someParam: 'someValue',
    ...
});
const response = await fixed._request('GET or POST', 'methodName', body);
```

## Order states
> All order states (statuses) are listed [here](https://fixedfloat.com/api#:~:text=0%20%E2%80%94%20New%20order,with%20the%20order)
```js
const STATES = [
    /* 0 */ 'Transaction expected',
    /* 1 */ 'The transaction is waiting for the required number of confirmations',
    /* 2 */ 'Currency exchange',
    /* 3 */ 'Sending funds',
    /* 4 */ 'Completed',
    /* 5 */ 'Expired',
    /* 6 */ 'Not currently in use',
    /* 7 */ 'A decision must be made to proceed with the order'
];
```

## License
fixedfloat-api is Licensed under the [MIT License](https://github.com/wilddip/fixedfloat-api/blob/main/LICENSE). Simple and clear about MIT License is written [here](https://choosealicense.com/licenses/mit/)