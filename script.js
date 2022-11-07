'use strict'

// get element area

let FormInputContainerEl = document.getElementById('FormInputContainer');
let transactionNameInputEl = document.getElementById('transactionNameInput');
let transactionAmountInputEl = document.getElementById('transactionAmountInput');
let addedElementContainerEl = document.getElementById('addedElementContainer');
let AvailableBalenceEl = document.getElementById('AvailableBalence')
let TotalIncomeEl = document.getElementById('TotalIncome')
let TotalExpenceEl = document.getElementById('TotalExpence')

// global variables

let StoredArr = JSON.parse(localStorage.getItem('StoredArrOfObjects'));

if (!StoredArr) {
    StoredArr = [];
}else {
    displayData(StoredArr);
}

let TotalIncome = localStorage.getItem('TotalIncome');
if (!TotalIncome) {
    TotalIncome = '';
}else {
    TotalIncomeEl.innerText = TotalIncome;
}

let TotalExpence = localStorage.getItem('TotalExpence')
if (!TotalExpence) {
    TotalExpence = '';
}else {
    TotalExpenceEl.innerText = TotalExpence;
}


// function area

function displayData(StoredArr) {
    addedElementContainerEl.innerHTML = null;
    StoredArr.forEach(a => {
        let newLi = document.createElement('li');
        addedElementContainerEl.appendChild(newLi);
        newLi.classList.add('addedElement')
        newLi.setAttribute('id',a.id)
        newLi.innerHTML = `<div class="addedElementName">${a.transactionName}</div>
        <div class="addedElementAmount" id="addedElementAmount">₹ ${a.transactionAmount}</div>
        <div onclick="deleteItem(${a.id})"><i class="fa-solid fa-trash"></i></div>`
    })
    let availableBalence = StoredArr.reduce((a, b) => {
        return a + b.transactionAmount;
    }, 0)
    AvailableBalenceEl.innerText = `₹ ${availableBalence}`
}

function addToLocalStorage(StoredArr) {
    localStorage.setItem('StoredArrOfObjects', JSON.stringify(StoredArr))
}

function deleteItem(id) {
    let sign = '';
    let amount = 0;
    StoredArr.forEach((a) => {
        if (a.id === id) {
            sign = a.sign
            amount = a.transactionAmount
        }
    })

    if (sign === 'income') {
        TotalIncome = localStorage.getItem('TotalIncome')
        TotalIncome = TotalIncome - amount;
        TotalIncomeEl.innerText = TotalIncome
        if (TotalIncome === 0) {
            localStorage.removeItem('TotalIncome')
        } else {
            localStorage.setItem('TotalIncome',TotalIncome)
        }

    } else {
        TotalExpence = localStorage.getItem('TotalExpence')
        TotalExpence = TotalExpence - amount;
        TotalExpenceEl.innerText = TotalExpence
        if (TotalExpence === 0) {
            localStorage.removeItem('TotalExpence')
        } else {;
            localStorage.setItem('TotalExpence', TotalExpence)
        }
    }

    console.log(sign)
    console.log(amount);
    StoredArr = StoredArr.filter(a => a.id != id);
    if (StoredArr.length === 0) {
        displayData(StoredArr);
        localStorage.removeItem('StoredArrOfObjects');
    } else {
        addToLocalStorage(StoredArr);
        displayData(StoredArr);
    }
}

// Event listender area

FormInputContainerEl.addEventListener('submit', function(e){
    e.preventDefault();
    
    let transactionNameInputValue = transactionNameInputEl.value;
    let transactionAmountInputValue = Number(transactionAmountInputEl.value);

    if (!transactionAmountInputValue || !transactionNameInputValue) {
        alert('Enter Both Transaction name and Amount details to add')
    } else {

        // creating object
        let newObject = { 'transactionName': transactionNameInputValue, 'transactionAmount': transactionAmountInputValue, 'id': new Date().valueOf() }

        // delete input area
        transactionNameInputEl.value = null;
        transactionAmountInputEl.value = null;

        // checking income or expence
        let regex = /^\d/
        let a = transactionAmountInputValue;
        let result = regex.test(a);
        if (result) {
            newObject.sign = 'income'
            TotalIncome = TotalIncome.split('');
            TotalIncome.push(`+${transactionAmountInputValue}`)
            TotalIncome = TotalIncome.join('')
            TotalIncome = String(eval(TotalIncome));
            localStorage.setItem('TotalIncome', TotalIncome)
            TotalIncomeEl.innerText = TotalIncome;
        } else {
            newObject.sign = 'expence'
            TotalExpence = TotalExpence.split('');
            TotalExpence.push(transactionAmountInputValue)
            TotalExpence = TotalExpence.join('');
            TotalExpence = String(eval(TotalExpence));
            localStorage.setItem('TotalExpence', TotalExpence);
            TotalExpenceEl.innerText = TotalExpence;
        }

        // store in local and display the li element
    
        StoredArr.push(newObject)
        displayData(StoredArr)
        addToLocalStorage(StoredArr)
    }    
})