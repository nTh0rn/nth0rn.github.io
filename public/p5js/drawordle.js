// p5.js sketch for DraWordle
function sketch(p) {
	let submittedText = "";
	let words = [];
	let colors = [];
	let currColor = 'Y';
	let centerImg;
	p.setup = function() {
		p.createCanvas(300, 426).parent('drawordle-canvas-inner');
		p.frameRate(30);
		centerImg = p.loadImage('https://img.icons8.com/plasticine/100/paint-brush.png');
		for (let i = 0; i < 6; i++) {
			words[i] = [];
			for (let j = 0; j < 5; j++) {
				words[i][j] = ' ';
			}
		}
		for (let i = 0; i < 6; i++) {
			colors[i] = [];
			for (let j = 0; j < 5; j++) {
				colors[i][j] = 'G';
			}
		}
	};
	p.draw = function() {
		p.clear();
		let rectWidth = 80;
		let rectHeight = 40;
		let x = (p.width - rectWidth) / 2;
		let y = (p.height - rectHeight) / 2;
		for(var i = 0; i < 6; i++) {
			for(var j = 0; j < 5; j++) {
				if (document.documentElement.classList.contains('dark')) {
					p.stroke(150);
				} else {
					p.stroke(100);
				}
				switch(colors[i][j]) {
					case 'G':
						p.fill(108,169,101);
						break;
					case 'Y':
						p.fill(200,182,83);
						break;
					case 'E':
						p.fill(120,124,127);
						break;
				}
				p.rect(j*48+10*(j+1), i*48+10*(i+1)+68, 48, 48);
				if(submittedText) {
					p.noStroke();
					p.fill(255);
					p.textAlign(p.CENTER, p.CENTER);
					p.textFont('Helvetica');
					p.textSize(24);
					p.textStyle(p.BOLD);
					p.text(words[i][j], j*48+10*(j+1)+23, i*48+10*(i+1)+93);
				}
			}
		}
		p.stroke(100);
		p.fill(120,124,127);
		p.rect(10, 10, 48, 48, 12);
		p.fill(200,182,83);
		p.rect(68, 10, 48, 48, 12);
		p.fill(108,169,101);
		p.rect(126, 10, 48, 48, 12);
		if (document.documentElement.classList.contains('dark')) {
			p.stroke(100);
		} else {
			p.stroke(150);
		}
		p.line(5, 68, 295, 68);
		switch(currColor) {
			case 'G':
				break;
			case 'Y':
				break;
			case 'E':
		}
		p.rect(242, 10, 48, 48, 24);
		if (centerImg && centerImg.width > 0 && centerImg.height > 0) {
			p.push();
			let cx = 235 + 20;
			let cy = 25 + 20;
			p.translate(cx, cy);
			p.rotate(p.radians(225));
			p.imageMode(p.CENTER);
			p.image(centerImg, 0, 0, 50, 50);
			p.imageMode(p.CORNER);
			p.pop();
		}
	};
	p.mousePressed = function() {
		if (p.mouseX > 10 && p.mouseX < 58 && p.mouseY > 10 && p.mouseY < 58) {
			currColor = 'E';
		} else if (p.mouseX > 48 && p.mouseX < 116 && p.mouseY > 10 && p.mouseY < 58) {
			currColor = 'Y';
		} else if (p.mouseX > 126 && p.mouseX < 174 && p.mouseY > 10 && p.mouseY < 58) {
			currColor = 'G';
		} else {
			if(p.mouseY > 78 && p.mouseY < 426 && p.mouseX > 0 && p.mouseX < 300) {
				let x = p.mouseX - 5;
				let y = p.mouseY - 73;
				x = Math.floor(x/58);
				y = Math.floor(y/58);
				if(x < 0) {
					x = 0;
				} else if(x > 4) {
					x = 4;
				}
				if(y < 0) {
					y = 0;
				} else if(y > 5) {
					y = 5;
				}
				colors[y][x] = currColor;
			}
		}
	};
	p.setSubmittedText = function(val) {
		if(val.length == 5) {
			submittedText = val;
		}
	};
	p.replaceCharAt = function(str, index, newChar) {
		return str.slice(0, index) + newChar + str.slice(index + 1);
	};
	p.findWords = function() {
		// ...existing code...
	};
}
function waitForP5() {
	if (window.p5 && window.createCanvas) {
		window.drawordleP5Instance = new p5(sketch, 'drawordle-canvas-inner');
	} else {
		setTimeout(waitForP5, 50);
	}
}
waitForP5();
window.drawordleOnSubmit = function(val) {
	if (window.drawordleP5Instance && window.drawordleP5Instance.setSubmittedText) {
		window.drawordleP5Instance.setSubmittedText(val);
	}
};
