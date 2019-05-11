const db = require('../db/mongodb');
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = require('../config.json').port;
let tickers;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/get', (req, res) => {
	let coins = req.query.coin;
	if (!coins) {
		res.json(respSuccess(tickers));
	} else {
		coins = coins.toUpperCase();
		const filterredTickers = {};
		let arrCoins = [coins];
		if (~coins.indexOf(',')) {
			arrCoins = coins.split(',');
		}
		arrCoins.forEach(coin => {
			const filteredMarkets = Object.keys(tickers).filter(c => ~c.indexOf(coin.trim()));
			filteredMarkets.forEach(c => filterredTickers[c] = tickers[c]);
		});
		res.json(respSuccess(filterredTickers));
	}
});

app.get('/getHistory', (req, res) => {
	db.getHistory(req.query, (h, msg) => {
		if(h){
			res.json(respSuccess(h));
		} else {
			res.json(respError(msg));
		}
	});
});
module.exports = (tickers_) => {
	tickers = tickers_;
};

app.listen(port, () => console.info('ADAMANT-INFO server listening on port ' + port));

function respSuccess (data) {
	return {
		success: true,
		date: new Date().getTime(),
		result: data
	};
}
function respError (msg) {
	return {
		success: false,
		date: new Date().getTime(),
		msg
	};
}