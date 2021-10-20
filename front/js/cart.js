let panier = JSON.parse(localStorage.getItem('panier'))
let getqty = (arr, n) => arr.map(x => x[n]);
const reducer = (a, b) => a + b;
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
let delbtn = document.getElementsByClassName('deleteItem')
let arr_del = Array.from(delbtn)
let inputs = document.getElementsByClassName('itemQuantity')
let arr_inp = Array.from(inputs)
let price = document.getElementsByClassName('price')
let arr_pri = Array.from(price)

function total_q() {
    let inputs = document.getElementsByClassName('itemQuantity')
    let arr_inp = Array.from(inputs)
    let qty = getqty(arr_inp, 'value')
    qty = qty.map(function(index) { return parseInt(index) })
    let total_qty = (qty.reduce(reducer))
    document.getElementById('totalQuantity').innerHTML = total_qty
    let pri = getqty(arr_pri, 'innerHTML')
    pri = pri.map(function(index) { return parseInt(index) })
    let total_price = 0
    for (let q = 0; q < qty.length; q++) { total_price += qty[q] * pri[q] };
    document.getElementById('totalPrice').innerHTML = total_price
    localStorage.setItem("panier", JSON.stringify(panier)) // sauvegarde du "panier" dans le localstorage

}

total_q()
for (let input of inputs) {
    input.addEventListener('change', () => {
        if ((input.value < 0)) {
            alert("Veuillez saisir une quantité supérieur a zéro")
        } else {
            let index = arr_inp.indexOf(input)
            panier[index]['quantity'] = parseInt(input.value)
            total_q()
        }
    })
}
for (let btn of delbtn) {
    btn.addEventListener("click", () => {
        let index = arr_del.indexOf(btn)
        let pdel = document.getElementsByClassName('cart__item')[index]
        pdel.remove()
        panier.splice(index, 1)
        total_q()
    })
}

document.getElementById('order').addEventListener('click', (event) => {
    event.preventDefault()
    let customer = {
        firstName: document.getElementById('firstName').value,
        lastname: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value
    }

    console.log('commande');
    console.table(customer);
})