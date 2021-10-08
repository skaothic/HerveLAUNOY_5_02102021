//fonction affichage dynamique accueil//

//requete API -> promesse//
const kanap = fetch("http://localhost:3000/api/products");
kanap.then((response) => { //si ok promesse devient reponse//
    var kanapprom = response.json();
    kanapprom.then((kanaptabs) => { // reponse = tableau à boucler par index=k//
        for (let k = 0; k < kanaptabs.length; k++) {
            //creation de variable avec les parametres propre au produit
            let produit = new Object()
            produit.id = kanaptabs[k]['_id']
            produit.imageUrl = kanaptabs[k]['imageUrl']
            produit.alttxt = kanaptabs[k]['altTxt']
            produit.name = kanaptabs[k]['name']
            produit.description = kanaptabs[k]['description']
                //ajout du code HTML commenté en ressortant les variables précedentes
            document.getElementById('items').innerHTML +=
                '<a href="./product.html?id=' + produit.id + '">' +
                '<article>' +
                '<img src="' + produit.imageUrl + '" alt="' + produit.alttxt + '">' +
                '<h3 class="productName">' + produit.name + '</h3>' +
                '<p class="productDescription">' + produit.description + '</p>' +
                '</article>' +
                '</a>'
        }
    })
}).catch((err) => { //si requete impossible affichage message d'erreur en place de la liste de produit et message erreur console//
    document.getElementById('items').innertext = 'Désolé un problème est survenu pendant le chargement de notre catalogue.veuillez réessayer ultérieurement'
    console.log('Problème API');
});