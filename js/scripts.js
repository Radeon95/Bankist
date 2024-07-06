'use strict';

document.addEventListener('DOMContentLoaded', function () {
  loadAccountsData();
});
// Data
const account1 = {
  owner: 'Radu Bitlan',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'GBP',
  locale: 'en-GB',
  movementsDates: [
    '2020-07-26T12:01:20.894Z',
    '2023-09-11T09:48:16.867Z',
    '2023-11-01T13:15:33.035Z',
    '2024-01-25T14:18:46.235Z',
    '2024-02-25T06:04:23.907Z',
    '2024-03-15T16:33:06.386Z',
    '2024-03-25T18:49:59.371Z',
    '2024-04-23T14:43:26.374Z',
  ],
};

const account2 = {
  owner: 'Ossama Belkahla',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.3,
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
  movementsDates: [
    '2020-07-27T12:01:20.894Z',
    '2023-09-06T09:48:16.867Z',
    '2023-11-03T13:15:33.035Z',
    '2024-01-29T14:18:46.235Z',
    '2024-02-21T06:04:23.907Z',
    '2024-03-10T16:33:06.386Z',
    '2024-03-26T18:49:59.371Z',
    '2024-04-10T14:43:26.374Z',
  ],
};

const account3 = {
  owner: 'Victor Bantis Ion',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.4,
  pin: 3333,
  currency: 'EUR',
  locale: 'pt-PT',
  movementsDates: [
    '2020-07-07T12:01:20.894Z',
    '2023-08-11T09:48:16.867Z',
    '2023-10-01T13:15:33.035Z',
    '2024-01-14T14:18:46.235Z',
    '2024-02-05T06:04:23.907Z',
    '2024-03-18T18:49:59.371Z',
    '2024-03-29T16:33:06.386Z',
    '2024-04-11T14:43:26.374Z',
  ],
};

const account4 = {
  owner: 'Ana Bitlan',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 2,
  pin: 4444,
  currency: 'EUR',
  locale: 'nl-BE',
  movementsDates: [
    '2020-07-07T12:01:20.894Z',
    '2023-08-21T09:48:16.867Z',
    '2023-10-30T13:15:33.035Z',
    '2023-11-28T18:49:59.371Z',
    '2024-01-01T14:18:46.235Z',
    '2024-02-19T06:04:23.907Z',
    '2024-03-18T16:33:06.386Z',
    '2024-04-26T14:43:26.374Z',
  ],
};

let accounts = [account1, account2, account3, account4];

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

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const containerGallery = document.querySelector('.gallery');

const operations = document.querySelector('.operations');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

/////////////////////////////////////////////////
// Functions

// Save data in local storage
function saveAccountsData() {
  localStorage.setItem('accountsData', JSON.stringify(accounts));
}
function loadAccountsData() {
  const data = localStorage.getItem('accountsData');
  if (data) {
    accounts = JSON.parse(data);
    accounts.forEach(acc => {
      acc.movementsDates = acc.movementsDates.map(date => new Date(date));
    });
  }
}

// Default currency = EUR
function converter(amount, currency) {
  const rates = {
    GBP: 1.16,
    USD: 0.92,
    EUR: 1,
  };
  return amount * rates[currency];
}

// Movements dates
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

// Format currency

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  acc.movements = acc.movements.map(movement =>
    converter(movement, acc.currency)
  );

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMovements = formatCur(mov, acc.locale, acc.currency);

    const html = ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMovements}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);

    const row = containerMovements.querySelector('.movements__row');
    row.style.backgroundColor = type === 'deposit' ? '#c8f1d2' : '#fba7aa';
  });
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};

createUserName(accounts);

const calcAndPrintBanlance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// Display summary
const calcDispalySummary = function (acc) {
  // Display incomes
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // Display outgoings
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  // Display interests
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const updateUI = function (acc) {
  // Dispaly movemets
  displayMovements(acc);

  // Display balance
  calcAndPrintBanlance(acc);

  calcDispalySummary(acc);
};

// Gallery and Operations Toggle
function toggleGalleryDisplay() {
  const mainOpacity = containerApp.style.opacity;

  if (window.matchMedia('(min-width: 1000px)').matches) {
    operations.style.display = 'none'; // Always hide operations above 1000px width

    if (mainOpacity == 0) {
      containerGallery.style.display = 'flex';
    } else {
      containerGallery.style.display = 'none';
    }
  }
  if (window.matchMedia('(min-width: 500px) and (max-width: 1000px)').matches) {
    containerGallery.style.display = 'none'; // Always hide gallery below 1000px width

    if (mainOpacity == 0) {
      operations.style.display = 'grid'; // Show operations if main block is invisible
    } else {
      operations.style.display = 'none';
    }
  } else if (window.matchMedia('(max-width: 500px)').matches) {
    operations.style.display = 'none';
    containerGallery.style.display = 'none';
  }
}

// Attach toggleGalleryDisplay to resize events
window.addEventListener('resize', toggleGalleryDisplay);

toggleGalleryDisplay();

// Event listeners for buttons
btnLogin.addEventListener('click', function (e) {
  setTimeout(toggleGalleryDisplay, 100);
});

btnClose.addEventListener('click', function (e) {
  setTimeout(toggleGalleryDisplay, 100);
});

// TABS

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// EVENT LISTENER

let currentAccount, timer;

// Login button
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Load account data initially

    // Current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  } else {
    containerApp.style.opacity = 0;
  }
});

// Transfer button
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());

    // Save after transaction
    saveAccountsData();

    // UPDATE UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// FOR LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Save after adding a loan
      saveAccountsData();
      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // DELETE ACCOUNT
    accounts.splice(index, 1);

    // Save after deleting an account
    saveAccountsData();
    // HIDE UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Sort movements

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
