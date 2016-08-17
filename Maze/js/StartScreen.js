function bottomText(c)
{
	var ctx = c.getContext("2d");
	if (typeof bottomText.counter == "undefined") 
	{
        bottomText.counter = 0.1;
		bottomText.increment = 0.05;
    }
	ctx.fillStyle = "rgba(255, 0, 0, " + bottomText.counter + ")";
	ctx.textAlign = "center";
	ctx.font = "20pt Comic Sans MS";
	ctx.fillText("Press space to begin!", c.width/2, c.height*4/5);

	bottomText.counter += bottomText.increment;
	if ((bottomText.counter >= 1.0) || (bottomText.counter <= 0.1))
	{
		bottomText.increment = -bottomText.increment;
	}
}

function determineFontHeight(fontStyle) 
{
	var body = document.getElementsByTagName("body")[0];
	var dummy = document.createElement("div");
	var dummyText = document.createTextNode("M");
	dummy.appendChild(dummyText);
	dummy.setAttribute("style", fontStyle);
	body.appendChild(dummy);
	var result = dummy.offsetHeight;
	body.removeChild(dummy);
	return result;
};

function drawCheckerBoxText(c)
{
	var ctx = c.getContext("2d");
	ctx.font = "190pt Comic Sans MS";
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	
	if (typeof drawCheckerBoxText.offLeft == "undefined") 
	{
		drawCheckerBoxText.offLeft = 0;
    }
	
	//var posX = c.width/2;
	var metric = ctx.measureText("Start!");
	var height = determineFontHeight("font: " + ctx.font + ";");
	var width = metric.width;
	drawCheckerBoxText.offLeft += 5;
	drawCheckerBoxText.offLeft %= (c.width + width);
	var posX = drawCheckerBoxText.offLeft - width/2;
	var posY = c.height/3;
	ctx.fillText("Start!", posX, posY);
	
	var x = posX - width/2;
	var y = posY - height/3;
	return {x: x, y: y, width: width, height: height};
}

function superCheckerBoard(c)
{
	var x = 0;
	var y = 0;
	if (typeof superCheckerBoard.canvasBlack == "undefined")
	{
		//checkerBoard(c, "#FFFFFF", "#000000");
		superCheckerBoard.canvasBlack = document.createElement("canvas");
		superCheckerBoard.canvasWhite = document.createElement("canvas");
		superCheckerBoard.canvasBlack.width = c.width;
		superCheckerBoard.canvasBlack.height = c.height;
		superCheckerBoard.canvasWhite.width = c.width;
		superCheckerBoard.canvasWhite.height = c.height;
		
		var ctx = superCheckerBoard.canvasBlack.getContext("2d");
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, c.width, c.height);
		superCheckerBoard.blackData = ctx.getImageData(0, 0, c.width, c.height);
		
		ctx = superCheckerBoard.canvasWhite.getContext("2d");
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, c.width, c.height);
		superCheckerBoard.whiteData = ctx.getImageData(0, 0, c.width, c.height);
	}
	else if (typeof superCheckerBoard.dataPosX == "undefined")
	{
	
		var ctx = superCheckerBoard.canvasBlack.getContext("2d");
		ctx.font = "190pt Comic Sans MS";
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Start!", c.width/2, c.height/3);
		superCheckerBoard.blackData = ctx.getImageData(0, 0, c.width, c.height);
		
		ctx = superCheckerBoard.canvasWhite.getContext("2d");
		ctx.font = "190pt Comic Sans MS";
		ctx.fillStyle = "#000000";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("Start!", c.width/2, c.height/3);
		superCheckerBoard.whiteData = ctx.getImageData(0, 0, c.width, c.height);
		superCheckerBoard.dataPosX = -c.width;
		superCheckerBoard.dataPosY = 0;
		x = superCheckerBoard.dataPosX;
	}
	else {
		superCheckerBoard.dataPosX += 2;
		x = superCheckerBoard.dataPosX;
		if (superCheckerBoard.dataPosX > c.width)
			superCheckerBoard.dataPosX = -c.width;
	}
	var ctx = c.getContext("2d");
	if (superCheckerBoard.startingData)
		ctx.putImageData(superCheckerBoard.startingData, 0, 0);
	//alert("x=" + invertRect.x + " y=" + invertRect.y + " w=" + invertRect.width + " h=" + invertRect.height);
	var starting = true;
	var rectWidth = c.width/15;
	for (var i = 0; i < c.width; i += rectWidth)
	{
		var draw = !starting;
		if (starting)
			ctx.putImageData(superCheckerBoard.blackData, x, 0, i - x, 0, rectWidth, rectWidth);
		else
			ctx.putImageData(superCheckerBoard.whiteData, x, 0, i - x, 0, rectWidth, rectWidth);
			
		for (var j = rectWidth; j < c.height; j += rectWidth)
		{
			if (draw)
				ctx.putImageData(superCheckerBoard.blackData, x, 0, i - x, j, rectWidth, rectWidth);
			else
				ctx.putImageData(superCheckerBoard.whiteData, x, 0, i - x, j, rectWidth, rectWidth);
			draw = !draw;
		}
		starting = !starting;
	}
	
	if (typeof superCheckerBoard.startingData == "undefined")
	{
		superCheckerBoard.startingData = ctx.getImageData(0, 0, c.width, c.height);
	}
}	

function checkerBoard(c, color1, color2)
{
	var ctx = c.getContext("2d");
	ctx.fillStyle = color1;
	ctx.fillRect(0, 0, c.width, c.height);
	ctx.fillStyle = color2;
	var starting = true;
	var rectWidth = c.width/15;
	for (var i = 0; i < c.width; i += rectWidth)
	{
		var draw = !starting;
		if (starting)
			ctx.fillRect(i, 0, rectWidth, rectWidth);
		for (var j = rectWidth; j < c.height; j += rectWidth)
		{
			if (draw)
				ctx.fillRect(i, j, rectWidth, rectWidth);
			draw = !draw;
		}
		starting = !starting;
	}
}
