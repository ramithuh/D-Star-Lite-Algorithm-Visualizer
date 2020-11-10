/**  Author : Ramith Hettiarachchi
 * 
 * 
 *  Visualizer for D* Lite Algo
 * 
 *  im@ramith.fyi
 * 
 * 
 *  **/




var GRID = [...Array(100)].map(e => Array(100).fill(0));
var myPath = [...Array(100)].map(e => Array(100).fill(0));
var lastx = 0
var lasty = 0


let xOffset = 0.0;
let yOffset = 0.0;

let bx=0;
let by=0;
var PanZoom = false;
var speed=25;
var fps=3;

var GridSize=50;
var Zoom=1;
var Background=[100,245];
var autorun = false;



const Inf = 9999

var consoleLog=[];
var regLog=[];
var code="";


var current_instruction ="D* Algorithm Visualizer";
var samplecodes = ['2x2','3x3','4x4'];

var infoLog=[];
var line_array_readings=[]
var consoleBuffer=0;


function dec2bin(dec){
  return (dec >>> 0).toString(2);
}
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

{const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top];
  }
  TopKey() {
    return [this._heap[top][1][0],this._heap[top][1][1]];
  }

  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  
  _findElementIndex(key) {
    // TODO: optimize
    for (let i = 0, l = this._heap.length; i < l; i++) {
      //key in queue
        if (this._heap[i][0][0] == key[0] && this._heap[i][0][1] == key[1]) { 
          return i; 
        }
    }
    return -1;
  }

  removeKey(key) {
    const idx = this._findElementIndex(key);
    if (idx === -1) {
        return;
    }
    if (idx > -1) {
      this._heap.splice(idx, 1);
    }
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
} window.PriorityQueue = PriorityQueue
}


class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}



//D* Lite algorithm Parameters
var s_last  = 0
var s_start = 0
var km = 0 
s_start   = new Vector(0,0);
s_current = new Vector(0,0);
s_goal   = new Vector(6,7);

function comp(a,b){
  if(a[0]>b[0]){
    return false;
  }else if(a[0]==b[0]){
    if(a[1]>b[1]){
      return false;
    }else{
      return true;
    }
  }else{
    return true;
  }

}

function isVectorEqual(a,b){
  if(a.x==b.x && a.y==b.y)
    return true
  else return false
}

function h(point1,point2){   
  //heuristic function
  return Math.sqrt((point1.x-point2.x)**2 + (point1.y-point2.y)**2)
}

function CalculateKey(s){
  //Calculate Key 
  //console.log("=> activating calculate key",s)
  //console.log("=> CalculateKey ✅ ",Math.min(g[s.x][s.y],rhs[s.x][s.y]) + h(s_start,s) + km , Math.min(g[s.x][s.y],rhs[s.x][s.y]))
  return [Math.min(g[s.x][s.y],rhs[s.x][s.y]) + h(s_start,s) + km , Math.min(g[s.x][s.y],rhs[s.x][s.y])]
}
var count =0
function UpdateVertex(u){

  //console.log("==> Update Vertex")
  if ( u.x < 0 || u.x > 100 || u.y < 0 || u.y > 100){
    //console.log("Stopped Unexpectedly",u)
    return -1
  }
  //console.log(" => UpdateVertex ",u)
  if(!isVectorEqual(u,s_goal)){
        //n = [[0,1],[1,0],[-1,0],[0,-1]]
        let c1,c2,c3,c4;
        if(u.y+1 > 100 || GRID[u.x][u.y+1]) c1 = Inf
        else  c1 = g[u.x  ][u.y+1] + 1 + GRID[u.x][u.y]*Inf
        
        if(u.x+1 > 100 || GRID[u.x+1][u.y]) c2 = Inf 
        else  c2 = g[u.x+1][u.y  ] + 1 + GRID[u.x][u.y]*Inf
        
        if(u.x-1 < 0 || GRID[u.x-1][u.y]) c3 = Inf
        else  c3 = g[u.x-1][u.y  ] + 1 + GRID[u.x][u.y]*Inf

        if(u.y-1 < 0 || GRID[u.x][u.y-1]) c4 = Inf
        else  c4 = g[u.x  ][u.y-1] + 1 + GRID[u.x][u.y]*Inf

        //console.log("=> RHS[",u.x,",",u.y,"] = ",Math.min(c1,c2,c3,c4))
        rhs[u.x][u.y]  = Math.min(c1,c2,c3,c4)
  }
  if(queue._findElementIndex([u.x,u.y])){
    queue.removeKey([u.x,u.y]);
  }
  if(g[u.x][u.y]!=rhs[u.x][u.y]){
    //console.log("Reddaaaa =>")
    queue.push([[u.x,u.y],CalculateKey(u)])
  }
}
function ComputeShortestPath(){
  //console.log(" => ComputeShortestPath")
  
  
  while(comp(queue.TopKey(),CalculateKey(s_start))
    || rhs[s_start.x][s_start.y]!=g[s_start.x][s_start.y]){
      
      let k_old = queue.TopKey()
      let u   = queue.pop()[0]
      u       = new Vector(u[0],u[1])

      
      if(k_old < CalculateKey(u)){
        queue.push([[u.x,u.y],CalculateKey(u)])
      }else if(g[u.x][u.y] > rhs[u.x][u.y]){
        g[u.x][u.y] = rhs[u.x][u.y]
        
        UpdateVertex(new Vector(u.x,u.y+1))
        UpdateVertex(new Vector(u.x+1,u.y))
        UpdateVertex(new Vector(u.x  ,u.y-1))
        UpdateVertex(new Vector(u.x-1,u.y))

      }else{
        g[u.x][u.y] = Inf
       
        UpdateVertex(u)
        UpdateVertex(new Vector(u.x  ,u.y+1))
        UpdateVertex(new Vector(u.x+1,u.y))
        UpdateVertex(new Vector(u.x  ,u.y-1))
        UpdateVertex(new Vector(u.x-1,u.y))
      }

    }
}

//initilize
s_last = s_start
var queue = new PriorityQueue((a, b) => comp(a[1],b[1]));
var km = 0;
var rhs = [...Array(100)].map(e => Array(100).fill(Inf));
var g   = [...Array(100)].map(e => Array(100).fill(Inf)); 
rhs[s_goal.x][s_goal.y] = 0;
queue.push([[s_goal.x,s_goal.y],CalculateKey(s_goal)]);


//CalculateKey(s_goal)

//ComputeShortestPath()
/*
queue.push([[0,1],[100,2]]);
queue.push([[0,2],[100,3]]);
queue.push([[1,1],[99,3]]);
queue.push([[4,2],[101,3]]);


var x=queue.pop();
console.log("ss",x)
console.log('Top:', queue.peek()); //=> 50
console.log('Size:', queue.size()); //=> 5
console.log('Contents:');
while (!queue.isEmpty()) {
  console.log(queue.pop()); //=> 40, 30, 20, 10
}*/


function setup() {
  green=false;
  frameRate(5);
  //pixelDensity(4);
  createCanvas(windowWidth, windowHeight );

  console_area=createElement('textarea', 'Console ');
  console_area.attribute("rows","40");
  console_area.attribute("cols","70");
  console_area.attribute("readonly",true);

  area= createElement('textarea', 'Visualization Log');
  area.attribute("rows","40");
  area.attribute("cols","42");
  area.attribute("readonly",true);


  code_area= createElement('textarea', 'Copy Paste Assembly Code');
  code_area.attribute("rows","40");
  code_area.attribute("cols","35");

  matrix_area = createElement('textarea', 'Copy Paste Matrix');
  matrix_area.attribute("rows","40");
  matrix_area.attribute("cols","40");

  //arduino_mega2 = loadImage('arduino_mega_small.png');
  rectMode(CENTER);
  angleMode(DEGREES);


  
  gui = createGui('D* Lite Visualizer', windowWidth - 250 , windowHeight/2 - 500);
  gui.addButton("Calculate Shortest Path", function() {
    ComputeShortestPath();
  });
  gui.addButton("Reset", function() {
    Reset();
  });
  gui.addButton("NextStep", function() {
    Execute();
  });
  gui.addGlobals('autorun');



  
  sliderRange(0, 90, 1);
  gui.addGlobals('GridSize');
  sliderRange(0, 360, 5);
  gui.addGlobals('OrientationOffSet');
  sliderRange(0.3, 3, 0.01);
  gui.addGlobals('Zoom');
  sliderRange(0, 1023,1);
  gui.addGlobals('PanZoom');

  gui.addGlobals('Background');
  console.log("ammo");


}



function draw_grid(){
  blocksize = GridSize*Zoom
  


  for (var x = 0; x < width; x +=blocksize) {
    let xb = parseInt(floor(x/blocksize))

		for (var y = 0; y < height; y += blocksize) {
      let yb = parseInt(floor(y/blocksize))
      fill(0)
      textSize(7);
      text("("+str(xb)+","+str(yb) +")", x+blocksize/3 ,  y + blocksize-10);

      
      textSize(10);
      if(rhs[xb][yb]!=Inf && g[xb][yb]!=Inf)
      text(str(rhs[xb][yb]) + " , "+ str(g[xb][yb]) , x+blocksize/4,  y + blocksize/4);


			stroke(59, 172, 251);
      strokeWeight(0.04);
      
      if(myPath[xb][yb]==1){
        fill(0,0,255)
        rect(x + blocksize/2, y + blocksize/2, blocksize,blocksize);
      }else if(GRID[xb][yb]==1){
        fill(0)
        rect(x + blocksize/2, y + blocksize/2, blocksize,blocksize);
      }

      if(s_start.x==xb && s_start.y == yb){
        fill(255,0,0)
        rect(x + blocksize/2, y + blocksize/2, blocksize,blocksize);
      }
      if(s_goal.x==xb && s_goal.y == yb ){
        fill(0,255,0)
        rect(x + blocksize/2, y + blocksize/2, blocksize,blocksize);
      }
      line(x, 0, x, height);
      line(0, y, width, y);

      //line(-width, -y, width, -y);
		}
  }
}






function draw() {
  background(Background);
  draw_grid();
  
  scale(Zoom);


  fill(55);
  rect(windowWidth/2 - 50, 100 - 80, 200,30);
  fill(255, 255, 255);
  textSize(17);
  text(current_instruction, windowWidth/2 - 50 + 20 , 100 - 80 + 5, 200,30); // Text wraps within text box

  fill(233, 255, 255);
  rect(windowWidth/2 + 10 , 100 - 60, 320,20);
  fill(0);
  textSize(13);


  //console_area.elt.value = consoleLog.join("\n");
  //area.elt.value         = regLog.join("\n");

  
  push();
  let fps = frameRate();
  fill(100);
  stroke(1);
  text("FPS: " + fps.toFixed(2),  9*width/10, 9*height/10 -20*5);
  pop();

  if(autorun){
    
    Execute();
    delay(speed);
    if(s_current==s_goal)autorun = false;
  }


}

function mousePressed(){
  console.log("> mouse pressed ",floor(mouseX/blocksize),floor(mouseY/blocksize))
  xOffset = mouseX
  yOffset = mouseY

  let xoff = floor(xOffset/(GridSize*Zoom))//*(GridSize*Zoom);
  let yoff = floor(yOffset/(GridSize*Zoom))//*(GridSize*Zoom);

  console.log("=> ",xoff,yoff);
  if(GRID[xoff][yoff]){
    GRID[xoff][yoff] = 0
    
  }else{
    GRID[xoff][yoff] = 1
    lastx = xoff
    lasty = yoff
  }

}
function mouseReleased() {

    if(mouseX==xOffset && mouseY==yOffset){
      return;
    }
    var tempGRID = [...Array(100)].map(e => Array(100).fill(0));
    console.log(" <= mouse released ",floor(mouseX/blocksize),floor(mouseY/blocksize))

    for(let bbx   = floor(xOffset/blocksize); bbx <= floor(mouseX/blocksize); bbx+=1){
      for(let bby = floor(yOffset/blocksize); bby <= floor(mouseY/blocksize); bby+=1){
        let xoff = bbx
        let yoff = bby
      
        //console.log("=> ",xoff,yoff);

        tempGRID[xoff][yoff] = 1
        
      }
    }
    for(let bbx   = 0; bbx < 100; bbx+=1){
      for(let bby = 0; bby < 100; bby+=1){
        let xoff = bbx
        let yoff = bby
      
        if(tempGRID[xoff][yoff])
        if(GRID[xoff][yoff] && (xoff!=lastx || yoff!=lasty)){
          GRID[xoff][yoff] = 0
        }else{
          GRID[xoff][yoff] = 1
        }
        
      }
    }




}
function mouseWheel(event) {


  print(event.delta);
  //move the square according to the vertical scroll amount
  //if(event.delta>0){
    if(mouseY < windowHeight*2/3 && false){
      Zoom+=event.delta*0.01;
    }
  //}
  //uncomment to block page scrolling
  //return false;
  return false;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function ResetWindow() {

  Zoom=1;
  bx=0;
  by=0;

}
function delay(ms) {
  var cur_d = new Date();
  var cur_ticks = cur_d.getTime();
  var ms_passed = 0;
  while(ms_passed < ms) {
      var d = new Date();  // Possible memory leak?
      var ticks = d.getTime();
      ms_passed = ticks - cur_ticks;
      // d = null;  // Prevent memory leak?
  }
}
function Reset() {
  s_last = s_start
  queue = new PriorityQueue((a, b) => comp(a[1],b[1]));
  km = 0;
  rhs = [...Array(100)].map(e => Array(100).fill(Inf));
  g   = [...Array(100)].map(e => Array(100).fill(Inf)); 
  rhs[s_goal.x][s_goal.y] = 0;
  queue.push([[s_goal.x,s_goal.y],CalculateKey(s_goal)]);

}
function Traverse(pos){
    if(pos.x < 0 || pos.x >100 || pos.y < 0 || pos.y >100 || pos==s_goal){
      return;
    }
    myPath[pos.x][pos.y] = 1
}

function give_rhs(x,y){
  if(x < 0 || x >100 || y < 0 || y >100)return Inf

  return rhs[x][y];

}

function Execute(){
    //current
    c = s_current
    if(c==s_goal)return

    var t   = [ [0,1], [1,0] , [-1,0], [0,-1]]
    var lis = [ give_rhs(c.x,c.y+1),give_rhs(c.x+1,c.y),give_rhs(c.x-1,c.y),give_rhs(c.x,c.y-1)  ]

    var togo  = lis.indexOf(Math.min(...lis))
    s_current.x += t[togo][0]
    s_current.y += t[togo][1]

    Traverse(s_current)

}


