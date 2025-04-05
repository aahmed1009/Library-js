function Author(name, email) {
  this.name = name;
  this.email = email;
}

function Book(name, price, author) {
  this.name = name;
  this.price = price;
  this.author = author;
}

let books = [];

const startButton = document.getElementById("startButton");
const bookForm = document.getElementById("bookForm");
const submitBooks = document.getElementById("submitBooks");
const tableBody = document.getElementById("tableBody");

startButton.onclick = function () {
  const count = parseInt(document.getElementById("bookTotal").value);
  if (!count || count < 1) {
    showInlineError("step1", "Please enter a number greater than 0.");
    return;
  }

  clearInlineError("step1");
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";

  bookForm.innerHTML = "";
  for (let i = 0; i < count; i++) {
    bookForm.innerHTML += `
                <div class="book-input">
                    <h3>Book ${i + 1}</h3>
                    <input type="text" placeholder="Book Name" class="name">
                    <input type="text" placeholder="Price" class="price">
                    <input type="text" placeholder="Author Name" class="author">
                    <input type="email" placeholder="Author Email" class="email">
                    <p class="error" style="color:red"></p>
                    <hr>
                </div>
            `;
  }
};

submitBooks.onclick = function () {
  const entries = document.querySelectorAll(".book-input");
  books = [];
  let allValid = true;

  entries.forEach((entry) => {
    const name = entry.querySelector(".name").value.trim();
    const price = entry.querySelector(".price").value.trim();
    const authorName = entry.querySelector(".author").value.trim();
    const email = entry.querySelector(".email").value.trim();
    const errorBox = entry.querySelector(".error");

    errorBox.innerText = "";

    if (!name || !price || !authorName || !email) {
      errorBox.innerText = "All fields must be filled.";
      allValid = false;
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      errorBox.innerText = "Price must be a valid number greater than 0.";
      allValid = false;
      return;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;
    if (!emailPattern.test(email)) {
      errorBox.innerText = "Email is not valid.";
      allValid = false;
      return;
    }

    const author = new Author(authorName, email);
    const book = new Book(name, price, author);
    books.push(book);
  });

  if (allValid) {
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "block";
    showTable();
  }
};

function showTable() {
  tableBody.innerHTML = "";
  books.forEach((book, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                <td>${book.name}</td>
                <td>${book.price}</td>
                <td>${book.author.name}</td>
                <td>${book.author.email}</td>
                <td class="actions">
                    <button class="edit" onclick="editRow(${i})">Edit</button>
                    <button class="delete" onclick="deleteRow(${i})">Delete</button>
                </td>
            `;
    tableBody.appendChild(row);
  });
}

function editRow(index) {
  const book = books[index];
  const row = tableBody.children[index];
  row.innerHTML = `
            <td><input value="${book.name}"></td>
            <td><input value="${book.price}"></td>
            <td><input value="${book.author.name}"></td>
            <td><input value="${book.author.email}"></td>
            <td class="actions">
                <button class="save" onclick="saveRow(${index})">Save</button>
                <button class="cancel" onclick="showTable()">Cancel</button>
                <p class="error" style="color:red"></p>
            </td>
        `;
}

function saveRow(index) {
  const row = tableBody.children[index];
  const inputs = row.querySelectorAll("input");
  const errorBox = row.querySelector(".error");

  const name = inputs[0].value.trim();
  const price = inputs[1].value.trim();
  const authorName = inputs[2].value.trim();
  const email = inputs[3].value.trim();

  errorBox.innerText = "";

  if (!name || !price || !authorName || !email) {
    errorBox.innerText = "All fields must be filled.";
    return;
  }

  if (isNaN(price) || Number(price) <= 0) {
    errorBox.innerText = "Price must be a valid number greater than 0.";
    return;
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;
  if (!emailPattern.test(email)) {
    errorBox.innerText = "Email is not valid.";
    return;
  }

  books[index].name = name;
  books[index].price = price;
  books[index].author.name = authorName;
  books[index].author.email = email;

  showTable();
}

function deleteRow(index) {
  books.splice(index, 1);
  showTable();
}

function showInlineError(id, msg) {
  let el = document.getElementById(id);
  if (!el.querySelector(".error")) {
    let p = document.createElement("p");
    p.className = "error";
    p.style.color = "red";
    el.appendChild(p);
  }
  el.querySelector(".error").innerText = msg;
}

function clearInlineError(id) {
  let el = document.getElementById(id);
  let err = el.querySelector(".error");
  if (err) err.innerText = "";
}
