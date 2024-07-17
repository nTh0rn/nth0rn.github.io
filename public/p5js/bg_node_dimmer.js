

var nodes = [];
var canvas;

var node_dist = 0;
var closest_dist=10000000;
var closest_node=0;

var last_resized=0;
var density_ratio=8000;
var ratio_shrink=false;

var dropped=0;
var halt_bg=false;

function windowResized() {
  if((windowHeight != height || second() != last_resized || ratio_shrink == true) && halt_bg == false) {
    resizeCanvas(windowWidth, windowHeight);
    if(abs(last_node_count-(width*height/density_ratio))/last_node_count > 0.25 || ratio_shrink == true) {
      if(ratio_shrink == true) {
        if(density_ratio <= 23000) {
          density_ratio+=5000;
          //print("New density ratio: " + density_ratio);
          ratio_shrink = false;
        } else {
          remove();
        }
      }
      for (var i = 0; i < last_node_count; i++) {
        nodes.pop();
      }
      for (var i = 0; i < width*height/density_ratio; i++) {
        nodes.push(new Node(random(0, width), random(0, height)));
      }
      last_node_count=width*height/density_ratio;
    }
    last_resized=second();
  }
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0, 'fixed');
  canvas.style('z-index', '-1');
  canvas.style('opacity', '0.1');

  for (var i = 0; i < width*height/density_ratio; i++) {
    nodes.push(new Node(random(0, width), random(0, height)));
  }

  last_node_count=width*height/density_ratio;

  last_resized=second();
  windowResized();
}

function draw() {

  // Performance protection. Decreases number of nodes if FPS is consistently low.
  if(frameRate() < 30) {
    dropped+=1;
  } else {
    dropped=0;
  }
  if(dropped > 10) {
    ratio_shrink = true;
    windowResized();
    dropped=0;
  }


  clear();

  // Checks for resizing outside of every second.
  if(windowWidth != width || windowHeight != height) {
    windowResized();
  }

  // Main node loop
  for (var i = 0; i < nodes.length; i++) {
    closest_dist=1000000;
    nodes[i].checkBoundary();
    if (i == 0 && density_ratio <= 13000) {
      nodes[0].follow_mouse();
    } else {
      nodes[i].update();
    }
    nodes[i].display();
    if(density_ratio <= 13000) {
      for (var j = 0; j < nodes.length; j++) {
        node_dist = sqrt(pow(abs(nodes[j].x - nodes[i].x), 2) + pow(abs(nodes[j].y - nodes[i].y), 2));
        if (node_dist < 100 && i != j) {
            stroke(51, 154, 240);
            strokeWeight(3 - (node_dist / 100) * 3);
            line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            strokeWeight(1);
            
          }
        if(node_dist < closest_dist && j != i) {
          closest_dist = node_dist;
          closest_node=j;
        }
        

      }
      nodes[i].grav_acc(nodes[closest_node]);
    }
  }
}

function Node(x, y) {
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
    if (abs(this.speed) > abs(this.init_speed)) {
      this.speedX*=0.99;
      this.speedY*=0.99;
    }
    
  };

  this.grav_acc = function (other) {
    other_dist = sqrt(pow(other.x-this.x,2)+pow(other.y-this.y,2));

    if(other_dist < other.size/2+this.size/2) {
      old_speedX=this.speedX;
      old_speedY=this.speedY;

      this.speedX=other.speedX;
      this.speedY=other.speedY;

      other.speedX=old_speedX;
      other.speedY=old_speedY;
    } else if(other_dist < 25) {
      this.speedX += (this.x - other.x)/10000;
      this.speedY += (this.y - other.y)/10000;
    }
  };

  this.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
  };

  this.follow_mouse = function () {
    this.init_speed=0.28;
    this.x = mouseX;
    this.y = mouseY;
    this.speedX = (mouseX - pmouseX);
    this.speedY = (mouseY - pmouseY);

    this.speed=sqrt(pow(this.speedX,2)+pow(this.speedY,2));
    if(this.speed > this.init_speed) {
      this.speedX=this.speedX/(this.speed/this.init_speed);
      this.speedY=this.speedY/(this.speed/this.init_speed);
    }
  };

  this.display = function () {
    push();
    fill(this.color);
    strokeWeight(0);
    ellipse(this.x, this.y, this.size, this.size);
    pop();
  };
}