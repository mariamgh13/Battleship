/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";



    // etape 1 changement de sheep en ship pour le bon fonctionnement :D 
    var ship = { dom: { parentNode: { removeChild: function () { } } } };

    var player = {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        activeShip: 0,
        dead: false,
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        play: function (col, line) {
            // console.log(col, line);
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            this.game.fire(this, col, line, _.bind(function (hasSucced) {
                this.tries[line][col] = hasSucced;

                let cell = this.game.grid.children[line].children[col];
                if (this.tries[line][col]) cell.style.backgroundColor = 'indianRed';
                else cell.style.backgroundColor = 'lightgrey';
            }, this));
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            //Etape 7, modification de la fonction, qui gere maitenant aussi les messages a affiché
            //elle renvoie un object, et garde en mémoire sur la grid, si on a touché ou pas.

            //Etape 14 Animation explosion rajouté 
            let removeNode = (node) => node.remove();

            let animate = (cell, bool) => {
                let div = document.createElement('div');
                div.style.backgroundImage = bool ? 'url("img/explo.png")' : 'url("img/plouf.png")';
                div.style.width = bool ? '43px' : '43px';
                div.style.height = bool ? '55px' : '55px';
                div.style.margin = '0 auto';

                cell.appendChild(div);
                let pos = bool ? 42.86 : 42.86;
                let max = bool ? 300 : 300;

                let id = setInterval(() => {
                    if (pos >= max) {
                        clearInterval(id);
                        removeNode(div);
                    } else {
                        div.style.backgroundPositionX = -pos + 'px'; 
                        pos += bool ? 42.86 : 42.86; 
                    }
                }, 150);
            }

            var succeed = false;
            let msg = 'Manqué...';
            let bateau;

            if (this.grid[line][col] === true) {
                msg = 'Déja touché !';
                succeed = true;
            } else if (this.grid[line][col] === false) {
                msg = "T'as déjà manqué ici ....";
                succeed = false;
            } else if (this.grid[line][col] !== 0) {
                succeed = true;
                msg = 'Touché !';

                //Etape9 Récupérer le bateau en question quand il est touché et lui enlevé un point de vie
                // console.log(this);
                bateau = this.fleet.find((e) => e.getId() == this.grid[line][col]);
                let name = bateau.getName();
                let img = document.querySelector('.' + name.toLowerCase()); // a voir ici avec Paul
                // console.log(img);
                if (bateau) {
                    let life = bateau.getLife() - 1;
                    // console.log(bateau);
                    bateau.setLife(life);
                    // console.log(this);
                    if (life == 0 && this.game.players[0] == this) {
                        img.classList.add('sunk');
                        var audio = new Audio('sound/kill.mp3');
                        audio.play();
                        audio.volume = 0.1;
                    }
                    else if (life == 0 && this.game.players[1] == this){
                        var audio = new Audio('sound/kill.mp3');
                        audio.play();
                        audio.volume = 0.1;
                    }
                    this.verifyDeath();
                }
                // this.grid[line][col] = 0;
            }

            //AUDIO AND IMAGE SECTION
            if (succeed == false && this.game.players[0] == this) {
                var audio = new Audio('sound/ratéordi.mp3');
                audio.play();
                audio.volume = 0.1;
            } else if (succeed == false && this.game.players[1] == this) {
                var audio = new Audio('sound/raté.mp3');
                audio.play();
                audio.volume = 0.1;

                let cell = this.game.grid.children[line].children[col];
                animate(cell, false);
            } else if (succeed == true && this.game.players[0] == this) {
                var audio = new Audio('sound/touchéordi.mp3');
                audio.play();
                audio.volume = 0.1;
            } else if (succeed == true && this.game.players[1] == this) {
                var audio = new Audio('sound/touché.mp3');
                audio.play();audio.volume = 0.1;

                let cell = this.game.grid.children[line].children[col];
                animate(cell, true);
            }

            this.grid[line][col] = succeed;
            callback.call(undefined, { sucess: succeed, msg: msg, bateau: bateau });
        },


        setActiveShipPosition: function (x, y) {
            var ship = this.fleet[this.activeShip];
            var i = 0;
            // etape 3 et 4 conditions pour ne pas mettre les batteaux les uns sur les autres, n'y sortir de la grille . Pour vertical et horizontale 
            var vertical = player.fleet[player.activeShip].vertical;

            if (!vertical) {
                x = x - Math.floor(ship.getLife() / 2);
                for (var i = 0; i < ship.getLife(); i++) {
                    if (this.grid[y][x + i] !== 0)
                        return false;
                }
                for (var i = 0; i < ship.getLife(); i++) {
                    this.grid[y][x + i] = ship.getId();
                }
                return true;

            } else {

                y = y - Math.floor(ship.getLife() / 2);

                for (var i = 0; i < ship.getLife(); i++) {
                    if (y < 0)
                        return false;
                    if (this.grid[y + i][x] !== 0)
                        return false;
                }

                for (var i = 0; i < ship.getLife(); i++)
                    this.grid[y + i][x] = ship.getId();
            }
            return true;




            // if (ship.getLife() == 3) x++;


            // while (i < ship.getLife()) {
            //     if (this.grid[y][x + i] > 0) {
            //         console.log(this.grid);
            //         return false;
            //     }
            //     i += 1;
            // }
            // if(this.grid[y][x] !== 0 || x < 2 || x + ship.getLife() > 12){
            //     return false;
            // }
            // i = 0;
            // while (i < ship.getLife()) {
            //     this.grid[y][x + i] = ship.getId();
            //     i += 1;
            // }

            // return true;
        },


        clearPreview: function () {
            this.fleet.forEach(function (ship) {
                // etape 1 changement de sheep en ship pour le bon fonctionnement :D 
                if (ship.dom.parentNode) {
                    ship.dom.parentNode.removeChild(ship.dom);
                }
            });
        },
        resetShipPlacement: function () {
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function (grid) {
            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');

                    if (val === true) {
                        node.style.backgroundColor = '#e60019';
                    } else if (val === false) {
                        node.style.backgroundColor = '#aeaeae';
                    }
                });
            });
        },
        renderShips: function (grid) {
        },
        // étape 0 , pour corriger l'erreur de l'a console 
        setGame: function (game) {
            this.game = game;
        },
        // étape 0
        isShipOk: function (callback) {
        },
        getDead: function() {
            return this.dead;
        },
        verifyDeath: function () {
            let bool = true;
            this.fleet.forEach(e => {
                // console.log(e.life)
                if(e.life !== 0) bool = false;
            }) 
            // console.log(bool);
            this.dead = bool;
        }

    };

    global.player = player;

}(this));