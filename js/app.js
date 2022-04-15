const currencyOneEl = document.querySelector('[data-js="currency-one"]');
const currencyTwoEl = document.querySelector('[data-js="currency-two"]');
const currenciesEl = document.querySelector('[data-js="currencies-container"]');
const convertedValueEl = document.querySelector('[data-js="converted-value"]');
const valuePrecisionEl = document.querySelector('[data-js="conversion-precision"]');
const timesCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]');

let internalExchangeRate = {};

const url = 'https://v6.exchangerate-api.com/v6/7b1d2a1ed460dc816905c9db/latest/USD';

const getErrormessage = errorType => ({
    "unsupported-code": "se não for compatível com o código de moeda fornecido (consulte as moedas suportadas...)",
    "no-data-available": "",
    "malformed-request": "quando alguma parte da sua solicitação não segue a estrutura mostrada acima.",
    "invalid-key": "quando sua chave de API não é válida.",
    "inactive-account": "se seu endereço de e-mail não foi confirmado.",
    "quota-reached": "quando sua conta atingiu o número de solicitações permitidas pelo seu plano.",
    "plan-upgrade-required": "se o nível do seu plano não for compatível com esse tipo de solicitação."
})[errorType] || ' nao foi possivel obter as informações';

const fetchExchangerRate = async() => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Sua conexão falhou');
        }
        const exchangeRateData = await response.json();
        if (exchangeRateData.result === 'error') {
            throw new Error(getErrormessage(exchangeRateData['error-type']))
        }
        return exchangeRateData
    } catch (err) {
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

}
const init = async() => {

    const exchangeRateData = await fetchExchangerRate();
    internalExchangeRate = {...exchangeRateData };
    const getOptions = selectedCurrency => Object.keys(exchangeRateData.conversion_rates)
        .map(currency => `<option ${ currency === selectedCurrency ? 'selected':''}>${currency}</option>`)
        .join(' ');

    currencyOneEl.innerHTML = getOptions('USD');
    currencyTwoEl.innerHTML = getOptions('BRL');

    convertedValueEl.textContent = `R$ ${exchangeRateData.conversion_rates.BRL.toFixed(2).replace('.', ',')} `;
    valuePrecisionEl.textContent = ` 1 USD = ${exchangeRateData.conversion_rates.BRL} BRL `
}

timesCurrencyOneEl.addEventListener('input', e => {
    console.log(internalExchangeRate)
    convertedValueEl.textContent = (e.target.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2).replace('.', ',');
})

currencyTwoEl.addEventListener('input', e => {
    const currencyTwoValue = internalExchangeRate.conversion_rates[e.target.value];
    convertedValueEl.textContent = (timesCurrencyOneEl.value * currencyTwoValue).toFixed(2)
    valuePrecisionEl.textContent = ` 1 USD = ${ 1 * internalExchangeRate.conversion_rates[currencyTwoValue.value]} ${currencyTwoEl.value}`
})


init();