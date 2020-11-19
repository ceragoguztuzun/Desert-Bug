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

var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0];

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


function initNodes(id) {

    var m = mat4();

    switch (id) {

        case torso_id:
            m = rotate(theta[torso_id], 0, 1, 0);
            figure[torsoId] = createNode(m, torso, null, headId);
            break;
        case head_id:
        case anthena1_id:
        case anthena2_id:

        case upperlegR_id:
        case upperlegR1_id:
        case upperlegR2_id:

        case upperlegL_id:
        case upperlegL1_id:
        case upperlegL2_id:

        case midlegR_id:
        case midlegR1_id:
        case midlegR2_id:

        case midlegL_id:
        case midlegL1_id:
        case midlegL2_id:

        case backlegR_id:
        case backlegR1_id:
        case backlegR2_id:

        case backlegL_id:
        case backlegL1_id:
        case backlegL2_id:

        case lightsaber_id:
    }

}