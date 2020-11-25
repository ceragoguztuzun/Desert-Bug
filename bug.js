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
var torso_width = 4.0;
var torso_height = 1.0;

var head_width = 1.0;
var head_height = 1.0;

var arm_width = 0.3;
var arm_height = 2.0;

var anthena_width = 0.2;
var anthena_height = 3.5;

var lightsaber_width = 1.0;
var lightsaber_height = 4.0;
//
var numNodes = 23;
var numAngles = 24;
var angle = 0;
var coords_x;
var coords_y;
var coords_z;
var coords = [coords_x, coords_y, coords_z];
//
var jumpFlag = false;
var animFlag = false;
var interpolation_fr_index = 0;
var t;
var jump_theta = [];
var jump_coords = [];
var anim_theta = [];
var anim_coords = [];

//angles for each node
var theta = [180, 0, 30, -30, -60, 30, 15, 60, -30, -15, -60, 30, 15, 60, -30, -15, -60, 30, 15, 60, -30, -15, 0];

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
            m = translate( coords);
    
            //m = rotate(theta[torso_id], 0, 1, 0);
            m = mult(m, rotate(theta[torso_id], 0, 1, 0))
            m = mult(m, rotate(theta[torso_id], 0, 0, 1))
            // form node
            figure[torso_id] = createNode(m, torso, null, head_id);
            break;
        case head_id:
            // configure m
            m = translate(head_height * 1.75, torso_height + -head_height, 0.0);
            m = mult(m, rotate(theta[head_id], 0, 1, 0))
            m = mult(m, translate(0.0, -0.5 * head_height, 0.0));
            // form node
            figure[head_id] = createNode(m, head, upperlegR_id, anthena1_id);
            break;
        case anthena1_id:
            // configure m
            m = rotate(180, 1, 0, 0);
            m = mult(m, translate(0, 0.9 * torso_height - 0.5 * anthena_height, 0));
            m = mult(m, rotate(theta[anthena1_id], 1, 0, 0));
            // form node
            figure[anthena1_id] = createNode(m, anthena1, anthena2_id, null);
            break;
        case anthena2_id:
            // configure m
            m = rotate(180, 1, 0, 0);
            m = mult(m, translate(0, 0.9 * torso_height - 0.5 * anthena_height, 0));
            m = mult(m, rotate(theta[anthena2_id], 1, 0, 0));
            // form node
            figure[anthena2_id] = createNode(m, anthena2, null, null);
            break;
        case upperlegR_id:
            // configure m
            m = translate(torso_height * (0.75), arm_height - 1, (torso_width * -0.3));
            m = mult(m, rotate(theta[upperlegR_id], 1, 0, 0));
            // form node
            figure[upperlegR_id] = createNode(m, upperlegs, upperlegL_id, upperlegR1_id);
            break;
        case upperlegR1_id:
            // configure m
            m = translate(torso_height * (0.05), arm_height - 0.2, (torso_width * -0.03));
            m = mult(m, rotate(theta[upperlegR1_id], 1, 0, 0));
            // form node
            figure[upperlegR1_id] = createNode(m, legs1, null, upperlegR2_id);
            break;
        case upperlegR2_id:
            // configure m
            m = translate(torso_height * (0.025), arm_height - 1.1, (torso_width * -0.002));
            m = mult(m, rotate(theta[upperlegR2_id], 1, 0, 0));
            // form node
            figure[upperlegR2_id] = createNode(m, legs2, null, lightsaber_id);
            break;

        case upperlegL_id:
            // configure m
            m = translate(torso_height * (0.75), arm_height - 1, (torso_width * 0.3));
            m = mult(m, rotate(theta[upperlegL_id], 1, 0, 0));
            // form node
            figure[upperlegL_id] = createNode(m, upperlegs, midlegR_id, upperlegL1_id);
            break;
        case upperlegL1_id:
            // configure m
            m = translate(torso_height * (0.05), arm_height - 0.2, (torso_width * 0.03));
            m = mult(m, rotate(theta[upperlegL1_id], 1, 0, 0));
            // form node
            figure[upperlegL1_id] = createNode(m, legs1, null, upperlegL2_id);
            break;
        case upperlegL2_id:
            // configure m
            m = translate(torso_height * (0.025), arm_height - 1.1, (torso_width * -0.002));
            m = mult(m, rotate(theta[upperlegL2_id], 1, 0, 0));
            // form node
            figure[upperlegL2_id] = createNode(m, legs2, null, null);
            break;

        case midlegR_id:
            // configure m
            m = translate(-0.5 * torso_height * (0.75), arm_height - 1, (torso_width * -0.3));
            m = mult(m, rotate(theta[midlegR_id], 1, 0, 0));
            // form node
            figure[midlegR_id] = createNode(m, upperlegs, midlegL_id, midlegR1_id);
            break;
        case midlegR1_id:
            // configure m
            m = translate(-0.5 * torso_height * (0.05), arm_height - 0.2, (torso_width * -0.03));
            m = mult(m, rotate(theta[midlegR1_id], 1, 0, 0));
            // form node
            figure[midlegR1_id] = createNode(m, legs1, null, midlegR2_id);
            break;
        case midlegR2_id:
            // configure m
            m = translate(-0.5 * torso_height * (0.025), arm_height - 1.1, (torso_width * -0.002));
            m = mult(m, rotate(theta[midlegR2_id], 1, 0, 0));
            // form node
            figure[midlegR2_id] = createNode(m, legs2, null, null);
            break;

        case midlegL_id:
            // configure m
            m = translate(-0.5 * torso_height * (0.75), arm_height - 1, (torso_width * 0.3));
            m = mult(m, rotate(theta[midlegL_id], 1, 0, 0));
            // form node
            figure[midlegL_id] = createNode(m, upperlegs, backlegR_id, midlegL1_id);
            break;
        case midlegL1_id:
            // configure m
            m = translate(-0.5 * torso_height * (0.05), arm_height - 0.2, (torso_width * 0.03));
            m = mult(m, rotate(theta[midlegL1_id], 1, 0, 0));
            // form node
            figure[midlegL1_id] = createNode(m, legs1, null, midlegL2_id);
            break;
        case midlegL2_id:
            // configure m
            m = translate(-0.5 * torso_height * (0.025), arm_height - 1.1, (torso_width * -0.002));
            m = mult(m, rotate(theta[midlegL2_id], 1, 0, 0));
            // form node
            figure[midlegL2_id] = createNode(m, legs2, null, null);
            break;

        case backlegR_id:
            // configure m
            m = translate(-2 * torso_height * (0.75), arm_height - 1, (torso_width * -0.3));
            m = mult(m, rotate(theta[backlegR_id], 1, 0, 0));
            // form node
            figure[backlegR_id] = createNode(m, upperlegs, backlegL_id, backlegR1_id);
            break;
        case backlegR1_id:
            // configure m
            m = translate(-2 * torso_height * (0.05), arm_height - 0.2, (torso_width * -0.03));
            m = mult(m, rotate(theta[backlegR1_id], 1, 0, 0));
            // form node
            figure[backlegR1_id] = createNode(m, legs1, null, backlegR2_id);
            break;
        case backlegR2_id:
            // configure m
            m = translate(-2 * torso_height * (0.025), arm_height - 1.1, (torso_width * -0.002));
            m = mult(m, rotate(theta[backlegR2_id], 1, 0, 0));
            // form node
            figure[backlegR2_id] = createNode(m, legs2, null, null);
            break;

        case backlegL_id:
            // configure m
            m = translate(-2 * torso_height * (0.75), arm_height - 1, (torso_width * 0.3));
            m = mult(m, rotate(theta[backlegL_id], 1, 0, 0));
            // form node
            figure[backlegL_id] = createNode(m, upperlegs, null, backlegL1_id);
            break;
        case backlegL1_id:
            // configure m
            m = translate(-2 * torso_height * (0.05), arm_height - 0.2, (torso_width * 0.03));
            m = mult(m, rotate(theta[backlegL1_id], 1, 0, 0));
            // form node
            figure[backlegL1_id] = createNode(m, legs1, null, backlegL2_id);
            break;
        case backlegL2_id:
            // configure m
            m = translate(-2 * torso_height * (0.025), arm_height - 1.1, (torso_width * -0.002));
            m = mult(m, rotate(theta[backlegL2_id], 1, 0, 0));
            // form node
            figure[backlegL2_id] = createNode(m, legs2, null, null);
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
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * torso_height, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(torso_width, torso_height, torso_width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

// draw HEAD SECTION
function head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * head_height, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(head_width, head_height, head_width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function anthena1() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * anthena_height, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(anthena_width, anthena_height, anthena_width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function anthena2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * anthena_height, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(anthena_width, anthena_height, anthena_width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

// draw UPPER LEG SECTION
function upperlegs() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * arm_height, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(arm_width, arm_height, arm_width));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function legs1() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.25 * arm_height, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(arm_width * 0.5, arm_height * 0.6, arm_width * 0.5));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function legs2() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.25 * arm_height, 0.0));
    instanceMatrix = mult(instanceMatrix, scale4(arm_width * 0.2, arm_height * 0.4, arm_width * 0.2));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
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

    
	var saveButton = document.getElementById("save_button");
    var input = document.getElementById('txt_input');
    anim_coords.push( coords);
    anim_theta.push( theta.slice());

    for(var i = 0; i < 3; i++) coords[i] = 0; 

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    instanceMatrix = mat4();

    t = 0;

    //projectionMatrix = ortho(-10.0, 10.0, -10.0, 10.0, -10.0, 10.0);
    projectionMatrix = perspective(120.0, 1.0, 0.0001, 10);
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
    document.getElementById("torso_angle_slider").oninput = function () {
        theta[torso_id] = event.srcElement.value;
        initNodes(torso_id);
        console.log("torso theta: ", theta[torso_id]);
    };
    document.getElementById("head1_angle_slider").oninput = function () {
        theta[head_id] = event.srcElement.value;
        initNodes(head_id);
        console.log("head theta: ", theta[head_id]);
    };

    document.getElementById("anthena1_angle_slider").oninput = function () {
        theta[anthena1_id] = event.srcElement.value;
        initNodes(anthena1_id);
        console.log("anthena1 theta: ", theta[anthena1_id]);
    };
    document.getElementById("anthena2_angle_slider").oninput = function () {
        theta[anthena2_id] = event.srcElement.value;
        initNodes(anthena2_id);
        console.log("anthena2 theta: ", theta[anthena2_id]);
    };
    document.getElementById("upperlegR_angle_slider").oninput = function () {
        theta[upperlegR_id] = event.srcElement.value;
        initNodes(upperlegR_id);
        console.log("upperlegR theta: ", theta[upperlegR_id]);
    };
    document.getElementById("upperlegL_angle_slider").oninput = function () {
        theta[upperlegL_id] = event.srcElement.value;
        initNodes(upperlegL_id);
        console.log("upperlegL theta: ", theta[upperlegL_id]);
    };

    document.getElementById("midlegL_angle_slider").oninput = function () {
        theta[midlegL_id] = event.srcElement.value;
        initNodes(midlegL_id);
        console.log("midlegL theta: ", theta[midlegL_id]);
    };

    document.getElementById("midlegR_angle_slider").oninput = function () {
        theta[midlegR_id] = event.srcElement.value;
        initNodes(midlegR_id);
        console.log("midlegR theta: ", theta[midlegR_id]);
    };

    document.getElementById("backlegL_angle_slider").oninput = function () {
        theta[backlegL_id] = event.srcElement.value;
        initNodes(backlegL_id);
        console.log("backlegL theta: ", theta[backlegL_id]);
    };

    document.getElementById("backlegR_angle_slider").oninput = function () {
        theta[backlegR_id] = event.srcElement.value;
        initNodes(backlegR_id);
        console.log("backlegR theta: ", theta[backlegR_id]);
    };

    document.getElementById("upperlegL1_angle_slider").oninput = function () {
        theta[upperlegL1_id] = event.srcElement.value;
        initNodes(upperlegL1_id);
        console.log("upperlegL1 theta: ", theta[upperlegL1_id]);
    };

    document.getElementById("upperlegR1_angle_slider").oninput = function () {
        theta[upperlegR1_id] = event.srcElement.value;
        initNodes(upperlegR1_id);
        console.log("upperlegR1 theta: ", theta[upperlegR1_id]);
    };

    document.getElementById("midlegL1_angle_slider").oninput = function () {
        theta[midlegL1_id] = event.srcElement.value;
        initNodes(midlegL1_id);
        console.log("midlegL1 theta: ", theta[midlegL1_id]);
    };
    document.getElementById("midlegR1_angle_slider").oninput = function () {
        theta[midlegR1_id] = event.srcElement.value;
        initNodes(midlegR1_id);
        console.log("midlegR1 theta: ", theta[midlegR1_id]);
    };
    document.getElementById("backlegL1_angle_slider").oninput = function () {
        theta[backlegL1_id] = event.srcElement.value;
        initNodes(backlegL1_id);
        console.log("backlegL1 theta: ", theta[backlegL1_id]);
    };
    document.getElementById("backlegR1_angle_slider").oninput = function () {
        theta[backlegR1_id] = event.srcElement.value;
        initNodes(backlegR1_id);
        console.log("backlegR1 theta: ", theta[backlegR1_id]);
    };
    document.getElementById("upperlegL2_angle_slider").oninput = function () {
        theta[upperlegL2_id] = event.srcElement.value;
        initNodes(upperlegL2_id);
        console.log("upperlegL2 theta: ", theta[upperlegL2_id]);
    };
    document.getElementById("upperlegR2_angle_slider").oninput = function () {
        theta[upperlegR2_id] = event.srcElement.value;
        initNodes(upperlegR2_id);
        console.log("upperlegR2 theta: ", theta[upperlegR2_id]);
    };
    document.getElementById("midlegL2_angle_slider").oninput = function () {
        theta[midlegL2_id] = event.srcElement.value;
        initNodes(midlegL2_id);
        console.log("midlegL2 theta: ", theta[midlegL2_id]);
    };
    document.getElementById("midlegR2_angle_slider").oninput = function () {
        theta[midlegR2_id] = event.srcElement.value;
        initNodes(midlegR2_id);
        console.log("midlegR2 theta: ", theta[midlegR2_id]);
    };
    document.getElementById("backlegL2_angle_slider").oninput = function () {
        theta[backlegL2_id] = event.srcElement.value;
        initNodes(backlegL2_id);
        console.log("backlegL2 theta: ", theta[backlegL2_id]);
    };
    document.getElementById("backlegR2_angle_slider").oninput = function () {
        theta[backlegR2_id] = event.srcElement.value;
        initNodes(backlegR2_id);
        console.log("backlegR2 theta: ", theta[backlegR2_id]);
    };

    // BUTTON EVENT LISTENERS
    document.getElementById("jump_button").onclick = function () {
        jumpFlag = true;
        animFlag = false;
        t = 0;
        interpolation_fr_index = 0;

        // init theta lists for each pose in jumping 
        jump_theta.push(
            //T,    H, A1, A2, UR, UR1, UR2, UL, UL1, UL2, MR, MR1, MR2, ML, ML1, ML2, BR, BR1, BR2, BL, BL1, BL2, L
            [-150, 0, 30, -30, -60, 30, 15, 60, -30, -15, -60, 30, 15, 60, -30, -15, -60, 30, 15, 60, -30, -15, 0],
            [-150, 0, 15, -15, -90, 60, -45, 90, -60, 45, -90, 60, -45, 90, -60, 45, -90, 60, -45, 90, -60, 45, 0],
            [-160, 0, 12, -12, -60, 60, -45, 60, -60, 45, -50, 60, -45, 50, -60, 45, -35, 60, -45, 35, -60, 45, 0],
            [-170, -75, 3, -9, -20, 60, 20, 20, -60, -25, -25, 60, 20, 25, -60, -25, -20, 60, 20, 20, -60, -25, 0],
            [-160, 0, 12, -12, -60, 60, -45, 60, -60, 45, -50, 60, -45, 50, -60, 45, -35, 60, -45, 35, -60, 45, 0],
            [-150, 0, 15, -15, -90, 60, -45, 90, -60, 45, -90, 60, -45, 90, -60, 45, -90, 60, -45, 90, -60, 45, 0],
            [-150, 0, 30, -30, -60, 30, 15, 60, -30, -15, -60, 30, 15, 60, -30, -15, -60, 30, 15, 60, -30, -15, 0],
        );

        jump_coords.push(
            // x, y, z
            [0, 0, 0],
            [0, -0.8, 0],
            [0, 2, -1],
            [0, 5, -2],
            [0, 2, -1],
            [0, -0.8, 0],
            [0, 0, 0]
        );
    };
    document.getElementById("stop_button").onclick = function () {
        if( animFlag) {
            animFlag = false;
        }
        if( jumpFlag) {
            jumpFlag = false;
        }
    };
    document.getElementById("shapeRevert_button").onclick = function () {
        if( animFlag) {
            animFlag = false;
        }
        if( jumpFlag) {
            jumpFlag = false;
        }
        theta = [180, 0, 30, -30, -60, 30, 15, 60, -30, -15, -60, 30, 15, 60, -30, -15, -60, 30, 15, 60, -30, -15, 0];
        for(var i = 0; i < 3; i++) coords[i] = 0;
        for (i = 0; i < numNodes; i++) initNodes(i);
    };
    document.getElementById("play_button").onclick = function () {
        animFlag = true;
        jumpFlag = false;
        t = 0;
        interpolation_fr_index = 0;
    };
    document.getElementById("addKeyFrame_button").onclick = function () {
        if( !jumpFlag && !animFlag)
        {    
            anim_coords.push( coords);
            anim_theta.push( theta.slice());
            for (i = 0; i < numNodes; i++) initNodes(i);
            alert("Keyframe is Added! Add more keyframes, or play your animation through the PLAY button!");
        }
        else alert("Stop the animation through STOP button to add keyframe.");
    };
    // save animation by generating a txt file.
	// used https://github.com/eligrey/FileSaver.js library for the implementation of save functionality.
	// I used the saveAs function to save the data in created Blob to a txt file.
	saveButton.addEventListener("click", function(){
		// variables to save: 
		var dataToWrite = writeToTxt();
		var blob = new Blob(dataToWrite);
		saveAs(blob, "bug_animation.txt");
    });
    // load inputted txt file
	input.addEventListener("change", function(){
		let files = input.files;
	
		if(files.length == 0) return;
	
		const file = files[0];
	
		let reader = new FileReader();
		var lines;

		reader.onload = (e) => {
			var file = e.target.result;
			// parse line by line by splitting the txt input.
			lines = file.split(/\r\n|\n/);

            jumpFlag = false;
            var line_index = 0;
            animFlag = (lines[line_index] == 'true');

            if( animFlag)
            {
                line_index++;
                var anim_tlen = parseInt(lines[line_index]);
                line_index++;
                for(var i = 0; i < anim_tlen; i++)
                {
                    var arr = [];
                    for( var j = 0; j < numNodes; j++)
                    {
                        arr.push(parseInt(lines[line_index]));
                        line_index++;
                    }
                    anim_theta.push(arr);
                }
                for(var i = 0; i < anim_tlen; i++)
                {
                    var arr = [];
                    for( var j = 0; j < 3; j++)
                    {
                        arr.push(parseInt(lines[line_index]));
                        line_index++;
                    }
                    anim_coords.push(arr);
                }
            }
		};
		reader.readAsText(file); 
	});


    for (i = 0; i < numNodes; i++) initNodes(i);

    render();
}

// Method to create a txt file of the created animation to be saved
function writeToTxt() {
	var dataToWrite = [];
    dataToWrite.push(animFlag, "\n");
    //dataToWrite.push(theta.length, "\n");

    if(animFlag)
    {
        dataToWrite.push(anim_theta.length, "\n");
        for (var i = 0; i < anim_theta.length; i++) 
        {
            for( var j = 0; j < numNodes; j++)
            {
                dataToWrite.push(anim_theta[i][j], "\n");
            }
        }
        for (var i = 0; i < anim_coords.length; i++) 
        {
            for( var j = 0; j < 3; j++)
            {
                dataToWrite.push(anim_coords[i][j], "\n");
            }
        }
    }
	return dataToWrite;
}

var render = function () {

    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // TRIVIAL RENDER
    if (!jumpFlag && !animFlag) 
    {
        traverse(torso_id);
    }
    // JUMP/ANIMATION RENDER
    else 
    {
        var anim_theta_len;
        if( jumpFlag) anim_theta_len = jump_theta.length;
        if( animFlag) anim_theta_len = anim_theta.length;
        var len = theta.length;

        // change keyframe when t = 1
        if (t < 1) 
        {
            if( jumpFlag) t = t + 0.05;
            if( animFlag) t = t + 0.01;
        }
        else 
        {
            t = 0;
            interpolation_fr_index = (interpolation_fr_index + 1) % anim_theta_len; // loop
        }
        
        var next_fr_index = (interpolation_fr_index + 1) % anim_theta_len;

        // translate by changing coords
        if( jumpFlag)
        {
            for( var i = 0; i < 3; i++) coords[i] = (1 - t)*jump_coords[interpolation_fr_index][i] + t*jump_coords[next_fr_index][i];
        }
        if( animFlag)
        {
            for( var i = 0; i < 3; i++) coords[i] = (1 - t)*anim_coords[interpolation_fr_index][i] + t*anim_coords[next_fr_index][i];
        }

        // change each angle in theta array
        for (var i = 0; i < len; i++) 
        {
            if( jumpFlag) theta[i] = (1 - t)*jump_theta[interpolation_fr_index][i] + t*jump_theta[next_fr_index][i];
            if( animFlag) theta[i] = (1 - t)*anim_theta[interpolation_fr_index][i] + t*anim_theta[next_fr_index][i];
            initNodes(i);
        }
        traverse(torso_id);
    }
    requestAnimFrame(render);
}

