const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const sortAscButton = document.getElementById("sort-asc");
const sortDescButton = document.getElementById("sort-desc");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const token = localStorage.getItem("authToken");

const localStorageTransaction = JSON.parse(localStorage.getItem(currentUser._id + "_transactions"));
let transactions = localStorageTransaction !== null ? localStorageTransaction : [];

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "" || date.value.trim() === "") {
        alert("Please enter text, amount, and date");
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
            date: date.value,
        };

        transactions.push(transaction);
        sortTransactions("asc");
        updateLocalStorage();
        updateValues();
        text.value = "";
        amount.value = "";
        date.value = "";
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
        ${transaction.text} 
        <span>${sign}₹${Math.abs(transaction.amount)}</span>
        <span class="date">${transaction.date}</span>
        <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        text.value = transaction.text;
        amount.value = transaction.amount;
        date.value = transaction.date;
        removeTransaction(id);
    }
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `₹${income}`;
    money_minus.innerText = `₹${expense}`;
}

function updateLocalStorage() {
    localStorage.setItem(currentUser._id + "_transactions", JSON.stringify(transactions));
}

function sortTransactions(order) {
    if (order === "asc") {
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (order === "desc") {
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    Init();
}

function Init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
}

Init();

form.addEventListener("submit", addTransaction);
sortAscButton.addEventListener("click", () => sortTransactions("asc"));
sortDescButton.addEventListener("click", () => sortTransactions("desc"));
