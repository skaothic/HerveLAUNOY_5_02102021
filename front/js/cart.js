var panier = JSON.parse(localStorage.getItem('panier'))
console.table(panier)
var quantité = parseInt(panier[4])
var kanap = fetch("http://localhost:3000/api/products");
kanap.then((response) => { //si ok promesse devient reponse//
    var kanapprom = response.json();
    kanapprom.then((kanaptabs) => { // reponse = tableau à boucler pour chercher correspondance entre var product_id et _id du tableau //
        for (let k = 0; k < kanaptabs.length; k++) {
            //creation d'objet produit ayant pour parametres les caracteristiques du canapé 
            let produit = new Object()
            produit.id = kanaptabs[k]['_id']
            produit.imageUrl = kanaptabs[k]['imageUrl']
            produit.alttxt = kanaptabs[k]['altTxt']
            produit.name = kanaptabs[k]['name']
            produit.description = kanaptabs[k]['description']
            produit.price = kanaptabs[k]['price']
            produit.colors = kanaptabs[k]['colors']

            if (panier[1] == produit.id) {
                document.getElementById('cart__items').innerHTML += '<article class="cart__item" data-id="{product-ID}">' +
                    '<div class="cart__item__img">' +
                    '<img src="' + produit.imageUrl + '" alt="' + produit.alttxt + ' ">' +
                    '</div>' +
                    '<div class="cart__item__content">' +
                    '<div class="cart__item__content__titlePrice">' +
                    '<h2>' + produit.name + '</h2>' +
                    '<p>' + produit.price + '€</p>' +
                    '</div>' +
                    '<div class="cart__item__content__settings">' +
                    '<div class="cart__item__content__settings__quantity">' +
                    '<p>Qté :</p>' +
                    '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + quantité + '">' +
                    '</div>' +
                    '<div class="cart__item__content__settings__delete">' +
                    '<p class="deleteItem">Supprimer</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</article>'
            }
        }
    });
}).catch((err) => { //si requete impossible affichage message d'erreur en place de la liste de produit et message erreur console//
    document.getElementById('items').innertext = 'Désolé un problème est survenu pendant le chargement de notre catalogue.veuillez réessayer ultérieurement'
    console.log('Problème API');
});