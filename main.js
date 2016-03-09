var socket = io.connect("http://76.28.150.193:8888");

socket.on("load", function (data) {
    gameEngine.entities = [];
    for (var i = 0; i < 12; i++) {
        circle = new Circle(gameEngine);
        circle.x = data.data.circles[i].x;
        circle.y = data.data.circles[i].y;
        circle.radius = data.data.circles[i].radius;
        circle.dx = data.data.circles[i].dx;
        circle.dy = data.data.circles[i].dy;
        gameEngine.addEntity(circle);
    }

    for (var i = 0; i < 12; i++) {
        rectangle = new Rectangle(gameEngine);
        rectangle.x = data.data.rectangles[i].x;
        rectangle.y = data.data.rectangles[i].y;
        rectangle.width = data.data.rectangles[i].width;
        rectangle.height = data.data.rectangles[i].height;
        rectangle.dx = data.data.rectangles[i].dx;
        rectangle.dy = data.data.rectangles[i].dy;
        gameEngine.addEntity(rectangle);
    }
});

function mySaveFunction(){
    var circles = [];
    var rectangles = [];

    for (var i = 0; i < 24; i++){
        var ent = gameEngine.entities[i];
        if (ent.radius){
            var circle = {x: ent.x, y: ent.y, radius: ent.radius, dx: ent.dx, dy: ent.dy};
            circles.push(circle);
        } else {
            var rectangle = {x: ent.x, y: ent.y, width: ent.width, height: ent.height, dx: ent.dx, dy: ent.dy};
            rectangles.push(rectangle);
        }
    }
    socket.emit("save", { studentname: "Abdalla Ahmed", statename: "stateAAA", data: {circles: circles, rectangles: rectangles}});
};

function myLoadFunction(){
    socket.emit("load", { studentname: "Abdalla Ahmed", statename: "stateAAA" });
};

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.setNotIt();
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

function Rectangle(game){
    this.player = 1;
    this.height = 20;
    this.width = 20;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.setNotIt1();
    Entity.call(this, game, this.height + Math.random() * (800 - this.height * 2), this.height + Math.random() * (800 - this.height * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Rectangle.prototype = new Entity();
Rectangle.prototype.constructor = Rectangle;

Circle.prototype.setIt = function () {
    this.it = true;
    this.color = 0;
    this.visualRadius = 500;
};

Rectangle.prototype.setIt1 = function() {
    this.it = true;
    this.color = 0;
    this.width = 500;

};

Circle.prototype.setNotIt = function () {
    this.it = false;
    this.color = 3;
    this.visualRadius = 200;
};

Rectangle.prototype.setNotIt1 = function () {
    this.it = false;
    this.color = 3;
    this.width = 200;
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Rectangle.prototype.collide1 = function (other) {
    return distance(this, other) < this.height + other.height;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Rectangle.prototype.collideLeft1 = function () {
    return (this.x - this.height) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Rectangle.prototype.collideRight1 = function () {
    return (this.x + this.height) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Rectangle.prototype.collideTop1 = function () {
    return (this.y - this.height) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Rectangle.prototype.collideBottom1 = function () {
    return (this.y + this.height) > 800;
};

var c={x: 100,y: 101, r: 25};
var r={x: 100,y: 100, w: 100, h: 100};

function collisionDetection(circle, rect){
    var collide = false;

    if ((circle.x > rect.x) && (circle.x < (rect.x + rect.width)) && (circle.y > rect.y) && (circle.y < (rect.y + rect.width))){
        collide = true;
    }

    if ((circle.x > rect.x - circle.r) && (circle.x < (rect.x + rect.width + circle.r)) && (circle.y > rect.y - circle.r) && (circle.y < (rect.y + rect.width + circle.r))) {
        collide = true;
    }

    if (circle.x > rect.x - circle.r && circle.x < rect.x && circle.y > rect.y - circle.r && circle.y < rect.y){
        var point = {x: rect.x, y: rect.y};
        console.log(distance(circle,point));
        if (distance(circle,point) < circle.radius){
            collide = true;
        }
    }

    if (circle.x > (rect.x + rect.width) - circle.r && circle.x < (rect.x + rect.width) && circle.y > rect.y - circle.r && circle.y < rect.y){
        var point = {x: (rect.x + rect.width), y: rect.y};
        console.log(distance(circle,point));
        if (distance(circle,point) < circle.radius){
            collide = true;
        }
    }

    if (circle.x > rect.x - circle.radius && circle.x < rect.x && circle.y > (rect.y + rect.height) - circle.r && circle.y < (rect.y + rect.height)){
        var point = {x: rect.x, y: (rect.y + rect.height)};
        console.log(distance(circle,point));
        if (distance(circle,point) < circle.radius){
            collide = true;
        }
    }

    if (circle.x > (rect.x + rect.width) - circle.radius && circle.x < (rect.x + rect.width) && circle.y > (rect.y + rect.height) - circle.radius && circle.y < (rect.y + rect.height)){
        var point = {x: (rect.x + rect.width), y: (rect.y + rect.height)};
        console.log(distance(circle,point));
        if (distance(circle,point) < circle.radius){
            collide = true;
        }
    }
    return collide;
};

console.log(collisionDetection(c, r));

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
    //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.visualRadius){
            if (ent !== this && this.collide(ent)) {
                var temp = { x: this.velocity.x, y: this.velocity.y };

                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x)/dist;
                var difY = (this.y - ent.y)/dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;
                if (this.it) {
                    this.setNotIt();
                    ent.setIt();
                }
                else if (ent.it) {
                    this.setIt();
                    ent.setNotIt();
                }
            }

            if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
                var dist = distance(this, ent);
                if (this.it && dist > this.radius + ent.radius + 10) {
                    var difX = (ent.x - this.x)/dist;
                    var difY = (ent.y - this.y)/dist;
                    this.velocity.x += difX * acceleration / (dist*dist);
                    this.velocity.y += difY * acceleration / (dist * dist);
                    var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                    if (speed > maxSpeed) {
                        var ratio = maxSpeed / speed;
                        this.velocity.x *= ratio;
                        this.velocity.y *= ratio;
                    }
                }
                if (ent.it && dist > this.radius + ent.radius) {
                    var difX = (ent.x - this.x) / dist;
                    var difY = (ent.y - this.y) / dist;
                    this.velocity.x -= difX * acceleration / (dist * dist);
                    this.velocity.y -= difY * acceleration / (dist * dist);
                    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                    if (speed > maxSpeed) {
                        var ratio = maxSpeed / speed;
                        this.velocity.x *= ratio;
                        this.velocity.y *= ratio;
                    }
                }
            }
        } else {
            collisionDetection(Circle, Rectangle);
        }

    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Rectangle.prototype.update = function () {
    Entity.prototype.update.call(this);
    //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft1() || this.collideRight1()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft1()) this.x = this.height;
        if (this.collideRight1()) this.x = 800 - this.height;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop1() || this.collideBottom1()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop1()) this.y = this.height;
        if (this.collideBottom1()) this.y = 800 - this.height;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.width && ent.height){
            if (ent !== this && this.collide1(ent)) {
                var temp = { x: this.velocity.x, y: this.velocity.y };

                var dist = distance(this, ent);
                var delta = this.height + ent.height - dist;
                var difX = (this.x - ent.x)/dist;
                var difY = (this.y - ent.y)/dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.velocity.x = ent.velocity.x * friction;
                this.velocity.y = ent.velocity.y * friction;
                ent.velocity.x = temp.x * friction;
                ent.velocity.y = temp.y * friction;
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
                ent.x += ent.velocity.x * this.game.clockTick;
                ent.y += ent.velocity.y * this.game.clockTick;
                if (this.it) {
                    this.setNotIt1();
                    ent.setIt1();
                }
                else if (ent.it) {
                    this.setIt1();
                    ent.setNotIt1();
                }
            }

            if (ent != this && this.collide1({ x: ent.x, y: ent.y, height: this.width })) {
                var dist = distance(this, ent);
                if (this.it && dist > this.height + ent.height + 10) {
                    var difX = (ent.x - this.x)/dist;
                    var difY = (ent.y - this.y)/dist;
                    this.velocity.x += difX * acceleration / (dist*dist);
                    this.velocity.y += difY * acceleration / (dist * dist);
                    var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                    if (speed > maxSpeed) {
                        var ratio = maxSpeed / speed;
                        this.velocity.x *= ratio;
                        this.velocity.y *= ratio;
                    }
                }
                if (ent.it && dist > this.height + ent.height) {
                    var difX = (ent.x - this.x) / dist;
                    var difY = (ent.y - this.y) / dist;
                    this.velocity.x -= difX * acceleration / (dist * dist);
                    this.velocity.y -= difY * acceleration / (dist * dist);
                    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                    if (speed > maxSpeed) {
                        var ratio = maxSpeed / speed;
                        this.velocity.x *= ratio;
                        this.velocity.y *= ratio;
                    }
                }
            }
        } else {
            collisionDetection(Circle, Rectangle);
        }
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};

Rectangle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.closePath();

};

var friction = 1;
var acceleration = 1000000;
var maxSpeed = 200;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");
ASSET_MANAGER.queueDownload("./img/rectangle.png");

var gameEngine;


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
    var rectangle = new Rectangle(gameEngine);
    circle.setIt();
    rectangle.setIt1();
    gameEngine.addEntity(circle);
    gameEngine.addEntity(rectangle);
    for (var i = 0; i < 12; i++) {
        circle = new Circle(gameEngine);
        rectangle = new Rectangle(gameEngine);
        gameEngine.addEntity(circle);
        gameEngine.addEntity(rectangle);
    }
    gameEngine.init(ctx);
    gameEngine.start();
});

