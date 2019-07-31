//constants OBJECT
"use strict";
//music https://www.youtube.com/watch?v=EQja4bK1k6c
const constants = {
    //menu
    menuBtn: document.querySelector(".menu__start"),
    menuInfo: document.querySelector(".menu__info"),
    menu: document.querySelector(".menu"),

    //  overlay
    wrapper: document.querySelector(".gameWrapper"),
    btnMenu: $(".menuOpen"),
    towerMenu: $(".gameMenu"),
    btnResume: $('.resume'),
    btnPause: $('.pause'),
    life: $(".life"),
    //              game
    game: $(".game"),
    //audio
    //   button towers
    towers: $('#tower1,#tower2,#tower3'),
    // button gameover
    btnGameover: $(".btnGameover"),
    //   tiles active to build tower (centermap)
    mapCenterTile: $('.mapCenter'),
    //     canvas 
    canvas: document.querySelector('#cnv'),
    canvas2: document.querySelector("#cnv2"),
    canvas3: document.querySelector("#cnv3"),
    canvas4: document.querySelector("#cnv4"),
    canvas5: document.querySelector("#cnv5"),

    //     canvas settings
    canvasWidth: 640,
    canvasHeight: 320,
    fps: 30,

    init: function () {
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        this.canvas2.width = this.canvasWidth;
        this.canvas2.height = this.canvasHeight;

        this.canvas3.width = this.canvasWidth;
        this.canvas3.height = this.canvasHeight;

        this.canvas4.width = this.canvasWidth;
        this.canvas4.height = this.canvasHeight;

        this.canvas5.width = this.canvasWidth;
        this.canvas5.height = this.canvasHeight;
    },
    listenerFun: {
        //                                                                                                                  FUNCTION
        goldListenerRef: function () {
            $(".coin").hover(this.goldSelect);
        },
        //                                            Gameover BloodScreen                                                  FUNCTION
        bloodScreen: function () {
            overlay.append('<div class="bloodScreen"></div>');
        }
    }
}
//              pre setting for players
let playerSet = {
    life: 10,
    refresh: function () {
        if (playerSet.life <= 0) {
            constants.listenerFun.bloodScreen();

        } else
            constants.life.text(playerSet.life);

    }
}
//              pre settings for minions
let minionSet = {
    minionHalfSize: 16,
    whichMinion: 0,
    minionsArray: [],
    minionHp: 32,
    prize: 7.5,
    waveSize: [3, 8, 12, 20, 32, 36, 47, 59,111,999],
    minionsConstructed: false,
    minionRunTime: 90, // 19 frames x 32px   it was 38bro
    waveIsOn: false,
    whichWave: 0
}
//              pre settings for towers
let towerSet = {
    towersCoordinate: [],
    whichTower: 0,
    choosenTower: null,
    towerMenuOpened: false,
    //  check place for building posY posX 
    checkBuildPos: function (xPos, yPos) {
        let cnvHeight = constants.canvas.height;
        let cnvWidth = constants.canvas.width;

        let distance = 32;

        // console.log(overlayOffset);
        if (xPos > constants.canvas.offsetLeft + distance &&
            xPos < constants.canvas.offsetLeft + cnvWidth - distance &&
            yPos > constants.canvas.offsetTop + distance &&
            yPos < constants.canvas.offsetTop + cnvHeight - distance) {
            return true;
        } else {
            return false;
        }

    },
    // show/hide towers Menu                                                FUNCTION 
    toggleTowerMenu: function () {
        if (towerSet.towerMenuOpened) {
            constants.towerMenu.css({
                'display': "none"
            });
            towerSet.towerMenuOpened = false;
        } else {
            constants.towerMenu.css({
                'display': "flex"
            });

            towerSet.towerMenuOpened = true;
        }
    },
    //                                                     choose tower                                                 FUNCTION
    chooseTower: function () {
        if (towerSet.choosenTower == $(this).attr("id")) {
            towerSet.choosenTower = null;
        } else {
            towerSet.choosenTower = $(this).attr("id");
        }
    },
    //                                           point in circle function                                               FUNCTION
    pointInCircle: function (x, y, cx, cy, radius) {
        let distanceSquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distanceSquared <= radius * radius;
    },
    //                                           diagonal function                                                      FUNCTION
    diagonal: function (sideA, sideB) {
        return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
    }
}
let overlay = $('.gameWrapper');
// context OBJECT
let context = {
    ctx: constants.canvas.getContext("2d"),
    ctx2: constants.canvas2.getContext("2d"),
    ctx3: constants.canvas3.getContext("2d"),
    ctx4: constants.canvas4.getContext("2d"),
    ctx5: constants.canvas5.getContext("2d"),

    //  canvas clearer                                                                                                  FUNCTION
    cleanCanvas: function () {
        this.ctx.clearRect(constants.canvas.offsetLeft, constants.canvas.offsetTop, innerWidth, innerHeight);
        this.ctx2.clearRect(constants.canvas2.offsetLeft, constants.canvas2.offsetTop, innerWidth, innerHeight);
        this.ctx3.clearRect(constants.canvas3.offsetLeft, constants.canvas3.offsetTop, innerWidth, innerHeight);
        this.ctx4.clearRect(constants.canvas4.offsetLeft, constants.canvas4.offsetTop, innerWidth, innerHeight);
    },
    ctxCheck: function () {
        console.log(this.ctx, this.ctx2, this.ctx3, this.ctx4, this.ctx5);
    }
    
}
//              map set
const mapSet = {
    mapHeight: 10,
    mapWidth: 20,
    tileWidth: 32,
    tileHeight: 32,
    //map
    mapCenter: new Image(),
    mapTop: new Image(),
    mapLeft: new Image(),
    mapRight: new Image(),
    mapBottom: new Image(),
    mapLeftTop: new Image(),
    mapRightTop: new Image(),
    mapLeftBottom: new Image(),
    mapRightBottom: new Image(),
    //road
    roadLeftRight: new Image(),
    roadBottomLeft: new Image(),
    roadBottomRight: new Image(),
    roadBottomTop: new Image(),
    roadTopLeft: new Image(),
    roadTopRight: new Image(),
    // adds
    mapTree1: new Image(),
    mapTree2: new Image(),
    mapTree3: new Image(),
    mapDiamond: new Image(),
    mapStone: new Image(),
    coinSprite: new Image(),
    //minion
    minion: new Image(),
    //towers
    tower1: new Image(),
    tower2: new Image(),
    tower3: new Image(),

    //                                    load textures and drawing maps
    loadMapImages: function () {
        //map
        this.mapCenter.src = "https://i.postimg.cc/kgGCvNLX/map-Center.png";
        this.mapTop.src = "https://i.postimg.cc/HxCFRbvM/mapTop.png";
        this.mapLeft.src = "https://i.postimg.cc/YCPHnGwN/mapLeft.png";
        this.mapRight.src = "https://i.postimg.cc/sXdRzkxv/mapRight.png";
        this.mapBottom.src = "https://i.postimg.cc/gkNdhtST/map-Bottom.png";
        this.mapLeftTop.src = "https://i.postimg.cc/3RXQxt09/map-Left-Top.png";
        this.mapRightTop.src = "https://i.postimg.cc/Kc5yXs28/map-Right-Top.png";
        this.mapLeftBottom.src = "https://i.postimg.cc/yNSzw1VM/map-Left-Bottom.png";
        this.mapRightBottom.src = "https://i.postimg.cc/PJdsp1mH/map-Right-Bottom.png";
        //road
        this.roadLeftRight.src = "png/roadLeftRight.png";
        this.roadBottomLeft.src = "png/roadBottomLeft.png";
        this.roadBottomRight.src = "png/roadBottomRight.png";
        this.roadBottomTop.src = "png/roadBottomTop.png";
        this.roadTopLeft.src = "png/roadTopLeft.png";
        this.roadTopRight.src = "png/roadTopRight.png";
        // adds
        this.mapTree1.src = "https://i.postimg.cc/qB6jyNmV/mapTree2.png";
        this.mapTree2.src = "https://i.postimg.cc/qB6jyNmV/mapTree2.png";
        this.mapTree3.src = "png/mapTree2.png";
        this.mapDiamond.src = "png/mapDiamond.png";
        this.mapStone.src = "https://i.postimg.cc/J0Kwbtqk/mapStone.png";
        this.coinSprite.src = "https://i.postimg.cc/mk4RYvW0/gold-Coin-Sprite.png";
        //minion
        this.minion.src = "https://i.postimg.cc/HkrGyY7r/map-Tile-154.png";
        //towers
        this.tower1.src = "https://i.postimg.cc/rmcYQMzC/tower1.png";
        this.tower2.src = "https://i.postimg.cc/rswZ2j1D/tower2.png";
        this.tower3.src = "https://i.postimg.cc/Gtg7LDKq/tower3.png";

    },
    // maps drawing                                                                                                    FUNCTION
    drawAdds: function (ctx = "ctx2") {
        let addsMap = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, //1
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, //2
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, //3
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, //4
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, //5
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, //6
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, //7
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, //8
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, //9
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 //10
        ]

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                switch (addsMap[((y * this.mapWidth) + x)]) {

                    case 0:
                        context[ctx].fillStyle = "transparent";
                        break;
                    case 1:
                        const pMapStone = context.ctx2.createPattern(this.mapStone, "repeat");
                        context[ctx].fillStyle = pMapStone;
                        break;
                        this
                    case 2:
                        const pMapTree2 = context.ctx2.createPattern(this.mapTree2, "repeat");
                        context[ctx].fillStyle = pMapTree2;
                        break;
                    default:
                        context[ctx].fillStyle = "red";
                        break;
                }
                context[ctx].fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
            }
        }
    },
    //     !   dodac ctx jako argument  !                                                                              FUNCTION
    drawMap: function (ctx = "ctx") {
        let gameMap = [
            5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, //1
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, //2
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, //3
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, //4
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, //5
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, //6
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, //7
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, //8
            2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, //9
            7, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 8 //10
        ]

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                switch (gameMap[((y * this.mapWidth) + x)]) {
                    case 0:
                        const backgroundCenter = context.ctx.createPattern(this.mapCenter, "repeat");
                        context[ctx].fillStyle = backgroundCenter;
                        break;

                    case 1:
                        const backgroundTop = context.ctx.createPattern(this.mapTop, "repeat");
                        context[ctx].fillStyle = backgroundTop;
                        break;

                    case 2:
                        const backgroundLeft = context.ctx.createPattern(this.mapLeft, "repeat");
                        context[ctx].fillStyle = backgroundLeft;
                        break;

                    case 3:
                        const backgroundRight = context.ctx.createPattern(this.mapRight, "repeat");
                        context[ctx].fillStyle = backgroundRight;
                        break;

                    case 4:
                        const backgroundBotttom = context.ctx.createPattern(this.mapBottom, "repeat");
                        context[ctx].fillStyle = backgroundBotttom;
                        break;

                    case 5:
                        const backgroundLeftTop = context.ctx.createPattern(this.mapLeftTop, "repeat");
                        context[ctx].fillStyle = backgroundLeftTop;
                        break;

                    case 6:
                        const backgroundRightTop = context.ctx.createPattern(this.mapRightTop, "repeat");
                        context[ctx].fillStyle = backgroundRightTop;
                        break;

                    case 7:
                        const backgroundLeftBottom = context.ctx.createPattern(this.mapLeftBottom, "repeat");
                        context[ctx].fillStyle = backgroundLeftBottom;
                        break;

                    case 8:
                        const backgroundRightBottom = context.ctx.createPattern(this.mapRightBottom, "repeat");
                        context[ctx].fillStyle = backgroundRightBottom;
                        break;

                    default:
                        context[ctx].fillStyle = "blue";
                }
                context[ctx].fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
            }
        }
    },
}
//                                            gold OBJECT     
let goldObj = {
    actualGold: 200,
    goldOnScreen: $(".goldAmount"),
    array: [],
    coinSound : new Audio("audio/coinSound.wav"),

    actualizeGold: function (amount) {
        this.actualGold += amount;
        this.goldOnScreen.text(this.actualGold);

    },
    canPay: function (cost) {
        if ((this.actualGold - cost) >= 0) {
            // console.log("canpay");
            return true;
        } else
            return false;
    },
    Gold: function (amount, x, y, width = 16, height = 16, pic = mapSet.coinSprite) {
        this.amount = amount;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.pic = pic;
        this.frame = 0;
        this.total = 0;
        this.update = function () {
            if (this.frame == 8) {
                this.frame = 0;
            }
            context.ctx4.drawImage(this.pic, this.frame * 128 / 8, 0, 16, 16, this.x, this.y, 16, 16);
            this.total += 1;
            if (this.total == 3) {
                this.total = 0;
                this.frame += 1;
            }

        }
    }
}

//                                             Minion Constructor                                                                       FUNCTION
function minionObj(leftOfMinion, topOfMinion, minionHp, whichMinion, speed = .35) {

    this.x = leftOfMinion;
    this.y = topOfMinion;
    this.minionHp = minionHp;
    this.canDie = true;
    this.whichMinion = whichMinion;
    this.dx = speed;


    this.dead = function () {
        if (this.canDie) {

            minionSet.minionsArray[this.whichMinion] = undefined;
    
            goldObj.array.push(new goldObj.Gold((minionSet.prize), this.x, this.y));
 
            this.canDie = false;

            let count = 0;
            for (let i = 0; i < minionSet.minionsArray.length; i++) {
                if (minionSet.minionsArray[i] == undefined) {
                    count++;
                    if (minionSet.minionsArray.length == count) {

                        minionSet.waveIsOn = false;
                        minionSet.minionsConstructed = false;

                    }
                }
            }

        }
    }
    this.draw = function () {
        context.ctx4.drawImage(mapSet.minion, this.x, this.y, 32, 32);
        context.ctx4.beginPath();
        context.ctx4.moveTo(this.x, this.y);
        context.ctx4.lineTo(this.x + this.minionHp, this.y);
        context.ctx4.lineWidth = 2.5;
        context.ctx4.strokeStyle = "red";
        context.ctx4.stroke();
    }
    this.update = function () {
        if (this.x >= constants.canvasWidth) {
            minionSet.minionsArray[this.whichMinion] = undefined;
            playerSet.life -= 1;
            playerSet.refresh();

            let count = 0;
            for (let i = 0; i < minionSet.minionsArray.length; i++) {
                if (minionSet.minionsArray[i] == undefined) {
                    count++;
                    if (minionSet.minionsArray.length == count) {

                        minionSet.waveIsOn = false;
                        minionSet.minionsConstructed = false;

                    }
                }
            }

        }
        this.x += this.dx;
        this.draw();
    }
}

//                                    towers constructor and shooting function                                      FUNCTION
function tower(x = 0, y, dmgArea = 640, dmgSize = 10, dmgColor = "red", dmg = .1, towerType = "constructor", whichTower = "ANOTHER", sound, pic) {
    x += 16; //move to the middle
    y += 16; //move to the middle
    this.x = x;
    this.y = y;
    this.xReset = x;
    this.yReset = y;
    this.dmgArea = dmgArea;
    this.dmgSize = dmgSize;
    this.dmgColor = dmgColor;
    this.dmg = dmg;
    this.towerType = towerType;
    this.whichTower = whichTower;
    this.pic = pic;
    this.sound = sound;
    // console.log(pic);
    this.dx;
    this.dy;
    this.diag;
    this.frame = 1;
    this.whichFrame = 1;
    this.total;
    this.whichOne;
    this.targetElement = undefined;
    this.targetOutOfRange = true;
    this.target = {
        x: undefined,
        y: undefined
    }
    this.targetsArray = minionSet.minionsArray;
    //draw
    this.draw = function () {
        context.ctx5.drawImage(this.pic, this.xReset - (16), this.yReset - (16))
    }
    this.shoot = function () {
        context.ctx3.beginPath();
        context.ctx3.arc(this.x, this.y, this.dmgSize, 0, Math.PI * 2, false);
        context.ctx3.strokeStyle = this.dmgColor;
        context.ctx3.stroke();
    }
    //update   
    this.update = function () {
        if (this.targetElement == undefined || this.targetOutOfRange) { //than targeting
            targeting: for (var i = 0; i < this.targetsArray.length; i++) {
                if (this.targetsArray[i] != undefined) {
                    this.target.x = this.targetsArray[i].x + minionSet.minionHalfSize;
                    this.target.y = this.targetsArray[i].y + minionSet.minionHalfSize;

                    if (towerSet.pointInCircle(this.target.x, this.target.y, this.x, this.y, this.dmgArea)) {
                        this.targetElement = this.targetsArray[i];
                        this.targetOutOfRange = false;
                        break targeting;
                    }
                }
            }
        }
        if (this.targetElement != undefined) { //than shooting
            this.target.x = this.targetElement.x + minionSet.minionHalfSize;
            this.target.y = this.targetElement.y + minionSet.minionHalfSize;
            if (towerSet.pointInCircle(this.target.x, this.target.y, this.x, this.y, this.dmgArea)) {
                // console.log("target is inside");
                this.dx = (this.target.x - this.x);
                this.dy = (this.target.y - this.y);

                this.diag = towerSet.diagonal(this.dx, this.dy);
                this.frame = Math.round(this.diag);

                this.dx = (this.target.x - this.x) * (this.whichFrame / this.frame);
                this.dy = (this.target.y - this.y) * (this.whichFrame / this.frame);

                this.total = (this.whichFrame / this.frame);
                if (this.total >= 1) {

                    if (this.targetElement != undefined) {
                        this.targetElement.minionHp -= this.dmg;
                        this.sound.play();

                        if (this.targetElement.minionHp <= 0) {
                            this.targetElement.dead();
                            this.targetElement = undefined;
                            // this.sound.pause();
                        }
                        this.whichFrame = 1;
                        this.x = this.xReset;
                        this.y = this.yReset;
                    }
                } else {
                    this.x += this.dx;
                    this.y += this.dy;
                }
                this.whichFrame++;
            } else {
                this.targetOutOfRange = true;
                this.sound.pause();
            }
        }
        this.shoot();
    }
}

function checkCanvasElements() {
    var xPos = event.offsetX; // - canvas.left 
    var yPos = event.offsetY; // - canvas.top

    goldObj.array.forEach((element, i) => {
        // console.log(element, "inside of element");
        if (yPos > element.y &&
            yPos < element.y + element.height &&
            xPos > element.x &&
            xPos < element.x + element.width) {
            
           
            goldObj.coinSound.play();
            goldObj.actualizeGold(element.amount);
            goldObj.array.splice(i, 1);
        }
    })

}
//                                                     clicks
function getPosOnCanvas(e) {

    var xPos = e.offsetX; // - canvas.left 
    var yPos = e.offsetY; // - canvas.top

    if (towerSet.choosenTower != null) {
        buildTower(yPos, xPos);
    }
    if (towerSet.towerMenuOpened) {
        constants.towerMenu.css({
            'display': "none"
        });
        towerSet.towerMenuOpened = false;
    }
    // canvasElements.forEach(checkCanvasElements);
}
//                                                      ADDING TOWER                                                FUNCTION
function buildTower(yPos, xPos) {
    if (towerSet.checkBuildPos(xPos, yPos)) {
        yPos -= 16; //center pos 
        xPos -= 16; //center pos 
        //set top, left of tower
        let leftOfTowers = xPos;
        let topOfTowers = yPos;
        //settings towers
        let towerType,
            towerName1 = "Archer",
            towerName2 = "Mage",
            towerName3 = "Artillery",
            towerRad,
            towerRad1 = 100,
            towerRad2 = 80,
            towerRad3 = 200,
            dmgSize,
            dmgSize1 = 1,
            dmgSize2 = 1.5,
            dmgSize3 = 0.5,
            dmgColor,
            dmgColor1 = "red",
            dmgColor2 = "blue",
            dmgColor3 = "black",
            dmg,
            dmg1 = .7,
            dmg2 = .5,
            dmg3 = .32,
            cost, cost1 = 50,
            cost2 = 50,
            cost3 = 70,
            sound,
            sound1 = new Audio("audio/1.wav"),
            sound2 = new Audio("audio/2.wav"),
            sound3 = new Audio("audio/3.wav"),
            pic;
        //set towerType
        switch (towerSet.choosenTower) {
            case "tower1":
                towerType = towerName1;
                towerRad = towerRad1;
                dmgSize = dmgSize1;
                dmgColor = dmgColor1;
                dmg = dmg1;
                cost = cost1;
                sound = sound1;
                pic = mapSet.tower1;

                break;
            case "tower2":
                towerType = towerName2;
                towerRad = towerRad2;
                dmgSize = dmgSize2;
                dmgColor = dmgColor2;
                dmg = dmg2;
                cost = cost2;
                sound = sound2;
                pic = mapSet.tower2;

                break;
            case "tower3":
                towerType = towerName3;
                towerRad = towerRad3;
                dmgSize = dmgSize3;
                dmgColor = dmgColor3;
                dmg = dmg3;
                cost = cost3;
                sound = sound3;
                pic = mapSet.tower3;

                break;
            default:
                console.log("tower building gone wrong");
                break;
        }

        if (goldObj.canPay(cost)) {
            goldObj.actualGold -= cost;
            goldObj.goldOnScreen.text(goldObj.actualGold);
            towerSet.towersCoordinate.push(new tower(leftOfTowers, topOfTowers, towerRad, dmgSize, dmgColor, dmg, towerType, towerSet.whichTower, sound, pic));
            towerSet.towersCoordinate[towerSet.towersCoordinate.length - 1].draw();
            towerSet.whichTower++;
        } else {
            console.log("Nie mamy złota Panie ..");
        }

    } else {
        console.log("nie można tutaj tego zbudować Panie ..");
    }
}
// create random spot object
function RespownSpot(minY, maxY, minX, maxX) {
    let newObject, x, y;

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    x = random(minX, maxX);
    y = random(minY, maxY);
    newObject = {};
    newObject.x = x;
    newObject.y = y;
    return newObject;
}
//                                                   main loop functions                                            FUNCTION
function createMinions() {
    if (!minionSet.minionsConstructed) {
        for (let i = 0; i < minionSet.waveSize[minionSet.whichWave] + 1; i++) {
            let Respown = RespownSpot(-200, 0, 32, 250);
            minionSet.minionsArray.push(new minionObj(Respown.y, Respown.x, minionSet.minionHp, minionSet.whichMinion));
            minionSet.whichMinion += 1;
        }
        minionSet.whichWave++;
        minionSet.waveIsOn = true;
        minionSet.minionsConstructed = true;
    }
}
//                              tower.update, minion.update                                                            FUNCTION
function updateAll() {
    for (let i = 0; i < minionSet.minionsArray.length; i++) {
        if (minionSet.minionsArray[i] != undefined) {
            minionSet.minionsArray[i].update();
        }
    }
    if (minionSet.waveIsOn) {
        for (let i = 0; i < towerSet.towersCoordinate.length; i++) {
            towerSet.towersCoordinate[i].update();
        }
    }
    for (let i = 0; i < goldObj.array.length; i++) {
        goldObj.array[i].update();
    }
}
//                                                    animate main loop                                             FUNCTION
function animate() {
    context.cleanCanvas();
    mapSet.drawMap();
    mapSet.drawAdds();
    // drawRoad();
    updateAll();
    // setInterval(animate, 1000 / constants.fps);
}

// init Game propertys
function init() {
    constants.menuBtn.addEventListener('click',()=>{
     
        constants.menu.classList.toggle("displayNone");
        constants.menuBtn.classList.toggle("displayNone");
        constants.menuInfo.classList.toggle("displayNone");

        constants.wrapper.classList.toggle("displayNone");

    });
    // load constants OBJECT settings (canvas width, height)
    constants.init();
    // check context OBJECT console.log
    playerSet.refresh();
    // overlayOffset.init();
    context.ctxCheck();
    // load mapSet OBJECT images
    mapSet.loadMapImages();
    // load gold amount on the screen
    goldObj.goldOnScreen.text(goldObj.actualGold);
    // start animate canvas.ctx
    setInterval(animate, 1000 / 30);
}

window.addEventListener("load",init);

constants.canvas4.addEventListener("mousemove", checkCanvasElements, false); //false dodac w parametrach sprawdz! !!!!!!!
constants.canvas4.addEventListener("click", getPosOnCanvas, false); //false dodac w parametrach sprawdz! !!!!!!!
constants.towers.click(towerSet.chooseTower);
constants.btnResume.click(createMinions);
constants.btnMenu.click(towerSet.toggleTowerMenu);







































