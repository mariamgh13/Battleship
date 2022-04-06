/*jslint browser this */
/*global _, utils */

(function (global) {
    "use strict";

    var refType = {};
    var Ship;
    var shipFactory;

    var shipAI = 0;
    function getShipNewIndex() {
        shipAI = shipAI + 1;
        return shipAI;
    }

    Ship = {
        life: null,
        color: null,
        name: null,
        id: null,
        dom: null,
        // etape 4 bateau verical 
        vertical: false,

        
        setName: function (name) {
            this.name = name;
        },
        getName: function () {
            return this.name;
        },
        setLife: function (life) {
            this.life = parseInt(life, 10);
        },
        getLife: function () {
            return this.life;
        },
        setColor: function (color) {
            this.color = color;
        },
        getColor: function () {
            return this.color;
        },
        getId: function () {
            return this.id;
        },
        // getVertical: function () {
        //     return this.vertical;
        // },
        // setVertical: function (vertical) {
        //     this.vertical = vertical;
        // },
        init: function () {
            this.id = getShipNewIndex();
            this.vertical = false;

            this.dom = document.createElement('div');
            this.dom.style.height = "" + utils.CELL_SIZE + "px";
            this.dom.style.width = "" + utils.CELL_SIZE * this.life + "px";
            this.dom.style.position = "relative";
            this.dom.style.opacity = "0.8";
            this.dom.style.backgroundColor = this.color;
        }
    };

    shipFactory = {
        TYPE_BATTLESHIP: 'battleship',
        TYPE_DESTROYER: 'destroyer',
        TYPE_SUBMARINE: 'submarine',
        TYPE_SMALL_SHIP: 'small-ship',

        build: function (type, name) {

            if (!refType[type]) {
                return null;
            }

            var newShip = _.assign({}, Ship, refType[type]);

            newShip.init();

            if (name !== undefined) {
                newShip.setName(name);
            }

            return newShip;
        }
    };

    refType[shipFactory.TYPE_BATTLESHIP] = {
        life: 5,
        name: "Battleship",
        color: "#e60019"
    };
    refType[shipFactory.TYPE_DESTROYER] = {
        life: 5,
        name: "Destroyer",
        color: "#577cc2"
    };
    refType[shipFactory.TYPE_SUBMARINE] = {
        life: 4,
        name: "Submarine",
        color: "#56988c"
    };
    refType[shipFactory.TYPE_SMALL_SHIP] = {
        life: 3,
        name: "small-ship",
        color: "#203140"
    };


    // Expose l'objet à l'exterieur du scope de la fonction.
    // Depuis l'extérieur, vous pouvez l'utilisé ainsi :
    // var monDestroyer = shipFactory.build(shipFactory.TYPE_DESTROYER)
    global.shipFactory = shipFactory;

}(this));
