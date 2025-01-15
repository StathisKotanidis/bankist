'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

let inputLoginUsername = document.querySelector('.login__input--user');
let inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//152-Creating DOM Elements
const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = '';
  movs.forEach((mov, i) => {
    const movement = `<div class="movements__row">
          <div class="movements__type movements__type--${
            mov >= 0 ? 'deposit' : 'withdrawal'
          }">${i + 1} ${mov >= 0 ? 'deposit' : 'withdrawal'}</div>
          <div class="movements__date"></div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', movement);
  });
};

//156--Computing Usernames

const createUsername = str => {
  return str
    .toLowerCase() //steven thomas williams
    .split(' ') // [steven, thomas, williams]
    .map(name => name[0]) // [s,t,w]
    .join(''); //stw
};

//Create a username for each account
accounts.forEach(account => {
  account.username = createUsername(account.owner);
});

//158--Reduce Method, calculating the balance value
const calculateBalance = acc => {
  const balance = acc.movements.reduce((mov, cur) => mov + cur, 0);
  labelBalance.textContent = `${balance}€`;

  acc.balance = balance;
  return balance;
};

//160--The magic of chaining methods--Calculating IN,OUT and Interest

const calculateInsAndOuts = acc => {
  const ins = [];
  const outs = [];
  acc.movements.filter(amount =>
    amount >= 0 ? ins.push(amount) : outs.push(amount)
  );
  const positiveAmount = ins.reduce((acc, cur) => acc + cur, 0);
  const negativeAmount = outs.reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = positiveAmount;
  labelSumOut.textContent = Math.abs(negativeAmount);

  const interest = acc.movements
    .filter(amount => amount > 0)
    .map(amount => (amount * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = interest;
};

const updateUI = acc => {
  displayMovements(acc.movements);
  calculateBalance(acc);
  calculateInsAndOuts(acc);
};

//163--Implementing Login

let currentAccount;
btnLogin.addEventListener('click', e => {
  //Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner
      .split(' ')
      .at(0)}`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);

    //Clearing user and pin inputs
    inputLoginUsername.value = ' ';
    inputLoginPin.value = ' ';
    inputLoginPin.blur(); //looses focus
  }
});

//164--Implementing Transfers
let receiverAccount;
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(inputTransferAmount.value * -1);
    receiverAccount.movements.push(inputTransferAmount.value);
    updateUI(currentAccount);
  }

  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});

//167--Implementing Loans
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

//165--Implementing Close Account
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputClosePin.value = '';
    inputCloseUsername.value = '';
  }
});

//170--Implementing Sorting

let sorted = false; //state
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
