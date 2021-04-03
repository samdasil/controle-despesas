const transactionsUL         = document.querySelector('#transactions')
const positiveBalanceDisplay = document.querySelector('#money-plus')
const negativeBalanceDisplay = document.querySelector('#money-minus')
const totalBalanceDisplay    = document.querySelector('#balance')
const form                   = document.querySelector('#form')
let inputTransactionName   = document.querySelector('#text')
let inputTransactionAmount = document.querySelector('#amount')

// let dummyTransactions = [
//     { id: 1, name: 'Bolo de Brigadeiro', amount: -20 },
//     { id: 2, name: 'Salario', amount: 300 },
//     { id: 3, name: 'Torta', amount: -10 },
//     { id: 4, name: 'Violão', amount: 150 }
// ]

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []

const addTransactionIntoDOM = ({ amount, name, id }) => {
    const operator = amount < 0 ? '-' : '+'
    const CSSClass = amount < 0 ? 'minus' : 'plus'
    const amountAbsolute = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `${name} <span>${operator} R$ ${amountAbsolute}</span><button class='delete-btn' onClick='removeTransaction(${id})'>x</button>`
    transactionsUL.prepend(li)
}

const removeTransaction = id => {
    transactions = transactions.filter( transaction => transaction.id !== id )
    init()
    updateLocalStorage()
}

const getPositivesBalances = transactionsAmount => (
    transactionsAmount.filter(value => value > 0).reduce((accumulator, value) => accumulator + value, 0).toFixed(2)
)


const getNegativesBalances = transactionsAmount => (
    Math.abs(transactionsAmount.filter(value => value < 0).reduce((accumulator, value) => accumulator + value, 0)).toFixed(2)
)

const getTotalBalances = transactionsAmount => (
    transactionsAmount.reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2)
)

const updateBalances = () => {
    const transactionsAmount = transactions.map(({ amount }) => amount)
    const totalBalances = getTotalBalances(transactionsAmount)
    const positiveBalance = getPositivesBalances(transactionsAmount)
    const negativeBalance = getNegativesBalances(transactionsAmount)

    totalBalanceDisplay.textContent     = `R$ ${totalBalances}`
    positiveBalanceDisplay.textContent  = `R$ ${positiveBalance}`
    negativeBalanceDisplay.textContent  = `R$ ${negativeBalance}`
}

const init  = () => {
    transactionsUL.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalances()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}
const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionArray = (transactionName, transactionAmount) => {
    transactions.push({ id: generateID(), name: transactionName, amount: Number(transactionAmount) })
}

const cleanInputsTransaction = () => {
    inputTransactionName.value   = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmit = e => {
    e.preventDefault()
    const transactionName   = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const someEmpty = transactionName === '' || transactionAmount === ''

    if(someEmpty){
        alert('Favor preencher Descrição e Valor.')
        return
    }

    addToTransactionArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputsTransaction()

}

form.addEventListener('submit', handleFormSubmit)