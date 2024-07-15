var MAX_NUM = 200;
var circles = [];
var done = false;
var node_dist = 0;
var closest_dist=10000000;
var closest_node=0;
var canvas;
var last_resized=0;

let graphic;

function windowResized() {
    //console.log('resized');
    if(second() != last_resized || windowHeight != height) {
      resizeCanvas(windowWidth, windowHeight);
      if(second() != last_resized) {
      if(abs(last_node_count-(width*height/12000))/last_node_count > 0.25) {
        for (var i = 0; i < last_node_count; i++) {
          circles.pop();
        }
        for (var i = 0; i < width*height/12000; i++) {
          circles.push(new Circle(random(0, width), random(0, height)));
        }
        last_node_count=width*height/12000;
      }
      last_resized=second();
      graphic = createGraphics(width, height);
    }
    }
  }


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0, 'fixed');
    canvas.style('z-index', '-1');
    blendMode(LIGHTEST);

  noStroke();

  for (var i = 0; i < width*height/12000; i++) {
    circles.push(new Circle(random(0, width), random(0, height)));
  }

  last_node_count=width*height/12000;

  last_resized=second();
  windowResized();

  graphic = createGraphics(width, height);
}

function draw() {
  clear();
  tint(255, 50);
  image(graphic, 0, 0);
  
  graphic.clear();
  if(windowWidth != width || windowHeight != height) {
    windowResized();
  }


  for (var i = 0; i < circles.length; i++) {
    closest_dist=1000000;
    circles[i].checkBoundary();
    if (i == 0) {
      circles[i].follow_mouse();
    } else {
      circles[i].update();
    }
    circles[i].display();

    for (var j = 0; j < circles.length; j++) {
      node_dist = sqrt(
          pow(abs(circles[j].x - circles[i].x), 2) +
            pow(abs(circles[j].y - circles[i].y), 2)
        );
      if (node_dist < 100 && i != j) {
          graphic.stroke(51, 154, 240);
          graphic.strokeWeight(3 - (node_dist / 100) * 3);
          graphic.line(circles[i].x, circles[i].y, circles[j].x, circles[j].y);
          graphic.strokeWeight(1);
        }
      if(node_dist < closest_dist && j != i) {
        closest_dist = node_dist;
        closest_node=j;
      }
      //circles[i].grav_acc(circles[j].x,circles[j].y);
      //circles[j].grav_acc(circles[i].x,circles[i].y);
    }
    circles[i].grav_acc(circles[closest_node].x,circles[closest_node].y);
  }
  
}

function Circle(x, y) {
  
  this.x = x;
  this.y = y;
  this.speedX = random(-0.2, 0.2);
  this.speedY = random(-0.2, 0.2);
  this.init_speed = sqrt(pow(this.speedX,2)+pow(this.speedY,2));
  this.size = random(5, 10);
  this.color = color(51, 154, 240);

  this.checkBoundary = function () {
    if (this.x < 0) {
      this.x = 0;
      this.speedX *= -1;
    }
    if (this.x > width) {
      this.x = width;
      this.speedX *= -1;
    }
    if (this.y < 0) {
      this.y = 0;
      this.speedY *= -1;
    }
    if (this.y > height) {
      this.y = height;
      this.speedY *= -1;
    }
    
    this.speed=sqrt(pow(this.speedX,2)+pow(this.speedY,2));
    if (abs(this.speed) > abs(this.init_speedX)) {
      this.speedX*=0.999;
      this.speedy*=0.999;
    }
    
    if (abs(this.speedY) > abs(this.init_speedY)) {
      if(this.speedY > 0) {
        this.speedY-=0.01
      } else {
        this.speedY+=0.01
      }
    }
    
  };

  this.grav_acc = function (other_x, other_y) {
    if(abs(this.x - other_x) < 50) {
    if (other_x > this.x) {
      this.speedX -= (50-abs(this.x - other_x)/50)/50000;
    } else {
      this.speedX += (50-abs(this.x - other_x)/50)/50000;
    }
    }

    if(abs(this.y - other_y) < 50) {
    if (other_y > this.y) {
      this.speedY -= (50-abs(this.y - other_y)/50)/50000;
    } else {
      this.speedY += (50-abs(this.y - other_y)/50)/50000;
    }
    }
  };

  this.update = function () {
    //restitution

    this.x += this.speedX;
    this.y += this.speedY;
  };

  this.follow_mouse = function () {
    //restitution

    this.x = mouseX;
    this.y = mouseY;
  };

  this.getx = function () {
    return this.x;
  };
  this.gety = function () {
    return this.y;
  };

  this.display = function () {
    graphic.push();
    graphic.fill(this.color);
    graphic.strokeWeight(0);
    graphic.ellipse(this.x, this.y, this.size, this.size);
    graphic.pop();
  };
}

