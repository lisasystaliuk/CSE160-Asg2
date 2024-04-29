class Cube {
  constructor(color=[1.0,1.0,1.0], matrix=new Matrix4()) {
    this.type = 'cube';
    // this.position = position;
    this.color = color;
    // this.size = size;
    // this.segments = segments;
    this.matrix = matrix;

  }

  render() {
    // let xy = this.position;
    var rgba = this.color;
    var M = this.matrix;
    // var size = this.size;

    // // Pass the color of a point to u_FragColor variable
    // gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // // Pass the matrix to u_ModelMatrix attribute
    // gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

    drawCube(M, rgba);


  }
}
function drawCube(M, color) {
    // var n = 36;
    // vertices = [[]]
    gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
    // var extraPt = 1;
    var baseX = 0.0;
    var baseY = 0.0;
    var baseZ = 0.0;
    var sideLength = 1.0;
    var frontOne = [baseX, baseY, baseZ,   baseX+sideLength, baseY+sideLength, baseZ,    baseX+sideLength, baseY, baseZ];
    var frontTwo = [baseX, baseY, baseZ,   baseX+sideLength, baseY+sideLength, baseZ,    baseX, baseY+sideLength, baseZ];

    const backOne = [baseX, baseY, baseZ+sideLength,   baseX+sideLength, baseY+sideLength, baseZ+sideLength,       baseX+sideLength, baseY, baseZ+sideLength];
    const backTwo = [baseX, baseY, baseZ+sideLength,   baseX+sideLength, baseY+sideLength, baseZ+sideLength,       baseX, baseY+sideLength, baseZ+sideLength];

    const topOne = [baseX, baseY+sideLength, baseZ,   baseX+sideLength, baseY+sideLength, baseZ+sideLength,       baseX, baseY+sideLength, baseZ+sideLength];
    const topTwo = [baseX, baseY+sideLength, baseZ,   baseX+sideLength, baseY+sideLength, baseZ+sideLength,       baseX+sideLength, baseY+sideLength, baseZ]; 

    const bottomOne = [baseX, baseY, baseZ,   baseX+sideLength, baseY, baseZ+sideLength,       baseX, baseY, baseZ+sideLength];
    const bottomTwo = [baseX, baseY, baseZ,   baseX+sideLength, baseY, baseZ+sideLength,       baseX+sideLength, baseY, baseZ]; 

    const leftOne = [baseX, baseY, baseZ+sideLength,   baseX, baseY+sideLength, baseZ,     baseX, baseY, baseZ];
    const leftTwo = [baseX, baseY, baseZ+sideLength,   baseX, baseY+sideLength, baseZ,     baseX, baseY+sideLength, baseZ+sideLength];

    const rightOne = [baseX+sideLength, baseY, baseZ+sideLength,   baseX+sideLength, baseY+sideLength, baseZ,                  baseX+sideLength, baseY, baseZ];
    const rightTwo = [baseX+sideLength, baseY, baseZ+sideLength,   baseX+sideLength, baseY+sideLength, baseZ+sideLength,       baseX+sideLength, baseY+sideLength, baseZ];

    
    // Pass the matrix to u_ModelMatrix attribute
    gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);
    
    // Front of a cube
    drawTriangle3D(frontOne);
    drawTriangle3D(frontTwo);

    // back of the cube
    drawTriangle3D(backOne);
    drawTriangle3D(backTwo);
    // Other sides of the cube top, botton, left, right back
    // <fill this in yourself>
    // console.log(rgba);
    //Lighting
    gl.uniform4f(u_FragColor, color[0]*.9, color[1]*.9, color[2]*.9, color[3]);

    //Top of the cube
    drawTriangle3D(topOne);
    drawTriangle3D(topTwo);

    // Bottom of the cube
    drawTriangle3D(bottomOne);
    drawTriangle3D(bottomTwo);


    // // left
    drawTriangle3D(leftOne);
    drawTriangle3D(leftTwo);
    // // right
    drawTriangle3D(rightOne);
    drawTriangle3D(rightTwo);
    
}