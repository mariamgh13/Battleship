/*jslint browser this */
/*global _, player, computer, utils */

(function () {
    "use strict";

    var game = {
        PHASE_INIT_PLAYER: "PHASE_INIT_PLAYER",
        PHASE_INIT_OPPONENT: "PHASE_INIT_OPPONENT",
        PHASE_PLAY_PLAYER: "PHASE_PLAY_PLAYER",
        PHASE_PLAY_OPPONENT: "PHASE_PLAY_OPPONENT",
        PHASE_GAME_OVER: "PHASE_GAME_OVER",
        PHASE_WAITING: "waiting",

        currentPhase: "",
        phaseOrder: [],
        // garde une référence vers l'indice du tableau phaseOrder qui correspond à la phase de jeu pour le joueur humain
        playerTurnPhaseIndex: 2,

        // l'interface utilisateur doit-elle être bloquée ?
        waiting: false,

        // garde une référence vers les noeuds correspondant du dom
        grid: null,
        miniGrid: null,

        // liste des joueurs
        players: [],

        // lancement du jeu
        init: function () {

            // initialisation
            // etape 2 retrait .braid pour l'affichage correcte dans le mini map
            this.grid = document.querySelector('.main-grid');
            this.miniGrid = document.querySelector('.mini-grid');


            // etape 12 lié a html
            this.chose = document.querySelector('.chose');
            this.difficulty = document.querySelector('.difficulty');

            // etape 12 , choix pour commencement entre nous et ordi, 

            this.phaseOrder = [];
            self = this;
            this.chose.addEventListener('click', function (e) {
                e = e || window.event;
                e = e.target;
                if (e.nodeName === 'SPAN') {
                    switch (e.id) {
                        case 'first-me':
                            self.phaseOrder = [
                                self.PHASE_INIT_PLAYER,
                                self.PHASE_INIT_OPPONENT,
                                self.PHASE_PLAY_PLAYER,
                                self.PHASE_PLAY_OPPONENT,
                                self.PHASE_GAME_OVER
                            ];
                            break;
                        case 'first-computer':
                            self.phaseOrder = [
                                self.PHASE_INIT_OPPONENT,
                                self.PHASE_INIT_PLAYER,
                                self.PHASE_PLAY_OPPONENT,
                                self.PHASE_PLAY_PLAYER,
                                self.PHASE_GAME_OVER,
                            ];
                            break;

                        case 'first-aleatoire':
                            let x = Math.floor(Math.random() * 2);
                            // console.log(x);
                            if (x) {
                                self.phaseOrder = [
                                    self.PHASE_INIT_OPPONENT,
                                    self.PHASE_INIT_PLAYER,
                                    self.PHASE_PLAY_OPPONENT,
                                    self.PHASE_PLAY_PLAYER,
                                    self.PHASE_GAME_OVER,
                                ];
                            } else {
                                self.phaseOrder = [
                                    self.PHASE_INIT_PLAYER,
                                    self.PHASE_INIT_OPPONENT,
                                    self.PHASE_PLAY_PLAYER,
                                    self.PHASE_PLAY_OPPONENT,
                                    self.PHASE_GAME_OVER
                                ];
                            }
                            break;
                    }

                    //Etape12 établit le tour ou le joueur joue, en fonction de qui a commencé
                    this.playerTurnPhaseIndex = self.phaseOrder.indexOf(self.PHASE_PLAY_PLAYER);
                    // console.log(this.playerTurnPhaseIndex);

                    self.chose.style.display = 'none';
                    
                    // initialise les joueurs
                    self.setupPlayers();

                    self.difficulty.style.display = 'block';
                    self.difficulty.addEventListener('click', function(e) {
                        e = e || window.event;
                        e = e.target;
                        let computer = self.players[1];
                        if (e.nodeName === 'SPAN') {
                            if(e.id == 'difficulty_easy') computer.difficulty = computer.COMPUTER_DIFFICULTY_EASY;
                            else if(e.id == 'difficulty_advanced') computer.difficulty = computer.COMPUTER_DIFFICULTY_ADVANCED;
                        }
                        
                        self.difficulty.style.display = 'none';
                        console.log(computer);

                        // ajoute les écouteur d'événement sur la grille
                        self.addListeners();
    
                        // c'est parti !
                        self.goNextPhase();
                    });
                }
            });
            // défini l'ordre des phase de jeu
            //     this.phaseOrder = [
            //         this.PHASE_INIT_PLAYER,
            //         this.PHASE_INIT_OPPONENT,
            //         this.PHASE_PLAY_PLAYER,
            //         this.PHASE_PLAY_OPPONENT,
            //         this.PHASE_GAME_OVER
            //     ];
            //  
            //     // initialise les joueurs
            //     this.setupPlayers();

            //     // ajoute les écouteur d'événement sur la grille
            //     this.addListeners();

            //     // c'est parti !
            //     this.goNextPhase();
        },
        setupPlayers: function () {
            // donne aux objets player et computer une réference vers l'objet game
            player.setGame(this);
            computer.setGame(this);

            // todo : implémenter le jeu en réseaux
            this.players = [player, computer];

            this.players[0].init();
            this.players[1].init();
        },
        goNextPhase: function () {
            // récupération du numéro d'index de la phase courante
            var ci = this.phaseOrder.indexOf(this.currentPhase);
            var self = this;

            if (ci !== this.phaseOrder.length - 1) {
                this.currentPhase = this.phaseOrder[ci + 1];
            } else {
                this.currentPhase = this.phaseOrder[0];
            }

            let end = this.gameIsOver();

            let endMessage = (url, msg) => {
                var audio = new Audio(url);
                audio.play();
                audio.volume = 0.1;
                this.waiting = true;
                return alert(msg);
            }

            if (end == 13) {
                return endMessage('sound/victory.mp3', "End of Game bro !");
            }
            else if (end == 21 ) {
                return endMessage('sound/victoryordi.mp3', "Computer Win !");
            }

            // console.log(this.currentPhase);
            switch (this.currentPhase) {
                case this.PHASE_GAME_OVER:
                    //detection de la fin de partie
                    if (end == 0) {
                        // console.log(this.gameIsOver()
                        // le jeu n'est pas terminé on recommence un tour de jeu
                        //Bug étape6 + 10 pas de break ni rapelle de la fonction goNextPhase();
                        // this.currentPhase = this.phaseOrder[this.playerTurnPhaseIndex];
                        this.currentPhase = this.phaseOrder[this.playerTurnPhaseIndex - 1];
                        self.goNextPhase();
                    } 
                    // else if (this.gameIsOver() == 13) {
                    //     var audio = new Audio('sound/victory.mp3');
                    //     audio.play();
                    //     audio.volume = 0.1;
                    //     alert("End of Game bro !");
                    //     break;
                    // }
                    // else if (this.gameIsOver() == 21 ) {
                    //     var audio = new Audio('sound/victoryordi.mp3');
                    //     audio.play();
                    //     audio.volume = 0.1;
                    //     alert("Computer Win !");
                    //     break;
                    // }
                    break;
                case this.PHASE_INIT_PLAYER:
                    utils.info("Placez vos bateaux");
                    break;
                case this.PHASE_INIT_OPPONENT:
                    this.wait();
                    utils.info("En attente de votre adversaire");
                    this.players[1].areShipsOk(function () {
                        self.stopWaiting();
                        self.goNextPhase();
                    });
                    break;
                case this.PHASE_PLAY_PLAYER:
                    utils.info("A vous de jouer, choisissez une case !");
                    break;
                case this.PHASE_PLAY_OPPONENT:
                    utils.info("A votre adversaire de jouer...");
                    this.players[1].play();
                    break;
            }

        },
        gameIsOver: function () {
            // return false;
            // etape 11 fin de  la partie avec petite alerte ligne 162
            // let Nous = this.players[0].fleet;
            // let Computer = this.players[1].fleet;
            let i = 0;
            if(this.players[0].dead) i = 21;
            if(this.players[1].dead) i = 13;


            // if (Nous[0].life === 0 && Nous[1].life === 0 && Nous[2].life === 0 && Nous[3].life === 0) {
            //     i = 21;

            //     // console.log("Nous " + i)
            // }

            // else {
            //     i = 0;
            // }
            // if (Computer[0].life === 0 && Computer[1].life === 0 && Computer[2].life === 0 && Computer[3].life === 0) {
            //     i = 13;
            //     // console.log("computer " +i)
            // }
            // else {
            //     i = 0;
            // }
            return i;
        },
        getPhase: function () {
            if (this.waiting) {
                return this.PHASE_WAITING;
            }
            return this.currentPhase;
        },
        // met le jeu en mode "attente" (les actions joueurs ne doivent pas être pris en compte si le jeu est dans ce mode)
        wait: function () {
            this.waiting = true;
        },
        // met fin au mode mode "attente"
        stopWaiting: function () {
            this.waiting = false;
        },
        addListeners: function () {
            // on ajoute des acouteur uniquement sur la grid (délégation d'événement)
            this.grid.addEventListener('mousemove', _.bind(this.handleMouseMove, this));
            this.grid.addEventListener('click', _.bind(this.handleClick, this));
            // etape 4 pour retation des bateaux
            this.grid.addEventListener('contextmenu', _.bind(this.rotateShip, this));
        },
        handleMouseMove: function (e) {
            // on est dans la phase de placement des bateau
            if (this.getPhase() === this.PHASE_INIT_PLAYER && e.target.classList.contains('cell')) {
                var ship = this.players[0].fleet[this.players[0].activeShip];

                // si on a pas encore affiché (ajouté aux DOM) ce bateau
                if (!ship.dom.parentNode) {
                    this.grid.appendChild(ship.dom);
                    // passage en arrière plan pour ne pas empêcher la capture des événements sur les cellules de la grille
                    ship.dom.style.zIndex = -1;
                }

                // décalage visuelle, le point d'ancrage du curseur est au milieu du bateau
                ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + "px";
                ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";


                // let decalage = parseInt(getComputedStyle(this.grid).height) - parseInt(ship.dom.style.height);
                // if (ship.vertical) {
                //     ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - decalage - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
                //     ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE + "px";
                // } else {
                //     ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - decalage + "px";
                //     ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
                // }
            }
        },
        handleClick: function (e) {
            // self garde une référence vers "this" en cas de changement de scope
            var self = this;

            // si on a cliqué sur une cellule (délégation d'événement)
            if (e.target.classList.contains('cell')) {
                // si on est dans la phase de placement des bateau
                if (this.getPhase() === this.PHASE_INIT_PLAYER) {
                    // on enregistre la position du bateau, si cela se passe bien (la fonction renvoie true) on continue
                    if (this.players[0].setActiveShipPosition(utils.eq(e.target), utils.eq(e.target.parentNode))) {
                        // et on passe au bateau suivant (si il n'y en plus la fonction retournera false)
                        if (!this.players[0].activateNextShip()) {
                            this.wait();
                            utils.confirm("Confirmez le placement ?", function () {
                                // si le placement est confirmé
                                self.stopWaiting();
                                // étape 1 la ligne 229 et 230 altérné 
                                self.players[0].clearPreview();
                                self.renderMiniMap();
                                self.goNextPhase();
                            }, function () {
                                self.stopWaiting();
                                // sinon, on efface les bateaux (les positions enregistrées), et on recommence
                                self.players[0].resetShipPlacement();
                            });
                        }
                    }
                    // si on est dans la phase de jeu (du joueur humain)
                } else if (this.getPhase() === this.PHASE_PLAY_PLAYER) {
                    this.players[0].play(utils.eq(e.target), utils.eq(e.target.parentNode));
                }
            }
        },
        // étape 4 pour la retation des bateaux 
        rotateShip: function (e) {
            // let self = this;
            // if (e.buttons == 2) {
            //     this.grid.addEventListener('contextmenu', event => event.preventDefault());
            //     let player = self.players[0];
            //     let ship = player.fleet[player.activeShip];

            //     let y = ship.dom.style.height;
            //     let x = ship.dom.style.width;

            //     ship.dom.style.height = x;
            //     ship.dom.style.width = y;
            //     ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (parseInt(getComputedStyle(this.grid).height) - parseInt(ship.dom.style.height)) - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
            //     ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE + "px";

            //     ship.vertical = ship.vertical ? false : true;
            // }
            //ETAPE10 rotate que si c'est le placement des bateaux
            if(this.currentPhase == this.PHASE_INIT_PLAYER) {
                e.preventDefault();
                var ship = this.players[0].fleet[this.players[0].activeShip];
                if (ship.vertical == false) {
                    if (ship.id != 3) {
                        ship.dom.style.transform = "rotate(90deg)";
                    }
                    else {
                        ship.dom.style.transform = "rotate(90deg) translate(-30px, -30px)";
                    }
                    ship.vertical = true;
                }
                else {
                    ship.dom.style.transform = "initial"
                    ship.vertical = false;
                }
            }

        },
        // fonction utlisée par les objets représentant les joueurs (ordinateur ou non)
        // pour placer un tir et obtenir de l'adversaire l'information de réusssite ou non du tir
        fire: function (from, col, line, callback) {
            this.wait();
            var self = this;
            var msg = "";

            // determine qui est l'attaquant et qui est attaqué
            var target = this.players.indexOf(from) === 0
                ? this.players[1]
                : this.players[0];

            if (this.currentPhase === this.PHASE_PLAY_OPPONENT) {
                msg += "Votre adversaire vous a... ";
            }

            // on demande à l'attaqué si il a un bateaux à la position visée
            // le résultat devra être passé en paramètre à la fonction de callback (3e paramètre)
            target.receiveAttack(col, line, function (response) {
                //Etape 7 modification de la function receiveAttack

                // if (hasSucceed) {
                //     msg += "Touché !";
                // } else {
                //     msg += "Manqué...";
                // }
                // if()

                utils.info(response.msg);

                // if(target == self.players[0] && response.sucess) {
                //     console.log(target);
                // }


                // on invoque la fonction callback (4e paramètre passé à la méthode fire)
                // pour transmettre à l'attaquant le résultat de l'attaque
                callback(response.sucess, response.bateau);

                // on fait une petite pause avant de continuer...
                // histoire de laisser le temps au joueur de lire les message affiché
                setTimeout(function () {
                    self.stopWaiting();
                    self.goNextPhase();
                }, 1000);
            });

        },
        renderMap: function () {
            this.players[0].renderTries(this.grid);
            //console.log(this.grid);
        },
        // étape 2 affichage sur la mini map avec precision pour pas décalé le tableau
        renderMiniMap: function () {
            var that = this;
            this.players[0].fleet.forEach(function (e) {
                that.miniGrid.appendChild(e.dom);
                that.miniGrid.style.marginTop = "-210px";
            })
        }
    };

    // point d'entrée
    document.addEventListener('DOMContentLoaded', function () {
        game.init();
    });

}());