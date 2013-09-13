// set Animation Frame

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var ballMadness = _ = {};

/* ------------------------------------------------------------------------- */
/* helper functions and vars*/
/* ------------------------------------------------------------------------- */
var timer = 0,
	onInitialScreen = false;
	
	// getting images
	candy = new Image()
	candy.src = './assets/images/candy.png'
	candy.onload = function() {

	}

	truffle = new Image()
	truffle.src = './assets/images/truffle.png'
	truffle.onload = function() {
		
	}

	cookie = new Image()
	cookie.src = './assets/images/cookie.png'
	cookie.onload = function() {
		
	}
_.rand = function(min, max){
	return ~~(Math.random() * (max-min+1) + min);
};


/* ------------------------------------------------------------------------- */
/* createCanvas function */
/* ------------------------------------------------------------------------- */
_.createCanvas = function(){

	// creating the canvas element
	_.canvas = document.createElement('canvas');
	_.cw     = _.canvas.width  = 600;
	_.ch     = _.canvas.height = 400;
	_.ctx    = _.canvas.getContext('2d');

	// append the canvas to the body
	document.body.appendChild( _.canvas );

};


/* ------------------------------------------------------------------------- */
/* creating interface */
/* ------------------------------------------------------------------------- */
	_.createInterface = function(){
		onInitialScreen = true;
		_.ctx.clearRect(0, 0, _.cw, _.ch);
		_.ctx.beginPath();
		_.ctx.arc(300, 200, 50, 0, Math.PI*2, false);
		_.ctx.closePath();
		_.ctx.fill();


		if (_.key.enter) {
			document.getElementById('interface').style.display = 'none';
			onInitialScreen = false;
			cancelAnimationFrame(_.createInterface);
			_.init();
			return false;
		}
		requestAnimationFrame(_.createInterface);
	}


/* ------------------------------------------------------------------------- */
/* creating ending screen */
/* ------------------------------------------------------------------------- */
	_.createEndingScreen = function(){
		_.ctx.clearRect(0, 0, _.cw, _.ch);

		if (_.key.restart) {
			document.getElementById('end').style.display = "none";
			timer = 0;
			_.score.calories = 0;
			document.getElementById('caloriesScore').innerHTML = 0;
			cancelAnimationFrame(_.createEndingScreen);
			_.init();
			return false;
		}
		requestAnimationFrame(_.createEndingScreen);
	}

/* ------------------------------------------------------------------------- */
/* Player Class */
/* ------------------------------------------------------------------------- */
_.Player = function(){};

_.Player.prototype = {
	x: 300,
	y: 200,
	radius: 50,
	vel: 0,
	eaten: 0,
	alive: false,

	render: function(){
		_.ctx.fillStyle = 'hsla(70, 100%, 0%, 1)';
		_.ctx.beginPath();
		_.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		_.ctx.closePath();
		_.ctx.fill();
		this.alive = true;
	},

	update: function(){

		/* Moving */
		/* ----------------------------------------------------------------- */
		// going up
		if (_.key.up){

			if (this.y - this.radius <= 0 || this.y -this.radius - this.vel <= 0){
				this.y = this.radius;
			} else {
				this.y -= this.vel;
			}
		}

		// going down
		if (_.key.down){

			if (this.y + this.radius >= _.ch || this.y + this.radius + this.vel >= _.ch){
				this.y = _.ch - this.radius;
			} else {
				this.y += this.vel;
			}
		}

		// going left
		if (_.key.left){

			if (this.x - this.radius <= 0 || this.x - this.radius - this.vel <=0){
				this.x = this.radius;
			} else{
				this.x -= this.vel;	
			}
		}

		// going right
		if (_.key.right){

			if (this.x + this.radius >= _.cw || this.x + this.radius + this.vel >= _.cw) {
				this.x = _.cw - this.radius;
			} else {
				this.x += this.vel;	
			}
		}

		/* Updating radius */
		/* ----------------------------------------------------------------- */
		this.radius -= .05;
		this.vel = 200 / this.radius;

		// making you die
		if (this.radius <= 0) {
			this.alive = false;
			this.radius = 0;
		}

	},

	radiusUp: function(){
		this.eaten++;
		this.radius += _.food.factor;
	}
};


/* ------------------------------------------------------------------------- */
/* Food */
/* ------------------------------------------------------------------------- */
_.Food = function(type){
 // var oDragonImage = new Image();
 //    oDragonImage.src = 'images/dragon.gif';
 //    oDragonImage.onload = function() {
 //    }


	this.type = type;

	if ( type === 1 ) {
		this.radius = 10;
		this.factor = 3;
		this.score = 3;
		this.image = candy;
	}

	if ( type === 2 ) {
		this.radius = 20;
		this.factor = 2;
		this.score = 2;
		this.image = truffle;
	}

	if ( type === 3 ) {
		this.radius = 30;
		this.factor = 1;
		this.score = 1;
		this.image = cookie;
	}

	
	this.x = _.rand(this.radius, _.cw - this.radius);
	this.y = _.rand(this.radius, _.ch - this.radius);
};

_.Food.prototype = {
	render: function(){
		_.ctx.fillStyle = 'hsla(0, 100%, 50%, 0)';
		_.ctx.beginPath();
		_.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		_.ctx.closePath();
		_.ctx.fill();
		_.ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius);
	}
};


/* ------------------------------------------------------------------------- */
/* create Food */
/* ------------------------------------------------------------------------- */
_.createFood = function(){
	var foodType = _.rand(1, 3);

	_.food = new _.Food( foodType );
}


/* ------------------------------------------------------------------------- */
/* score */
/* ------------------------------------------------------------------------- */
_.Score = function(){
};
_.Score.prototype = {
	calories: 0,
	phrase: "More calories, please!",

	// setting scores for calories, depending on the size of the circle eaten

	updateCalories: function(foodtype){
		calories = this.calories;
		this.calories += foodtype;
		document.getElementById('caloriesScore').innerHTML = this.calories;
	},

	// setting the phrases of scores, depending of how many calories you have
	updatePhrases: function(){
		phrase = this.phrase;
		if (this.calories >= 25 ) {this.phrase = "That was yummy!"};
		if (this.calories >= 50) {this.phrase = "Why is it so good?!"}
		if (this.calories >= 75) {this.phrase = "MORE, I NEED MORE!"}
		if (this.calories >= 100) {this.phrase = "GIMME THAT CANDIES"}
		if (this.calories >= 125) {this.phrase = "DON'T YOU RUN FROM ME, FOOD"}
		if (this.calories >= 150) {this.phrase = "GOTTA EAT THEM ALL"}
		if (this.calories >= 175) {this.phrase = "I SHOULD BE DEAD SOON BUT I DON'T CARE"}
		if (this.calories >= 200) {this.phrase = "I HOPE HEAVEN HAS CANDIES"}
		if (this.calories >= 225) {this.phrase = "WHERE'S THE FOOD, SKYLER"}
		if (this.calories >= 250) {this.phrase = "TOMORROW I STOP, I SWEAR"}
		if (this.calories >= 300) {this.phrase = "IF (FOOD) I EAT(ALOT)"}	
		if (this.calories >= 400) {this.phrase = "I'M A LIVING GOD"}
		document.getElementById('phrases').innerHTML = this.phrase;
	},


};


/* ------------------------------------------------------------------------- */
/* handle Collision */
/* ------------------------------------------------------------------------- */
_.handleCollision = function(){

	var dist = Math.sqrt(
			Math.pow(_.food.x - _.player.x, 2) +
			Math.pow(_.food.y - _.player.y, 2)
		);

	if ( dist < _.food.radius + _.player.radius ) {
		_.player.radiusUp();
		_.createFood();
		_.score.updateCalories(_.food.score)
	}
};


/* ------------------------------------------------------------------------- */
/* handle Factor */
/* ------------------------------------------------------------------------- */
_.handleFactor = function(){
	// if ( _.player.eaten === 5 ) {
	// 	_.player.factor += .001;
	// 	_.player.eaten = 0;
	// }
};


/* ------------------------------------------------------------------------- */
/* key handlers */
/* ------------------------------------------------------------------------- */
_.key = {
	up: false, // 87, 38
	down: false, // 83, 40
	left: false, // 65, 37
	right: false, // 68, 39
	enter: false, // 13
	restart: false // 82
};

_.keyHandler = function(keycode, boo){
	if (keycode === 87 || keycode === 38) {_.key.up = boo}
	if (keycode === 83 || keycode === 40) {_.key.down = boo}
	if (keycode === 65 || keycode === 37) {_.key.left = boo}
	if (keycode === 68 || keycode === 39) {_.key.right = boo}
	if (keycode === 13) {_.key.enter = boo}
	if (keycode === 82) {_.key.restart = boo}
};

window.addEventListener('keydown', function(e){
	_.keyHandler(e.keyCode, true);
});

window.addEventListener('keyup', function(e){
	_.keyHandler(e.keyCode, false);
});


/* ------------------------------------------------------------------------- */
/* _ loop */
/* ------------------------------------------------------------------------- */
_.loop = function(){
	_.ctx.clearRect(0, 0, _.cw, _.ch);

	// player
	_.player.render();
	_.player.update();

	// food
	_.food.render();

	// collision
	_.handleCollision();

	// score
	_.score.updatePhrases();

	// setting how much time you survived
	document.getElementById('timerScore').innerHTML = timer.toFixed(1);

	// making ending screen appear once you die, displaying final scores
	if (!onInitialScreen) {
	if (!_.player.alive) {
		document.getElementById('game').style.display = 'none';
		document.getElementById('end').style.display = 'block';
		document.getElementById('finalTime').innerHTML = timer.toFixed(1);
		document.getElementById('finalCalories').innerHTML = _.score.calories;
		_.createEndingScreen();
		_.gameState = false;
	}
}

_.timer++;
if ( _.timer === 6 ) {
	timer += 0.10;
	_.timer = 0;
}

if (_.gameState) {
requestAnimationFrame(_.loop)
}
};


/* ------------------------------------------------------------------------- */
// /* init function */ Inits the game screen
/* ------------------------------------------------------------------------- */
_.init = function(){
	document.getElementById('game').style.display = 'block';
	_.timer = 0;
	_.gameState = true;
		// player
	_.player = new _.Player();

	// create Food
	_.createFood();

	// score
	_.score = new _.Score();
	// loop
	_.loop();

};

_.createCanvas();
_.createInterface();
