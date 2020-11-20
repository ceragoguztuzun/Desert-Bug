var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

// node ids
var torso_id = 0;

var head_id = 1;
var anthena1_id = 2;
var anthena2_id = 3;

var upperlegR_id = 4;
var upperlegR1_id = 5;
var upperlegR2_id = 6;

var upperlegL_id = 7;
var upperlegL1_id = 8;
var upperlegL2_id = 9;

var midlegR_id = 10;
var midlegR1_id = 11;
var midlegR2_id = 12;

var midlegL_id = 13;
var midlegL1_id = 14;
var midlegL2_id = 15;

var backlegR_id = 16;
var backlegR1_id = 17;
var backlegR2_id = 18;

var backlegL_id = 19;
var backlegL1_id = 20;
var backlegL2_id = 21;

var lightsaber_id = 22;

// widths & heights
// TODO

var numNodes = 23;
var numAngles = 24;
var angle = 0;

// some angles may be changed but idk 
var theta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var numVertices = 24;

var stack = [];

var figure = [];

for (var i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child) {
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}

//  left-child / right sibling tree
function initNodes(id) {

    var m = mat4();

    switch (id) {

        case torso_id:
            // configure m
            // form node
            figure[torso_id] = createNode(m, torso, null, head_id);
            break;
        case head_id:
            // configure m
            // form node
            figure[head_id] = createNode(m, head, upperlegR_id, anthena1_id);
            break;
        case anthena1_id:
            // configure m
            // form node
            figure[anthena1_id] = createNode(m, anthena1, anthena2_id, null);
            break;
        case anthena2_id:
            // configure m
            // form node
            figure[anthena2_id] = createNode(m, anthena2, null, null);
            break;
        case upperlegR_id:
            // configure m
            // form node
            figure[upperlegR_id] = createNode(m, upperlegR, upperlegL_id, upperlegR1_id);
            break;
        case upperlegR1_id:
            // configure m
            // form node
            figure[upperlegR1_id] = createNode(m, upperlegR1, null, upperlegR2_id);
            break;
        case upperlegR2_id:
            // configure m
            // form node
            figure[upperlegR2_id] = createNode(m, upperlegR2, null, lightsaber_id);
            break;

        case upperlegL_id:
            // configure m
            // form node
            figure[upperlegL_id] = createNode(m, upperlegL, midlegR_id, upperlegL1_id);
            break;
        case upperlegL1_id:
            // configure m
            // form node
            figure[upperlegL1_id] = createNode(m, upperlegL1, null, upperlegL2_id);
            break;
        case upperlegL2_id:
            // configure m
            // form node
            figure[upperlegL2_id] = createNode(m, upperlegL2, null, null);
            break;

        case midlegR_id:
            // configure m
            // form node
            figure[midlegR_id] = createNode(m, midlegR, midlegL_id, midlegR1_id);
            break;
        case midlegR1_id:
            // configure m
            // form node
            figure[midlegR1_id] = createNode(m, midlegR1, null, midlegR2_id);
            break;
        case midlegR2_id:
            // configure m
            // form node
            figure[midlegR2_id] = createNode(m, midlegR2, null, null);
            break;

        case midlegL_id:
            // configure m
            // form node
            figure[midlegL_id] = createNode(m, midlegL, backlegR_id, midlegL1_id);
            break;
        case midlegL1_id:
            // configure m
            // form node
            figure[midlegL1_id] = createNode(m, midlegL1, null, midlegL2_id);
            break;
        case midlegL2_id:
            // configure m
            // form node
            figure[midlegL2_id] = createNode(m, midlegL2, null, null);
            break;

        case backlegR_id:
            // configure m
            // form node
            figure[backlegR_id] = createNode(m, backlegR, backlegL_id, backlegR1_id);
            break;
        case backlegR1_id:
            // configure m
            // form node
            figure[backlegR1_id] = createNode(m, backlegR1, null, backlegR2_id);
            break;
        case backlegR2_id:
            // configure m
            // form node
            figure[backlegR2_id] = createNode(m, backlegR2, null, null);
            break;

        case backlegL_id:
            // configure m
            // form node
            figure[backlegL_id] = createNode(m, backlegL, null, backlegL1_id);
            break;
        case backlegL1_id:
            // configure m
            // form node
            figure[backlegL1_id] = createNode(m, backlegL1, null, backlegL2_id);
            break;
        case backlegL2_id:
            // configure m
            // form node
            figure[backlegL2_id] = createNode(m, backlegL2, null, null);
            break;

        case lightsaber_id:
            // configure m
            // form node
            figure[lightsaber_id] = createNode(m, lightsaber, null, null);
            break;
    }

}

function traverse(id) {
    if (id == null) return;

    stack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[id].transform);

    figure[id].render();

    if (figure[id].child != null) traverse(figure[id].child);

    modelViewMatrix = stack.pop();

    if (figure[id].sibling != null) traverse(figure[id].sibling);
}

// draw TORSO
function torso() {
}

// draw HEAD SECTION
function head() {
}
function anthena1() {
}
function anthena2() {
}

// draw UPPER LEG SECTION
function upperlegR() {
}
function upperlegR1() {
}
function upperlegR2() {
}
function upperlegL() {
}
function upperlegL1() {
}
function upperlegL2() {
}

// draw MID LEG SECTION
function midlegR() {
}
function midlegR1() {
}
function midlegR2() {
}
function midlegL() {
}
function midlegL1() {
}
function midlegL2() {
}

// draw BACK LEG SECTION
function backlegR() {
}
function backlegR1() {
}
function backlegR2() {
}
function backlegL() {
}
function backlegL1() {
}
function backlegL2() {
}

// draw A BADASS LIGHTSABER
function lightsaber() {
}

function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
    pointsArray.push(vertices[d]);
}


function cube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0, 10.0, -10.0, 10.0, -10.0, 10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // SLIDER EVENT LISTENERS
    document.getElementById("torso_angle_slider").onchange = function () {
        theta[torso_id] = event.srcElement.value;
        initNodes(torso_id);
    };
    document.getElementById("head1_angle_slider").onchange = function () {
        theta[head_id ] = event.srcElement.value;
        initNodes(head_id );
    };

    document.getElementById("anthena1_angle_slider").onchange = function () {
        theta[anthena1_id ] = event.srcElement.value;
        initNodes(anthena1_id );
    };
    document.getElementById("anthena2_angle_slider").onchange = function () {
        theta[anthena2_id ] = event.srcElement.value;
        initNodes(anthena2_id );
    };

    document.getElementById("upperlegL_angle_slider").onchange = function () {
        theta[upperlegL_id ] = event.srcElement.value;
        initNodes(upperlegL_id );
    };
    document.getElementById("upperlegL1_angle_slider").onchange = function () {
        theta[upperlegL1_id ] = event.srcElement.value;
        initNodes(upperlegL1_id );
    };
    document.getElementById("upperlegL2_angle_slider").onchange = function () {
        theta[upperlegL2_id ] = event.srcElement.value;
        initNodes(upperlegL2_id );
    };
    document.getElementById("upperlegR_angle_slider").onchange = function () {
        theta[upperlegR_id ] = event.srcElement.value;
        initNodes(upperlegR_id );
    };
    document.getElementById("upperlegR1_angle_slider").onchange = function () {
        theta[upperlegR1_id ] = event.srcElement.value;
        initNodes(upperlegR1_id );
    };
    document.getElementById("upperlegR2_angle_slider").onchange = function () {
        theta[upperlegR2_id ] = event.srcElement.value;
        initNodes(upperlegR2_id );
    };
    document.getElementById("midlegL_angle_slider").onchange = function () {
        theta[midlegL_id ] = event.srcElement.value;
        initNodes(midlegL_id );
    };
    document.getElementById("midlegL1_angle_slider").onchange = function () {
        theta[midlegL1_id ] = event.srcElement.value;
        initNodes(midlegL1_id );
    };
    document.getElementById("midlegL2_angle_slider").onchange = function () {
        theta[midlegL2_id ] = event.srcElement.value;
        initNodes(midlegL2_id );
    };
    document.getElementById("midlegR_angle_slider").onchange = function () {
        theta[midlegR_id ] = event.srcElement.value;
        initNodes(midlegR_id );
    };
    document.getElementById("midlegR1_angle_slider").onchange = function () {
        theta[midlegR1_id ] = event.srcElement.value;
        initNodes(midlegR1_id );
    };
    document.getElementById("midlegR2_angle_slider").onchange = function () {
        theta[midlegR2_id ] = event.srcElement.value;
        initNodes(midlegR2_id );
    };
    document.getElementById("backlegL_angle_slider").onchange = function () {
        theta[backlegL_id ] = event.srcElement.value;
        initNodes(backlegL_id );
    };
    document.getElementById("backlegL1_angle_slider").onchange = function () {
        theta[backlegL1_id ] = event.srcElement.value;
        initNodes(backlegL1_id );
    };
    document.getElementById("backlegL2_angle_slider").onchange = function () {
        theta[backlegL2_id ] = event.srcElement.value;
        initNodes(backlegL2_id );
    };
    document.getElementById("backlegR_angle_slider").onchange = function () {
        theta[backlegR_id ] = event.srcElement.value;
        initNodes(backlegR_id );
    };
    document.getElementById("backlegR1_angle_slider").onchange = function () {
        theta[backlegR1_id ] = event.srcElement.value;
        initNodes(backlegR1_id );
    };
    document.getElementById("backlegR2_angle_slider").onchange = function () {
        theta[backlegR2_id ] = event.srcElement.value;
        initNodes(backlegR2_id );
    };
    document.getElementById("lightsaber_angle_slider").onchange = function () {
        theta[lightsaber_id ] = event.srcElement.value;
        initNodes(lightsaber_id );
    };

    for (i = 0; i < numNodes; i++) initNodes(i);

    render();

}


var render = function () {

    gl.clear(gl.COLOR_BUFFER_BIT);
    traverse(torso_id);
    requestAnimFrame(render);
}

