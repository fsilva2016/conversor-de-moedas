"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var currencyOneEl = document.querySelector('[data-js="currency-one"]');
var currencyTwoEl = document.querySelector('[data-js="currency-two"]');
var currenciesEl = document.querySelector('[data-js="currencies-container"]');
var convertedValueEl = document.querySelector('[data-js="converted-value"]');
var valuePrecisionEl = document.querySelector('[data-js="conversion-precision"]');
var timesCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]');
var internalExchangeRate = {};
var url = 'https://v6.exchangerate-api.com/v6/7b1d2a1ed460dc816905c9db/latest/USD';

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

var fetchExchangerRate = function fetchExchangerRate() {
  var response, exchangeRateData, div, button;
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
            _context.next = 11;
            break;
          }

          throw new Error(getErrormessage(exchangeRateData['error-type']));

        case 11:
          return _context.abrupt("return", exchangeRateData);

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          div = document.createElement('div');
          button = document.createElement('button');
          div.textContent = _context.t0.message;
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

        case 27:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var init = function init() {
  var exchangeRateData, getOptions;
  return regeneratorRuntime.async(function init$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(fetchExchangerRate());

        case 2:
          exchangeRateData = _context2.sent;
          internalExchangeRate = _objectSpread({}, exchangeRateData);

          getOptions = function getOptions(selectedCurrency) {
            return Object.keys(exchangeRateData.conversion_rates).map(function (currency) {
              return "<option ".concat(currency === selectedCurrency ? 'selected' : '', ">").concat(currency, "</option>");
            }).join(' ');
          };

          currencyOneEl.innerHTML = getOptions('USD');
          currencyTwoEl.innerHTML = getOptions('BRL');
          convertedValueEl.textContent = "R$ ".concat(exchangeRateData.conversion_rates.BRL.toFixed(2).replace('.', ','), " ");
          valuePrecisionEl.textContent = " 1 USD = ".concat(exchangeRateData.conversion_rates.BRL, " BRL ");

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
};

timesCurrencyOneEl.addEventListener('input', function (e) {
  console.log(internalExchangeRate);
  convertedValueEl.textContent = (e.target.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2).replace('.', ',');
});
currencyTwoEl.addEventListener('input', function (e) {
  var currencyTwoValue = internalExchangeRate.conversion_rates[e.target.value];
  convertedValueEl.textContent = (timesCurrencyOneEl.value * currencyTwoValue).toFixed(2);
  valuePrecisionEl.textContent = " 1 USD = ".concat(1 * internalExchangeRate.conversion_rates[currencyTwoValue.value], " ").concat(currencyTwoEl.value);
});
init();