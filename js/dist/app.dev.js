"use strict";

var currencyOneEl = document.querySelector('[data-js="currency-one"]');
var currencyTwoEl = document.querySelector('[data-js="currency-two"]');
var currenciesEl = document.querySelector('[data-js="currencies-container"]');
var convertedValueEl = document.querySelector('[data-js="converted-value"]');
var valuePrecisionEl = document.querySelector('[data-js="conversion-precision"]');
var timesCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]');
var currencyInvert = document.querySelector('[data-js="currency-invert"]');

var showAlert = function showAlert(err) {
  var div = document.createElement('div');
  var button = document.createElement('button');
  div.textContent = err.message;
  div.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
  div.setAttribute('role', 'alert');
  button.classList.add('btn-close');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'close');
  button.addEventListener('click', function () {
    div.remove();
  });
  div.appendChild(button);
  currenciesEl.insertAdjacentElement('afterend', div);
};

var state = function () {
  var exchangeRate = {};
  return {
    getExchangeRate: function getExchangeRate() {
      return exchangeRate;
    },
    setExchangerRate: function setExchangerRate(newExchangerRate) {
      if (!newExchangerRate.conversion_rates) {
        showAlert({
          message: 'O objeto nao tem uma propriedade convertion_rates'
        });
        return;
      }

      exchangeRate = newExchangerRate;
      return exchangeRate;
    }
  };
}();

var APIKey = '7b1d2a1ed460dc816905c9db';

var getUrl = function getUrl(currency) {
  return "https://v6.exchangerate-api.com/v6/".concat(APIKey, "/latest/").concat(currency);
};

var getErrormessage = function getErrormessage(errorType) {
  return {
    "unsupported-code": "se não for compatível com o código de moeda fornecido (consulte as moedas suportadas...)",
    "no-data-available": "",
    "malformed-request": "quando alguma parte da sua solicitação não segue a estrutura mostrada acima.",
    "invalid-key": "quando sua chave de API não é válida.",
    "inactive-account": "se seu endereço de e-mail não foi confirmado.",
    "quota-reached": "quando sua conta atingiu o número de solicitações permitidas pelo seu plano.",
    "plan-upgrade-required": "se o nível do seu plano não for compatível com esse tipo de solicitação."
  }[errorType] || ' nao foi possivel obter as informações';
};

var fetchExchangerRate = function fetchExchangerRate(url) {
  var response, exchangeRateData, erroMessenger;
  return regeneratorRuntime.async(function fetchExchangerRate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(url));

        case 3:
          response = _context.sent;

          if (response.ok) {
            _context.next = 6;
            break;
          }

          throw new Error('Sua conexão falhou');

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(response.json());

        case 8:
          exchangeRateData = _context.sent;

          if (!(exchangeRateData.result === 'error')) {
            _context.next = 12;
            break;
          }

          erroMessenger = getErrormessage(exchangeRateData['error-type']);
          throw new Error(erroMessenger);

        case 12:
          return _context.abrupt("return", state.setExchangerRate(exchangeRateData));

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          showAlert(_context.t0);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var getOptions = function getOptions(selectedCurrency, conversion_rates) {
  var setSelectedAttribute = function setSelectedAttribute(currency) {
    return currency === selectedCurrency ? 'selected' : '';
  };

  return Object.keys(conversion_rates).map(function (currency) {
    return "<option ".concat(setSelectedAttribute(currency), ">").concat(currency, "</option>");
  }).join(' ');
};

var getMultipliedExchangeRate = function getMultipliedExchangeRate(conversion_rates) {
  var currencyTwo = conversion_rates[currencyTwoEl.value];
  return (timesCurrencyOneEl.value * currencyTwo).toFixed(2).replace('.', ',');
};

var getNotRoundedExchangeRate = function getNotRoundedExchangeRate(conversion_rates) {
  var currencyTwo = conversion_rates[currencyTwoEl.value];
  return "1 ".concat(currencyOneEl.value, " = ").concat(1 * currencyTwo, "  ").concat(currencyTwoEl.value);
};

var showUpdateRates = function showUpdateRates(_ref) {
  var conversion_rates = _ref.conversion_rates;
  convertedValueEl.textContent = getNotRoundedExchangeRate(conversion_rates);
  valuePrecisionEl.textContent = getNotRoundedExchangeRate(conversion_rates);
};

var showInitialInfo = function showInitialInfo(_ref2) {
  var conversion_rates = _ref2.conversion_rates;
  currencyOneEl.innerHTML = getOptions('USD', conversion_rates);
  currencyTwoEl.innerHTML = getOptions('BRL', conversion_rates);
  showUpdateRates({
    conversion_rates: conversion_rates
  });
};

var init = function init() {
  var url, exchangeRate;
  return regeneratorRuntime.async(function init$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          url = getUrl('USD');
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetchExchangerRate(url));

        case 3:
          exchangeRate = _context2.sent;

          if (exchangeRate && exchangeRate.conversion_rates) {
            showInitialInfo(exchangeRate);
          }

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

timesCurrencyOneEl.addEventListener('input', function (e) {
  var _state$getExchangeRat = state.getExchangeRate(),
      conversion_rates = _state$getExchangeRat.conversion_rates;

  convertedValueEl.textContent = getMultipliedExchangeRate(conversion_rates);
});
currencyTwoEl.addEventListener('input', function () {
  var exchangeRate = state.getExchangeRate();
  showUpdateRates(exchangeRate);
});
currencyOneEl.addEventListener('input', function _callee(e) {
  var url, exchangeRate;
  return regeneratorRuntime.async(function _callee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          url = getUrl(e.target.value);
          _context3.next = 3;
          return regeneratorRuntime.awrap(fetchExchangerRate(url));

        case 3:
          exchangeRate = _context3.sent;
          showUpdateRates(exchangeRate);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
});
init();