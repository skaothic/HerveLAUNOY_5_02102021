let urlcourante = window.location.href; //Récupération url actuelle
let url = new URL(urlcourante);
let kanap_id = url.searchParams.get("id"); // récupération de l'Id contenu dans l'Url



//requete API -> promesse//
let kanap = fetch("http://localhost:3000/api/products");
kanap.then((response) => { //si ok promesse devient reponse//
    let kanapprom = response.json();
    kanapprom.then((kanaptabs) => { // reponse = tableau à boucler pour récupérer les caracteristiques des canapé //
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

            if (kanap_id == produit.id) { // On recherche dans l Id(Url)  quel kanap affiché//
                //ajout du code HTML commenté en ajoutant les parametres propre a chaque produit via caractéristiques du produit précedemment créé//
                document.getElementById('title').innerHTML = document.getElementsByTagName('title')[0].innerHTML = produit.name
                document.getElementById('price').innerHTML = produit.price
                document.getElementById('description').innerHTML = produit.description
                document.getElementsByClassName('item__img')[0].innerHTML = '<img src="' + produit.imageUrl + '" alt="' + produit.alttxt + '">'
                produit.colors.forEach(color => {
                    document.getElementById('colors').innerHTML += '<option value="' + color + '">' + color + '</option>';
                });
                const button = document.getElementById('addToCart');
                button.addEventListener('click', function() {
                    const quantity = parseInt(document.getElementById("quantity").value); // enregistrement de la quantité en tantnwue nombre entier
                    const selectedcolor = document.getElementById('colors').value; // enregistrement de la couleur sélectionné
                    let commandes = JSON.parse(localStorage.getItem("panier")); // récupération du panier si déja présent

                    if (quantity < 0) { // verification que la quantité soit un nombre positif 
                        alert("Veuillez saisir une quantité supérieur a zéro")
                    } else {
                        //nombre positif => création de l'objet à rajouter au panier
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
                        } else

                        { //vérifier si le panier contient deja des produits 
                            if (commandes) { //oui on ajoute
                                for (let commande = 0; commande < commandes.length; commande++) { // on boucle le tableau de commande
                                    if ((commandes[commande]['name'] == article.name) && (commandes[commande]['selectedcolor'] == article.selectedcolor)) { //pour chercher si une correspondance nom/couleur existe deja 
                                        return [
                                            (commandes[commande]['quantity']) += article.quantity, // si oui on ajoute la quantité desiré a la quantité initial
                                            localStorage.setItem("panier", JSON.stringify(commandes)) // sauvegarde du "panier" dans le localstorage
                                        ]
                                    }
                                }
                                commandes.push(article) // si pas de correspondance ajout du produit a la derniere ligne du tableau de commandes
                                localStorage.setItem("panier", JSON.stringify(commandes)) // sauvegarde du "panier" dans le localstorage
                            } else {
                                // non on crée le panier et on ajoute la séléction
                                commandes = [] // création du panier
                                commandes.push(article) // ajout du produit
                                localStorage.setItem("panier", JSON.stringify(commandes)) // sauvegarde du "panier" dans le localstorage
                            }
                        }
                    }
                });
            }
        }
    })
}).catch((err) => { //si requete impossible affichage message d'erreur en place de la liste de produit et message erreur console//
    document.getElementById('items').innerHTML = 'Désolé un problème est survenu pendant le chargement de notre catalogue.veuillez réessayer ultérieurement'
    console.log('Problème API');
});