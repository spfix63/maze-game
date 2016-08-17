
movementEnum = 
{
	UP:1,
	DOWN:2,
	LEFT:3,
	RIGHT:4,
}

function Block (x, y, color)
{
	this.width = 1;
	this.height = 1;
	this.x = x;
	this.y = y;
	this.cx = x;
	this.cy = y;
	this.color = color;
	
	Block.prototype.toJSON = function()
	{
		return {x:this.x, y:this.y, c:this.color.substring(1), cx:this.cx, cy:this.cy};
	}
	Block.prototype.fromJSON = function(obj)
	{
		this.x = obj.x;
		this.y = obj.y;
		this.color = "#" + obj.c;
		this.cx = obj.cx;
		this.cy = obj.cy;
	}
}
//wut's this?
Block.width = 0;

Maze.CAR_RED = 1;
Maze.CAR_YELLOW = 2;
Maze.CAR_WHITE = 3;
Maze.LEVEL_KINDERGARDEN = 1;
Maze.LEVEL_CASUAL = 2;
Maze.LEVEL_EASY = 3;
Maze.MODE_TRANSITION = 0;
Maze.MODE_MAP = 1;
Maze.MODE_NORMAL = 2;
Maze.STATE_OVER = 1;
Maze.STATE_GAME = 2;

function Maze(width, heigth, vpWidth, vpHeight, car) 
{
	this.viewport = new Object();
	this.viewport.w = vpWidth;
	this.viewport.h = vpHeight;
	this.totalTime = 0;
	this.holeTimer = -1;
	this.cookiesEaten = 0;
	this.audioEnabled = true;
	this.pauseEnabled = false;
	this.level = 0;
	this.car = car;
	
	this.wallCollisionsEnabled = true;
	this.monsterCollisionsEnabled = true;
	
	this.gameState = Maze.STATE_GAME;
	this.mode = Maze.MODE_NORMAL;
	this.mapAnimation = new Object();
	this.mapAnimation.DISABLED = 0;
	this.mapAnimation.STARTING = 1;
	this.mapAnimation.COMPLETE = 2;
	this.mapAnimation.ENDING = 3;
	this.endAnimation = new Object();
	this.mapSound = document.createElement("audio");
	this.mapSound.src = "res/paper.mp3";
	document.body.appendChild(this.mapSound);
	
	this.holeArray = new Array();
	this.hitSound = new Array(4);
	
	this.hitSound[0] = document.createElement("audio");
	this.hitSound[0].src = "res/hit.mp3";
	document.body.appendChild(this.hitSound[0]);	
		
	this.hitSound[1] = document.createElement("audio");
	this.hitSound[1].src = "res/hit1.mp3";
	document.body.appendChild(this.hitSound[1]);
	
	this.hitSound[2] = document.createElement("audio");
	this.hitSound[2].src = "res/hit2.mp3";
	document.body.appendChild(this.hitSound[2]);
	
	this.hitSound[3] = document.createElement("audio");
	this.hitSound[3].src = "res/hit3.mp3";
	document.body.appendChild(this.hitSound[3]);
	
	this.shadeSound1 = document.createElement("audio");
	this.shadeSound1.src = "res/shade0.mp3";
	document.body.appendChild(this.shadeSound1);
	
	this.shadeSound2 = document.createElement("audio");
	this.shadeSound2.src = "res/shade1.mp3";
	document.body.appendChild(this.shadeSound2);
	
	this.shrinkSound = document.createElement("audio");
	this.shrinkSound.src = "res/shrink.mp3";
	document.body.appendChild(this.shrinkSound);
	
	this.throughSound = document.createElement("audio");
	this.throughSound.src = "res/through.mp3";
	this.throughSound.preload = "auto";
	document.body.appendChild(this.throughSound);
	
	this.horrorSound = document.createElement("audio");
	this.horrorSound.src = "res/horr.mp3";
	this.horrorSound.preload = "auto";
	document.body.appendChild(this.horrorSound);
	
	this.omnomnomSound = document.createElement("audio");
	this.omnomnomSound.src = "res/cms.mp3";
	this.omnomnomSound.preload = "auto";
	document.body.appendChild(this.omnomnomSound);
	
	
	this.mapAnimation.stage = this.mapAnimation.DISABLED;
	this.mapAnimation.timer = 0;
	this.mapAnimation.start = 1;
	this.mapAnimation.parch = new Image();
	this.mapAnimation.parch.src = "res/parch.png";
	
	this.gameScale = 4;
	this.scale = this.gameScale;
	this.mapScale = 1;
	
	this.width = width;
	this.height = heigth;
	this.pathColor = "#FFFFFF";
	this.pathColorH = [255, 255, 255, 255];
	this.wallColor = "#000000";
	this.wallColorH = [0, 0, 0, 0];
	this.color = "#000000";
	
	this.gmaze = new Array(this.width);
	for(var i = 0; i < this.width; i++)
	{
		this.gmaze[i] = new Array(this.height);
	}
    this.initHUD();
}

Maze.prototype.initHUD = function()
{
    this.HUDTimer = new Object();
    this.HUDTimer.rectX = this.viewport.w * 0.80;
    this.HUDTimer.rectY = this.viewport.h * 0.05;    
    this.HUDTimer.rectWdt = this.viewport.w * 0.15;
    this.HUDTimer.rectHgt = this.viewport.h * 0.10;
    
    this.HUDTimer.textWdt = this.viewport.w * 0.81;
    this.HUDTimer.textHgt = this.viewport.h * 0.11;     
    this.HUDTimer.textX = this.HUDTimer.rectX + this.HUDTimer.rectWdt/2;
    this.HUDTimer.textY = this.HUDTimer.rectY + this.HUDTimer.rectHgt/1.7;
    
    this.HUDTimer.fps = 0;
    
    this.HUDCookiePane = new Object();
    this.HUDCookiePane.cookie = new Image();
    this.HUDCookiePane.cookie.src = "res/cookie.png";
    this.HUDCookiePane.cookieCount = 0;
    /*  var aspectRatio = this.HUDCookiePane.cookie.width/this.HUDCookiePane.cookie.height; */
/*     this.HUDCookiePane.cookie.width = 48;
    this.HUDCookiePane.cookie.height = 33; */
    // var aspectRatio = this.HUDCookiePane.cookie.width/this.HUDCookiePane.cookie.height;
    var aspectRatio = 48/33;
    
    this.HUDCookiePane.rectX = this.viewport.w * 0.70;
    this.HUDCookiePane.rectY = this.viewport.h * 0.05;    
    this.HUDCookiePane.rectWdt = this.viewport.w * 0.10;
    this.HUDCookiePane.rectHgt = this.viewport.h * 0.10;
    
    this.HUDCookiePane.cookieY = this.HUDCookiePane.rectY + 5;
    this.HUDCookiePane.cookieX = this.HUDCookiePane.rectX + 5;
    this.HUDCookiePane.cookieWdt = this.HUDCookiePane.rectWdt*0.5 ;
    this.HUDCookiePane.cookieHgt = this.HUDCookiePane.cookieWdt/aspectRatio ; 
    
    this.HUDCookiePane.textX = this.HUDCookiePane.cookieX +this.HUDCookiePane.cookieWdt + 10;
    this.HUDCookiePane.textY = this.HUDTimer.textY;
        
    this.HUDBtnPane = new Object();
    this.HUDBtnPane.restartBtn = new Image();
    this.HUDBtnPane.restartBtn.src = "res/Restart.png";
    
    this.HUDBtnPane.pauseBtn = new Image();
    this.HUDBtnPane.pauseBtn.src = "res/Pause.png"; 
    
    this.HUDBtnPane.playBtn = new Image();
    this.HUDBtnPane.playBtn.src = "res/Play.png";
    
    this.HUDBtnPane.soundOnBtn = new Image();
    this.HUDBtnPane.soundOnBtn.src = "res/soundOnw.png";
    
    this.HUDBtnPane.soundOffBtn = new Image();
    this.HUDBtnPane.soundOffBtn.src = "res/soundOffw.png";

    this.HUDBtnPane.gameBtn = this.HUDBtnPane.pauseBtn;
    this.HUDBtnPane.soundBtn = this.HUDBtnPane.soundOnBtn;
    
    
    this.HUDBtnPane.rectX = this.viewport.w * 0.90;
    this.HUDBtnPane.rectY = this.viewport.h * 0.70;    
    this.HUDBtnPane.rectWdt = this.viewport.w * 0.05;
    this.HUDBtnPane.rectHgt = this.viewport.h * 0.22;
    
    this.HUDBtnPane.btnX = this.HUDBtnPane.rectX + 10;

    

    this.HUDBtnPane.restartBtnY = this.HUDBtnPane.rectY + 10;
    this.HUDBtnPane.gameBtnY = this.HUDBtnPane.rectY + 35;
    this.HUDBtnPane.soundBtnY = this.HUDBtnPane.rectY + 60;
    
    this.HUDBtnPane.btnWdt = this.HUDBtnPane.rectWdt * 0.5;
    this.HUDBtnPane.btnHgt = this.HUDBtnPane.rectWdt * 0.5;  
	
    
}

Maze.prototype.makePlayer = function(car)
{
	var p;
	switch (car)
	{
		case Maze.CAR_RED:
			p = new Player("res/reds.png");
			this.usePower = this.startZoomer;
			this.updatePower = this.updateZoomer;
			break;
		case Maze.CAR_WHITE:
			p = new Player("res/whites.png");
			this.usePower = this.startGhostRealm;
			this.updatePower = this.updateGhostRealm;			
			break;
		case Maze.CAR_YELLOW:
			p = new Player("res/yellows.png");
			this.usePower = this.startWallhack;
			this.updatePower = this.updateWallhack;	
			break;
	}
	return p;
}

Maze.prototype.setup = function(color, level)
{
	this.level = level;
	
	this.stopSound();
	
	switch(level)
	{
		case Maze.LEVEL_KINDERGARDEN :
			this.cookieCount = 7;
			this.cmCount = 7;
			this.holeTime = 2000; 
			break;
		
		case Maze.LEVEL_CASUAL :
			this.cookieCount = 11;
			this.cmCount = 11;
			this.holeTime = 1300;
			break;
		
		case Maze.LEVEL_EASY:
			this.cookieCount = 15;
			this.cmCount = 15;
			this.holeTime = 700;
			break;
	}
	
	this.player = this.makePlayer(this.car);
	this.playerWidth = 3;
	this.player.setWidth(this.playerWidth);
	this.player.setMoving(false);
    this.player.score = 0;
	this.currPos = this.player.calculatePosition();
	this.player.setScale(this.scale);
	
	
	var red = parseInt(color[1] + color[2], 16);
	var green = parseInt(color[3] + color[4], 16);
	var blue = parseInt(color[5] + color[6], 16);
	this.pathColor = color;
	this.wallColor = "#202020";
	this.wallColorH = [32, 32, 32, 255];
	if ((red + green + blue) / 3 < (255/6))
	{
		this.wallColor = "#CCCCCC";
		this.wallColorH = [204, 204, 204, 255];
	}
	this.pathColorH = [red, green, blue, 255];
}

Maze.prototype.setupItems = function()
{
	this.player.setRotation(Math.PI);
	var bw = this.viewport.w / this.width;
	Block.width = bw;
	//var bw = 10; //blockWidth
	this.player.setPosition(5*bw, 4*bw);
	this.currPos = this.player.calculatePosition();
	this.mazeCanvas = document.createElement("canvas");
	this.currentCanvas = this.mazeCanvas;
	this.mazeCanvas.width = this.width * bw;
	this.mazeCanvas.height = this.height * bw;
	var context = this.mazeCanvas.getContext("2d");
	var x = 0;
	for (var i = 0; i < this.width; i++, x += bw)
	{
		// var y = -context.canvas.height / 2;
		var y = 0;
		for (var j = 0; j < this.height; j++, y += bw)
		{
			context.fillStyle = this.gmaze[i][j].color;
			context.fillRect(x, y, bw, bw);
		}
	}
	//this.mazeCanvasData = context.getImageData(0, 0, this.mazeCanvas.width, this.mazeCanvas.height);
	
	bw = this.viewport.w / this.width; //blockWidth
	this.ghostCanvas = document.createElement("canvas");
	this.ghostCanvas.width = this.width * bw;
	this.ghostCanvas.height = this.height * bw;
	context = this.ghostCanvas.getContext("2d");
	x = 0.5;
	for (var i = 0; i < this.width; i++, x += bw)
	{
		var y = 0.5;
		for (var j = 0; j < this.height; j++, y += bw)
		{
			context.fillStyle = this.gmaze[i][j].color;
			context.fillRect(x, y, bw, bw);
		}
	}
	
	this.cookies = new Array(this.cookieCount);
	for (var i = 0; i < this.cookies.length; i++)
	{
		this.cookies[i] = new MazeObject("res/ckie.png");
		this.cookies[i].setMoving(false);
		this.cookies[i].setOriginalPosition(Math.floor(Math.random()*this.viewport.w), Math.floor(Math.random()*this.viewport.h));
		this.cookies[i].setPosition(this.cookies[i].original.x, this.cookies[i].original.y);
		this.cookies[i].trueOriginal = new Object();
		this.cookies[i].trueOriginal.x = this.cookies[i].original.x;
		this.cookies[i].trueOriginal.y = this.cookies[i].original.y;
		this.cookies[i].setWidth(15);
		
		var cx = Math.floor(this.cookies[i].original.x / Block.width);
		var cy = Math.floor(this.cookies[i].original.y / Block.width);
		if (this.gmaze[cx][cy].color != this.pathColor)
		{
			var dirx = 1, diry = 1;
			if (cx > this.width/2)
				dirx = -1;
			if (cy > this.height/2)
				diry = -1;
			while (this.gmaze[cx][cy].color != this.pathColor)
			{
				cx += dirx; cy += diry;
			}
		}
		cx = this.gmaze[cx][cy].cx;
		cy = this.gmaze[cx][cy].cy;
		this.cookies[i].setOriginalPosition(cx * Block.width, cy * Block.width);
		this.cookies[i].setPosition(this.cookies[i].original.x, this.cookies[i].original.y);
	}
	
	this.cms = new Array(this.cmCount);
	for (var i = 0; i < this.cms.length; i++)
	{
		this.cms[i] = new MazeObject("res/cm.png");
		this.cms[i].setMoving(false);
		this.cms[i].setOriginalPosition(Math.floor(Math.random()*this.viewport.w), Math.floor(Math.random()*this.viewport.h));
		this.cms[i].setPosition(this.cms[i].original.x, this.cms[i].original.y);
		this.cms[i].trueOriginal = new Object();
		this.cms[i].trueOriginal.x = this.cms[i].original.x;
		this.cms[i].trueOriginal.y = this.cms[i].original.y;
		this.cms[i].setWidth(Math.floor(Math.random()*13)+2);
		this.cms[i].hasDestination = false;
		
		var cx = Math.floor(this.cms[i].original.x / Block.width);
		var cy = Math.floor(this.cms[i].original.y / Block.width);
		if (this.gmaze[cx][cy].color != this.pathColor)
		{
			var dirx = 1, diry = 1;
			if (cx > this.width/2)
				dirx = -1;
			if (cy > this.height/2)
				diry = -1;
			while (this.gmaze[cx][cy].color != this.pathColor)
			{
				cx += dirx; cy += diry;
			}
		}
		cx = this.gmaze[cx][cy].cx;
		cy = this.gmaze[cx][cy].cy;
		this.cms[i].setOriginalPosition(cx * Block.width, cy * Block.width);
		this.cms[i].setPosition(this.cms[i].original.x, this.cms[i].original.y);
	}
}

Maze.prototype.setupMaze = function(color, level)
{
	this.setup(color, level);
	this.setupItems();
}

Maze.prototype.generateMaze = function(startPoint, endPoint, color, level)
{	
	/*var red = (255 - parseInt(color[1] + color[2], 16)).toString(16);
	if (red.length == 1) red = "0"+red;
	var green = (255 - parseInt(color[3] + color[4], 16)).toString(16);
	if (green.length == 1) green = "0"+green;
	var blue = (255 - parseInt(color[5] + color[6], 16)).toString(16);
	if (blue.length == 1) blue = "0"+blue;*/
	this.setup(color, level);
	
	this.generateWalls();
	this.generateTruePath(startPoint, endPoint);
	//this.generateDummyPaths(startPoint);
	this.setupItems();
}

Maze.prototype.generateWalls = function()
{             
	var block;
	for (var i = 0; i < this.width; i++)
	{
		for (var j = 0; j < this.height; j++)
		{
			block = new Block(i, j, this.wallColor);
			this.gmaze[i][j] = block;
		}
	}	
}

Maze.prototype.generateTruePath = function()
{
	var randomDirection;
	var cellCenterArray = [];
	var noPath = false;
	/*
	***x***|***x***
	*******|*******
	*******|*******
	x**x**x|x**x**x
	*******|*******
	*******|*******
	***x***|***x***
	
	*/
	// draw first cell
	var b = new Block(5, 4);
	/*this.gmaze[1][0].color = this.pathColor;
	this.gmaze[2][0].color = this.pathColor;
	this.gmaze[3][0].color = this.pathColor;
	
	this.gmaze[1][1].color = this.pathColor;
	this.gmaze[2][1].color = this.pathColor;
	this.gmaze[3][1].color = this.pathColor;
	
	this.gmaze[1][2].color = this.pathColor;
	this.gmaze[2][2].color = this.pathColor;
	this.gmaze[3][2].color = this.pathColor;
	
	this.gmaze[1][3].color = this.pathColor;
	this.gmaze[2][3].color = this.pathColor;
	this.gmaze[3][3].color = this.pathColor;*/
	var DC = 7; //distanceToCenter
	var DW = 3; //distanceToOwnWall
	var DNW = 4; //distanceToNeighborWall
	
	this.addCenter(b);
	var neighbourCenter = b;
	var currentPoint = neighbourCenter;
	var neighbourWall;
	var cellWall;
	
	var neighbours = [movementEnum.DOWN, movementEnum.RIGHT];
	
	while(!noPath)
	{
		randomDirection = Math.floor(Math.random()*neighbours.length);
		var neigh = neighbours[randomDirection];
		switch(neigh)
		{
			case movementEnum.UP:
				neighbourCenter	= new Block(currentPoint.x, currentPoint.y-DC);		
				neighbourWall = new Block(currentPoint.x, currentPoint.y-DNW);
				cellWall = new Block(currentPoint.x, currentPoint.y-DW);
				break;
				
			case movementEnum.DOWN:
				neighbourCenter = new Block(currentPoint.x, currentPoint.y+DC);	
				neighbourWall = new Block(currentPoint.x, currentPoint.y+DNW);
				cellWall = new Block(currentPoint.x, currentPoint.y+DW);
				break;
				
			case movementEnum.LEFT:		
				neighbourCenter	= new Block(currentPoint.x-DC, currentPoint.y);	
				neighbourWall = new Block(currentPoint.x-DNW, currentPoint.y);
				cellWall = new Block(currentPoint.x-DW, currentPoint.y);
				break;
				
			case movementEnum.RIGHT:
				neighbourCenter	= new Block(currentPoint.x+DC, currentPoint.y);
				neighbourWall = new Block(currentPoint.x+DNW, currentPoint.y);
				cellWall = new Block(currentPoint.x+DW, currentPoint.y);		
				break;
			
			default:
				break;
		}
		neighbourWall.cx = neighbourCenter.x;
		neighbourWall.cy = neighbourCenter.y;
		cellWall.cx = currentPoint.x;
		cellWall.cy = currentPoint.y;
		if (this.validateMovement(neighbourCenter.x, neighbourCenter.y))
		{
			if (this.cellNotConnected(neighbourCenter))
			{
			
				/*this.addBlock(neighbourCenter, this.pathColor);
				this.addBlock(neighbourWall, this.pathColor);
				this.addBlock(cellWall, this.pathColor);*/
				this.addCenter(neighbourWall, this.pathColor);
				this.addCenter(cellWall, this.pathColor);
				this.addCenter(neighbourCenter, this.pathColor);
				
				/*if ((neigh == movementEnum.RIGHT) || (neigh == movementEnum.LEFT))
				{
					this.addHorWall(neighbourWall, this.pathColor);
					this.addHorWall(cellWall, this.pathColor);
				}
				else
				{
					this.addVerWall(neighbourWall, this.pathColor);
					this.addVerWall(cellWall, this.pathColor);
				}*/
				
				cellCenterArray.push(neighbourCenter);	
				currentPoint = neighbourCenter;
			}			
		}
		neighbours = this.getNeighbours(currentPoint);
		if (neighbours[0] == -1)
		{
			if (cellCenterArray.length != 0)
			{
				currentPoint = cellCenterArray.pop();
			}
			else
			{
				noPath = true;
			}
		}
	} 
	
}

Maze.prototype.getNeighbours = function(block)
{
	var ret = [];
	var DC = 7; //distanceToCenter
	if (this.validateMovement(block.x+DC, block.y) && this.cellNotConnected(block))
	{
		ret.push(movementEnum.RIGHT);
	}
	if (this.validateMovement(block.x-DC, block.y) && this.cellNotConnected(block))
	{
		ret.push(movementEnum.LEFT);
	}
	if (this.validateMovement(block.x, block.y+DC) && this.cellNotConnected(block))
	{
		ret.push(movementEnum.DOWN);
	}
	if (this.validateMovement(block.x, block.y-DC) && this.cellNotConnected(block))
	{
		ret.push(movementEnum.UP);
	}
	if (ret.length == 0)
	{
		ret.push(-1);
	}
	return ret;
}

Maze.prototype.cellNotConnected = function(block)
{
	var DW = 3; //distanceToOwnWall
	var DNW = 4; //distanceToNeighborWall
	var ret = true;
	if ((block.x-DNW >= 0) && 
		(this.gmaze[block.x-DW][block.y].color == this.colorPath) &&
		(this.gmaze[block.x-DNW][block.y].color == this.colorPath))
		ret = false;
	if ((block.y-DNW >= 0) && 
		(this.gmaze[block.x][block.y-DW].color == this.colorPath) && 
		(this.gmaze[block.x][block.y-DNW].color == this.colorPath))
		ret = false;
	if ((block.x+DNW < this.width) && 
		(this.gmaze[block.x+DW][block.y].color == this.colorPath) && 
		(this.gmaze[block.x+DNW][block.y].color == this.colorPath))
		ret = false;
	
	if ((block.y+DNW < this.height) && 
		(this.gmaze[block.x][block.y+DW].color == this.colorPath) && 
		(this.gmaze[block.x][block.y+DNW].color == this.colorPath))
		ret = false;
	
	/*
	if (((this.gmaze[block.x+DW][block.y].color == this.colorPath) && (this.gmaze[block.x+DNW][block.y].color == this.colorPath)) ||
		((this.gmaze[block.x-DW][block.y].color == this.colorPath) && (this.gmaze[block.x-DNW][block.y].color == this.colorPath)) ||
		((this.gmaze[block.x][block.y-DW].color == this.colorPath) && (this.gmaze[block.x][block.y-DNW].color == this.colorPath)) ||
		((this.gmaze[block.x][block.y+DW].color == this.colorPath) && (this.gmaze[block.x][block.y+DNW].color == this.colorPath)))
	{
		ret = false;
	}
	else 
	{
		ret = true;
	}*/
	return ret;
}


Maze.prototype.addCenter = function(block, color)
{
	if (typeof this.addCenter.matrix == "undefined") {
		this.addCenter.matrix = [
			[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],
			[-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],
			[-2, 0],[-1, 0],[0, 0],[1, 0],[2, 0],
			[-2, 1],[-1, 1],[0, 1],[1, 1],[2, 1],
			[-2, 2],[-1, 2],[0, 2],[1, 2],[2, 2]
		];
	}
	for (var i = 0, mas = this.addCenter.matrix; 
		i < this.addCenter.matrix.length;
		i++)
	{
		this.gmaze[block.x+mas[i][0]][block.y+mas[i][1]] = block;
		this.gmaze[block.x+mas[i][0]][block.y+mas[i][1]].color = color;
	}
	
}
/*
Maze.prototype.addHorWall = function(block, color)
{
	this.gmaze[block.x-1][block.y] = block;
	this.gmaze[block.x-1][block.y].color = color;
	this.gmaze[block.x][block.y] = block;
	this.gmaze[block.x][block.y].color = color;
	this.gmaze[block.x+1][block.y] = block;
	this.gmaze[block.x+1][block.y].color = color;
}

Maze.prototype.addVerWall = function(block, color)
{
	this.gmaze[block.x][block.y-1] = block;
	this.gmaze[block.x][block.y-1].color = color;
	this.gmaze[block.x][block.y] = block;
	this.gmaze[block.x][block.y].color = color;
	this.gmaze[block.x][block.y+1] = block;
	this.gmaze[block.x][block.y+1].color = color;
}*/

/*Maze.prototype.addBlock = function(block, color)
{
	this.gmaze[block.x][block.y] = block;
	this.gmaze[block.x][block.y].color = color;
}*/


Maze.prototype.validateMovement = function(x, y)
{
	var ret;
	
	if ((x < 0) || (x >= this.width - 1) || 
		(y < 0) || (y >= this.height - 1))
	{
		ret = false;
	}
	else if ((this.gmaze[x][y].color == this.pathColor))
	{
		ret = false;
	}
	else
	{
		ret = true;
	}
	return ret;
}

Maze.prototype.draw = function(context)
{
	if (this.gameState == Maze.STATE_OVER)
		return;
	if (this.mapAnimation.stage == this.mapAnimation.DISABLED)
	{
		var cw = context.canvas.width;
		var ch = context.canvas.height;
		/*this.drawMaze(context, 0, 0, cw, ch, this.scale, pos.x, pos.y, 0, 0, 1, 1);
		this.player.draw(context);
		
		for (var i = 0; i < this.cookies.length; i++)
		{
			this.cookies[i].draw(context);
		}*/
		context.save();
		context.translate(cw / 2, ch / 2);	//originali masiniuko pozicija
		context.scale(this.scale, this.scale);
		context.drawImage(this.currentCanvas, -this.currPos.x, -this.currPos.y);
		context.translate(-this.currPos.x, -this.currPos.y);
		for (var i = 0; i < this.cookies.length; i++)
		{
			this.cookies[i].draw(context);
		}
		if (this.monsterCollisionsEnabled)
			for (var i = 0; i < this.cms.length; i++)
			{
				this.cms[i].draw(context);
			}
		context.restore();
		
		
		this.player.draw(context);
        this.drawHUD(context);
		
	}
	else 
		this.drawMapAnim(context)
}

Maze.prototype.drawHUD = function(context)
{
    this.drawHUDTimer(context);    
    
    this.drawHUDButtons(context);
    
    this.HUDCookiePane.cookieCount = this.cookies.length;
    context.fillStyle="#FFFFFF";
    context.roundRect(this.HUDCookiePane.rectX, this.HUDCookiePane.rectY, 
        this.HUDCookiePane.rectWdt, this.HUDCookiePane.rectHgt, 
        {upperLeft:10,upperRight:10,lowerLeft:10,lowerRight:10},
        true);
    
    context.fillStyle="#000000";
    context.drawImage(this.HUDCookiePane.cookie, this.HUDCookiePane.cookieX ,
        this.HUDCookiePane.cookieY, this.HUDCookiePane.cookieWdt, this.HUDCookiePane.cookieHgt);
    context.fillText(": "+ this.HUDCookiePane.cookieCount,  this.HUDCookiePane.textX, this.HUDCookiePane.textY);
    // context.fillText(": "+ this.cookiesEaten,  this.HUDCookiePane.textX, this.HUDCookiePane.textY);
}
Maze.prototype.drawHUDButtons = function(context)
{
    context.fillStyle="#FFFFFF";
    context.roundRect(this.HUDBtnPane.rectX, this.HUDBtnPane.rectY, 
        this.HUDBtnPane.rectWdt, this.HUDBtnPane.rectHgt, 
        {upperLeft:10,upperRight:10,lowerLeft:10,lowerRight:10},
        true);
    
    context.drawImage(this.HUDBtnPane.restartBtn, this.HUDBtnPane.btnX ,
        this.HUDBtnPane.restartBtnY, this.HUDBtnPane.btnWdt, this.HUDBtnPane.btnHgt);
    context.drawImage(this.HUDBtnPane.gameBtn, this.HUDBtnPane.btnX ,
        this.HUDBtnPane.gameBtnY, this.HUDBtnPane.btnWdt, this.HUDBtnPane.btnHgt);

    context.drawImage(this.HUDBtnPane.soundBtn, this.HUDBtnPane.btnX ,
        this.HUDBtnPane.soundBtnY, this.HUDBtnPane.btnWdt, this.HUDBtnPane.btnHgt);
} 

Maze.prototype.drawHUDTimer = function(context)
{   
    context.fillStyle="#FFFFFF";
    context.roundRect(this.HUDTimer.rectX, this.HUDTimer.rectY, 
        this.HUDTimer.rectWdt, this.HUDTimer.rectHgt, 
        {upperLeft:10,upperRight:10,lowerLeft:10,lowerRight:10},
        true);
    
    var secs = (this.totalTime/1000).toFixed(1);
    
    context.font="13pt Times New Roman";
    context.fillStyle="#000000";
    context.textAlign = "center";
	if (this.usePower.enabled == true)
	{
		context.fillText("Power:"+this.usePower.time,  this.HUDTimer.textX, this.HUDTimer.textY);
	}
    // context.fillText("fps:"+this.HUDTimer.fps,  this.HUDTimer.textX, this.HUDTimer.textY);
	else
	{
		context.fillText("Time:"+secs,  this.HUDTimer.textX, this.HUDTimer.textY);
	}
}
/** 
 * Draws a rounded rectangle using the current state of the canvas.  
 * If you omit the last three params, it will draw a rectangle  
 * outline with a 5 pixel border radius  
 * @param {Number} x The top left x coordinate 
 * @param {Number} y The top left y coordinate  
 * @param {Number} width The width of the rectangle  
 * @param {Number} height The height of the rectangle 
 * @param {Object} radius All corner radii. Defaults to 0,0,0,0; 
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false. 
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true. 
 */
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
    var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "object") {
        for (var side in radius) {
            cornerRadius[side] = radius[side];
        }
    }
    
    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
} 
Maze.prototype.drawMapAnim = function(context)
{
	var cw = context.canvas.width;
	var ch = context.canvas.height;
	if (this.mapAnimation.stage == this.mapAnimation.STARTING)
	{
		var cutX = this.mapAnimation.timer/(this.mapAnimation.start*2);
		this.drawMaze(context, 0, 0, cw, ch, 1, cw/2, ch/2, cutX, 0, 1 - cutX*2, 1);
		context.drawImage(this.mapAnimation.parch, cutX*cw-this.mapAnimation.parch.width/2, -this.mapAnimation.parch.width/8, 
			this.mapAnimation.parch.width, this.mapAnimation.parch.height*1.1);
		context.drawImage(this.mapAnimation.parch, (1-cutX)*cw-this.mapAnimation.parch.width/2, -this.mapAnimation.parch.width/8, 
			this.mapAnimation.parch.width, this.mapAnimation.parch.height*1.1);
	}
	else if (this.mapAnimation.stage == this.mapAnimation.COMPLETE)
	{
		var pos = this.currPos;
		this.drawMaze(context, 0, 0, cw, ch, 1, cw/2, ch/2, 0, 0, 1, 1);
		this.player.draw(context);
		context.drawImage(this.mapAnimation.parch, -this.mapAnimation.parch.width/2, -this.mapAnimation.parch.width/8, 
			this.mapAnimation.parch.width, this.mapAnimation.parch.height*1.1);
		context.drawImage(this.mapAnimation.parch, cw-this.mapAnimation.parch.width/2, -this.mapAnimation.parch.width/8, 
			this.mapAnimation.parch.width, this.mapAnimation.parch.height*1.1);
		context.beginPath();
		context.strokeStyle = this.wallColor;
		context.arc(pos.x, pos.y, this.playerWidth*3, 0, 2*Math.PI);
		for (var i = 0; i < this.cookies.length; i++)
		{
			this.cookies[i].draw(context);
		}
		
		for (var i = 0; i < this.cms.length; i++)
		{
			this.cms[i].draw(context);
		}
		context.stroke();
	}
	else if (this.mapAnimation.stage == this.mapAnimation.ENDING)
	{
		var completion = 1 - this.mapAnimation.timer/this.mapAnimation.start;
		var pos = this.currPos;
		var newScale = this.mapScale + (this.scale - this.mapScale)*completion;
		var focusX = cw/2 + (pos.x - cw/2)*completion;
		var focusY = ch/2 + (pos.y - ch/2)*completion;
		this.drawMaze(context, 0, 0, cw, ch, newScale, focusX, focusY, 0, 0, 1, 1);
	}
}

//context.save();
// translate context to center of canvas
//context.translate(cw / 2, ch / 2);	//originali masiniuko pozicija
//context.scale(this.scale, this.scale);
//context.drawImage(this.mazeCanvas, -pos.x, -pos.y);
//context.restore();

//doesn't work that well. im sizes in multiples (0.5 etc)
Maze.prototype.drawMaze = function(context, cx, cy, cw, ch, scale, fx, fy, imx, imy, imw, imh)
{
	var image = this.currentCanvas;
	var w = imw * image.width;
	var h = imh * image.height;
	var x = imx * image.width;
	var y = imy * image.height;
	context.drawImage(image, x, y, w, h,
		cw*imx + cx - scale * fx + cw / 2, ch*imy + cy - scale * fy + ch / 2, (scale * cw)*imw, (scale * ch)*imh);
}
Maze.prototype.mouseup = function(mouseX, mouseY)
{
    if ((mouseX < (this.HUDBtnPane.btnX + this.HUDBtnPane.btnWdt)) && 
        (mouseX > this.HUDBtnPane.btnX) && (mouseY > this.HUDBtnPane.gameBtnY) && 
        (mouseY < (this.HUDBtnPane.gameBtnY + this.HUDBtnPane.btnHgt)))
    {
        
        if (this.pauseEnabled == true)
        {
			this.pauseEnabled = false;
            this.HUDBtnPane.gameBtn = this.HUDBtnPane.pauseBtn; 
        }
        else
        {
			this.pauseEnabled = true;
            this.HUDBtnPane.gameBtn = this.HUDBtnPane.playBtn;
        } 
    }
    else if ((mouseX < (this.HUDBtnPane.btnX + this.HUDBtnPane.btnWdt)) && 
        (mouseX > this.HUDBtnPane.btnX) && (mouseY > this.HUDBtnPane.restartBtnY) && 
        (mouseY < (this.HUDBtnPane.restartBtnY + this.HUDBtnPane.btnHgt)))
    {
		this.totalTime = 0;
        this.generateMaze(0, 0, this.pathColor, this.level, 0);
    }
    else if ((mouseX < (this.HUDBtnPane.btnX + this.HUDBtnPane.btnWdt)) && 
        (mouseX > this.HUDBtnPane.btnX) && (mouseY > this.HUDBtnPane.soundBtnY) && 
        (mouseY < (this.HUDBtnPane.soundBtnY + this.HUDBtnPane.btnHgt)))
    {
		if (this.audioEnabled)
        {
			this.audioEnabled = false;
			this.horrorSound.volume = 0;
			this.mapSound.volume = 0;
			this.shadeSound1.volume = 0;
			this.shadeSound2.volume = 0;
			this.shrinkSound.volume = 0;
			this.throughSound.volume = 0;
			this.omnomnomSound.volume = 0;
            this.HUDBtnPane.soundBtn = this.HUDBtnPane.soundOffBtn; 
        }
        else
        {
			this.audioEnabled = true;
			this.horrorSound.volume = 1;
			this.mapSound.volume = 1;
			this.shadeSound1.volume = 1;
			this.shadeSound2.volume = 1;
			this.shrinkSound.volume = 1;
			this.throughSound.volume = 1;
			this.omnomnomSound.volume = 1;
            this.HUDBtnPane.soundBtn = this.HUDBtnPane.soundOnBtn;
        } 
    }
}

Maze.prototype.update = function(dt)
{
	if (this.gameState == Maze.STATE_OVER || this.pauseEnabled == true)
		return;
	this.totalTime += dt;
    this.HUDTimer.fps = dt;
	if (this.mode == Maze.MODE_NORMAL)
	{
		if (Key.consumeIsDown(Key.M)) this.beginMapAnimation();
		if (Key.isDown(Key.D)) this.player.moveRight();
		if (Key.isDown(Key.A)) this.player.moveLeft();
		if (Key.isDown(Key.S)) this.player.moveDown();
		if (Key.isDown(Key.W)) this.player.moveUp();
		if (Key.isDown(Key.F)) this.usePower();
		this.player.update();
		if (this.usePower.enabled == true)
			this.updatePower(dt);
		
		
		if (Key.isDown(Key.Q)) 
		{	
			if (this.scale > 3)
			{
				this.scale -= 0.01 * this.scale;
				if (this.startZoomer.enabled == true)
				{
					this.player.scale.x *= 0.99;
					this.player.scale.y *= 0.99;
				}
				else
					this.player.setScale(this.scale);
			}
		}
		if (Key.isDown(Key.E)) 
		{
			if (this.scale < 7)
			{
				this.scale += 0.01 * this.scale;
				if (this.startZoomer.enabled == true)
					{
						this.player.scale.x *= 1.01;
						this.player.scale.y *= 1.01;
					}
				else
					this.player.setScale(this.scale);
			}
		}
		if (this.holeTimer < 0)
		{
			this.drawHoles(1);
			this.holeTimer = this.holeTime;
		}
		else
			this.holeTimer -= dt;
		
		
		this.checkCookieCollisions();
		if (this.monsterCollisionsEnabled)
			this.checkMonsterCollisions();
		
		var pos = this.currPos;
		this.currPos = this.player.calculatePosition();
		if (this.wallCollisionsEnabled && this.checkCollisions())
		{	
			if (this.audioEnabled && this.collision == false)
			{
				var rand = Math.floor(Math.random()*this.hitSound.length);
				this.collision = true;
				this.hitSound[rand].play();
			}
			var carX = Math.floor(pos.x/Block.width);
			var wallX = Math.floor(this.currPos.x/Block.width);
			var carY = Math.floor(pos.y/Block.width);
			var wallY = Math.floor(this.currPos.y/Block.width);
			
			if ((this.gmaze[wallX - 1][wallY].color != this.pathColor) &&
				(this.gmaze[wallX + 1][wallY].color != this.pathColor))
				this.currPos.y = pos.y;
			if ((this.gmaze[wallX][wallY + 1].color != this.pathColor) &&
				(this.gmaze[wallX][wallY - 1].color != this.pathColor))
				this.currPos.x = pos.x;
			if ((this.currPos.x != pos.x) && (this.currPos.y != pos.y))
			{
				if ((this.gmaze[carX - 1][carY].color == this.pathColor) &&
					(this.gmaze[carX + 1][carY].color == this.pathColor))
					this.currPos.y = pos.y;
				if ((this.gmaze[carX][carY + 1].color == this.pathColor) &&
					(this.gmaze[carX][carY - 1].color == this.pathColor))
					this.currPos.x = pos.x;
			}
			//this.currPos = pos;
			this.player.setPosition(this.currPos.x, this.currPos.y);
			this.player.speed *= 0.98;
		}
		else
		{
			this.collision = false;
		}
			
		if (this.checkHoles(this.currPos.x, this.currPos.y))
		{
			alert("Holey moley");
			this.gameState = Maze.STATE_OVER;
		}
		
		this.updateMonsters();
	}
	else if (this.mode == Maze.MODE_MAP) 
	{
		if (Key.consumeIsDown(Key.M)) this.endMapAnimation();
	}
}


Maze.prototype.updateMonsters = function()
{
	var x = this.currPos.x;
	var y = this.currPos.y;
	for (var i = 0; i < this.cms.length; i++)
	{
		if (!this.cms[i].hasDestination)
		{
			var DC = 7;
			var DW = 3;
			var darr = [];
			var ox = this.cms[i].original.x;
			var yx = this.cms[i].original.y;
			var cx = Math.floor(this.cms[i].original.x / Block.width);
			var cy = Math.floor(this.cms[i].original.y / Block.width);
			cx = this.gmaze[cx][cy].cx;
			cy = this.gmaze[cx][cy].cy;
			var lx = cx; var ly = cy;
			var rx = cx; var ry = cy;
			var ux = cx; var uy = cy;
			var dx = cx; var dy = cy;
			if ((lx - DW < 0) || (this.gmaze[lx - DW][ly].color != this.pathColor))
				lx = -1;
			else
				lx -= DC;
			if ((rx + DW >= this.width) || (this.gmaze[rx + DW][ly].color != this.pathColor))
				rx = -1;
			else
				rx += DC;
			if ((uy - DW < 0) || (this.gmaze[ux][uy - DW].color != this.pathColor))
				uy = -1;
			else
				uy -= DC;
			if ((dy + DW >= this.height) || (this.gmaze[dx][dy + DW].color != this.pathColor))
				dy = -1;
			else
				dy += DC;
			while (lx + rx + uy + dy != -4)
			{
				if (lx != -1) 
				{
					if ((lx < 0) || (lx >= this.width))
						lx = -1;
					else if (((lx - DW >= 0) && (this.gmaze[lx - DW][ly].color != this.pathColor)) ||
						((ly + DW < this.height) && (this.gmaze[lx][ly + DW].color == this.pathColor)) || 
						((ly - DW >= 0) && (this.gmaze[lx][ly - DW].color == this.pathColor)))
					{
						darr.push({x: lx, y: ly, dir: movementEnum.LEFT});
						lx = -1;
					}
					else
						lx -= DC;
				}
					
				if (rx != -1) 
				{
					if ((rx < 0) || (rx >= this.width))
						rx = -1;
					else if (((rx + DW < this.width) && (this.gmaze[rx + DW][ry].color != this.pathColor)) ||
						((ry + DW < this.height) && (this.gmaze[rx][ry + DW].color == this.pathColor)) || 
						((ry - DW >= 0) && (this.gmaze[rx][ry - DW].color == this.pathColor)))
					{
						darr.push({x: rx, y: ry, dir: movementEnum.RIGHT});
						rx = -1;
					}	
					else
						rx += DC;
				}
				
				if (uy != -1) 
				{
					if ((uy < 0) || (uy >= this.height))
						uy = -1;
					else if (((uy - DW >= 0) && (this.gmaze[ux][uy - DW].color != this.pathColor)) ||
						((ux + DW < this.width) && (this.gmaze[ux + DW][uy].color == this.pathColor)) || 
						((ux - DW >= 0) && (this.gmaze[ux - DW][uy].color == this.pathColor)))
					{
						darr.push({x: ux, y: uy, dir: movementEnum.UP});
						uy = -1;
					}	
					else
						uy -= DC;
				}
				
				if (dy != -1) 
				{
					if ((dy < 0) || (dy >= this.height))
						dy = -1;
					else if (((dy + DW < this.height) && (this.gmaze[dx][dy + DW].color != this.pathColor)) ||
						((dx + DW < this.width) && (this.gmaze[dx + DW][dy].color == this.pathColor)) || 
						((dx - DW >= 0) && (this.gmaze[dx - DW][dy].color == this.pathColor)))
					{
						darr.push({x: dx, y: dy, dir: movementEnum.DOWN});
						dy = -1;
					}	
					else
						dy += DC;
				}
			}
			
			if (darr.length != 0)
			{
				this.cms[i].destination = darr[Math.floor(Math.random() * darr.length)];
				this.cms[i].destination.x *= Block.width;
				this.cms[i].destination.y *= Block.width;
				this.cms[i].hasDestination = true;
			}
		}
		if (this.cms[i].hasDestination) switch (this.cms[i].destination.dir)
		{
			case movementEnum.LEFT:
				this.cms[i].moveLeft();
				if (this.cms[i].destination.x >= this.cms[i].original.x)
				{
					this.cms[i].setOriginalPosition(this.cms[i].destination.x, this.cms[i].destination.y);
					this.cms[i].hasDestination = false;
				}
				break;
			case movementEnum.RIGHT:
				this.cms[i].moveRight();
				if (this.cms[i].destination.x <= this.cms[i].original.x)
				{
					this.cms[i].setOriginalPosition(this.cms[i].destination.x, this.cms[i].destination.y);
					this.cms[i].hasDestination = false;
				}
				break;
			case movementEnum.UP:
				this.cms[i].moveUp();
				if (this.cms[i].destination.y >= this.cms[i].original.y)
				{
					this.cms[i].setOriginalPosition(this.cms[i].destination.x, this.cms[i].destination.y);
					this.cms[i].hasDestination = false;
				}
				break;
			case movementEnum.DOWN:
				this.cms[i].moveDown();
				if (this.cms[i].destination.y <= this.cms[i].original.y)
				{
					this.cms[i].setOriginalPosition(this.cms[i].destination.x, this.cms[i].destination.y);
					this.cms[i].hasDestination = false;
				}
				break;
		}
	}
}

Maze.prototype.checkCookieCollisions = function()
{
	var x = this.currPos.x;
	var y = this.currPos.y;
	for (var i = 0; i < this.cookies.length; i++)
	{
		if ((x >= this.cookies[i].original.x - this.cookies[i].width/2) && (x <= this.cookies[i].original.x + this.cookies[i].width/2) &&
			(y >= this.cookies[i].original.y - this.cookies[i].height/2) && (y <= this.cookies[i].original.y + this.cookies[i].height/2))
		{
			this.cookies.splice(i, 1);
			this.cookiesEaten++;
			break;
		}
	}
	if (this.cookies.length == 0)
	{
		 this.generateMaze(0, 0, this.pathColor, this.level);
	}
}


Maze.prototype.checkMonsterCollisions = function()
{
	var x = this.currPos.x;
	var y = this.currPos.y;
	for (var i = 0; i < this.cms.length; i++)
	{
		if ((x >= this.cms[i].original.x - this.cms[i].width/2) && (x <= this.cms[i].original.x + this.cms[i].width/2) &&
			(y >= this.cms[i].original.y - this.cms[i].height/2) && (y <= this.cms[i].original.y + this.cms[i].height/2))
		{
			
			this.mode = Maze.MODE_TRANSITION;
			this.endAnimation.timer = 8000;
			this.endAnimation.start = 8000;
			
			var _this = this;
			this.omnomnomSound.play();
			this.pauseEnabled = true;
			animLoop(function( deltaT ) 
			{
				_this.endAnimation.timer -= deltaT;
				if ( _this.endAnimation.timer < 0 ) 
				{
					_this.endAnimation.timer = 0;
					_this.mode = Maze.MODE_NORMAL;
					_this.gameState = Maze.STATE_OVER;
					return false;
				}
			});
			break;
		}
	}
}


Maze.prototype.checkCollisions = function()
{
	var context = this.mazeCanvas.getContext("2d");
	
	var data = context.getImageData(this.currPos.x, this.currPos.y, 1, 1);
	/*var ind = Math.round(this.currPos.y) * this.viewport.w * 4 + Math.round(this.currPos.x) * 4;
	var data = [
		this.mazeCanvasData.data[ind],
		this.mazeCanvasData.data[ind+1],
		this.mazeCanvasData.data[ind+2],
		this.mazeCanvasData.data[ind+3]
	];*/
	if ((data.data[0] == this.wallColorH[0]) &&
		(data.data[1] == this.wallColorH[1]) &&
		(data.data[2] == this.wallColorH[2]) &&
		(data.data[3] == this.wallColorH[3]))
		return true;
	return false;
}

Maze.prototype.checkHoles = function(x, y)
{
	//cia reikes scale, jeigu darysim daugiau celiu
	var context = this.currentCanvas.getContext("2d");
	var data = context.getImageData(x, y, 1, 1);
	if (data.data[3] == 0) //alpha
		return true;
	else
		return false;
}

Maze.prototype.drawHoles = function(holeCount)
{
	var context = this.mazeCanvas.getContext("2d");
	var x = Math.floor(Math.random()*this.viewport.w);
	var y = Math.floor(Math.random()*this.viewport.h);
	context.clearRect(x, y, 
		10, 10);
	this.holeArray.push({x:x, y:y});
}


Maze.prototype.drawHole = function(x, y)
{
	var context = this.mazeCanvas.getContext("2d");
	context.clearRect(x, y, 
		10, 10);
	this.holeArray.push({x:x, y:y});
}

Maze.prototype.beginMapAnimation = function()
{
	this.mode = Maze.MODE_TRANSITION;
	this.mapAnimation.timer = 1000;
	this.mapAnimation.start = 1000;
	this.mapAnimation.stage = this.mapAnimation.STARTING;
	if (this.audioEnabled)
	{
		this.mapSound.play();
	}
	var _this = this;
	animLoop(function(deltaT)
	{
		_this.mapAnimation.timer -= deltaT;
		if ( _this.mapAnimation.timer < 0 ) 
		{
			//alert("animEnded1");
			_this.mapAnimation.timer = 0;
			_this.mapAnimation.stage = _this.mapAnimation.COMPLETE;
			_this.mode = Maze.MODE_MAP;
			_this.player.setMoving(true);
			_this.player.setScale(3);
			return false;
		}
	});
}

Maze.prototype.endMapAnimation = function()
{
	this.player.setMoving(false);
	this.player.setScale(this.scale);
	this.mode = Maze.MODE_TRANSITION;
	this.mapAnimation.timer = 1000;
	this.mapAnimation.start = 1000;
	this.mapAnimation.stage = this.mapAnimation.ENDING;
	var _this = this;
	animLoop(function( deltaT ) 
	{
		_this.mapAnimation.timer -= deltaT;
		if ( _this.mapAnimation.timer < 0 ) 
		{
			_this.mapAnimation.timer = 0;
			_this.mapAnimation.stage = _this.mapAnimation.DISABLED;
			_this.mode = Maze.MODE_NORMAL;
			return false;
		}
	});
}

Maze.prototype.getScore = function()
{
	if (this.totalTime == 0)
		this.playerScore = 0;
	else
		this.playerScore = Math.floor((this.cookiesEaten)*10000/(Math.sqrt(this.totalTime)));
	return this.playerScore;
}

Maze.prototype.getState = function()
{
    return this.gameState;
}
function animLoop( render, element ) 
{
	var running, lastFrame = +new Date;
	function loop( now ) 
	{
		// stop the loop if render returned false
		if ( running !== false ) 
		{
			window.requestAnimFrame( loop, element );
			var deltaT = now - lastFrame;
			// do not render frame when deltaT is too high
			if ( deltaT < 160 ) 
			{
				running = render( deltaT );
			}
			lastFrame = now;
		}
	}
	loop( lastFrame );
}

Maze.prototype.startZoomer = function()
{
	this.player.setScale(1);
	this.startZoomer.enabled = true;
	this.startZoomer.time = 10000;
	if (this.audioEnabled)
	{
		this.shrinkSound.play();
	}
}

Maze.prototype.updateZoomer = function(dt)
{
	this.startZoomer.time -= dt;
	var cof = (10000-this.startZoomer.time)/10000;
	this.player.setScale((this.scale - 1) * cof * cof + 1);
	if (this.startZoomer.time < 0)
	{
		this.player.setScale(this.scale);
		this.startZoomer.time = 0;
		this.startZoomer.enabled = false;
		this.shrinkSound.pause();
		this.shrinkSound.currentTime = 0;
	}
}

Maze.prototype.startGhostRealm = function()
{
	this.currentCanvas = this.ghostCanvas;
	this.monsterCollisionsEnabled = false;
	this.startGhostRealm.enabled = true;
	this.startGhostRealm.time = 10000;
	if (this.audioEnabled)
	{
		this.horrorSound.play();
		this.shadeSound1.play();
	}
}

Maze.prototype.updateGhostRealm = function(dt)
{
	this.startGhostRealm.time -= dt;
	if (this.startGhostRealm.time < 0)
	{
		this.monsterCollisionsEnabled = true;
		this.currentCanvas = this.mazeCanvas;
		this.startGhostRealm.time = 0;
		this.startGhostRealm.enabled = false;
		if (this.audioEnabled)
		{
			this.shadeSound2.play();
		}
		this.horrorSound.pause();
	}
}

Maze.prototype.startWallhack = function()
{
	this.wallCollisionsEnabled = false;
	this.startWallhack.enabled = true;
	this.startWallhack.time = 3000;
	if (this.audioEnabled)
	{
		this.throughSound.play();
	}
}

Maze.prototype.updateWallhack = function(dt)
{
	this.startWallhack.time -= dt;
	if (this.startWallhack.time < 0)
	{
		this.wallCollisionsEnabled = true;
		this.startWallhack.time = 0;
		this.startWallhack.enabled = false;
		this.throughSound.pause();
		this.throughSound.currentTime = 0;
	}
}

Maze.prototype.stopSound = function() 
{
	this.horrorSound.pause();
	if (this.horrorSound.canPlayThrough)
		this.horrorSound.currentTime = 0;
	this.mapSound.pause();
	if (this.mapSound.canPlayThrough)
		this.mapSound.currentTime = 0;
	this.shadeSound1.pause();
	if (this.shadeSound1.canPlayThrough)
		this.shadeSound1.currentTime = 0;
	this.shadeSound2.pause();
	if (this.shadeSound2.canPlayThrough)
		this.shadeSound2.currentTime = 0;
	this.shrinkSound.pause();
	if (this.shrinkSound.canPlayThrough)
		this.shrinkSound.currentTime = 0;
	this.throughSound.pause();
	if (this.throughSound.canPlayThrough)
		this.throughSound.currentTime = 0;
	this.omnomnomSound.pause();
	if (this.omnomnomSound.canPlayThrough)
		this.omnomnomSound.currentTime = 0;
}

DBTYPES =
{
	ALIAS:0,
	COLOR:1,
	LEVEL:2,
	CAR:3,
	WIDTH:4,
	HEIGHT:5,
	HOLE:6,
	GUMBA:7,
	COOKIE:8,
	CK_EATEN: 9,
	MAZE:10,
	TIME:11,
	PLAYER:12,
	CHECK:13
}

Maze.loadMaze = function(playerName, callback)
{
	var m = new Maze(200, 100, 800, 400, Maze.CAR_RED);	
	
	var arr = new Array();
	arr.push({playerName: playerName, typeEnum: DBTYPES.CHECK, callback:function(check)
	{
		if (!check)
		{	callback({success: false, maze: null}); return; }
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.CAR, callback:function(car)
	{
		if (!car)
		{	callback({success: false, maze: null}); return; }
		m.car = car;
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.LEVEL, callback:function(level)
	{
		if (level === null)
		{	callback({success: false, maze: null}); return; }
		m.level = level;
	
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.WIDTH, callback:function(width)
	{
		if (!width)
		{	callback({success: false, maze: null}); return; }
		m.width = width;
	
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.HEIGHT, callback:function(height)
	{
		if (!height)
		{	callback({success: false, maze: null}); return; }
		m.height = height;
	
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.COLOR, callback:function(col)
	{
		if (!col)
		{	callback({success: false, maze: null}); return; }
		m.color = "#" + col;
	
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.MAZE, callback:function(maze)
	{
		if (!maze)
		{	callback({success: false, maze: null}); return; }
		var b;
		for (var i = 0; i < m.width; i++)
		{
			for (var j = 0; j < m.height; j++)
			{
				b = new Block();
				b.fromJSON(maze[i][j]);
				m.gmaze[i][j] = b; 
			}
		}
		m.setupMaze(m.color, m.level);	
	
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.TIME, callback:function(time)
	{
		if (!time)
		{	callback({success: false, maze: null}); return; }
		m.totalTime = time;
	
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.CK_EATEN, callback:function(cookiesEaten)
	{
		if (!cookiesEaten)
		{	callback({success: false, maze: null}); return; }
		m.cookiesEaten = cookiesEaten;
	
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.GUMBA, callback:function(gumbas)
	{
		if (!gumbas)
		{	callback({success: false, maze: null}); return; }
		
		var i;
		for (i = 0; i < gumbas.length; i++)
		{
			m.cms[i].fromJSON(gumbas[i]);
			console.log("gumbas"+m.cms[i].original.x+":"+m.cms[i].original.y);
		}	
		for (;i < m.cms.length; i++)
		{
			m.cms.splice(i);
		}
	
	}});
		
	arr.push({playerName: playerName, typeEnum: DBTYPES.COOKIE, callback:function(cookies)
	{
		if (!cookies)
		{	callback({success: false, maze: null}); return; }
			
		var i;
		for (i = 0; i < cookies.length; i++)
		{
			m.cookies[i].fromJSON(cookies[i]);
		}	
		for (;i < m.cookies.length; i++)
		{
			m.cookies.splice(i);
		}	
	}});
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.PLAYER, callback:function(player)
	{
		if (player)
			m.player.fromJSON(player);
		else
			callback({success: false, maze: null});
	}});
	
	
	arr.push({playerName: playerName, typeEnum: DBTYPES.HOLE, callback:function(holes)
	{
		if (holes)
		{
			for (var i = 0; i < holes.length; i++)
			{
				m.drawHole(holes[i].x, holes[i].y);
			}
			console.log("Hole callback");
			callback({success: true, maze: m});
		}
		else {
			callback({success: false, maze: null});
		}
	
	}});
	
	Maze.loadFromDB(arr);
	/*Maze.loadFromDB(playerName, DBTYPES.CAR, function(car)
	{
		if (!car)
		{	callback({success: false, maze: null}); return; }
		m.car = car;
	});
	
	Maze.loadFromDB(playerName, DBTYPES.WIDTH, function(width)
	{
		if (!width)
		{	callback({success: false, maze: null}); return; }
		m.viewport.w = width;
	
	});*/
	/* 
	Maze.loadFromDB(playerName, DBTYPES.HEIGHT, function(height)
	{
		if (!height)
		{	callback({success: false, maze: null}); return; }
		m.viewport.h = height;
	}); */
	
	/* Maze.loadFromDB(playerName, DBTYPES.COLOR, function(col)
	{
		if (!col)
		{	callback({success: false, maze: null}); return; }
		m.color = col;
	}); */
	/* 
	Maze.loadFromDB(playerName, DBTYPES.LEVEL, function(level)
	{
		if (!level)
		{	callback({success: false, maze: null}); return; }
		m.level = level;
	});
	 */
	/* 
	Maze.loadFromDB(playerName, DBTYPES.MAZE, function(maze)
	{
		if (!maze)
		{	callback({success: false, maze: null}); return; }
		var b;
		for (var i = 0; i < m.width; i++)
		{
			for (var j = 0; j < m.height; j++)
			{
				b = new Block();
				b.fromJSON(maze[i][j]);
				m.gmaze[i][j] = b; 
			}
		}
		m.setupMaze(m.color, m.level);	
	}); */
	
	/* Maze.loadFromDB(playerName, DBTYPES.TIME, function(time)
	{
		if (!time)
		{	callback({success: false, maze: null}); return; }
		m.totalTime = time;
	}); */
	
	
	/* Maze.loadFromDB(playerName, DBTYPES.GUMBA, function(gumbas)
	{
		if (!gumbas)
		{	callback({success: false, maze: null}); return; }
		
		var i;
		for (i = 0; i < gumbas.length; i++)
		{
			m.cms[i].fromJSON(gumbas[i]);
		}	
		for (;i < m.cms.length; i++)
		{
			m.cms.splice(i);
		}
	}); */
	/* 
	Maze.loadFromDB(playerName, DBTYPES.COOKIE, function(cookies)
	{
		if (!cookies)
		{	callback({success: false, maze: null}); return; }
			
		var i;
		for (i = 0; i < cookies.length; i++)
		{
			m.cookies[i].fromJSON(cookies[i]);
		}	
		for (;i < m.cookies.length; i++)
		{
			m.cookies.splice(i);
		}
	}); */
	/* 
	Maze.loadFromDB(playerName, DBTYPES.PLAYER, function(player)
	{
		if (player)
			m.player.fromJSON(player);
		else
			callback({success: false, maze: null});
	});
	
	Maze.loadFromDB(playerName, DBTYPES.HOLE, function(holes)
	{
		if (holes)
		{
			for (var i = 0; i < holes.length; i++)
			{
				m.drawHole(holes[i].x, holes[i].y);
			}
			callback({success: true, maze: m});
		}
		else
			callback({success: false, maze: null});
	}); */
}

//callback returns unstringified object.
// Maze.loadFromDB = function( playerName, typeEnum, callback)
Maze.loadFromDB = function(aaa)
{	
	if (aaa.length == 0)
		return;
	var xmlhttp2 = new XMLHttpRequest();
	xmlhttp2.onreadystatechange = function()
	{
		if (xmlhttp2.readyState==4 && xmlhttp2.status==200)
		{
			var objectToLoad = null;
			if (xmlhttp2.responseText.trim() != "-1")
				objectToLoad = JSON.parse(xmlhttp2.responseText);
			if (aaa.length > 0)
			{
				aaa[0].callback(objectToLoad);
				console.log("objectToLoad:"+aaa[0].typeEnum+" "+objectToLoad);
				if (!objectToLoad)
					return;
				aaa.splice(0, 1);
				Maze.loadFromDB(aaa);
			}
		}
	}
	xmlhttp2.open("GET", "php/db.php?func=loadSS&alias="+aaa[0].playerName+"&colEnum="+aaa[0].typeEnum, true);
	xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp2.send();
}

Maze.saveMaze = function(playerName, maze, callback) 
{
	var aaa = new Array();
	var item = JSON.stringify(maze.gmaze);
	// alert(item.length);
	aaa.push({item:item, typeEnum:DBTYPES.MAZE, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.MAZE);
	
	item = JSON.stringify(maze.pathColor.substring(1));
	aaa.push({item:item, typeEnum:DBTYPES.COLOR, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.COLOR);
	
	item = JSON.stringify(maze.cookies);
	aaa.push({item:item, typeEnum:DBTYPES.COOKIE, callback:function(x){}});
	
	item = JSON.stringify(maze.cookiesEaten);
	aaa.push({item:item, typeEnum:DBTYPES.CK_EATEN, callback:function(x){}});
	
	// Maze.saveToDB(playerName, item, DBTYPES.COOKIE);
	
	item = JSON.stringify(maze.cms);
	aaa.push({item:item, typeEnum:DBTYPES.GUMBA, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.GUMBA);
	console.log("Gumba:"+item);
	
	item = JSON.stringify(maze.player);
	aaa.push({item:item, typeEnum:DBTYPES.PLAYER, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.PLAYER);

	item = JSON.stringify(maze.level);
	aaa.push({item:item, typeEnum:DBTYPES.LEVEL, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.LEVEL);
	
	item = JSON.stringify(maze.car);
	aaa.push({item:item, typeEnum:DBTYPES.CAR, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.CAR);
	
	item = JSON.stringify(maze.width);
	aaa.push({item:item, typeEnum:DBTYPES.WIDTH, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.WIDTH);
	
	item = JSON.stringify(maze.height);
	aaa.push({item:item, typeEnum:DBTYPES.HEIGHT, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.HEIGHT);
	
	item = JSON.stringify(maze.holeArray);
	aaa.push({item:item, typeEnum:DBTYPES.HOLE, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.HOLE);
	
	item = JSON.stringify(maze.totalTime);
	aaa.push({item:item, typeEnum:DBTYPES.TIME, callback:function(x){}});
	// Maze.saveToDB(playerName, item, DBTYPES.TIME);
	
	item = JSON.stringify(true);
	aaa.push({item:item, typeEnum:DBTYPES.CHECK, callback:callback});
	Maze.saveToDB(playerName, aaa);
	// Maze.saveToDB(playerName, item, DBTYPES.CHECK);
}

Maze.saveToDB = function(playerName, aaa)
{	
	if (aaa.length == 0)
		return;
	var xmlhttp2 = new XMLHttpRequest();
	xmlhttp2.onreadystatechange = function()
	{
		if (xmlhttp2.readyState==4 && xmlhttp2.status==200)
		{
			if (aaa.length > 0)
			{
				console.log("objectToSave:"+aaa[0].typeEnum+" "+aaa[0].item);
				aaa[0].callback(true);
				aaa.splice(0, 1);
				Maze.saveToDB(playerName, aaa);
			}
		}
	}
	xmlhttp2.open("POST", "php/db.php", true);
	xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp2.send("alias="+playerName+"&func=updateSS&colEnum=" +aaa[0].typeEnum+"&value=" +aaa[0].item);
}	
// Maze.saveToDB = function(playerName, objectToSave, typeEnum, callback)
// {
	// var xmlhttp2 = new XMLHttpRequest();
	// xmlhttp2.onreadystatechange = function()
	// {
		// if (xmlhttp2.readyState==4 && xmlhttp2.status==200)
		// {			
			// console.log("saveToDB:"+objectToSave);
		// }
	// }
	// xmlhttp2.open("POST", "php/db.php", true);
	// xmlhttp2.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	// xmlhttp2.send("alias="+playerName+"&func=updateSS&colEnum=" +typeEnum+"&value=" +objectToSave);
// }
