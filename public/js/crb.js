let formControl = document.querySelectorAll(".checkbox");
let formControlD = document.querySelectorAll(".checkbox-d");
let formControlE = document.querySelectorAll(".checkbox-e");
let formControlO = document.querySelectorAll(".checkbox-o");
console.log(formControl.length);

// Get Quantity Elements Across Tables
let key = document.querySelectorAll(".qt");
let keyD = document.querySelectorAll(".qt-d");
let keyE = document.querySelectorAll(".qt-e");
let keyO = document.querySelectorAll(".qt-o");

// Get Amount Elements Across Tables
let amount = document.querySelectorAll(".amount");
let amountD = document.querySelectorAll(".amount-d");
let amountE = document.querySelectorAll(".amount-e");
let amountO = document.querySelectorAll(".amount-o");

// Get Total Elements Across Tables
let totalText = document.getElementById("total-text");
let totalTextD = document.getElementById("total-text-d");
let totalTextE = document.getElementById("total-text-e");
let totalTextO = document.getElementById("total-text-o");

// Event Loops

for (let i = 0; i < key.length; i++) {
  key[i].addEventListener("keyup", function () {
    setTimeout(getAmountBoxes, 1000);
    setTimeout(function () {
      if (key[i].value == "" || key[i].value == "0") {
        formControl[i].removeAttribute("checked");
      }
    }, 1000);
  });
}

for (let i = 0; i < keyD.length; i++) {
  keyD[i].addEventListener("keyup", function () {
    setTimeout(getAmountBoxesD, 1000);
    setTimeout(function () {
      if (keyD[i].value == "" || keyD[i].value == "0") {
        formControlD[i].removeAttribute("checked");
      }
    }, 1000);
  });
}

for (let i = 0; i < keyE.length; i++) {
  keyE[i].addEventListener("keyup", function () {
    setTimeout(getAmountBoxesE, 1000);
    setTimeout(function () {
      if (keyE[i].value == "" || keyE[i].value == "0") {
        formControlE[i].removeAttribute("checked");
      }
    }, 1000);
  });
}

for (let i = 0; i < keyO.length; i++) {
  keyO[i].addEventListener("keyup", function () {
    setTimeout(getAmountBoxesO, 1000);
    setTimeout(function () {
      if (keyO[i].value == "" || keyO[i].value == "0") {
        formControlO[i].removeAttribute("checked");
      }
    }, 1000);
  });
}

let price = document.querySelectorAll(".price");

function getAmountBoxes() {
  let arr = [];
  for (let i = 0; i < amount.length; i++) {
    if (!amount[i].value == "") {
      let a = parseInt(amount[i].value);
      arr.push(a);
    }
  }
  let sum = arr.reduce(function (a, b) {
    return a + b;
  }, 0);
  totalText.innerText = sum;
}

function getAmountBoxesD() {
  let arr = [];
  for (let i = 0; i < amountD.length; i++) {
    if (!amountD[i].value == "") {
      let a = parseInt(amountD[i].value);
      arr.push(a);
    }
  }
  let sum = arr.reduce(function (a, b) {
    return a + b;
  }, 0);
  totalTextD.innerText = sum;
}

function getAmountBoxesE() {
  let arr = [];
  for (let i = 0; i < amountE.length; i++) {
    if (!amountE[i].value == "") {
      let a = parseInt(amountE[i].value);
      arr.push(a);
    }
  }
  let sum = arr.reduce(function (a, b) {
    return a + b;
  }, 0);
  totalTextE.innerText = sum;
}

function getAmountBoxesO() {
  let arr = [];
  for (let i = 0; i < amountO.length; i++) {
    if (!amountO[i].value == "") {
      let a = parseInt(amountO[i].value);
      arr.push(a);
    }
  }
  let sum = arr.reduce(function (a, b) {
    return a + b;
  }, 0);
  totalTextO.innerText = sum;
}
