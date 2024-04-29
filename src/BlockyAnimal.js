// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform float u_Size;
  uniform vec4 u_FragColor;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  // if (!gl) {
  //   console.log('Failed to get the rendering context for WebGL');
  //   return;
  // }
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}


function connectVariablesToGLSL()
{
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  //Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  // Retrieve the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}
function addActionsforHtmlUI()
{
  document.getElementById("clearCanvas").onclick = function() {
    // clear the shapes list
    shapesList = [];
    // redraw the canvas
    renderAllShapes();
  };
  document.getElementById('modePoint').onclick = function() {
    currentMode = POINT;
  };

  document.getElementById('modeTriangle').onclick = function() {
    currentMode = TRIANGLE;
  };
  document.getElementById('modeCircle').onclick = function() {
    currentMode = CIRCLE;
  };
  document.getElementById("redSlider").oninput = updateColor;
  document.getElementById("greenSlider").oninput = updateColor;
  document.getElementById("blueSlider").oninput = updateColor;

  document.getElementById("sizeSlider").oninput = function() {
    currentSize = parseFloat(this.value);
  };
  document.getElementById("segmentsSlider").oninput = function() {
    currentSegments = parseInt(this.value); // Update the global variable controlling segments
  };
  document.getElementById("cameraSlider").oninput = function() {
    currentAngle = parseInt(this.value); // Update the global variable controlling angle
    renderAllShapes();
  };
  document.getElementById("cameraSlider").oninput = function() {
    currentAngle = parseInt(this.value); // Update the global variable controlling angle
    renderAllShapes();
  };
  document.getElementById("yellowSlider").oninput = function() {
    currentYellow = parseInt(this.value); // Update the global variable controlling angle
    renderAllShapes();
  };
  document.getElementById("magentaSlider").oninput = function() {
    currentMagenta = parseInt(this.value); // Update the global variable controlling angle
    renderAllShapes();
  };
  document.getElementById('animationONButtonY').onclick = function() {
    isAnimateY = true;
  };
  document.getElementById('animationOFFButtonY').onclick = function() {
    isAnimateY = false;
  };
  document.getElementById('animationONButtonM').onclick = function() {
    isAnimateM = true;
  };
  document.getElementById('animationOFFButtonM').onclick = function() {
    isAnimateM = false;
  };
  document.getElementById("leftArmSlider").oninput = function() {
    currentLeftArm = parseInt(this.value); // Update the global variable controlling angle
    renderAllShapes();
  };
  document.getElementById("rightArmSlider").oninput = function() {
    currentRightArm = parseInt(this.value); // Update the global variable controlling angle
    renderAllShapes();
  };
  document.getElementById('animationONButtonLA').onclick = function() {
    isAnimateLA = true;
  };
  document.getElementById('animationOFFButtonLA').onclick = function() {
    isAnimateLA = false;
  };
  document.getElementById('animationONButtonRA').onclick = function() {
    isAnimateRA = true;
  };
  document.getElementById('animationOFFButtonRA').onclick = function() {
    isAnimateRA = false;
  };
  document.getElementById("leftLegSlider").oninput = function() {
    currentLeftLeg = parseInt(this.value); // Update the global variable controlling angle
    renderAllShapes();
  };
  document.getElementById("rightLegSlider").oninput = function() {
    currentRightLeg = parseInt(this.value); // Update the global variable controlling angle
    renderAllShapes();
  };
  document.getElementById('animationONButtonLL').onclick = function() {
    isAnimateLL = true;
  };
  document.getElementById('animationOFFButtonLL').onclick = function() {
    isAnimateLL = false;
  };
  document.getElementById('animationONButtonRL').onclick = function() {
    isAnimateRL = true;
  };
  document.getElementById('animationOFFButtonRL').onclick = function() {
    isAnimateRL = false;
  };
  document.getElementById("drawPineappleButton").onclick = drawPineapple;
  // document.getElementById("drawSnowflakeButton").addEventListener("click", drawSnowflake);
  document.getElementById('drawSnowflakeButton').onclick = function() {
    currentMode = SNOWFLAKE;
  };
  
}
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 3;
const MY_DRAW = 4;
const SNOWFLAKE = 5;
let currentColor = [1.0, 1.0, 1.0, 1.0]; // Default color: white
let currentSize = 10;
let currentAngle = 0;
let currentYellow = 0;
let isAnimateY = false;
let isAnimateM = false;
let isAnimateLA = false;
let isAnimateRA = false;
let isAnimateLL = false;
let isAnimateRL = false;
let currentMagenta = 0;
let currentLeftArm = 0;
let currentRightArm = 0;
let currentLeftLeg = 0;
let currentRightLeg = 0;
let shapesList = [];
let currentMode = POINT; // Can be POINT or TRIANGLE or CIRCLE
let currentSegments = 10;
const maskColor = [0/255,23/255,156/255,1];
const furColor = [235/255,120/255,15/255,1];
const anotherfurColor = [0.815,0.454,0.121,1];
const eyeColor = [0, 0, 0, 1];
const whites = [182/255,178/255,178/255,1]
const furColorThree = [212/255,101/255,5/255,1];



function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsforHtmlUI();

  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = click;
  // canvas.onmousedown = function(ev) { // Mouse is pressed
  //   click(ev);
  // };

  // canvas.onmousemove = function(ev) { // Mouse is moving
  //   if (ev.buttons === 1) { // Check if the left button is being pressed
  //     click(ev);
  //   }
  // };


  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // renderAllShapes();
  requestAnimationFrame(tick);
}
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;
function tick() 
{
  g_seconds = performance.now()/1000.0-g_startTime;
  // console.log(g_seconds);
  updateAnimationAngles();
  renderAllShapes();
  //tell the browser to update again when it has time
  requestAnimationFrame(tick);
}
function updateAnimationAngles() {
  if(isAnimateY) {
    currentYellow = 45*Math.sin(g_seconds);
  }
  if(isAnimateM) {
    currentMagenta = 45*Math.sin(3*g_seconds);
  }
  if(isAnimateLA) {
    currentLeftArm = 45*Math.sin(g_seconds);
  }
  if(isAnimateRA) {
    currentRightArm = 45*Math.sin(g_seconds);
  }
  if(isAnimateLL) {
    currentLeftLeg = 45*Math.sin(g_seconds);
  }
  if(isAnimateRL) {
    currentRightLeg = 45*Math.sin(g_seconds);
  }
}
function updateColor() {
  var red = parseFloat(document.getElementById('redSlider').value);
  var green = parseFloat(document.getElementById('greenSlider').value);
  var blue = parseFloat(document.getElementById('blueSlider').value);
  currentColor = [red, green, blue, 1.0];
}

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];
function click(ev) {
  [x,y] = convertCoordinatesEventToGL(ev);
  if (currentMode == SNOWFLAKE) {
    let snowflake = new Snowflake([x, y], currentSize, currentColor.slice()); // Drawing white snowflakes
    shapesList.push(snowflake);
    renderAllShapes();
  }
  else if (currentMode == POINT) {
    let point = new Point([x, y], currentColor.slice(), currentSize);
    shapesList.push(point);
  } else if (currentMode == TRIANGLE) {
    let triangle = new Triangle([x,y], currentColor.slice(), currentSize);
    shapesList.push(triangle);
  }
  else if(currentMode == CIRCLE) {
    let circle = new Circle([x,y], currentColor.slice(), currentSize, currentSegments);
    shapesList.push(circle);
  }
  else if(currentMode == MY_DRAW) {
      // Write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // renderAllShapes();
    }
  renderAllShapes();
}
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return([x,y]);
}
function renderAllShapes()
{
  gl.clear (gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  let startTime = performance.now();


  //pass the matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(currentAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  // var len = shapesList.length;
  // for(var i = 0; i < len; i++) {
  //   shapesList[i].render();
  // }

  //Draw a test triangle
  // drawTriangle3D([-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0]);

  // //Draw a cube
  // var body = new Cube([0.203, 0.203, 0.515,1]);
  // body.matrix.translate(-.25, -.75, 0.0); //translate: args: x, y, and z
  // body.matrix.rotate(-5, 1, 0, 0);
  // body.matrix.scale(0.5, .3, .5);
  // body.render();

  //Draw body
  var body = new Cube(anotherfurColor);
  body.matrix.setTranslate(0, -.5, 0.0);
  // body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.rotate(-currentYellow,1,0,0);
  // let rotateOpt = isAnimate ? 45*Math.sin(g_seconds) : -currentYellow;
  // leftArm.matrix.rotate(rotateOpt,0,0,1);
  var bodyCoordinates = new Matrix4(body.matrix);
  body.matrix.scale(0.25, .35, .2);
  body.matrix.translate(-.5, .9, 0.3); //translate: args: x, y, and z
  // leftArm.matrix.rotate(45, 0, 0, 1);
  body.render();
  //Test box
  var head = new Cube(furColor);
  head.matrix = bodyCoordinates;//leftArm.matrix;
  // box.matrix.translate(-0.1, .7, 0); //translate: args: x, y, and z
  // box.matrix.rotate(-30, 1, 0, 0);
  // box.matrix.scale(.2, .4, .2);
  head.matrix. translate(0, 0.65, 0); 
  head.matrix.rotate (-currentMagenta,0,1,0);
  var headCoordinates = new Matrix4(head.matrix)
  head.matrix.scale(.5,.3,.3);
  head.matrix.translate(-.5,0,.0,0.4);
  // box.matrix. translate(-1, 1, 0,0);
  head.render();

  var lEar = new Cube(whites);
  lEar.matrix = headCoordinates;//leftArm.matrix;
  // box.matrix.translate(-0.1, .7, 0); //translate: args: x, y, and z
  // box.matrix.rotate(-30, 1, 0, 0);
  // box.matrix.scale(.2, .4, .2);
  lEar.matrix.translate(-.1, .3, 0); 
  // lEar.matrix.rotate (-currentMagenta,0,0,1);
  // var headCoordinates = new Matrix4(head.matrix)
  lEar.matrix.scale(.1,.05,.05);
  lEar.matrix.translate(-.5,0,.0,0);
  var earCoordinates = new Matrix4(lEar.matrix)
  // box.matrix. translate(-1, 1, 0,0);
  lEar.render();

  var rEar = new Cube(whites);
  rEar.matrix = headCoordinates;//leftArm.matrix;
  // box.matrix.translate(-0.1, .7, 0); //translate: args: x, y, and z
  // box.matrix.rotate(-30, 1, 0, 0);
  // box.matrix.scale(.2, .4, .2);
  rEar.matrix.translate(2.5, -0.01, 0); 
  // rEar.matrix.rotate (-currentMagenta,0,0,1);
  // // var headCoordinates = new Matrix4(head.matrix)
  // rEar.matrix.scale(.05,.05,.05);
  // rEar.matrix.translate(-.5,0,.0,0);
  // var earCoordinates = new Matrix4(lEar.matrix)
  // box.matrix. translate(-1, 1, 0,0);
  rEar.render();

  //draw left arm
  var leftArm = new Cube(furColorThree);
  leftArm.matrix = bodyCoordinates;
  leftArm.matrix.setTranslate(-.5, -.5, 0.0);
  leftArm.matrix.translate(0.17, .3, 0.05);
  // leftArm.matrix.rotate(-5, 1, 0, 0);
  var uArmCoordinates = new Matrix4(leftArm.matrix);
  // leftArm.matrix.rotate(-currentLeftArm,1,0.5,0);
  // // let rotateOpt = isAnimate ? 45*Math.sin(g_seconds) : -currentYellow;
  // // leftArm.matrix.rotate(rotateOpt,0,0,1);
  // var yellowCoordinates = new Matrix4(body.matrix);
  leftArm.matrix.scale(0.22, .4, .2);
  // leftArm.matrix.translate(-.5, 0, -0.001); //translate: args: x, y, and z
  // leftArm.matrix.rotate(45, 0, 0, 1);
  leftArm.render();

  var rightArm = new Cube(furColorThree);
  rightArm.matrix = bodyCoordinates;
  // rightArm.matrix.setTranslate(-.5, -.5, 0.0);
  // leftArm.matrix.translate(0.17, .9, 0.05);
  // rightArm.matrix.rotate(-5, 1, 0, 0);


  // Apply rotation
  rightArm.matrix.rotate(-currentRightArm,1,0.5,0); 

  // rightArm.matrix.rotate(-currentRightArm,1,0,0);
  // // let rotateOpt = isAnimate ? 45*Math.sin(g_seconds) : -currentYellow;
  // // leftArm.matrix.rotate(rotateOpt,0,0,1);
  // var yellowCoordinates = new Matrix4(body.matrix);
  // rightArm.matrix.scale(0.25, .7, .2);
  rightArm.matrix.translate(2, 0, 0); //translate: args: x, y, and z
  // leftArm.matrix.rotate(45, 0, 0, 1);
  rightArm.render();
  // Colors and dimensions can be adjusted
let leftLeg = new Cube(furColor);
let rightLeg = new Cube(furColor);

// Assuming body coordinates are already set up
// Dimensions for translation are hypothetical and should be adjusted based on your model scale
leftLeg.matrix.translate(-0.5, -1.0, 0); // Move left leg to the left and downward from the body center
leftLeg.matrix.scale(0.12, .4, .1);
rightLeg.matrix.scale(0.12, .4, .1);
rightLeg.matrix.translate(.5, -1.4, 0.5); // Move right leg to the right and downward from the body center
leftLeg.matrix.translate(3, 1.1, 0.5);
// Example rotation for a walking animation
// These angles would be dynamically updated in an animation loop
leftLeg.matrix.rotate(currentLeftLeg, 1, 0, 0); // Rotate around the x-axis by 20 degrees
rightLeg.matrix.rotate(-currentRightLeg, 1, 0, 0); // Rotate around the x-axis by -20 degrees
leftLeg.render();
rightLeg.render();
  


  
  //A bunch of rotating cubes
  // var K= 2000.0;
  // for (var i=1; i<K; i++) {
  //   var c = new Cube();
  //   c.matrix.translate(-.8,1.9*i/K-1.0,0); 
  //   c.matrix.rotate(g_seconds*100,1,1,1);
  //   c.matrix.scale(.1, 0.5/K, 1.0/K);
  //   c.render();
  // }


  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
  // console.log(`Render time: ${endTime - startTime} milliseconds`);
}
function sendTextToHTML(text, htmlID)
{
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

function drawPineapple() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);  // Ensure the viewport is correctly set

  const rows = 6;
  const scale = 1.5;
  const xoffset = 0.1 * scale;
  const shift = 0.2 * scale;
  const tX = [-0.1 * scale, 0, 0.1 * scale];
  const tY = [-0.4 * scale, -0.3 * scale, -0.4 * scale];
  const orange = [1.0, 0.65, 0.0, 1.0];
  const yellow = [1.0, 1.0, 0.0, 1.0];
  const orellow = [1.0, 0.825, 0, 1.0]
  var vertices  = [];
  var color = [];
  var yOffset;
  for (let i = 0; i < rows; i++) {
      yOffset = 0.1 * i * scale;
      const currentXoffset = (i % 2 === 0) ? 0 : -xoffset;
      vertices = [
          tX[0] + currentXoffset, tY[0] + yOffset,
          tX[1] + currentXoffset, tY[1] + yOffset,
          tX[2] + currentXoffset, tY[2] + yOffset
      ];
      if(i != rows -1)
      {
        // First triangle vertices (orange)
        color = orange;
        vertices = [tX[1]-shift + currentXoffset, tY[1] + yOffset,
        tX[0] + currentXoffset, tY[0] + yOffset,
        tX[1] + currentXoffset, tY[1] + yOffset];
        gl.uniform4fv(u_FragColor, new Float32Array(color));
        drawTriangle(vertices);
      }
      else
      {
        // Second triangle vertices (yellow)
        color = yellow;
        vertices = [tX[0] + currentXoffset+ shift, tY[0] + yOffset, 
        tX[1] + currentXoffset + shift, tY[1] + yOffset,
        tX[2] + currentXoffset + shift, tY[2] + yOffset];
        gl.uniform4fv(u_FragColor, new Float32Array(color));
        drawTriangle(vertices);
      }
      // Second triangle vertices (yellow)
      color = yellow;
      vertices = [tX[0] + currentXoffset, tY[0] + yOffset, 
      tX[1] + currentXoffset, tY[1] + yOffset,
      tX[2] + currentXoffset, tY[2] + yOffset];
      gl.uniform4fv(u_FragColor, new Float32Array(color));
      drawTriangle(vertices);
      // Third triangle vertices (orange)
      color = orange;
      vertices = [tX[1] + currentXoffset, tY[1] + yOffset,
      tX[2] + currentXoffset, tY[2] + yOffset,
      tX[1] + shift + currentXoffset, tY[1] + yOffset];
      gl.uniform4fv(u_FragColor, new Float32Array(color));
      drawTriangle(vertices);
      if (i != 0 && i != rows - 1) {
          var extraXOffset = currentXoffset + (i % 2 == 0 ? -shift : shift);
          // Fourth triangle (yellow)
          color = yellow;
          vertices = [tX[0] + extraXOffset, tY[0] + yOffset,
          tX[1] + extraXOffset, tY[1] + yOffset,
          tX[2] + extraXOffset, tY[2] + yOffset];
          gl.uniform4fv(u_FragColor, new Float32Array(color));
          drawTriangle(vertices);
          if(i % 2 == 1)
          {   
            color = orange;
            vertices = [tX[1] + extraXOffset, tY[1] + yOffset,
            tX[2] + extraXOffset, tY[2] + yOffset,
            tX[1] + shift + extraXOffset, tY[1] + yOffset];
            gl.uniform4fv(u_FragColor, new Float32Array(color));
            drawTriangle(vertices);
          }
          else 
          {
            color = yellow;
            vertices = [tX[0] + extraXOffset+ 2*shift, tY[0] + yOffset, 
            tX[1] + extraXOffset+ 2*shift, tY[1] + yOffset,
            tX[2] + extraXOffset+ 2*shift, tY[2] + yOffset];
            gl.uniform4fv(u_FragColor, new Float32Array(color));
            drawTriangle(vertices);
            if(i == 2)
            {
              color = orellow;
              vertices = [tX[1] + extraXOffset, tY[1] + yOffset,
              tX[2] + extraXOffset -shift, tY[2] + yOffset,
              tX[2] + extraXOffset - shift, tY[2] + 2*yOffset];
              gl.uniform4fv(u_FragColor, new Float32Array(color));
              drawTriangle(vertices);
              color = orellow;
              vertices = [tX[1] + extraXOffset+ shift, tY[1] + 2*yOffset,
              tX[2] + extraXOffset + 2*shift, tY[2] + yOffset,
              tX[2] + extraXOffset + 2*shift, tY[2] + 2*yOffset];
              gl.uniform4fv(u_FragColor, new Float32Array(color));
              drawTriangle(vertices);
            
            }
          }
        }
      // console.log('Drawing triangle with vertices:', vertices, 'and color:', color);
  }
  var startX = tX[0];
  var startY = tY[0]+yOffset+0.15;
  var endX = tX[2];
  var endY = tY[2]+yOffset+ 0.15;
  var startColor = 0.3
  var steps = (1-startColor)/0.1;
  var leaf_color = [0, 0.3, 0.0, 1.0];
  color = leaf_color;
  vertices = [startX, startY,
    0, 1,
    endX, endY];
  gl.uniform4fv(u_FragColor, new Float32Array(color));
  drawTriangle(vertices);
  endX = 0;
  for(let i = 1; i <= steps; i++) {
    color[1] = startColor+0.1*i
    vertices = [startX, startY,
      -0.1*i, 1-0.1*i,
      endX, endY];
    gl.uniform4fv(u_FragColor, new Float32Array(color));
    drawTriangle(vertices);
    vertices = [startX+shift, startY,
      0.1*i, 1-0.1*i,
      endX, endY];
    gl.uniform4fv(u_FragColor, new Float32Array(color));
    drawTriangle(vertices);
  }
}
function drawSnowflake() {
  const points = 6; // Number of points in the snowflake
  const layers = 3; // Number of layers of detail in each arm
  const angleStep = Math.PI / points;

  gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas

  for (let i = 0; i < points; i++) {
      let angle = i * 2 * angleStep;
      for (let j = 1; j <= layers; j++) {
          let armLength = j / layers * 0.2; // Scale the length of each arm layer
          let x1 = armLength * Math.cos(angle);
          let y1 = armLength * Math.sin(angle);
          let x2 = armLength * Math.cos(angle + angleStep);
          let y2 = armLength * Math.sin(angle + angleStep);
          drawTriangle([0, 0, x1, y1, x2, y2]);
      }
  }
}
