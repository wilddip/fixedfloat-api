const axios = require('axios').default;
const { Method } = require('axios');
const crypto = require('crypto');

const STATES = [
    'Transaction expected',
    'The transaction is waiting for the required number of confirmations',
    'Currency exchange',
    'Sending funds',
    'Completed',
    'Expired',
    'Not currently in use',
    'A decision must be made to proceed with the order'
];

const resolveState = (data) => {
    if (data.status) data.statusText = STATES[data.status];
    return data;
}

const currencyAppend = (name, body, data) => {
    if (data.indexOf(' ') !== -1) {
        const arr = data.split(' ');
        body.append(`${name}Qty`, arr[0]);
        body.append(`${name}Currency`, arr[1]);
    } else body.append(`${name}Currency`, data);
}

class FixedFloat {
    /**
     * Main API class
     * @param {String} apiKey API key
     * @param {String} secretKey Secret key
     * @description Get your pair of keys from https://fixedfloat.com/apikey
     */
    constructor(apiKey, secretKey) {
        if (!apiKey || !secretKey) throw new Error('Please provide an API and secret keys');
        this.mainURL = 'https://fixedfloat.com/api/v1/';
        this.apiKey = apiKey;
        this.secretKey = secretKey;
    }

    /**
     * Made request
     * @param {Method} req_method Request method
     * @param {String} api_method API method
     * @param {String} body Body or query
     */
    async _request(req_method, api_method, body = '') {
        if (!req_method || !api_method) throw new Error(`Required params: req_method & api_method`)
        const { data } = await axios({
            method: req_method,
            url: this.mainURL + api_method + (req_method === 'GET' ? `?${body}` : ''),
            headers: {
                'X-API-KEY': this.apiKey,
                'X-API-SIGN': crypto.createHmac('sha256', Buffer.from(this.secretKey)).update(body).digest('hex')
            },
            data: req_method === 'GET' ? '' : body
        });
        if (data.code !== 0 || data.msg !== 'OK') throw new Error(`Error ${data.code}: ${data.msg}`);
        return data.data;
    }

    /**
     * Getting a list of all currencies that are available on FixedFloat.com.
     */
    async getCurrencies() {
        return await this._request('GET', 'getCurrencies')
    }

    /**
     * Information about a currency pair with a set amount of funds.
     * @param {String} from From currency (ex. 0.1 ETH)
     * @param {String} to To currency (ex. BTC)
     * @param {'fixed'|'float'} type Order type: fixed or float (def. float)
     */
    async getPrice(from, to, type = 'float') {
        if (!from || !to || from.indexOf(' ') + to.indexOf(' ') === -2) throw new Error(`No required params. Example: {from: '0.1 ETH', to: 'BTC'}`);
        const body = new URLSearchParams({type});
        currencyAppend('from', body, from);
        currencyAppend('to', body, to);
        return await this._request('POST', 'getPrice', body.toString())
    }

    /**
     * Receiving information about the order.
     * @param {String} id Order ID
     * @param {String} token Security token of order
     */
    async getOrder(id, token) {
        const body = new URLSearchParams({id, token});
        return resolveState(await this._request('GET', 'getOrder', body.toString()));
    }

    /**
     * Emergency Action Choice
     * @param {String} id Order ID
     * @param {String} token Security token of order
     * @param {String} choice EXCHANGE or REFUND
     * @param {String} address refund address, required if choice="REFUND"
     */
    async setEmergency(id, token, choice, address) {
        const body = new URLSearchParams({id, token, choice, address});
        return await this._request('GET', 'setEmergency', body.toString())
    }

    /**
     * Creating exchange orders.
     * @param {String} from From currency (ex. 0.1 ETH)
     * @param {String} to To currency (ex. BTC)
     * @param {String} toAddress A destination address to which the funds will be dispatched upon the successful completion of the Order
     * @param {'fixed'|'float'} type Order type: fixed or float (def. float)
     * @param {String} extra This parameter can be omitted by specifying the MEMO or Destination Tag in toAddress separated by a colon.
     */
    async createOrder(from, to, toAddress, type = 'float', extra) {
        if (!from || !to || from.indexOf(' ') + to.indexOf(' ') === -2) throw new Error(`No required params. Example: {from: '0.1 ETH', to: 'BTC', ...}`);
        const body = new URLSearchParams({type, toAddress});
        currencyAppend('from', body, from);
        currencyAppend('to', body, to);
        if (extra) body.append('extra', extra);
        return resolveState(await this._request('POST', 'createOrder', body.toString()));
    }
}

module.exports = FixedFloat;