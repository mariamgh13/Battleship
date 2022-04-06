# Battleship

-----------------
##### *Projet de groupe de 2.*
##### *Dernière modification : 28 mars 2021*
-----------------

NOTE D'INTENTION
================

Le code est organisé autour de différents composants (objet) les principaux étant le "jeu" (fichier game.js), et les joueurs (fichier player.js et computer.js), chacun des objets est accessible dans le scope global.

au chargement de la page on invoque la méthode init de l'objet game. Ce dernier contient et gère "l'état" du jeu (qui sont les adversaires, à quelle phase de jeu en est-on, à qui est-ce de jouer, etc...) et permet (appelle la fonction), ou ne permet pas (ne fait rien) les actions des différents joueurs.

un joueur est représenté par un objet player (fichier player.js), et contient des méthodes inhérentes à "l'état" du joueur (sa flotte, la position de chaque bateau, les tirs effectués, etc...). L'objet computer (fichier computer.js), est "dérivé" de l'objet player, grace à la librairie "_" (prononcez "lodash"), et sa méthode "assign".

l'objet utils (fichier utils.js), est un objet contenant des méthodes utilitaires et transverses.

l'objet shipFactory (fichier shipFactory.js) est un objet qui simplifie la création des bateaux.


###### *Réalisé par :*

* **Paul Valentin** _alias_ [@pvalentinn](https://github.com/pvalentinn)
* **Mariam Ghukasyan** _alias_ [@mariamgh13](https://github.com/mariamgh13)

###### *Délai : 1 semaine (Mars 2021)*
