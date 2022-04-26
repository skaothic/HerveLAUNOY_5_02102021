let urlcourante = window.location.href; //Récupération url actuelle en tant que chaine de caratere
let url = new URL(urlcourante); // transformation en objet pour obtenir caracteristique
let kanap_id = url.searchParams.get("id"); // récupération de l'Id contenu dans l'Url

function showToDOM(where, what) { // affichage des éléments du produit
    document.getElementById(where).innerHTML = what
}

function saveCart(arr) { //fonction de sauvegarde du "panier" dans le localstorage
    localStorage.setItem("panier", JSON.stringify(arr))
}

function addAndSave(arr, prod) { //fonction ajout nouveau et sauvegarde du panier
    arr.push(prod) // ajout du produit
    saveCart(arr) //appel de la fonction de sauvegarde du "panier" dans le localstorage
}

function getValue(option) { // fonction de récupération des options/quantité selectionnées
    return document.getElementById(option).value
}
//requete API -> promesse//
let kanap = fetch("../js/product.json");
kanap.then((response) => { //si ok promesse devient reponse//
    let kanapprom = response.json();
    kanapprom.then((kanaptabs) => { // reponse = tableau à boucler pour récupérer les caracteristiques des canapé //
        for (let k = 0; k < kanaptabs.length; k++) {
            if (kanap_id == kanaptabs[k]['_id']) { // On recherche dans l Id(Url)  quel kanap affiché//
                //creation d'objet produit ayant pour parametres les caracteristiques du canapé 
                let produit = new Object()
                produit.id = kanaptabs[k]['_id']
                produit.imageUrl = kanaptabs[k]['imageUrl']
                produit.alttxt = kanaptabs[k]['altTxt']
                produit.name = kanaptabs[k]['name']
                produit.description = kanaptabs[k]['description']
                produit.price = kanaptabs[k]['price']
                produit.colors = kanaptabs[k]['colors']
                    //ajout du code HTML commenté en ajoutant les parametres propre a chaque produit via caractéristiques du produit précedemment créé//
                document.getElementsByTagName('title')[0].innerHTML = produit.name
                showToDOM('title', produit.name)
                showToDOM('price', produit.price)
                showToDOM('description', produit.description)
                document.getElementsByClassName('item__img')[0].innerHTML = '<img src="' + produit.imageUrl + '" alt="' + produit.alttxt + '">'
                produit.colors.forEach(color => {
                    document.getElementById('colors').innerHTML += '<option value="' + color + '">' + color + '</option>';
                });
                const button = document.getElementById('addToCart');
                button.addEventListener('click', function() {
                    const quantity = parseInt(getValue("quantity")); // appel de la fonction de selection pour la quantité (en tant que nombre entier pour verifications)
                    const selectedcolor = getValue('colors') // appel de la fonction de selection pour la couleur 
                    let commandes = JSON.parse(localStorage.getItem("panier")); // récupération du panier si déja présent
                    if (quantity < 0) { // verification que la quantité soit un nombre  positif sinon alerte et reset a 0
                        alert("La quantité doit être supérieur a zéro")
                        document.getElementById("quantity").value = 0
                    } else { //nombre positif => création de l'objet à rajouter au panier(ajout de la quantité et de la couleur par rapport a produit)
                        let article = {
                            kanap_id,
                            name: produit.name,
                            img: produit.imageUrl,
                            quantity,
                            price: produit.price,
                            selectedcolor,
                            alt: produit.alttxt,
                        }
                        if (quantity == 0) { // vérification quantité différente de zéro
                            alert("Veuillez choisir la quantité")
                        } else if (selectedcolor == '') { // Vérification qu'une couleur a été selectioné
                            alert("Veuillez choisir une couleur")
                        } else { //vérifier si le panier contient deja des produits 
                            if (commandes) { //oui on ajoute
                                for (let c = 0; c < commandes.length; c++) { // on boucle le tableau de commande
                                    if ((commandes[c]['name'] == article.name) &&
                                        (commandes[c]['selectedcolor'] == article.selectedcolor)) { //pour chercher si une correspondance nom/couleur existe deja 
                                        return [
                                            (commandes[c]['quantity']) += article.quantity, // si oui on ajoute la quantité desiré a la quantité initial
                                            saveCart(commandes) //appel de la fonction de sauvegarde du "panier" dans le localstorage
                                        ]
                                    }
                                }
                                addAndSave(commandes, article) //appel de la fonction ajout nouveau produit et sauvegarde du panier
                            } else {
                                // non on crée le panier 
                                let commandes = [] // création du panier
                                addAndSave(commandes, article) //appel de la fonction ajout nouveau produit et sauvegarde du panier
                            }
                        }
                    }
                });
            }
        }
    })
}).catch(() => {
    document.getElementById('items').innerHTML = 'Désolé un problème est survenu pendant le chargement de notre catalogue.veuillez réessayer ultérieurement';
    console.log('Problème API');
});