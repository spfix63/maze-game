function Player(src) 
{
	this.sprite = new Image();
	this.sprite.src = src;
	this.width = this.sprite.width;
	this.height = this.sprite.height;
	
		
	this.bMoving = true;
	this.origin = new Object();
	this.origin.x = 0;
	this.origin.y = 0;
	this.direction = 0;
	this.distance = 0.0;
	this.scale = new Object();
	this.scale.x = 1;
	this.scale.y = 1;
	
	this.speed = 0.0;
	this.maxSpeed = 1;
	this.accel = 0.01;
}

Player.prototype.toJSON = function()
{
	return {x: this.origin.x, y: this.origin.y};
}

Player.prototype.fromJSON = function(obj)
{
	this.origin.x = obj.x;
	this.origin.y = obj.y;
}

Player.prototype.draw = function(context) 
{
	if (this.failedToSetWidth == true)
	{
		this.failedToSetWidth = false;
		this.setWidth(this.width);
	}
	
	context.save();
	var trX, trY, dY;
	if (bMoving)
	{ trX = this.origin.x; trY = this.origin.y; dY = this.distance; }
	else
	{ trX = context.canvas.width/2; trY = context.canvas.height/2; dY = 0; }
	
	context.translate(trX, trY);
	context.rotate(this.direction);
	context.scale(this.scale.x, this.scale.y); 
	context.drawImage(this.sprite, 0 - this.sprite.width/2, dY - this.sprite.height/2);
	context.restore();
};


Player.prototype.setMoving = function(isMoving) 
{
	bMoving = isMoving;
}

Player.prototype.moveLeft = function() 
{
	this.calculatePosition();
	this.direction -= 0.08; 
	if (this.direction < -Math.PI)
		this.direction += Math.PI*2;
};

Player.prototype.moveRight = function() 
{
	this.calculatePosition();
	this.direction += 0.08;
	if (this.direction > Math.PI)
		this.direction -= Math.PI*2;
};

Player.prototype.moveUp = function() 
{
	//this.distance -= this.speed;
	if (this.speed > -this.maxSpeed)
		this.speed -= this.accel;
};

Player.prototype.moveDown = function() 
{
	//this.distance += this.speed/2;
	this.speed += 3*this.accel;
	if (this.speed > 0)
	{
		this.speed = 0;
	}
};

Player.prototype.setWidth = function(w) 
{
	if (this.sprite.complete)
	{
		this.distance *= this.scale.y;
	
		var aspectRatio = this.sprite.width / this.sprite.height;  
		this.width = w;
		this.height = w / aspectRatio;
	
		this.scale.x *= w / this.sprite.width;
		this.scale.y = this.scale.x;
		this.distance /= this.scale.y;
	}
	else
	{
		this.failedToSetWidth = true;
		this.width = w;
	}
};

Player.prototype.setScale = function(x) 
{  
	//this.distance *= this.scale.y;
	this.scale.x = x;
	if (this.sprite.complete)
	{
		this.scale.x = x * this.width / this.sprite.width;
		this.scale.y = this.scale.x;
	}
	//this.distance /= this.scale.y;
};

Player.prototype.setRotation = function(radians)
{
	this.calculatePosition();
	this.direction = radians;
};

Player.prototype.setPosition = function(x, y)
{
	this.calculatePosition();
	this.origin.x = x;
	this.origin.y = y;
};

Player.prototype.calculatePosition = function()
{
	if (this.distance != 0)
	{
		var dy = this.distance/* * this.scale.y*/ * Math.cos(this.direction);
		var dx = this.distance/* * this.scale.y*/ * Math.sin(this.direction);

		this.origin.x -= dx;
		this.origin.y += dy;
		this.distance = 0.0;
	}	
	var ret = new Object();
	ret.x = this.origin.x;
	ret.y = this.origin.y;
	return ret;
};

Player.prototype.update = function()
{
	/*if (Key.isDown(Key.UP)) this.moveUp();
	if (Key.isDown(Key.LEFT)) this.moveLeft();
	if (Key.isDown(Key.DOWN)) this.moveDown();
	if (Key.isDown(Key.RIGHT)) this.moveRight();
	if (Key.isDown(Key.SPACE)) this.setScale(this.scale.x - 0.1);
	if (Key.isDown(Key.SHIFT)) this.setScale(this.scale.x + 0.1);*/
	this.distance += this.speed;
	this.speed *= 0.99;
}