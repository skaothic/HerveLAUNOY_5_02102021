let pageActive = window.location.href

function showToDOM(where, what) { // affichage des éléments sur la page
    document.getElementById(where).innerHTML = what
}

function getArrayFromDOM(id) {
    let HTMLcoll = document.getElementsByClassName(id)
    let arr = Array.from(HTMLcoll)
    return arr
}
const getQuantity = (arr, n) => arr.map(x => x[n]);
const reducer = (a, b) => a + b;

function getValue(option) { // fonction de récupération des champs utilisateurs
    return document.getElementById(option).value
}


if ((/cart.html/).test(pageActive)) {
    let panier = JSON.parse(localStorage.getItem('panier'))
    for (let p = 0; p < panier.length; p++) {
        document.getElementById('cart__items').innerHTML += '<article class="cart__item" data-id="{' + panier[p]['kanap_id'] + ' }">' +
            '<div class="cart__item__img">' +
            '<img src="' + panier[p]['img'] + '" alt="' + panier[p]['alt'] + ' ">' +
            '</div>' +
            '<div class="cart__item__content">' +
            '<div class="cart__item__content__titlePrice">' +
            '<h2>' + panier[p]['name'] + ' <br> couleur choisie : ' + panier[p]['selectedcolor'] + '</h2>' +
            '<p class="product_price"><span class="price">' + panier[p]['price'] + '</span>€</p>' +
            '</div>' +
            '<div class="cart__item__content__settings">' +
            '<div class="cart__item__content__settings__quantity">' +
            '<p>Qté :</p>' +
            '<input type="number" class="itemQuantity"  name="itemQuantity"  min="1" max="100" value="' + panier[p]['quantity'] + '">' +
            '</div>' +
            '<div class="cart__item__content__settings__delete">' +
            '<p class="deleteItem">Supprimer</p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</article>'
    };

    function saveCart(arr) { //fonction de sauvegarde du "panier" dans le localstorage
        localStorage.setItem("panier", JSON.stringify(arr))
    }

    let ArrayDelete = getArrayFromDOM('deleteItem');
    let ArrayInput = getArrayFromDOM('itemQuantity');
    let ArrayPrice = getArrayFromDOM('price');


    function getTotal() {
        ArrayInput = getArrayFromDOM('itemQuantity')
        let quantity = getQuantity(ArrayInput, 'value')
        quantity = quantity.map(function(index) { return parseInt(index) })
        let quantityTotal = (quantity.reduce(reducer))
        showToDOM('totalQuantity', quantityTotal)
        let price = getQuantity(ArrayPrice, 'innerHTML')
        price = price.map(function(index) { return parseInt(index) })
        let priceTotal = 0
        for (let q = 0; q < quantity.length; q++) {
            priceTotal += quantity[q] * price[q]
        }
        showToDOM('totalPrice', priceTotal)
        saveCart(panier)
    }

    getTotal()
    for (let input of ArrayInput) {
        input.addEventListener('change', () => {
            let index = ArrayInput.indexOf(input)
            if (input.value < 0) {
                alert("La quantité doit être supérieur a zéro")
                input.value = panier[index]['quantity']
            } else {
                panier[index]['quantity'] = parseInt(input.value)
                getTotal()
            }
        })
    }
    for (let btn of ArrayDelete) {
        btn.addEventListener("click", () => {
            let index = ArrayDelete.indexOf(btn)
            let productToDel = document.getElementsByClassName('cart__item')[index]
            productToDel.remove()
            panier.splice(index, 1)
            getTotal()
        })
    }

    function inputCheck(input, id, text) {
        const checkingName = /[^a-zA-Z é è]/g
        let response = getValue(input)
        if (checkingName.test(response)) {
            showToDOM(id, "Veuillez vérifier la saisie de votre " + text + "!")
            return false
        }
        showToDOM(id, " ")
        return true
    }

    function inputMailCheck() {
        const checkingMail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        let email = getValue('email')
        if (checkingMail.test(email)) {
            showToDOM('emailErrorMsg', " ")
            return true
        }
        showToDOM('emailErrorMsg', "Veuillez vérifier la saisie de votre adresse Email")
    }

    let orderButton = document.getElementById('order')

    function confirmPage() {
        document.location.replace(href = "./confirmation.html")
        localStorage.removeItem('panier')
    }

    orderButton.addEventListener('click', (event) => {
        event.preventDefault()
        if (inputCheck('firstName', 'firstNameErrorMsg', 'prénom') && inputCheck('lastName', 'lastNameErrorMsg', 'nom') && inputCheck('city', 'cityErrorMsg', 'ville') && inputMailCheck()) {
            let contact = {
                firstName: (getValue('firstName')),
                lastName: (getValue('lastName')),
                address: (getValue('address')),
                city: (getValue('city')),
                email: (getValue('email'))
            }
            let products = Array.from(panier.map(x => x['kanap_id']))
            let orderSummary = { contact, products }
            fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    body: JSON.stringify(orderSummary),
                    headers: {
                        'Accept': 'application/json',
                        "content-Type": "application/json",
                    }
                })
                .then(response => response.json(order))
                .then(json => localStorage.setItem("orderId", json['orderId']))
                .catch(() => {})
            confirmPage()

        }

    })
} else {
    let orderId = localStorage.getItem('orderId')
    document.getElementById('orderId').innerHTML = orderId
    setTimeout(() => {
        localStorage.removeItem('orderId')
    }, 10000);



}