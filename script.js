/*
LOGIN PAGE FUNCTIONALITY  
*/

// functionality for the sign-up button on the landing (login) page
const signupLink = document.getElementById('signup-link');
if (signupLink) {
  signupLink.addEventListener('click', function(event) {
    console.log('sign-up link clicked');
    event.preventDefault();
    window.location.href = 'signup.html';
  });
}

// login button 
const loginPage = document.getElementById('login-button');
if (loginPage) {
  loginPage.addEventListener('click', login);
}

//function to login
function login(event) {
  console.log('user attempting to login');
  event.preventDefault();

  // get email and password input values
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // ensure the fields weren't left blank
  if (email === '' || password === '') {
    alert('please enter your username and password to login.');
    return;
  }

  // retrieve stored email and password for comparison
  const storedEmail = localStorage.getItem('email');
  const storedPassword = localStorage.getItem('password');

  // check if the entered email and password match the stored values
  if (email === storedEmail && password === storedPassword) {
    window.location.href = 'homepage.html';
  } else {
    alert('incorrect email or password');
  }
}










/*
SIGN UP PAGE FUNCTIONALITY
*/

// signup form submission
const signupForm = document.getElementById('signup-done');
if (signupForm) {
  signupForm.addEventListener('submit', signup);
}

// function to sign up
function signup(event) {
  console.log('user attempting to sign up for account');
  event.preventDefault();

  // get input values from form for storage
  const newEmail = document.getElementById('signup-email').value;
  const newPassword = document.getElementById('signup-password').value;
  const newNumber = document.getElementById('signup-number').value;
  const newAddress = document.getElementById('signup-address').value;
  const newName = document.getElementById('signup-name').value;

  // validate the email using validEmail function
  if (!validEmail(newEmail)) {
    alert('please enter a valid email address.');
    return;
  }

  // check for blank inputs from user
  if (newEmail === '' || newPassword === '' || newNumber === '' || newAddress === '' || newName === '') {
    alert('please enter all information required.');
    return;
  }

  // store user's information in localStorage
  localStorage.setItem('email', newEmail);
  localStorage.setItem('password', newPassword);
  localStorage.setItem('name', newName);
  localStorage.setItem('number', newNumber);
  localStorage.setItem('address', newAddress);

  //alert of successful creation and send back to landing page
  alert('account created successfully');
  window.location.href = 'index.html';
}










/*
TICKET STORAGE HANDLING 
*/

// load the database of tickets from local storage
let lotteryTickets = loadTickets();

// function to add a ticket to the database
function addTicket(name, price, drawDate, winnings) {
  const ticket = {
    name: name,
    price: price,
    drawDate: drawDate,
    winnings: winnings
  };
  // push new ticket into database and save to localStorage
  lotteryTickets.push(ticket);
  saveTickets(lotteryTickets);
}

// function to load tickets from localStorage
function loadTickets() {
  const storedTickets = JSON.parse(localStorage.getItem('lotteryTickets')) || [];
  return storedTickets;
}

// function to save tickets to localStorage
function saveTickets(tickets) {
  localStorage.setItem('lotteryTickets', JSON.stringify(tickets));
}









/*
CART STORAGE HANDLING
*/

// loading the cart from localStorage
let cartTickets = loadCartTickets();

// function to add a ticket to the cart
function addToCart(name, price, drawDate, winnings, quantity) {
  // find the index of the same ticket in the cart (if it exists)
  const existingTicketIndex = cartTickets.findIndex(ticket => ticket.name === name);
  // check if the ticket already exists in the cart
  if (existingTicketIndex !== -1) {
    // if the ticket already exists, update its quantity
    cartTickets[existingTicketIndex].quantity += quantity;
  } else {
    // initializes the ticket's numbers to 1 
    const numbers = Array.from({ length: 5 }, () => 1);
    // if the ticket doesn't exist in the cart, add it
    const ticket = {
      name: name,
      price: price,
      drawDate: drawDate,
      winnings: winnings,
      quantity: quantity,
      numbers: numbers
    };

    // add the new ticket to the cart
    cartTickets.push(ticket);
  }

  // save the updated cart to localStorage
  saveCartTickets(cartTickets);
}

// function to load cart tickets from localStorage
function loadCartTickets() {
  const storedCartTickets = JSON.parse(localStorage.getItem('cartTickets')) || [];
  return storedCartTickets;
}

// function to save cart tickets to localStorage
function saveCartTickets(cart) {
  localStorage.setItem('cartTickets', JSON.stringify(cart));
}

// function to update the quantity of a ticket in the cart
function updateQuantity(select, ticketName) {
  const newQuantity = parseInt(select.value);
  const ticketIndex = cartTickets.findIndex(ticket => ticket.name === ticketName);
  if (ticketIndex !== -1) {
    // remove from cart if quantity is set to 0
    if (newQuantity === 0) {
      cartTickets.splice(ticketIndex, 1);
    } else {
      cartTickets[ticketIndex].quantity = newQuantity;
    }
    // save and display the new cart
    saveCartTickets(cartTickets);
    displayTicketsCart(cartTickets);
  }
}

// function to update the numbers of the ticket
function updateNumbers(input, index, ticketName) {
  const newNumber = parseInt(input.value);

  // check if the new number is within the valid range for lottery ticket numbers (1 - 69)
  if (isNaN(newNumber) || newNumber < 1 || newNumber > 69) {
    alert('Please enter a valid number between 1 and 69.');
    // set the value back to the previous valid value
    input.value = cartTickets.find(ticket => ticket.name === ticketName).numbers[index];
    return;
  }

  const ticketIndex = cartTickets.findIndex(ticket => ticket.name === ticketName);

  if (ticketIndex !== -1) {
    // update the corresponding number in the array
    cartTickets[ticketIndex].numbers[index] = newNumber;

    // save and display the new cart
    saveCartTickets(cartTickets);
    displayTicketsCart(cartTickets);
  }
}









/*
PURCHASE HISTORY STORAGE HANDLING
*/

// loading the purchase history from local storage
let purchaseHistory = loadPurchaseHistory();

// function to add a purchased ticket to the purchase history
function addToPurchaseHistory(name, price, drawDate, winnings, quantity, numbers) {
  // generate a random confirmation number 
  const confirmationNumber = Math.floor(Math.random() * 999999999) + 1;
  const ticket = {
    name: name,
    price: price,
    drawDate: drawDate,
    winnings: winnings,
    quantity: quantity,
    numbers: numbers,
    // set purchaseDate to the current date
    purchaseDate: new Date().toISOString(),
    confirmation: confirmationNumber,
    redeemed: false
  };
  purchaseHistory.push(ticket);
  savePurchaseHistory(purchaseHistory);
}

// function to load purchase history from localStorage
function loadPurchaseHistory() {
  const storedPurchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
  return storedPurchaseHistory;
}

// function to save purchase history to localStorage
function savePurchaseHistory(purchaseHistory) {
  localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
}










/*
TOTAL SALES STORAGE HANDLING
*/

//load totalSales from localStorage
let totalSales = loadTotalSales();

// function to load totalSales from localStorage
function loadTotalSales() {
  const storedTotalSales = parseInt(localStorage.getItem('totalSales')) || 0;
  return storedTotalSales;
}

// function to save totalSales to localStorage
function saveTotalSales(totalSales) {
  localStorage.setItem('totalSales', totalSales);
}













/*
TOTAL EARNINGS STORAGE HANDLING
*/

// load totalEarnings from localStorage
let totalEarnings = loadTotalEarnings();

// function to load totalEarnings from localStorage
function loadTotalEarnings() {
  const storedTotalEarnings = parseInt(localStorage.getItem('totalEarnings')) || 0;
  return storedTotalEarnings;
}

// function to save totalEarnings to localStorage
function saveTotalEarnings(totalEarnings) {
  localStorage.setItem('totalEarnings', totalEarnings);
}











/*
USER BANK ACCOUNT INFO STORAGE
*/

// load bankAccount from localStorage
let bankAccount = loadBankAccount();

// function to add a bank account to local storage
function addBankAccount(name, accountNumber, routingNumber) {
  const account = {
    name: name,
    accountNumber: accountNumber,
    routingNumber: routingNumber
  }
  bankAccount.push(account);
  saveBankAccount(bankAccount);
}
// function to load bankAccount from localStorage
function loadBankAccount() {
  const storedBankAccount = parseInt(localStorage.getItem('bankAccount')) || 0;
  return storedBankAccount;
}

// function to save bankAccount to localStorage
function saveBankAccount(bankAccount) {
  localStorage.setItem('bankAccount', bankAccount);
}





/*
PREVIOUS WINNING NUMBERS STORAGE HANDLING
*/

// generate 5 random numbers between 1 and 69
const prevNums1 = generateRandomWinningNumbers();
const prevNums2 = generateRandomWinningNumbers();
const prevNums3 = generateRandomWinningNumbers();
const prevNums4 = generateRandomWinningNumbers();
const prevNums5 = generateRandomWinningNumbers();
const prevNums6 = generateRandomWinningNumbers();
const prevNums7 = generateRandomWinningNumbers();


// load winningNumbersHistory from localStorage
let winningNumbersHistory = loadWinningNumbersHistory();

// we only want this code to run once, so we'll check if it has run before first
if (!localStorage.getItem('codeHasRunBefore')) {
  addToWinningNumbersHistory("Mega Millions", "2023-12-01", prevNums1);
  addToWinningNumbersHistory("Texas Lotto", "2023-12-02", prevNums2);
  addToWinningNumbersHistory("Texas Two Step", "2023-12-04", prevNums3);
  addToWinningNumbersHistory("Power Ball", "2023-12-03", prevNums4);
  addToWinningNumbersHistory("Mega Millions", "2023-11-30", prevNums5);
  addToWinningNumbersHistory("Texas Lotto", "2023-11-29", prevNums6);
  addToWinningNumbersHistory("Texas Two Step", "2023-11-28", prevNums7);
  localStorage.setItem('codeHasRunBefore', true);
}

// function to add winning numbers entry to the history
function addToWinningNumbersHistory(name, drawDate, numbers) {
  const winningNumber = {
    name: name,
    drawDate: drawDate,
    numbers: numbers
  };
  winningNumbersHistory.push(winningNumber);
  saveWinningNumbersHistory(winningNumbersHistory);
}

// function to load winning numbers history from localStorage
function loadWinningNumbersHistory() {
  const storedWinningNumbersHistory = JSON.parse(localStorage.getItem('winningNumbersHistory')) || [];
  return storedWinningNumbersHistory;
}

// function to save winning numbers history to localStorage
function saveWinningNumbersHistory(winningNumbersHistory) {
  localStorage.setItem('winningNumbersHistory', JSON.stringify(winningNumbersHistory));
}











/*
WINNING TICKETS STORAGE HANDLING
*/

// load winningTickets from localStorage
let winningTickets = loadWinningTickets();

// function to add a winning ticket to the winningTickets array
function addWinningTicket(name, price, drawDate, winnings, quantity, numbers, confirmation) {
  const winningTicket = {
    name: name,
    price: price,
    drawDate: drawDate,
    winnings: winnings,
    quantity: quantity,
    numbers: numbers,
    purchaseDate: new Date().toISOString(),
    confirmation: confirmation,
    redeemed: true
  };
  winningTickets.push(winningTicket);
  saveWinningTickets(winningTickets);

  // set the redeemed variable to true in the purchase history array so tickets wont be redeemed more than once
  const purchaseHistoryIndex = purchaseHistory.findIndex(ticket => ticket.confirmation === confirmation);
  if (purchaseHistoryIndex !== -1) {
    purchaseHistory[purchaseHistoryIndex].redeemed = true;
    // save the updated purchaseHistory array
    savePurchaseHistory(purchaseHistory);
  }
}

// function to load winning tickets from localStorage
function loadWinningTickets() {
  const storedWinningTickets = JSON.parse(localStorage.getItem('winningTickets')) || [];
  return storedWinningTickets;
}

// function to save winning tickets to localStorage
function saveWinningTickets(winningTickets) {
  localStorage.setItem('winningTickets', JSON.stringify(winningTickets));
}










/*
DYNAMIC HTML LIST GENERATION
*/

// function to generate HTML for each ticket to display to users
function generateTicketHTMLBrowse(ticket) {
  const ticketHTML = `
    <li>
      <div class="ticket-container">
        <div class="ticket-info">
          <h3>${ticket.name}</h3>
          <p>Price: $${ticket.price.toFixed(2)}</p>
          <p>Draw Date: ${ticket.drawDate}</p>
          <p>Winning Amount: $${ticket.winnings.toLocaleString()}</p>
        </div>
        <button class="purchase-button" data-ticket-name="${ticket.name}">Purchase</button>
      </div>
    </li>
  `;
  return ticketHTML;
}

// function to create HTML for each ticket to display to admins
function generateTicketHTMLAdmin(ticket) {
  const adminTicketHTML = `
    <li>
      <div class="ticket-container">
        <div class="admin-ticket-info">
          <h3>${ticket.name}</h3>
          <p>Price: $${ticket.price.toFixed(2)}</p>
          <p>Draw Date: ${ticket.drawDate}</p>
          <p>Winning Amount: $${ticket.winnings.toLocaleString()}</p>
        </div>
        <button class="delete-button" data-ticket-name="${ticket.name}">Delete</button>
        <button class="edit-button" data-ticket-name="${ticket.name}">Edit</button>
      </div>
    </li>
  `;
  return adminTicketHTML;
}

// function to create HTML for each ticket to display in the cart
function generateTicketHTMLCart(ticket) {
  const cartTicketHTML = `
    <li>
      <div class="ticket-container">
        <div class="cart-ticket-info">
          <h3>${ticket.name}</h3>
          <p>Price: $${ticket.price.toFixed(2)}</p>
          <p>Draw Date: ${ticket.drawDate}</p>
          <p>Winning Amount: $${ticket.winnings.toLocaleString()}</p>
          <p>Numbers: ${generateNumbersInputHTML(ticket.numbers, ticket.name)}</p>
          <button onclick="randomizeNumbers('${ticket.name}')">Randomize</button>
        </div>
        <div class="quantity-options">
          <label for="quantity-${ticket.name}">Quantity:</label>
          <select id="quantity-${ticket.name}" class="ticket-quantity" data-ticket-name="${ticket.name}" onchange="updateQuantity(this, '${ticket.name}'), calculateTotalPrice();">
            ${generateQuantityOptionsHTML(ticket.quantity)}
          </select>
        </div>
      </div>
    </li>
  `;
  return cartTicketHTML;
}

// function to create HTML for the numbers of the ticket
function generateNumbersInputHTML(numbers, ticketName) {
  let numbersInputHTML = '<p>Numbers: ';
  for (let i = 0; i < numbers.length; i++) {
    numbersInputHTML += `<input type="number" value="${numbers[i]}" min="0" max="10" step="1" onchange="updateNumbers(this, ${i}, '${ticketName}')" />`;
  }
  numbersInputHTML += '</p>';
  return numbersInputHTML;
}

// function to randomize the numbers for a ticket
function randomizeNumbers(ticketName) {
  const ticketIndex = cartTickets.findIndex(ticket => ticket.name === ticketName);

  if (ticketIndex !== -1) {
    // generate 5 random numbers between 1 and 69
    const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 69) + 1);

    // update the ticket's numbers with the random numbers
    cartTickets[ticketIndex].numbers = randomNumbers;

    // save the updated cart tickets
    saveCartTickets(cartTickets);

    // refresh the display of tickets in the cart
    displayTicketsCart(cartTickets);
  }
}

// function to create HTML for the quantity options (0-10) with the selected quantity
function generateQuantityOptionsHTML(selectedQuantity) {
  let optionsHTML = '';
  for (let i = 0; i <= 10; i++) {
    if (i === selectedQuantity) {
      optionsHTML += `<option value="${i}" selected>${i}</option>`;
    } else {
      optionsHTML += `<option value="${i}">${i}</option>`;
    }
  }
  return optionsHTML;
}

// function to create HTML for each ticket to display in the order history
function generateTicketHTMLOrderHistory(ticket) {
  const orderHistoryTicketHTML = `
    <li>
      <div class="ticket-container">
        <div class="order-ticket-info">
          <h3>${ticket.name}</h3>
          <p>Price: $${ticket.price.toFixed(2)}</p>
          <p>Draw Date: ${ticket.drawDate}</p>
          <p>Winning Amount: $${ticket.winnings.toLocaleString()}</p>
        </div>
        <div class="order-details">
          <p>Quantity: ${ticket.quantity}</p>
          <p>Numbers: ${ticket.numbers}</p>
          <p>Purchase Date: ${ticket.purchaseDate}</p>
          <p>Confirmation Number: ${ticket.confirmation}</p>
        </div>
      </div>
    </li>
  `;
  return orderHistoryTicketHTML;
}

// function to create HTML for each ticket to display on the redeem page
function generateTicketHTMLWinning(ticket) {
  const winningTicketHTML = `
    <li>
      <div class="ticket-container">
        <div class="winning-ticket-info">
          <h3>${ticket.name}</h3>
          <p>Price: $${ticket.price.toFixed(2)}</p>
          <p>Draw Date: ${ticket.drawDate}</p>
          <p>Winning Amount: $${ticket.winnings.toLocaleString()}</p>
        </div>
        <div class="order-details">
          <p>Quantity: ${ticket.quantity}</p>
          <p>Numbers: ${ticket.numbers}</p>
          <p>Purchase Date: ${ticket.purchaseDate}</p>
          <p>Confirmation Number: ${ticket.confirmation}</p>
    </li>
  `;
  return winningTicketHTML;
}

// function to create HTML for each ticket to display on previous winnings page
function generateTicketHTMLPreviousWinning(ticket) {
  const previousWinningTicketHTML = `
    <li>
      <div class="ticket-container">
        <div class="previous-ticket-info">
          <h3>${ticket.name}</h3>
          <p>Draw Date: ${ticket.drawDate}</p>
          <p>Winning Numbers: ${ticket.numbers}</p>
        </div>
      </div>
    </li>
  `;
  return previousWinningTicketHTML;
}











/*
HOME PAGE FUNCTIONALITY
*/

// home page to browse page button
const pageJumpBrowse = document.getElementById('page-jump-browse');
if (pageJumpBrowse) {
  pageJumpBrowse.addEventListener('click', function() {
    window.location.href = 'browse.html';
  });
}

// home page to user info page button
const pageJumpUserInfo = document.getElementById('page-jump-user-info');
if (pageJumpUserInfo) {
  pageJumpUserInfo.addEventListener('click', function() {
    window.location.href = 'UserInfo.html';
    editUserOpen();
  });
}

// home page to order history / cart button
const pageJumpOrderHistory = document.getElementById('page-jump-history');
if (pageJumpOrderHistory) {
  pageJumpOrderHistory.addEventListener('click', function() {
    window.location.href = "purchase.html";
  });
}

// home page to previous winnings button
const pageJumpPreviousWinnings = document.getElementById('page-jump-numbers');
if (pageJumpPreviousWinnings) {
  pageJumpPreviousWinnings.addEventListener('click', function() {
    window.location.href = "PreviousNumbers.html";
  });
}

// back to home button
const backToHomeButton = document.getElementById('back-to-home-button');
if (backToHomeButton) {
  backToHomeButton.addEventListener('click', function() {
    window.location.href = "homepage.html";
  });
}







/*
ADMIN LOGIN PAGE FUNCTIONALITY
*/

// admin login form submission
const adminLoginForm = document.querySelector('.login-form');
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', adminLogin);
}

// function to log admin in
function adminLogin(event) {
  event.preventDefault();

  // get the value from the passkey input field
  const inputPasskey = document.getElementById('admin-passkey').value;

  // validate the passkey
  if (validateAdminPasskey(inputPasskey)) {
    // redirect the user to the Admin Dashboard page if valid 
    window.location.href = 'AdminDash.html';
  } else {
    // show an error if invalid
    alert('Invalid passkey, access denied.');
  }
}

// admin validation function
function validateAdminPasskey(passKey) {
  // a simple, unencrypted passkey for the sake of this project, would be more secure in real world application
  //this should be kept secret but for this project it is visible here
  const correctPassKey = 'WirBallen';
  if (passKey === correctPassKey) {
    return true;
  }
}










/*
ADMIN DASHBOARD FUNCTIONALITY
*/

// call the displayTicketsAdmin function to initially display the tickets to the admin
displayTicketsAdmin();

// function to display the list of tickets on admin page 
function displayTicketsAdmin() {
  const resultListAdmin = document.getElementById('results-list-admin');
  if (resultListAdmin) {
    // clear existing content
    resultListAdmin.innerHTML = '';
    lotteryTickets.forEach(ticket => {
      //generate HTML for each ticket
      const ticketHTML = generateTicketHTMLAdmin(ticket);
      resultListAdmin.innerHTML += ticketHTML;
    });
  }

  // add delete and edit buttons to each ticket
  const deleteButtons = document.querySelectorAll('.delete-button');
  const editButtons = document.querySelectorAll('.edit-button');

  deleteButtons.forEach(button => {
    button.addEventListener('click', deleteTicketPress);
  });

  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const ticketName = this.getAttribute('data-ticket-name');
      editTicketOpen(ticketName);
      displayTicketsAdmin();
      console.log(`edit button clicked for ${ticketName}`);
    });
  });
}

// function for delete ticket button presses
function deleteTicketPress() {
  const ticketName = this.getAttribute('data-ticket-name');
  // display confirmation popup
  const confirmDelete = confirm(`Are you sure you want to delete ${ticketName} from the database?`);
  if (confirmDelete) {
    // call the delete functions (from the database and the cart)
    deleteTicket(ticketName);
    deleteTicketCart(ticketName);
    //save the new ticket database and display it
    saveTickets(lotteryTickets);
    saveCartTickets(cartTickets);
    displayTicketsAdmin();
  }
  console.log(`delete button clicked for ${ticketName}`);
}

// function to delete a ticket
function deleteTicket(ticketName) {
  // find the index of the ticket in the array
  const index = lotteryTickets.findIndex(ticket => ticket.name === ticketName);
  // remove the ticket from the array
  if (index !== -1) {
    lotteryTickets.splice(index, 1);
  }
}

// function to delete a ticket if its in the cart
function deleteTicketCart(ticketName) {
  // find the index of the ticket in the array
  const index = cartTickets.findIndex(ticket => ticket.name === ticketName);
  // remove the ticket from the array
  if (index !== -1) {
    cartTickets.splice(index, 1);
  }
}

// function to open the edit form
function editTicketOpen(ticketName) {
  const editedTicket = lotteryTickets.find(ticket => ticket.name === ticketName);

  // dynamically generate HTML for the edit form
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  const editForm = document.createElement('div');
  editForm.innerHTML = `
    <h2>Edit Ticket</h2>
    <form id="edit-form">
      <label for="edit-name">Name:</label>
      <input type="text" id="edit-name" value="${ticketName}" required>

      <label for="edit-price">Price:</label>
      <input type="number" id="edit-price" value="${editedTicket.price}" required>

      <label for="edit-drawDate">Draw Date:</label>
      <input type="text" id="edit-drawDate" value="${editedTicket.drawDate}" required>

      <label for="edit-winnings">Winnings:</label>
      <input type="number" id="edit-winnings" value="${editedTicket.winnings}" required>

      <button type="button" onclick="editTicket('${ticketName}')">Update</button>
      <button type="button" onclick="editTicketClose()">Cancel</button>
    </form>
  `;
  editForm.classList.add('edit-box');
  document.body.appendChild(overlay);
  document.body.appendChild(editForm);
}

// function to close the edit form
function editTicketClose() {
  const editForm = document.querySelector('.edit-box');
  const overlay = document.querySelector('.overlay');
  if (editForm && overlay) {
    document.body.removeChild(overlay);
    document.body.removeChild(editForm);
  }
}

// function to edit the ticket information
function editTicket(ticketName) {
  const editedTicket = {
    name: document.getElementById('edit-name').value,
    price: parseFloat(document.getElementById('edit-price').value),
    drawDate: document.getElementById('edit-drawDate').value,
    winnings: parseFloat(document.getElementById('edit-winnings').value)
  };

  if (!validDate(editedTicket.drawDate)) {
    alert("Invalid date format. Please enter a valid date in the format YYYY-MM-DD.");
    return;
  }

  // find the index of the ticket in the array
  const index = lotteryTickets.findIndex(ticket => ticket.name === ticketName);

  // update the ticket in the array
  if (index !== -1) {
    lotteryTickets[index] = editedTicket;
  }
  // save the new ticket info
  saveTickets(lotteryTickets);

  // close the edit form
  editTicketClose();

  // update the display after editing
  displayTicketsAdmin();
}


// functionality for "Add New Ticket" button
const addTicketButton = document.getElementById('add-ticket-button');
if (addTicketButton) {
  addTicketButton.addEventListener('click', newTicketOpen);
}

// function to open the new ticket form
function newTicketOpen() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  const newForm = document.getElementById('addTicket');

  document.body.appendChild(overlay);
  newForm.style.display = 'block';
}

// function to close the new ticket form
function newTicketClose() {
  const newForm = document.getElementById('addTicket');
  const overlay = document.querySelector('.overlay');
  if (newForm && overlay) {
    newForm.style.display = 'none';
    document.body.removeChild(overlay);
  }
}

// new ticket form submission
const newTicket = document.getElementById('add-ticket');
if (newTicket) {
  newTicket.addEventListener('submit', newTicketDone);
}

// function to validate the new ticket info and save it
function newTicketDone(event) {
  console.log('admin is adding a new ticket');
  event.preventDefault();

  const name = document.getElementById('new-ticket-name').value;
  const price = parseFloat(document.getElementById('new-ticket-price').value);
  const drawDate = document.getElementById('new-ticket-date').value;
  const winnings = parseFloat(document.getElementById('new-ticket-winnings').value);


  // a series of checks to ensure the inputted values are able to be used
  if (isNaN(price)) {
    alert('Invalid price. Please enter a valid value.');
    return;
  }
  if (!validDate(drawDate)) {
    alert('Invalid date. Please enter a valid draw date.');
    return;
  }
  if (isNaN(winnings)) {
    alert('Invalid winnings. Please enter a valid value.');
    return;
  }

  // add the new ticket to the database
  addTicket(name, price, drawDate, winnings);

  // save and display the updated list of tickets
  alert('Successfully added new ticket.');
  saveTickets(lotteryTickets);
  newTicketClose();
  displayTicketsAdmin();
}

// status report button
const statusReportButton = document.getElementById('status-report-button');
if (statusReportButton) {
  statusReportButton.addEventListener('click', function() {
    statusReport();
  });
}

// function to display a status report
function statusReport() {
  alert(`Total Tickets Sold: ${totalSales}\nTotal Earnings: $${totalEarnings}`);
}

// add winning numbers button
const addWinningNumbersButton = document.getElementById('add-winning-button');
if (addWinningNumbersButton) {
  addWinningNumbersButton.addEventListener('click', function() {
    // prompt for Ticket Name
    var name = prompt("Enter Ticket Name");
    if (!name) {
      alert("Ticket Name cannot be blank. Please try again.");
      return;
    }

    // prompt for 5 Winning Numbers
    var numberArray = [];
    for (var i = 1; i <= 5; i++) {
      var isValid = false;
      while (!isValid) {
        var number = parseInt(prompt("Enter Winning Number " + i));
        if (isNaN(number) || number < 1 || number > 69) {
          alert("Invalid number. Please enter a number between 1 and 69.");
        } else {
          isValid = true;
          numberArray.push(number);
        }
      }
    }

    // add winning numbers to localStorage
    addWinningNumbers(name, numberArray);
    alert("Winning numbers " + numberArray.join(', ') + " added to " + name + " successfully.");
  });
}





/*
PURCHASE PAGE (CART) FUNCTIONALITY
*/

// function to display the user's cart
function displayTicketsCart(cartTickets) {
  const resultListCart = document.getElementById('results-list-cart');
  if (resultListCart) {
    resultListCart.innerHTML = ''; // clear existing content
    cartTickets.forEach(ticket => {
      const ticketHTML = generateTicketHTMLCart(ticket);
      resultListCart.innerHTML += ticketHTML;
    });
  }
}

// function to display user's purchase history
function displayTicketsHistory(purchaseHistory) {
  const resultHistory = document.getElementById('results-list-history');
  if (resultHistory) {
    resultHistory.innerHTML = ''; // clear existing content
    purchaseHistory.forEach(ticket => {
      const ticketHTML = generateTicketHTMLOrderHistory(ticket);
      resultHistory.innerHTML += ticketHTML;
    });
  }
}

// function to handle purchasing logic / redirect to cart
function purchasePage(ticketName) {
  console.log(`purchase button clicked for ${ticketName}`);
  const boughtTicket = lotteryTickets.find(ticket => ticket.name === ticketName);
  const { name, price, drawDate, winnings } = boughtTicket;
  addToCart(name, price, drawDate, winnings, 1);
  alert('Cart Updated!');
}

//display the cart, total price, and purchase history each time the page refreshes
displayTicketsCart(cartTickets);
displayTicketsHistory(purchaseHistory);
calculateTotalPrice();


// function to calculate the total of the items in the cart
function calculateTotalPrice() {
  const cartTickets = loadCartTickets();
  const totalPriceDiv = document.getElementById('total-price');
  if (totalPriceDiv) {
    const total = cartTickets.reduce((acc, ticket) => acc + (ticket.price * ticket.quantity), 0);
    totalPriceDiv.textContent = `Total: $${total.toFixed(2)}`;
  }
}

// confirm purchase button
const confirmPurchaseButton = document.getElementById('confirm-purchase-button');
if (confirmPurchaseButton) {
  confirmPurchaseButton.addEventListener('click', confirmPurchase);
  console.log('Confirmed Purchase');
}

// function for confirming a purchase
function confirmPurchase() {
  const hasTicketsInCart = cartTickets.length > 0;

  // check if there is a default payment method selected
  const defaultPayment = JSON.parse(localStorage.getItem('defaultPayment'));
  const hasDefaultPayment = !!defaultPayment;

  // make sure cart is not empty and a default payment method is selected
  if (hasTicketsInCart && hasDefaultPayment) {
    let paymentMethodText = '';
    // check if default payment is a credit card
    if (defaultPayment.cardNumber) {
      paymentMethodText = `card ending in ${defaultPayment.cardNumber.slice(-4)}`;
      // or paypal
    } else if (defaultPayment.username) {
      paymentMethodText = `PayPal: ${defaultPayment.username}`;
    } else {
      alert('Unknown default payment method.');
      return;
    }

    // ask the user for confirmation before completing the purchase
    const confirmed = confirm(`Do you want to complete this purchase with ${paymentMethodText}?`);

    // if they confirm, add each ticket to the order history, calculate earnings and number of sales, and save them all to localStorage
    if (confirmed) {
      cartTickets.forEach(ticket => {
        const { name, price, drawDate, winnings, quantity, numbers } = ticket;
        addToPurchaseHistory(name, price, drawDate, winnings, quantity, numbers);
        let earnings = price * quantity;
        totalEarnings = totalEarnings + earnings;
        saveTotalEarnings(totalEarnings);
        // add the quantity to totalSales for each confirmed ticket sale
        totalSales = totalSales + quantity;
        saveTotalSales(totalSales);
      });

      // empty and save the cart 
      cartTickets.length = 0;
      saveCartTickets(cartTickets);
      alert('Purchase completed successfully!');
      displayTicketsCart();
      displayTicketsHistory();
      checkWinningTickets();
    }
  } else if (!hasDefaultPayment) {
    alert('Please select a payment method before completing the purchase.');
  } else {
    alert('Your cart is empty.');
  }
}


// retreive the winning numbers array from localStorage
let winningNumbersArray = JSON.parse(localStorage.getItem('winningNumbers')) || [];

// function to add winning numbers for a ticket
function addWinningNumbers(ticketName, winningNumbers) {
  const existingTicketIndex = winningNumbersArray.findIndex(ticket => ticket.name === ticketName);

  if (existingTicketIndex !== -1) {
    // if the ticket already has winning numbers, update them
    winningNumbersArray[existingTicketIndex].winningNumbers = winningNumbers;
  } else {
    // if the ticket doesn't exist, add it to the array
    winningNumbersArray.push({
      name: ticketName,
      winningNumbers: winningNumbers
    });
  }
  localStorage.setItem('winningNumbers', JSON.stringify(winningNumbersArray));
}

// a sample test ticket and winning numbers
//addWinningNumbers("Real Test Ticket", [1, 2, 3, 4, 5]);
if (window.location.pathname.includes("purchase.html")) {
  checkWinningTickets();
}


// function to check the user's purchase history for winning tickets that haven't yet been redeemed
function checkWinningTickets() {
  for (const ticket of purchaseHistory) {
    const matchingWinningTicket = winningNumbersArray.find(winningTicket => winningTicket.name === ticket.name);

    if (matchingWinningTicket) {
      // count the number of matching numbers for winnings calculation
      let matchingNumbersCount = 0;

      for (const ticketNumber of ticket.numbers) {
        if (matchingWinningTicket.winningNumbers.includes(ticketNumber)) {
          matchingNumbersCount++;
        }
      }

      if (matchingNumbersCount > 0) {
        // calculate winnings based on matching numbers count
        let winningsPercentage = 0;

        switch (matchingNumbersCount) {
          case 5:
            winningsPercentage = 1;
            break;
          case 4:
            winningsPercentage = .2;
            break;
          case 3:
            winningsPercentage = .05;
            break;
          case 2:
            winningsPercentage = .01;
            break;
          // no winnings for one matching number
        }

        const winningsAmount = (ticket.winnings * winningsPercentage);

        // check if there is not already a ticket with the same confirmation number
        const existingWinningTicket = winningTickets.find(existingTicket => existingTicket.confirmation === ticket.confirmation);

        if (!existingWinningTicket && !ticket.redeemed) {
          addWinningTicket(ticket.name, ticket.price, ticket.drawDate, winningsAmount, ticket.quantity, ticket.numbers, ticket.confirmation);
          const redeem = confirm(`Congratulations! You have ${matchingNumbersCount} matching number(s) for ${ticket.name}! You won $${winningsAmount.toFixed(2)} from this ticket! Would you like to go to redeem now?`);

          if (redeem) {
            window.location.href = 'redeem.html';
          }
        }
      }
    }
  }
}

// redeem button on order page
const redeemButtonOrder = document.getElementById('redeem-button-order');
if (redeemButtonOrder) {
  redeemButtonOrder.addEventListener('click', function() {
    window.location.href = 'redeem.html';
  });
}

// function to display the default payment on the purchase page
function displayDefaultPaymentDetails() {
  const defaultPaymentDetails = document.getElementById('defaultPaymentDetails');
  if (defaultPaymentDetails) {
    const paymentMethodElement = defaultPaymentDetails.querySelector('#payment-method span');

    // load the default payment from localStorage
    const defaultPayment = JSON.parse(localStorage.getItem('defaultPayment'));

    // check if there is a default payment
    if (defaultPayment) {
      // check if it's a credit card
      if (defaultPayment.cardNumber) {
        const last4Digits = defaultPayment.cardNumber.slice(-4);
        paymentMethodElement.textContent = `Card ending in ${last4Digits}`;
        // or if it's paypal
      } else if (defaultPayment.username) {
        const email = defaultPayment.username;
        paymentMethodElement.textContent = `PayPal: ${email}`;
      }
    }
  }
}


// button to change payment method
const changePaymentButton = document.getElementById('change-payment-button');
if (changePaymentButton) {
  changePaymentButton.addEventListener('click', function() {
    window.location.href = 'UserInfo.html';
  });
}

displayDefaultPaymentDetails();












/*
REDEEM WINNINGS PAGE FUNCTIONALITY
*/

// function to display user's purchase history
function displayTicketsWinnings(winningTickets) {
  const resultWinnings = document.getElementById('results-list-winnings');
  if (resultWinnings) {
    resultWinnings.innerHTML = ''; // clear existing content
    winningTickets.forEach(ticket => {
      const ticketHTML = generateTicketHTMLWinning(ticket);
      resultWinnings.innerHTML += ticketHTML;
    });
  }
}

displayTicketsWinnings(winningTickets);

// redeem button functionality on redeem page
const redeemButton = document.getElementById('redeem-button');
if (redeemButton) {
  redeemButton.addEventListener('click', function() {
    if (winningTickets.length === 0) {
      alert('You have no tickets to redeem.');
      return;
    }

    let runningTotal = 0;

    for (const ticket of winningTickets) {
      const winningAmount = parseFloat(ticket.winnings);
      const totalWinningAmount = winningAmount * ticket.quantity;

      // add the total winning amount of each ticket to the running total
      runningTotal += totalWinningAmount;
    }

    // if total winnings are less than 599, check bank account information
    if (runningTotal < 599) {
      const bankName = localStorage.getItem('bankName');
      const accountNumber = localStorage.getItem('accountNumber');
      const routingNumber = localStorage.getItem('routingNumber');

      // check if bank account information is not null and numbers are valid
      if (bankName && !isNaN(accountNumber) && !isNaN(routingNumber)) {
        // clear the winningTickets array
        winningTickets = [];
        // save and display the updated winningTickets array
        saveWinningTickets(winningTickets);
        displayTicketsWinnings(winningTickets);

        // notify the user that they have successfully redeemed their winnings
        alert(`Congratulations! You have successfully redeemed your winnings to ${bankName}.\nTotal Redeemed Amount: $${runningTotal.toLocaleString()}`);
      }
      else {
        // prompt the user to add a valid bank account
        const addBankAccount = confirm('No valid bank information on file. Go add one now?');
        if (addBankAccount) {
          window.location.href = 'UserInfo.html';
        }
      }
    }
    else {
      alert('You must redeem amounts over $599 at your local lottery claiming center.');
    }
  });
}













/*
BROWSE PAGE BASIC DISPLAYS
*/

// call the displayTickets function to initially display the tickets
displayTicketsBrowse(lotteryTickets);

// function to display the list of tickets on browse page (to user)
function displayTicketsBrowse(ticketArray) {
  const resultListBrowse = document.getElementById('results-list-browse');
  if (resultListBrowse) {
    resultListBrowse.innerHTML = ''; // clear existing content
    ticketArray.forEach(ticket => {
      const ticketHTML = generateTicketHTMLBrowse(ticket);
      resultListBrowse.innerHTML += ticketHTML;
    });
  }

  // add purchase buttons to each ticket
  const purchaseButtons = document.querySelectorAll('.purchase-button');
  purchaseButtons.forEach(button => {
    button.addEventListener('click', function() {
      let ticketName = this.getAttribute('data-ticket-name');
      purchasePage(ticketName);
    });
  });
}

// cart button functionality
const cartButton = document.getElementById('cart-button');
if (cartButton) {
  cartButton.addEventListener('click', function() {
    window.location.href = 'purchase.html';
  });
}











/*
FILTER BY NAME
*/

// functionality of "Filter by Name" button
const filterByName = document.getElementById('filter-name');
if (filterByName) {
  filterByName.addEventListener('click', function() {
    // call function to sort by ascending by default
    sortName(true);
    // call function to take any further inputs of ascending / descending
    nameSortAscDesc();
  });
}

// function to take any further ascending / descending button input after sorting by name
function nameSortAscDesc() {
  // ascending and descending buttons
  const ascendingButton = document.getElementById('ascending-button');
  const descendingButton = document.getElementById('descending-button');

  // sort tickets by name in ascending order
  ascendingButton.addEventListener('click', function() {
    sortPrice(true);
  });

  // sort tickets by name in descending order
  descendingButton.addEventListener('click', function() {
    sortPrice(false);
  });
}

// function to sort tickets by name and display the sorted list
function sortName(ascending) {
  lotteryTickets.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  // display the sorted tickets
  displayTicketsBrowse(lotteryTickets);
}










/*
FILTER BY PRICE
*/

// functionality of "Filter by Price" button
const filterByPrice = document.getElementById('filter-price');
if (filterByPrice) {
  filterByPrice.addEventListener('click', function() {
    // call function to sort by ascending by default
    sortPrice(true);
    // call function to take any further inputs of ascending / descending
    priceSortAscDesc();
  });
}

// function for further ascending / descending button presses after sorting by price
function priceSortAscDesc() {
  // ascending and descending buttons
  const ascendingButton = document.getElementById('ascending-button');
  const descendingButton = document.getElementById('descending-button');

  // sort tickets by price in ascending order
  ascendingButton.addEventListener('click', function() {
    sortPrice(true);
  });

  // sort tickets by price in descending order
  descendingButton.addEventListener('click', function() {
    sortPrice(false);
  });
}

// function to sort tickets by price and display the sorted list
function sortPrice(ascending) {
  lotteryTickets.sort((a, b) => {
    return ascending ? a.price - b.price : b.price - a.price;
  });

  // display the sorted tickets
  displayTicketsBrowse(lotteryTickets);
}










/*
FILTER BY DRAW DATE
*/

// functionality of "Filter by Draw Date" button
const filterByDrawDate = document.getElementById('filter-draw-date');
if (filterByDrawDate) {
  filterByDrawDate.addEventListener('click', function() {
    // call function to sort by ascending by default
    sortDrawDate(true);
    // call function to take any further inputs of ascending / descending
    sortDrawDateAscDesc();
  });
}

// function for further ascending / descending button presses after sorting by draw date
function sortDrawDateAscDesc() {
  // ascending and descending buttons
  const ascendingButton = document.getElementById('ascending-button');
  const descendingButton = document.getElementById('descending-button');

  // sort tickets by draw date in ascending order
  ascendingButton.addEventListener('click', function() {
    sortDrawDate(true);
  });

  // sort tickets by draw date in descending order
  descendingButton.addEventListener('click', function() {
    sortDrawDate(false);
  });
}

// function to sort tickets by draw date and display the sorted list
function sortDrawDate(ascending) {
  lotteryTickets.sort((a, b) => {
    const aDate = new Date(a.drawDate);
    const bDate = new Date(b.drawDate);
    return ascending ? aDate - bDate : bDate - aDate;
  });

  // display the sorted tickets
  displayTicketsBrowse(lotteryTickets);
}










/*
FILTER BY WINNINGS
*/

// functionality of "Filter by Winnings" button
const filterByWinnings = document.getElementById('filter-winnings');
if (filterByWinnings) {
  filterByWinnings.addEventListener('click', function() {
    // call function to sort by ascending by default
    sortWinnings(true);
    // call function to take any further inputs of ascending / descending
    sortWinningsAscDesc();
  });
}

// function for further ascending / descending button presses after filtering by winnings
function sortWinningsAscDesc() {
  // ascending and descending buttons
  const ascendingButton = document.getElementById('ascending-button');
  const descendingButton = document.getElementById('descending-button');

  // sort tickets by winnings in ascending order
  ascendingButton.addEventListener('click', function() {
    sortWinnings(true);
  });

  // sort tickets by winnings in descending order
  descendingButton.addEventListener('click', function() {
    sortWinnings(false);
  });
}

// function to sort tickets by winnings and display the sorted list
function sortWinnings(ascending) {
  lotteryTickets.sort((a, b) => {
    return ascending ? a.winnings - b.winnings : b.winnings - a.winnings;
  });

  // display the sorted tickets
  displayTicketsBrowse(lotteryTickets);
}










/*
SEARCH BAR FUNCTIONALITY
*/

// functionality of user input into search bar
const searchBar = document.getElementById('search-bar');
if (searchBar) {
  searchBar.addEventListener('input', function() {
    searchByName();
  });
}

// function to perform a search by name
function searchByName() {
  const searchBar = document.getElementById('search-bar');
  const searchTerm = searchBar.value.trim().toUpperCase();

  // filter tickets that match the search term
  const searchResult = lotteryTickets.filter(ticket => ticket.name.toUpperCase().includes(searchTerm));

  // display the search results
  displayTicketsBrowse(searchResult);
}









/*
USER INFO PAGE FUNCTIONALITY
*/

// function to display the user info form
function displayUserInfo() {
  var userName = document.getElementById('user-name');
  var userEmail = document.getElementById('user-email');
  var userPhone = document.getElementById('user-phone');
  var userAddress = document.getElementById('user-address');
  var userBankName = document.getElementById('user-bank-name');
  var userAccountNumber = document.getElementById('user-account-number');
  var userRoutingNumber = document.getElementById('user-routing-number');

  if (userName) {
    userName.textContent = localStorage.getItem('name') || 'N/A';
  }

  if (userEmail) {
    userEmail.textContent = localStorage.getItem('email') || 'N/A';
  }

  if (userPhone) {
    userPhone.textContent = localStorage.getItem('number') || 'N/A';
  }

  if (userAddress) {
    userAddress.textContent = localStorage.getItem('address') || 'N/A';
  }

  if (userBankName) {
    userBankName.textContent = localStorage.getItem('bankName') || 'N/A';
  }

  if (userAccountNumber) {
    userAccountNumber.textContent = localStorage.getItem('accountNumber') || 'N/A';
  }

  if (userRoutingNumber) {
    userRoutingNumber.textContent = localStorage.getItem('routingNumber') || 'N/A';
  }
}

// function to display the edit form
function displayEditForm() {
  document.getElementById('edit-user-name').value = localStorage.getItem('name') || '';
  document.getElementById('edit-user-email').value = localStorage.getItem('email') || '';
  document.getElementById('edit-user-phone').value = localStorage.getItem('number') || '';
  document.getElementById('edit-user-address').value = localStorage.getItem('address') || '';
  document.getElementById('edit-user-bank-name').value = localStorage.getItem('bankName') || '';
  document.getElementById('edit-user-account-number').value = localStorage.getItem('accountNumber') || '';
  document.getElementById('edit-user-routing-number').value = localStorage.getItem('routingNumber') || '';
}

// function to toggle the edit form
function toggleEdit() {
  let userInfo = document.querySelector('.user-info-container');
  let editInfo = document.getElementById('user-info-edit');

  // if it is off, display it
  if (editInfo.style.display === 'none') {
    displayEditForm();
    userInfo.style.display = 'none';
    editInfo.style.display = 'block';
    // otherwise, turn it off
  } else {
    userInfo.style.display = 'block';
    editInfo.style.display = 'none';
  }
}

// function to save this new user info to localStorage
function saveUserInfo() {
  const editUserName = document.getElementById('edit-user-name');
  const editUserEmail = document.getElementById('edit-user-email');
  const editUserPhone = document.getElementById('edit-user-phone');
  const editUserAddress = document.getElementById('edit-user-address');
  const editUserBankName = document.getElementById('edit-user-bank-name');
  const editUserAccountNumber = document.getElementById('edit-user-account-number');
  const editUserRoutingNumber = document.getElementById('edit-user-routing-number');


  // check the validity of each input field
  if (
    editUserName.checkValidity() &&
    editUserEmail.checkValidity() &&
    editUserPhone.checkValidity() &&
    editUserAddress.checkValidity() &&
    validEmail(editUserEmail.value)
  ) {
    // if all fields are valid, save the information
    localStorage.setItem('name', editUserName.value);
    localStorage.setItem('email', editUserEmail.value);
    localStorage.setItem('number', editUserPhone.value);
    localStorage.setItem('address', editUserAddress.value);
    localStorage.setItem('bankName', editUserBankName.value);
    localStorage.setItem('accountNumber', editUserAccountNumber.value);
    localStorage.setItem('routingNumber', editUserRoutingNumber.value);

    // display the new user info 
    displayUserInfo();

    // turn edit form off
    toggleEdit();
  } else {
    alert('Please fill out all required fields with valid information.');
  }
}

// a function to handle pressing the cancel button
function cancelEdit() {
  toggleEdit();
}

// if we're on the user info page
if (window.location.pathname.endsWith('UserInfo.html')) {
  // cancel button on edit form
  const cancelEditBtn = document.getElementById('cancel-edit-button');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', cancelEdit);
  }

  // edit user info button
  const editButton = document.getElementById('edit-user-info-button');
  if (editButton) {
    editButton.addEventListener('click', toggleEdit);
  }

  // save user info button
  const saveButton = document.getElementById('save-user-info-button');
  if (saveButton) {
    saveButton.addEventListener('click', saveUserInfo);
  }
};

// close the add payment method modal by default
closeAddPayment();

// function to display the payment method dropdown menu
function displayPaymentDropdown() {
  const paymentDropdown = document.getElementById('payment-dropdown');
  if (paymentDropdown) {
    paymentDropdown.innerHTML = '<option value="-1">Select Payment Info</option>';

    // retrieve saved payment info from localStorage
    const savedPaymentInfo = JSON.parse(localStorage.getItem('savedPaymentInfo')) || [];
    const defaultPayment = JSON.parse(localStorage.getItem('defaultPayment'));

    // populate the dropdown with user's saved payment info
    savedPaymentInfo.forEach((payment, index) => {
      const option = document.createElement('option');
      option.value = index;

      // Check the type of payment method
      if (payment.cardNumber) {
        // It's a credit card
        option.textContent = `Card ending in ${payment.cardNumber.slice(-4)}`;
      } else if (payment.username) {
        // It's PayPal
        option.textContent = `PayPal: ${payment.username}`;
      } else {
        console.log('Unknown payment method:', payment);
        return; // Skip unknown payment methods
      }

      // find the default payment method, and display that one by default
      if (defaultPayment && JSON.stringify(payment) === JSON.stringify(defaultPayment)) {
        option.selected = true;
      }

      paymentDropdown.appendChild(option);
    });

    // option to add payment info
    const addPaymentOption = document.createElement('option');
    addPaymentOption.value = 'add';
    addPaymentOption.textContent = 'Add Payment Info';
    paymentDropdown.appendChild(addPaymentOption);
  }
}


// function to open the add payment form
function openAddPayment() {
  const addPaymentModal = document.getElementById('addPaymentModal');
  if (addPaymentModal) {
    addPaymentModal.style.display = 'block';
  }

}

// function to close add payment form
function closeAddPayment() {
  const addPaymentModal = document.getElementById('addPaymentModal');
  if (addPaymentModal) {
    addPaymentModal.style.display = 'none';
  }

}

// function to save the new payment info
function savePaymentInfo() {
  // get values from the input fields
  const cardNumber = document.getElementById('cardNumber').value;
  const expirationDate = document.getElementById('expirationDate').value;
  const csv = document.getElementById('csv').value;
  const cardOwnerName = document.getElementById('cardOwnerName').value;

  // check if any of the fields are empty
  if (!cardNumber || !expirationDate || !csv || !cardOwnerName) {
    alert('Please fill out all fields.');
    return;
  }

  // check if the card number is 16 digits long
  if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
    alert('Please enter a valid 16-digit card number.');
    return;
  }

  // check if the expiration date is in the format mm/yy
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
    alert('Please enter a valid expiration date in the format MM/YY.');
    return;
  }

  // check if the CSV is 3 digits long
  if (csv.length !== 3 || !/^\d+$/.test(csv)) {
    alert('Please enter a valid 3-digit CSV.');
    return;
  }

  const newPaymentInfo = {
    cardNumber: cardNumber,
    expirationDate: expirationDate,
    csv: csv,
    cardOwnerName: cardOwnerName
  };


  // load any saved payment information
  const savedPaymentInfo = JSON.parse(localStorage.getItem('savedPaymentInfo')) || [];

  // add the new payment info to the array
  savedPaymentInfo.push(newPaymentInfo);

  // save the updated payment info array to localStorage
  localStorage.setItem('savedPaymentInfo', JSON.stringify(savedPaymentInfo));

  // close the form
  closeAddPayment();

  // display the new payment methods dropdown
  displayPaymentDropdown();
}

// if a new payment method is selected
const paymentDropdown = document.getElementById('payment-dropdown');
if (paymentDropdown) {
  paymentDropdown.addEventListener('change', function() {
    const selectedValue = paymentDropdown.value;

    if (selectedValue === 'add') {
      // open the add payment form if they select add
      openAddPayment();
    } else if (selectedValue !== '-1') {
      // retrieve saved payment info from localStorage
      const savedPaymentInfo = JSON.parse(localStorage.getItem('savedPaymentInfo')) || [];
      const selectedPayment = savedPaymentInfo[selectedValue];

      // set the selected payment as the default payment in localStorage
      localStorage.setItem('defaultPayment', JSON.stringify(selectedPayment));

      // save the updated payment info array to localStorage
      localStorage.setItem('savedPaymentInfo', JSON.stringify(savedPaymentInfo));

      // close the form
      closeAddPayment();

      // display the new payment dropdown 
      displayPaymentDropdown();
      alert(`Selected Payment Info:\nCard ending in ${selectedPayment.cardNumber.slice(-4)}`);
    }
  });
}

displayUserInfo();
displayPaymentDropdown();






/*
PREVIOUS WINNING NUMBERS PAGE 
*/

// function to display the list of previous winning numbers
function displayPreviousWinningNumbers(winningNumbersHistory) {
  const resultListNumbers = document.getElementById('results-list-numbers');
  if (resultListNumbers) {
    resultListNumbers.innerHTML = ''; // Clear existing content
    winningNumbersHistory.forEach(winningNumber => {
      const winningNumbersHTML = generateTicketHTMLPreviousWinning(winningNumber);
      resultListNumbers.innerHTML += winningNumbersHTML;
    });
  }
}
displayPreviousWinningNumbers(winningNumbersHistory);











/*
MISC FUNCTIONS
*/

// function to validate date format (YYYY-MM-DD)
function validDate(date) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
}

// function to validate an email address is in correct format
function validEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

// function to generate 5 random winning numbers
function generateRandomWinningNumbers() {
  const numbersArray = [];

  for (let i = 0; i < 5; i++) {
    const randomNumber = Math.floor(Math.random() * 69) + 1;
    numbersArray.push(randomNumber);
  }

  return numbersArray;
}










/* 
PAYPAL FUNCTIONALITY 
*/

// function to save the user's entered paypal info their payment methods
function savePaypalInfo() {
  const paypalUsername = document.getElementById('paypal-email').value;
  const paypalPassword = document.getElementById('paypal-password').value;
  // check if any of the fields are empty
  if (!paypalUsername || !paypalPassword) {
    alert('Please fill out all PayPal login fields.');
    return;
  }

  const paypalInfo = {
    username: paypalUsername,
    password: paypalPassword
  };
  const savedPaymentInfo = JSON.parse(localStorage.getItem('savedPaymentInfo')) || [];

  // save the paypal info to localStorage
  savedPaymentInfo.push(paypalInfo);

  localStorage.setItem('savedPaymentInfo', JSON.stringify(savedPaymentInfo));

  console.log('PayPal Info Saved:', paypalInfo);

  // save the PayPal login info as default payment method
  localStorage.setItem('defaultPayment', JSON.stringify(paypalInfo));

  // redirect back to the purchase.html after saving
  window.location.href = 'purchase.html';
}

// paypal login form submission
const paypalLogin = document.getElementById('paypal-login-form');
if (paypalLogin) {
  document.getElementById('paypal-login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    savePaypalInfo();
  });
}
