//affichage dynamique accueil

const kanap = fetch("../js/product.json"); //requete API -> promesse[===>ligne 2]

kanap.then((response) => {
    let kanapprom = response.json();
    kanapprom.then((kanaptabs) => { // reponse = tableau à boucler par index=k[===>ligne 3]
        for (let k = 0; k < kanaptabs.length; k++) {
            let produit = new Object() //creation de variable avec les parametres propre au produit[===>ligne 4]
            produit.id = kanaptabs[k]['_id']
            produit.imageUrl = kanaptabs[k]['imageUrl']
            produit.alttxt = kanaptabs[k]['altTxt']
            produit.name = kanaptabs[k]['name']
            produit.description = kanaptabs[k]['description']
            document.getElementById('items').innerHTML += //ajout du code HTML commenté en ressortant les parametres des produits précedemment créés[===>ligne 5]
                '<a href="./product.html?id=' + produit.id + '">' +
                '<article>' +
                '<img src="' + produit.imageUrl + '" alt="' + produit.alttxt + '">' +
                '<h3 class="productName">' + produit.name + '</h3>' +
                '<p class="productDescription">' + produit.description + '</p>' +
                '</article>' +
                '</a>'
        }
    })
}).catch((err) => { //si requete impossible affichage message d'erreur en place de la liste de produit et message erreur console[===>ligne 2]
    document.getElementById('items').innerHTML = "Désolé un problème est survenu pendant le chargement de notre catalogue. Veuillez réessayer ultérieurement :'-("
    console.log('Problème API');
});