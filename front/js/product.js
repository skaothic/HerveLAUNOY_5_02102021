//Récupération url actuelle//
var urlcourante = document.location.href;
// On garde dans la variable product_id uniquement la portion derrière le dernier = de urlcourante correspondant à l ID du poduit selectionné//
var kanap_id = urlcourante.substring(urlcourante.lastIndexOf("=") + 1);
//requete API -> promesse//
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

            if (kanap_id == produit.id) {
                console.log(produit.name);
                //ajout du code HTML commenté en ajoutant les parametres propre a chaque produit via index k//
                document.getElementById('title').innerText = document.getElementsByTagName('title')[0].innerText = produit.name
                document.getElementById('price').innerText = produit.price
                document.getElementById('description').innerText = produit.description
                document.getElementsByClassName('item__img')[0].innerHTML = '<img src="' + produit.imageUrl + '" alt="' + produit.alttxt + '">'
                produit.colors.forEach(color => {
                    document.getElementById('colors').innerHTML += '<option value="' + color + '">' + color + '</option>';

                });;
            }
        }

    })
}).catch((err) => { //si requete impossible affichage message d'erreur en place de la liste de produit et message erreur console//
    document.getElementById('items').innerHTML = 'Désolé un problème est survenu pendant le chargement de notre catalogue.veuillez réessayer ultérieurement'
    console.log('Problème API');
});



//fonction document.getelementbyid ()
//dans then appel fonction avec id a modif en parametre