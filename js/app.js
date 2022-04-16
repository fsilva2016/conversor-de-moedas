const currencyOneEl = document.querySelector('[data-js="currency-one"]');
const currencyTwoEl = document.querySelector('[data-js="currency-two"]');
const currenciesEl = document.querySelector('[data-js="currencies-container"]');
const convertedValueEl = document.querySelector('[data-js="converted-value"]');
const valuePrecisionEl = document.querySelector('[data-js="conversion-precision"]');
const timesCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]');

const showAlert = (err) => {
    const div = document.createElement('div');
    const button = document.createElement('button');

    div.textContent = err.message;
    div.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
    div.setAttribute('role', 'alert');
    button.classList.add('btn-close');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'close')

    button.addEventListener('click', () => {
        div.remove()
    })

    div.appendChild(button);
    currenciesEl.insertAdjacentElement('afterend', div);
}


const state = (() => {
    let exchangeRate = {};
    return {
        getExchangeRate: () => exchangeRate,
        setExchangerRate: newExchangerRate => {
            if (!newExchangerRate.conversion_rates) {
                showAlert({ message: 'O objeto nao tem uma propriedade convertion_rates' })
                return
            }
            exchangeRate = newExchangerRate;
            return exchangeRate;
        }
    }
})();

const APIKey = '7b1d2a1ed460dc816905c9db';

const getUrl = currency => `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`;

const getErrormessage = errorType => ({
    "unsupported-code": "se não for compatível com o código de moeda fornecido (consulte as moedas suportadas...)",
    "no-data-available": "",
    "malformed-request": "quando alguma parte da sua solicitação não segue a estrutura mostrada acima.",
    "invalid-key": "quando sua chave de API não é válida.",
    "inactive-account": "se seu endereço de e-mail não foi confirmado.",
    "quota-reached": "quando sua conta atingiu o número de solicitações permitidas pelo seu plano.",
    "plan-upgrade-required": "se o nível do seu plano não for compatível com esse tipo de solicitação."
})[errorType] || ' nao foi possivel obter as informações';


const fetchExchangerRate = async url => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Sua conexão falhou');
        }
        const exchangeRateData = await response.json();
        if (exchangeRateData.result === 'error') {
            const erroMessenger = getErrormessage(exchangeRateData['error-type']);
            throw new Error(erroMessenger)
        }
        return state.setExchangerRate(exchangeRateData);
    } catch (err) {
        showAlert(err)
    }
}
const getOptions = (selectedCurrency, conversion_rates) => {
    const setSelectedAttribute = currency => currency === selectedCurrency ? 'selected' : '';
    return Object.keys(conversion_rates)
        .map(currency => `<option ${setSelectedAttribute(currency)}>${currency}</option>`)
        .join(' ');
}
const getMultipliedExchangeRate = conversion_rates => {
    const currencyTwo = conversion_rates[currencyTwoEl.value];
    return (timesCurrencyOneEl.value * currencyTwo).toFixed(2).replace('.', ',');
}

const getNotRoundedExchangeRate = conversion_rates => {
    const currencyTwo = conversion_rates[currencyTwoEl.value];
    return `1 ${currencyOneEl.value} = ${1* currencyTwo}  ${ currencyTwoEl.value}`
}
const showUpdateRates = ({ conversion_rates }) => {
    convertedValueEl.textContent = getNotRoundedExchangeRate(conversion_rates);
    valuePrecisionEl.textContent = getNotRoundedExchangeRate(conversion_rates);
}
const showInitialInfo = ({ conversion_rates }) => {
    currencyOneEl.innerHTML = getOptions('USD', conversion_rates);
    currencyTwoEl.innerHTML = getOptions('BRL', conversion_rates);

    showUpdateRates({ conversion_rates })

}
const init = async() => {
    const url = getUrl('USD');
    const exchangeRate = await fetchExchangerRate(url);

    if (exchangeRate && exchangeRate.conversion_rates) {
        showInitialInfo(exchangeRate);
    }
}


timesCurrencyOneEl.addEventListener('input', e => {
    const { conversion_rates } = state.getExchangeRate();
    convertedValueEl.textContent = getMultipliedExchangeRate(conversion_rates);
})

currencyTwoEl.addEventListener('input', () => {
    const exchangeRate = state.getExchangeRate()
    showUpdateRates(exchangeRate);
})

currencyOneEl.addEventListener('input', async e => {
    const url = getUrl(e.target.value);
    const exchangeRate = await fetchExchangerRate(url)
    showUpdateRates(exchangeRate);
})

init();