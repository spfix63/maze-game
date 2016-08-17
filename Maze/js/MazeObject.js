function MazeObject(src) 
{
	this.sprite = new Image();
	this.sprite.src = src;
	this.width = this.sprite.width;
	this.height = this.sprite.height;
	
	this.bMoving = true;
	this.origin = new Object();
	this.origin.x = 0;
	this.origin.y = 0;

	this.original = new Object();
	this.original.x = 0;
	this.original.y = 0;
	
	this.direction = 0;
	this.distance = 0.0;
	this.scale = new Object();
	this.scale.x = 1;
	this.scale.y = 1;
}

MazeObject.prototype.toJSON = function()
{
	return {x: this.original.x, y: this.original.y};
}

MazeObject.prototype.fromJSON = function(obj)
{
	this.original.x = obj.x;
	this.original.y = obj.y;
}

MazeObject.prototype.draw = function(context) 
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
	{ trX = this.original.x; trY = this.original.y; dY = 0; }
	
	context.translate(trX, trY);
	context.rotate(this.direction);
	context.scale(this.scale.x, this.scale.y); 
	context.drawImage(this.sprite, 0 - this.sprite.width/2, dY - this.sprite.height/2);
	context.restore();
};


MazeObject.prototype.setMoving = function(isMoving) 
{
	bMoving = isMoving;
}

MazeObject.prototype.moveLeft = function() 
{
	//this.calculatePosition();
	//this.direction -= 0.08; 
	this.original.x -= 0.3;
};

MazeObject.prototype.moveRight = function() 
{
	// this.calculatePosition();
	// this.direction += 0.08;
	this.original.x += 0.3;
};

MazeObject.prototype.moveUp = function() 
{
	// this.distance -= 0.5;
	this.original.y -= 0.3;
};

MazeObject.prototype.moveDown = function() 
{
	// this.distance += 0.2;
	this.original.y += 0.3;
};

MazeObject.prototype.setWidth = function(w) 
{
	if (this.sprite.complete)
	{
		this.distance *= this.scale.y;
	
		var aspectRatio = this.sprite.width / this.sprite.height;  
		this.width = w;
		this.height = w / aspectRatio;
	
		this.scale.x = w / this.sprite.width;
		this.scale.y = this.scale.x;
		this.distance /= this.scale.y;
	}
	else
	{
		this.failedToSetWidth = true;
		this.width = w;
	}
};

MazeObject.prototype.setScale = function(x) 
{  
	this.scale.x = x * this.width / this.sprite.width;
	this.scale.y = this.scale.x;
};

MazeObject.prototype.setRotation = function(radians)
{
	this.calculatePosition();
	this.direction = radians;
};

MazeObject.prototype.setOriginalPosition = function(x, y)
{
	this.original.x = x;
	this.original.y = y;
}

MazeObject.prototype.setPosition = function(x, y)
{
	this.calculatePosition();
	this.origin.x = x;
	this.origin.y = y;
};

MazeObject.prototype.calculatePosition = function()
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
