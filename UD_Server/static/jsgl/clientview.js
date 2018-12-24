var camera, scene, renderer;
var geometry, material, mesh;
var MAPA=[];
var SOLIDS=[];
var props={};

var VIEW_W=320;
var VIEW_H=240;
var ONTWEEN = false;
var ROTASPEED = 200;
var WALKSPEED = 200;

var TEXTURES ={};
var MATERIALS  ={};

var WALKABLES = {};
var SOLIDS_OBJS = {}



function init() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    camera = new THREE.PerspectiveCamera(70, VIEW_W / VIEW_H, 0.0001, 1000);
    camera.position.z = props.y;
    camera.position.x = props.x;
    camera.position.y = 0;
    var inirot =getRandomInt(4);
    if(inirot==0){
        camera.rotation.y=0;
    }else if(inirot==1){
        camera.rotation.y=THREE.Math.degToRad(90);
    }else if(inirot==2){
        camera.rotation.y=THREE.Math.degToRad(-90);
    }else if(inirot==4){
        camera.rotation.y=THREE.Math.degToRad(180);
    }

    scene = new THREE.Scene();

    WALL_BASE = new THREE.BoxGeometry( 1, 1, 1 );
    //material = new THREE.MeshNormalMaterial();
    //TEXTURES[0].wrapS = TEXTURES[0].wrapT = THREE.RepeatWrapping;
    //TEXTURES[0].anisotropy = renderer.capabilities.getMaxAnisotropy();

    for (var obj in SOLIDS_OBJS){
        console.log(SOLIDS_OBJS[obj]);
        if(SOLIDS_OBJS[obj].type=="WALL") {
            MATERIALS[obj] = new THREE.MeshPhongMaterial({
                map: TEXTURES[obj],
                bumpMap: TEXTURES[obj],
                shading: THREE.FlatShading
            });
        }else if(SOLIDS_OBJS[obj].type=="FLOOR"){
            MATERIALS[obj] = new THREE.MeshPhongMaterial({map: TEXTURES[obj], bumpMap:TEXTURES[obj],shading: THREE.FlatShading,side: THREE.DoubleSide});
        }
    }
    //material = new THREE.MeshPhongMaterial({map: TEXTURES["1"], bumpMap:TEXTURES["1"],shading: THREE.FlatShading});
    ////material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});

    FLOOR_BASE = new THREE.PlaneGeometry( 1, 1 );
    //floorMat = new THREE.MeshPhongMaterial({map: TEXTURES["2"], bumpMap:TEXTURES["2"],shading: THREE.FlatShading,side: THREE.DoubleSide});

    for(var y = 0;y<props.height;y++){
        for(var x = 0;x<props.width;x++){
            if(SOLIDS[y][x]==0) {
                var mesh = new THREE.Mesh(WALL_BASE, MATERIALS[SOLIDS[y][x]+1]);
                mesh.position.x = x;
                mesh.position.z = y;
                scene.add(mesh);
            }else if(SOLIDS[y][x]==1){
                var mesh = new THREE.Mesh(FLOOR_BASE, MATERIALS[SOLIDS[y][x]+1]);
                mesh.position.x = x;
                mesh.position.z = y;
                mesh.position.y = -0.5;
                mesh.rotation.x = THREE.Math.degToRad(90)
                scene.add(mesh);
            }
        }
    }
    CubeColor();

    var ambientLight = new THREE.AmbientLight(0x999999 );
    scene.add(ambientLight);

    var lights = [];
    lights[0] = new THREE.DirectionalLight( 0xffffff, 1 );
    lights[0].position.set( 1, 0, 0 );
    lights[1] = new THREE.DirectionalLight( 0x11E8BB, 1 );
    lights[1].position.set( 0.75, 1, 0.5 );
    lights[2] = new THREE.DirectionalLight( 0x8200C9, 1 );
    lights[2].position.set( -0.75, -1, 0.5 );
    scene.add( lights[0] );
    scene.add( lights[1] );
    scene.add( lights[2] );
    renderer.setSize( VIEW_W, VIEW_H);

    document.body.appendChild( renderer.domElement );
}

function animate(ts) {
    requestAnimationFrame( animate );
    TWEEN.update(ts);
    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}
function RotateLeft() {
    if(ONTWEEN){
        return;
    }
    ONTWEEN=true;
    //camera.rotation.y +=THREE.Math.degToRad(90);
    var ob={y:camera.rotation.y};
    var tween2 = new TWEEN.Tween(ob)
        .to({ y: camera.rotation.y + THREE.Math.degToRad(90) }, ROTASPEED)
        .easing(TWEEN.Easing.Quadratic.Out);

    tween2.onUpdate(function() {
        camera.rotation.y = ob.y;
    });
    tween2.onComplete(function () {
        ONTWEEN=false;
    })
    tween2.start();
}
function RotateRight() {
    if(ONTWEEN){
        return;
    }
    ONTWEEN=true;
    //camera.rotation.y -=THREE.Math.degToRad(90);
    var ob={y:camera.rotation.y};
    var tween2 = new TWEEN.Tween(ob)
        .to({ y: camera.rotation.y - THREE.Math.degToRad(90) }, ROTASPEED)
        .easing(TWEEN.Easing.Quadratic.Out);

    tween2.onUpdate(function() {
        camera.rotation.y = ob.y;
    });
    tween2.onComplete(function () {
        ONTWEEN=false;
    })
    tween2.start();
}
function MoveFW() {
    if(ONTWEEN){
        return;
    }
    ONTWEEN=true;
    var np=THREE.Utils.cameraLookDir(camera);
    var npPosX = Math.round(camera.position.x+np.x);
    var npPosZ = Math.round(camera.position.z+np.z);
    if(MAPA[npPosZ][npPosX]==1){
        //camera.position.x +=Math.round(np.x);
        //camera.position.z+=Math.round(np.z);
        var ob={x:camera.position.x,z:camera.position.z};
        var tween2 = new TWEEN.Tween(ob)
            .to({ x:npPosX,z:npPosZ}, WALKSPEED)
            .easing(TWEEN.Easing.Quadratic.Out);
        tween2.onUpdate(function() {
            camera.position.x = ob.x;
            camera.position.z = ob.z;
        });
        tween2.onComplete(function () {
            ONTWEEN=false;
        });
        tween2.start();
    }else {
        ONTWEEN=false;
    }
}
function MoveBW() {
    if(ONTWEEN){
        return;
    }
    ONTWEEN=true;
    var np=THREE.Utils.cameraLookDir(camera);
    var npPosX = Math.round(camera.position.x-np.x);
    var npPosZ = Math.round(camera.position.z-np.z);
    if(MAPA[npPosZ][npPosX]==1){
        var ob={x:camera.position.x,z:camera.position.z};
        var tween2 = new TWEEN.Tween(ob)
            .to({ x:npPosX,z:npPosZ}, WALKSPEED)
            .easing(TWEEN.Easing.Quadratic.Out);
        tween2.onUpdate(function() {
            camera.position.x = ob.x;
            camera.position.z = ob.z;
        });
        tween2.onComplete(function () {
            ONTWEEN=false;
        });
        tween2.start();
    }else {
        ONTWEEN=false;
    }
}
THREE.Utils = {
    cameraLookDir: function(camera) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(camera.rotation, camera.rotation.order);
        return vector;
    }
};


function CubeColor() {
    var vertexColorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors,side: THREE.DoubleSide } );

    var color, point, face, numberOfSides, vertexIndex;

    // faces are indexed using characters
    var faceIndices = [ 'a', 'b', 'c', 'd' ];

    var size = 100;
    var cubeGeometry = new THREE.CubeGeometry( size, size, size );

    // first, assign colors to vertices as desired
    for ( var i = 0; i < cubeGeometry.vertices.length; i++ )
    {
        point = cubeGeometry.vertices[ i ];
        color = new THREE.Color( 0xffffff );
        //color.setRGB( 0.5 + point.x / size, 0.5 + point.y / size, 0.5 + point.z / size );
        //console.log(0.5+point.x / size)
        //var col = 0.5+point.x / size;
        //color.setHSL(0.2+(col*0.5),1,0.5)
        if(point.x<0){
            if(point.y<0){
                color.setHex(0x000000);
            }else {
                color.setHex(0x330033);
            }
        }else{
            if(point.y<0){
                color.setHex(0x000000);
            }else {
                color.setHex(0x003333);
            }
        }
        cubeGeometry.colors[i] = color; // use this array for convenience
    }

    // copy the colors to corresponding positions
    //     in each face's vertexColors array.
    for ( var i = 0; i < cubeGeometry.faces.length; i++ )
    {
        face = cubeGeometry.faces[ i ];
        numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
        for( var j = 0; j < numberOfSides; j++ )
        {
            vertexIndex = face[ faceIndices[ j ] ];
            face.vertexColors[ j ] = cubeGeometry.colors[ vertexIndex ];
        }
    }

    cube = new THREE.Mesh( cubeGeometry, vertexColorMaterial );
    cube.y=size;
    scene.add(cube);
}