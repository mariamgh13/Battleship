/*jslint browser this */
/*global _ */

(function (global) {
    "use strict";

    global.utils = {
        CELL_SIZE: 60,
        // retourne la position (démarre à 1) du noeud passé en paramètre dans son parent
        eq: function (node) {
            var p = node.parentNode;
            var i = 0;
            var nbChildren = p.children.length;
            var c = p.children[i];

            while (c !== node && i < nbChildren) {
                i += 1;
                c = p.children[i];
            }
            if (c === node) {
                return i;
            } else {
                return null;
            }
        },
        // créer un tableau à deux dimension, chaque élément du tableau est définie à la valeur (optionelle) "value" (vaut 0 par défaut)
        createGrid: function (lines, columns, value) {
            var val = value !== undefined
                ? value
                : 0;
            var i = 0;
            var j;
            var grid = [];
            while (i < lines) {
                grid[i] = [];
                j = 0;
                while (j < columns) {
                    grid[i][j] = val;
                    j += 1;
                }
                i += 1;
            }
            return grid;
        },
        // permet de faire afficher un message dans une "boite" spécifique (le noeud qui a la classe game-info)
        info: function (msg) {
            var infoBox = document.querySelector('.game-info');

            infoBox.innerHTML = msg;
        },
        // permet de demander une confirmation à l'utilisateur
        // les 2 derniers paramètres sont des callback a exécuter en cas de confirmation pour le deuxième, ou d'infirmation pour le dernier
        confirm: function (message, confirm, cancel) {
            var clickCallback;
            var confirmBox = document.querySelector('#confirm');
            var btnContainer = confirmBox.querySelector('.btn-container');
            var msgContainer = confirmBox.querySelector('.message-container');
            clickCallback = function (e) {
                if (e.target.classList.contains('btn')) {
                    this.removeEventListener('click', clickCallback);
                    confirmBox.style.display = "none";
                    if (e.target.classList.contains('confirm-ok')) {
                        if (confirm) {
                            confirm.call();
                        }
                    } else {
                        if (cancel) {
                            cancel.call();
                        }
                    }
                }
            };

            btnContainer.addEventListener('click', clickCallback);

            confirmBox.style.display = 'block';

            msgContainer.innerHTML = message;
        }
    };

}(this));
