/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";

    var computer = _.assign({}, player, {
        grid: [],
        tries: [],
        fleet: [],
        nearby: [],
        game: null,

        COMPUTER_DIFFICULTY_EASY: "COMPUTER_DIFFICULTY_EASY",
        COMPUTER_DIFFICULTY_ADVANCED: "COMPUTER_DIFFICULTY_ADVANCED",

        difficulty: "",

        play: function () {
            var self = this;
            //Etape8 rajout de la function getRandomInt, tire a des coordonées random a chaque fois.
            // let x = this.getRandomInt(10);
            // let y = this.getRandomInt(10);
            let { x, y, index } = this.getRandomPositions();
            // console.log(`x: ${x}, y: ${y}, index: ${index}`);
            
            setTimeout(function () {
                self.game.fire(this, y, x, function (hasSucced, bateau) {
                    self.tries[x][y] = hasSucced;
                    // console.log(x, y);
                    // console.log(self);
                    if(hasSucced) {
                        let grid = self.game.miniGrid; 
                        let cell = grid.children[x].children[y];
                        // console.log(cell);

                        //Etape 9 marque une crois la ou le bateau a été touché
                        cell.innerText = '🔨';
                        cell.style.fontSize = '45px';
                        // cell.style.textAlign = 'center';

                        if(self.difficulty == self.COMPUTER_DIFFICULTY_ADVANCED) {
                            let aroundShot = [
                                {x: x-1, y: y, type: 'vertical', played: false},
                                {x: x, y: y+1, type: 'horizontal', played: false},
                                {x: x+1, y: y, type: 'vertical', played: false},
                                {x: x, y: y-1, type: 'horizontal', played: false},
                            ];
                        
                            //Etape14 
                            if(bateau.getLife() == 0) {
                                console.log("done with it");
                                self.nearby = [];
                            } else if(self.nearby.find(e => !e.played) || index > 0) {
                                console.log("look for horizontal/vertical");
                                let type = self.nearby[index].type;
                                let same = aroundShot.filter((e) => type == e.type);
                                self.nearby.forEach((e) => {
                                    if(e == e.played) return;
                                    if(type == e.type) same.push(e);
                                });
                                self.nearby = same;
                            } else {
                                console.log('look for around');
                                self.nearby = aroundShot;
                            }
                            console.log(self.nearby);
                        }
                    }
                });
            }, 2000);
        },
        getRandomPositions: function() {
            let x = 0;
            let y = 0;
            let index = 0;
        
            do {
                x = this.getRandomInt(10);
                y = this.getRandomInt(10);
        
                if(this.nearby.length) {
                    for(var i = 0; i < this.nearby.length; i++) {
                        if(this.nearby[i].played) continue;
                        x = this.nearby[i].x;
                        y = this.nearby[i].y;
                        this.nearby[i].played = true;
                        index = i;
                        
                        console.log(`x: ${x}, y: ${y}`);
                        if((x < 0 || x > 9) || (y < 0 || y > 9)) continue;
                        else break;
                    }
                }
        
            } while(this.tries[x][y] !== 0)

            return {x, y, index};
        }, 
        getRandomInt: (max) => Math.floor(Math.random() * Math.floor(max)),
        // etape 5 pour pouvoir mettre les pions aleatoire de l'ordinateur , avec condition de pas mettre les uns sur les autres, n'y hors cadre
        areShipsOk: function (callback) {
            // var i = 0;
            // var j;

            // this.fleet.forEach(function (ship, i) {
            //     j = 0;
            //     let x = Math.floor(Math.random() * Math.floor(9));
            //     while (j < ship.life) {
            //         if(!this.grid[x][j]) continue;
            //         this.grid[x][j] = ship.getId();
            //         console.log(this.grid);
            //         j += 1;
            //     }
            // }, this);

            let j = 0;
            while(j < this.fleet.length) {
                let error = false;
                let ship = this.fleet[j];
                let vertical = this.getRandomInt(2);
                let x = this.getRandomInt(10);
                let y = this.getRandomInt(10);
                let life_div = Math.floor(ship.getLife() / 2);

                if((x + life_div > 9 && !vertical) || (y + life_div > 9 && vertical)) {
                    // console.log(`x: ${x}, y: ${y}, life: ${life_div}, id: ${j}, vertical: ${vertical}`);
                    continue;
                };

                if (!vertical) {
                    x = x - life_div;
                    for (var i = 0; i < ship.getLife(); i++) {
                        if (this.grid[y][x + i] !== 0) {
                            error = true;
                            break;
                        }   
                    }

                    if(!error) {
                        for (var i = 0; i < ship.getLife(); i++) this.grid[y][x + i] = ship.getId();
                        j++;
                    }
                } else {
                    y = y - life_div;
                    for (var i = 0; i < ship.getLife(); i++) {
                        if(y < 0) {
                            error = true;
                            break;
                        } else if (this.grid[y + i][x] !== 0){
                            error = true;
                            break;
                        }
                    }

                    if(!error) {
                        for (var i = 0; i < ship.getLife(); i++) this.grid[y + i][x] = ship.getId();
                        j++;
                    }
                }
            }
            // console.log(this.grid);
            setTimeout(function () {
                callback();
            }, 500);
        }
    });

    global.computer = computer;

}(this));