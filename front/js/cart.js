let pageActive = window.location.href // enregistrement URL active [===>ligne 20]

function showToDOM(where, what) { // affichage des éléments sur la page
    document.getElementById(where).innerHTML = what
}

function getArrayFromDOM(id) { // recupération des collections HTML et changement en tableau JavaScript [===>ligne 24]
    let HTMLcoll = document.getElementsByClassName(id)
    let arr = Array.from(HTMLcoll)
    return arr
}
const getQuantity = (arr, n) => arr.map(x => x[n]); // récuparation d'un champs spécifique d un tableau      [===>ligne 25]
const reducer = (a, b) => a + b; //fonction d'addition des valeurs d'une colonne d un tableau

function getValue(option) { // fonction de récupération des champs utilisateurs
    return document.getElementById(option).value
}


if ((/cart.html/).test(pageActive)) { // verif si URL active correspond au panier
    let panier = JSON.parse(localStorage.getItem('panier')) // récupération du panier en tant que tableau    [===>ligne 21]
    for (let p = 0; p < panier.length; p++) { // boucle sur le tableau précedent pour affiché autant d article que de ligne du tableau  [===>ligne 22]
        document.getElementById('cart__items').innerHTML += '<article class="cart__item" data-id="{' + panier[p]['kanap_id'] + ' }">' + // [===>ligne 23]
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

    let ArrayDelete = getArrayFromDOM('deleteItem'); // creation d un tableau des boutons supprimer
    let ArrayInput = getArrayFromDOM('itemQuantity'); // creation d un tableau des inputs quantité
    let ArrayPrice = getArrayFromDOM('price'); // creation d un tableau des prix


    function getTotal() { // fonction pour récuperer les quantités et les prix pour additionner et afficher le total [===>ligne 26]
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
    for (let input of ArrayInput) { // ecoute des modif d input quantité + verif si saisie manuelle + MAJ panier et MAJ affichage totaux  [===>ligne 27]
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
    for (let btn of ArrayDelete) { // ecoute des clicks sur "supprimer" +suppression de la ligne cliquée+MAJ panier et MAJ affichage totaux  [===>ligne 28]
        btn.addEventListener("click", () => {
            let index = ArrayDelete.indexOf(btn)
            let productToDel = document.getElementsByClassName('cart__item')[index]
            productToDel.remove()
            panier.splice(index, 1)
            getTotal()
        })
    }

    function inputCheck(input, id, text) { //fonction de verification des saisie textuelle(Nom Prénom et Ville) avec message d'erreur (showToDOM)  [===>ligne 29]
        const checkingName = /[^a-zA-Z é è]/g
        let response = getValue(input)
        if (checkingName.test(response)) {
            showToDOM(id, "Veuillez vérifier la saisie de votre " + text + "!")
            return false
        }
        showToDOM(id, " ")
        return true
    }

    function inputMailCheck() { // fonction de verification de la saisie adresse mail avec message d'erreur (showToDOM)  [===>ligne 30]
        const checkingMail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        let email = getValue('email')
        if (checkingMail.test(email)) {

            showToDOM('emailErrorMsg', " ")
            return true
        }
        showToDOM('emailErrorMsg', "Veuillez vérifier la saisie de votre adresse Email")
        return false
    }

    let orderButton = document.getElementById('order') // selection du bouton commande

    function confirmPage() { //fonction de redirection vers la page confirmation et reset du panier car commande validée  [===>ligne 31]
        document.location.replace(href = "./confirmation.html")
        localStorage.removeItem('panier')
    }

    orderButton.addEventListener('click', (event) => { //ecoute du click sur bouton commande + verif (inputCheck et inputMailCheck) + creation objet contact et tableau (id de produit) commandé  [===>ligne 32]
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
            fetch("http://localhost:3000/api/products/order", { //envoi de l oobjet contact et tableau id produit
                    method: "POST",
                    body: JSON.stringify(orderSummary),
                    headers: {
                        'Accept': 'application/json',
                        "content-Type": "application/json",
                    }
                })
                .then(response => response.json(order))
                .then(json => localStorage.setItem("orderId", json['orderId'])) //recupération et sauvegarde local de l'orderId
                .catch(() => {})
            confirmPage()

        }

    })
} else {
    let orderId = localStorage.getItem('orderId') // recuperation de l orderId précedemment créé  [===>ligne 32]
    showToDOM('orderId', orderId) // affichage de l orederId
    setTimeout(() => { //suppresion de l orderId dans le localStorage  [===>ligne 33]
        localStorage.removeItem('orderId')
    }, 10000);



}