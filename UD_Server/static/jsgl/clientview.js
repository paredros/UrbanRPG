var camera, scene, renderer;
var geometry, material, mesh;
var MAPA=[];
var props={}

var VIEW_W=320;
var VIEW_H=240;
var ONTWEEN = false;
var ROTASPEED = 200;
var WALKSPEED = 200;

function init() {

    camera = new THREE.PerspectiveCamera(70, VIEW_W / VIEW_H, 0.01, 10);
    camera.position.z = props.y;
    camera.position.x = props.x;
    camera.position.y = 0;
    var inirot =getRandomInt(4);
    if(inirot==0){
        camera.position.y=0;
    }else if(inirot==1){
        camera.position.y=THREE.Math.degToRad(90);
    }else if(inirot==2){
        camera.position.y=THREE.Math.degToRad(-90);
    }else if(inirot==4){
        camera.position.y=THREE.Math.degToRad(180);
    }

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry( 1, 1, 1 );
    material = new THREE.MeshNormalMaterial();

    for(var y = 0;y<props.height;y++){
        for(var x = 0;x<props.width;x++){
            if(MAPA[y][x]==0) {
                var mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = x;
                mesh.position.z = y;
                scene.add(mesh);
            }
        }
    }


    renderer = new THREE.WebGLRenderer( { antialias: true } );
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
