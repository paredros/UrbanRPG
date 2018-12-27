var camera, scene, renderer;
var geometry, material, mesh;
var MAPA=[];
var SOLIDS=[];
var CEILS=[];
var INTERACTIVOS=[];
var props={};

var VIEW_W=320;
var VIEW_H=240;
var ONTWEEN = false;
var ROTASPEED = 200;
var WALKSPEED = 200;

var TEXTURES ={};
var TEXTURES_INTERACTIVOS={};
var MATERIALS ={};
var MATERIALS_INTERACTIVOS ={};

var WALKABLES = {};
var SOLIDS_OBJS = {};
var INTERACTIVOS_OBJS = {};
var SCRIPTS_INTERACTIVOS = {};

var TORCH;
var COMPOSER;

var CLICKLEABLES = [];
var ANIMABLES = [];




function init() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    //renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    camera = new THREE.PerspectiveCamera(70, VIEW_W / VIEW_H, 0.0001, 1000);
    camera.position.y = 0;

    /*camera.position.z = props.y;
    camera.position.x = props.x;
    var inirot =getRandomInt(4);
    if(inirot==0){
        camera.rotation.y=0;
    }else if(inirot==1){
        camera.rotation.y=THREE.Math.degToRad(90);
    }else if(inirot==2){
        camera.rotation.y=THREE.Math.degToRad(-90);
    }else if(inirot==4){
        camera.rotation.y=THREE.Math.degToRad(180);
    }*/

    scene = new THREE.Scene();

    WALL_BASE = new THREE.BoxGeometry( 1, 1, 1 );

    //material = new THREE.MeshNormalMaterial();
    //TEXTURES[0].wrapS = TEXTURES[0].wrapT = THREE.RepeatWrapping;
    //TEXTURES[0].anisotropy = renderer.capabilities.getMaxAnisotropy();
    //shading: THREE.FlatShading
    for (var obj in SOLIDS_OBJS){
        console.log(SOLIDS_OBJS[obj]);
        if(SOLIDS_OBJS[obj].type=="WALL") {
            MATERIALS[obj] = new THREE.MeshStandardMaterial({
                map: TEXTURES[obj],
                bumpMap: TEXTURES[obj],
                roughness:1,
                metalness:1
            });
        }else if(SOLIDS_OBJS[obj].type=="FLOOR"){
            MATERIALS[obj] = new THREE.MeshStandardMaterial({
                map: TEXTURES[obj],
                bumpMap:TEXTURES[obj],
                side: THREE.DoubleSide,
                roughness:1,
                metalness:1
            });
        }else if(SOLIDS_OBJS[obj].type=="CEIL") {
            MATERIALS[obj] = new THREE.MeshStandardMaterial({
                map: TEXTURES[obj],
                bumpMap: TEXTURES[obj],
                roughness:1,
                metalness:1
            });
        }
    }
    for (var obj in INTERACTIVOS_OBJS){
        MATERIALS_INTERACTIVOS[obj] = new THREE.MeshStandardMaterial({
            map: TEXTURES_INTERACTIVOS[obj],
            bumpMap:TEXTURES_INTERACTIVOS[obj],
            side: THREE.DoubleSide,
            transparent: true,
            roughness:1,
            metalness:1
        });
    }
    //material = new THREE.MeshPhongMaterial({map: TEXTURES["1"], bumpMap:TEXTURES["1"],shading: THREE.FlatShading});
    ////material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});

    FLOOR_BASE = new THREE.PlaneGeometry( 1, 1 );

    DOOR_BASE = new THREE.PlaneGeometry( 1, 1 );
    //default
    //floorMat = new THREE.MeshPhongMaterial({map: TEXTURES["2"], bumpMap:TEXTURES["2"],shading: THREE.FlatShading,side: THREE.DoubleSide});

    for(var y = 0;y<props.height;y++){
        for(var x = 0;x<props.width;x++){
            if(SOLIDS[y][x]!=-1) {
                var k = SOLIDS[y][x] + 1;
                var type = SOLIDS_OBJS[k].type;

                if (type == "FLOOR") {
                    var mesh = new THREE.Mesh(FLOOR_BASE, MATERIALS[k]);
                    //mesh.receiveShadow = true;
                    mesh.position.x = x;
                    mesh.position.z = y;
                    mesh.position.y = -0.5;
                    mesh.rotation.x = THREE.Math.degToRad(90)
                    scene.add(mesh);
                } else if (type == "WALL") {
                    var mesh = new THREE.Mesh(WALL_BASE, MATERIALS[k]);
                    //mesh.castShadow = true; //default is false
                    //mesh.receiveShadow = true; //default
                    mesh.position.x = x;
                    mesh.position.z = y;
                    scene.add(mesh);
                }
            }
            if(CEILS[y][x]!=-1) {
                var k = CEILS[y][x] + 1;
                var type = SOLIDS_OBJS[k].type;
                if(type == "CEIL"){
                    var mesh = new THREE.Mesh(WALL_BASE, MATERIALS[k]);
                    mesh.position.x = x;
                    mesh.position.z = y;
                    mesh.position.y = 1;
                    scene.add(mesh);
                }
            }
            if(INTERACTIVOS[y][x]!=-1) {
                var txt = INTERACTIVOS[y][x];
                var k = txt.split(",");
                var kk = parseInt(k[0])+1;
                var type = INTERACTIVOS_OBJS[kk].type;
                if(type=="LEVELGATE"){
                    console.log(SCRIPTS_INTERACTIVOS[k[1]])
                    var script = SCRIPTS_INTERACTIVOS[k[1]];
                    if(script.initpos){
                        camera.position.z = y;
                        camera.position.x = x;
                        camera.rotation.y=getRotationBasedOnDirection(script.direction);
                    }
                }else if(type=="DOOR"){
                    console.log("DOOR")
                    var script = SCRIPTS_INTERACTIVOS[k[1]];
                    var t = buildTextureForInteractive(kk);
                    var mat = buildMaterialForInteractive(t);
                    var mesh = new THREE.Mesh(DOOR_BASE, mat);
                    //mesh.receiveShadow = true;
                    mesh.position.x = x;
                    mesh.position.z = y;
                    //mesh.position.y = -0.5;
                    mesh.rotation.y = THREE.Math.degToRad(-90);
                    scene.add(mesh);
                    var p_x=x;
                    var p_y=y;
                    mesh.callback = function(){
                        var d = dist(camera.position.x, camera.position.z,p_x,p_y);
                        if(Math.floor(d)>1){
                            return;
                        }
                        if(script.status==0){
                            script.anim="toActive";
                            script.frame=0;
                            script.status=1;
                            MAPA[p_y][p_x]=1;
                        }else if(script.status==1){
                            script.anim="toIdle";
                            script.frame=0;
                            script.status=0;
                            MAPA[p_y][p_x]=0;
                        }
                    }
                    CLICKLEABLES.push(mesh);
                    script.meshOBJ = mesh;
                    script.texture = t;
                    script.material = mat;
                    script.textureID = kk;
                    script.time=0;
                    ANIMABLES.push(script);
                    if(script.status==0){
                        script.frame=0;
                        //esta cerrada
                        script.anim="idle";
                        script.animTo="";
                        MAPA[y][x]=0;
                    }
                }
            }
            /*if(SOLIDS[y][x]==0) {
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
            }*/
        }
    }

    var ambientLight = new THREE.AmbientLight(0x006666 );
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

    TORCH= new THREE.PointLight( 0xffffff, 70, 100, 3);
    //TORCH.castShadow = true;
    //TORCH.position.set(camera.position.x, 0.5, camera.position.z );
    TORCH.position.set(3, 0.25, camera.position.z );
    scene.add( TORCH );

    renderer.setSize( VIEW_W, VIEW_H);

    /*var helper = new THREE.CameraHelper( TORCH.shadow.camera );
    scene.add( helper );
    var pointLightHelper = new THREE.PointLightHelper( TORCH );
    scene.add( pointLightHelper );*/


    COMPOSER = new THREE.EffectComposer(renderer);
    var renderPass = new THREE.RenderPass(scene,camera);
    COMPOSER.addPass(renderPass);
    //renderPass.renderToScreen=true;

    var pass1 = new THREE.ShaderPass(SpectrumShader)
    //pass1.uniforms.color.value =new THREE.Color( 0xffff00 )
    COMPOSER.addPass(pass1)
    pass1.renderToScreen=true;


    document.body.appendChild( renderer.domElement );
}
function getRotationBasedOnDirection(ori) {
    var r = 0;
    if(ori=='N'){
        r=0;
    }else if(ori=='O'){
        r=THREE.Math.degToRad(90);
    }else if(ori=='E'){
        r=THREE.Math.degToRad(-90);
    }else if(ori=='S'){
        r=THREE.Math.degToRad(180);
    }
    return r;
}
function animate(ts) {
    requestAnimationFrame( animate );
    TWEEN.update(ts);
    for(var i=0;i<ANIMABLES.length;i++){

        if(ANIMABLES[i].animTo==""){

            ANIMABLES[i].time++;
            var properties = INTERACTIVOS_OBJS[ANIMABLES[i].textureID].properties;
            if(ANIMABLES[i].time>=properties.spritedata.speed){

                ANIMABLES[i].time=0;
                ANIMABLES[i].frame++;

                var dataframe = properties.spritedata[ANIMABLES[i].anim];
                if(ANIMABLES[i].anim=="idle" || ANIMABLES[i].anim=="active"){
                    if(ANIMABLES[i].frame>=dataframe.length){
                        ANIMABLES[i].frame=0;
                    }
                    AnimateTexture(ANIMABLES[i].texture, properties,dataframe[ANIMABLES[i].frame]);
                }else if(ANIMABLES[i].anim=="toActive"){
                    if(ANIMABLES[i].frame>=dataframe.length){
                        ANIMABLES[i].anim = "active";
                        dataframe = properties.spritedata[ANIMABLES[i].anim];
                        ANIMABLES[i].frame=0;
                    }
                    AnimateTexture(ANIMABLES[i].texture, properties,dataframe[ANIMABLES[i].frame]);
                }else if(ANIMABLES[i].anim=="toIdle"){
                    if(ANIMABLES[i].frame>=dataframe.length){
                        ANIMABLES[i].anim = "idle";
                        dataframe = properties.spritedata[ANIMABLES[i].anim];
                        ANIMABLES[i].frame=0;
                    }
                    AnimateTexture(ANIMABLES[i].texture, properties,dataframe[ANIMABLES[i].frame]);
                }
            }
        }
    }
    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

    //renderer.render( scene, camera );
    COMPOSER.render();
}
function AnimateTexture(texture, properties, frame){
    //console.log(texture);
    //console.log(properties);
    //console.log(frame);
    var posy = Math.floor(frame / properties.spritedata.tiles_x);
    var posx = (frame % properties.spritedata.tiles_x);
    texture.offset.x = posx  * (1/properties.spritedata.tiles_x);
    texture.offset.y = (1 / properties.spritedata.tiles_y) * (properties.spritedata.tiles_y-1-posy);
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
            //TORCH.position.set(ob.x, 0.25, ob.z );
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
            TORCH.position.set(ob.x, 0.25, ob.z);
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


function onDocumentMouseDown(event) {
    event.preventDefault();
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
        if(intersects[0].object.callback){
            intersects[0].object.callback();
        }
    }

}
function buildTextureForInteractive(key){
    var t = TEXTURES_INTERACTIVOS[key].clone();
    t.needsUpdate = true;
    return t;
}
function buildMaterialForInteractive(t){

    var r = new THREE.MeshStandardMaterial({
        map: t,
        bumpMap:t,
        side: THREE.DoubleSide,
        transparent: true,
        roughness:1,
        metalness:1
    });
    return r;
}