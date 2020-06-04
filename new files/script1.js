//file uguale a script.js ma l'highlight delle parti è fatto da me senza uso della
//libreria THREEx per "allenarmi" e capire il funzionamento di raycaster

console.log(`${window.innerWidth}  ${window.innerHeight}`);


let device = "PC";
let instructions = "<h3>Drag to rotate the model<br><br>Right click to change view<h3>";

if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
) {
    device = "mobile";
    instructions = "Drag to rotate the model<br><br>Tap with three fingers to change view";
}

//camera position to swap used in ChangeCameraPosition
let targetMid = new THREE.Vector3(0, 5, 0);
let targetUp = new THREE.Vector3(0, 9, 0);
let targetDown = new THREE.Vector3(0, 0, 0);




const TRAY = document.getElementById('js-tray-slide');
//const DRAG_NOTICE = document.getElementById('js-drag-notice');

//objects to add listners to each mesh
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

const blue = new THREE.MeshPhongMaterial({
    color: parseInt('0x187DF6'),
    shininess: 10
});

const red = new THREE.MeshPhongMaterial({
    color: parseInt('0xFD0000'),
    shininess: 10
});

const hover_color = new THREE.MeshPhongMaterial({
    color: parseInt('0xdaffa3'),
    shininess: 10
});

const green = new THREE.MeshPhongMaterial({
    color: parseInt('0x00FF00'),
    shininess: 10
});

let selected_color = new THREE.MeshPhongMaterial({
    color: parseInt('0x00FF00'),
    shininess: 10
});

function changeSelectedColor(color) {
    switch (color) {
        case 'blue':
            selected_color = blue;
            break;
        case 'red':
            selected_color = red;
            break;
        default:
            selected_color = green;
    }

};


// Initial material
const INITIAL_MTL = new THREE.MeshPhongMaterial({
    color: 0xf1f1f1,
    shininess: 10
});


var theModel;


const MODEL_PATH = "finished.glb";
let numberOfMeshes = 1508;



var activeOption = 'nd';
var loaded = false;

let activated = 0;
selectedPlaces = [
];


//const BACKGROUND_COLOR = 0xf1f1f1;
const BACKGROUND_COLOR = 0x9DBAFF;
// Init the scene
const scene = new THREE.Scene();
// Set background
scene.background = new THREE.Color(BACKGROUND_COLOR);
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 1, 100);

const canvas = document.querySelector('#c');

// Init the renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
let el = document.getElementsByClassName("modal-body");
el[0].appendChild(renderer.domElement);
var cameraFar = 15;

// document.body.appendChild(renderer.domElement);

// Add a camerra
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 2;
camera.position.y = 8;


const INITIAL_MAP = [

];


for (let i = 0; i < numberOfMeshes; i++) {
    if (i < 10) {
        nameOb = "a00" + i.toString();
    } else if (i >= 10 && i < 100) {
        nameOb = "a0" + i.toString();
    } else {
        nameOb = "a" + i.toString();
    }
    INITIAL_MAP.push({ childID: nameOb, mtl: INITIAL_MTL });
    selectedPlaces.push({ place: nameOb, activated: false, hovered: false });
}

let objectss = [];
let currentSelected;
// Init the object loader
var loader = new THREE.GLTFLoader();

loader.load(MODEL_PATH, function (gltf) {
    theModel = gltf.scene;
    console.log(theModel.children.length);
    theModel.traverse(o => {
        if (o.isMesh) {

            o.castShadow = true;
            o.receiveShadow = true;
            objectss.push(o);
        }
    });

    // Set the models initial scale   
    theModel.scale.set(3, 3, 3);
    theModel.rotation.y = Math.PI;

    // Offset the y position a bit
    theModel.position.y = -1;


    // Set initial textures
    for (let object of INITIAL_MAP) {
        initColor(theModel, object.childID, object.mtl);
    }

    // Add the model to the scene
    scene.add(theModel);

    // // Remove the loader
    // LOADER.remove();

}, undefined, function (error) {
    console.error(error);
});


//function to add event listner from smartphone and pc
//on each mesh of theModel
//object is the mesh inside the collection of meshes in theModel
let add_click_touch = function (object) {

    let i = 0;
    // let options = document.querySelectorAll(".option");
    // let options2 = document.querySelectorAll(".option2");
    // -let temp;
    while (i < selectedPlaces.length) {

        if (selectedPlaces[i].place == object.nameID) {
            // for (opt of options) {
            //   if (opt.classList.contains(object.nameID)) {
            //     temp = opt;
            //   }
            // }

            // for (opt of options2) {
            //   if (opt.classList.contains(object.nameID)) {
            //     temp = opt;
            //   }
            // }

            if (selectedPlaces[i].activated == true) {
                selectedPlaces[i].activated = false;
                selectedPlaces[i].hovered = false;
                //temp.classList.remove('--is-activated');
                activated--;
                //temp.classList.add('hide');
                setMaterial(theModel, object.nameID, INITIAL_MTL);
            } else {
                selectedPlaces[i].activated = true;
                selectedPlaces[i].hovered = false;
                //temp.classList.add('--is-activated');
                activated++;
                //temp.classList.remove('hide');
                setMaterial(theModel, object.nameID, selected_color);
            }
            break;
        }
        i++;
    }
};

// Function - Add the textures to the models
function initColor(parent, type, mtl) {
    parent.traverse(o => {
        if (o.isMesh) {
            if (o.name.includes(type)) {
                new_mtl = new THREE.MeshPhongMaterial({
                    color: parseInt('0x00FE32'),
                    shininess: 10
                });
                o.material = mtl;
                o.nameID = type; // Set a new property to identify this object
                // domEvents.addEventListener(o, 'click', function (event) {
                //     add_click_touch(o);

                // }, false);
                // domEvents.addEventListener(o, 'touchstart', function (event) {
                //     add_click_touch(o);
                // }, false);
                // domEvents.addEventListener(o, 'mouseover', function (event) {
                //     for (const mesh of selectedPlaces) {
                //         if (mesh.place == o.nameID && mesh.activated == false) {
                //             new_mtl1 = new THREE.MeshPhongMaterial({
                //                 color: parseInt('0xdaffa3'),
                //                 shininess: 1
                //             });
                //             setMaterial(theModel, type, new_mtl1);
                //             // setTimeout(function () {
                //             //   setMaterial(theModel, type, INITIAL_MTL);
                //             // }, 300);
                //         }
                //     }

                // }, false);

                // domEvents.addEventListener(o, 'mouseout', function (event) {
                //     for (const mesh of selectedPlaces) {
                //         if (mesh.place == o.nameID && mesh.activated == false) {
                //             setTimeout(function () {
                //                 setMaterial(theModel, type, INITIAL_MTL);
                //             }, 50);
                //         }
                //     }

                // }, false);
            }
        }
    });
}

// Add lights
var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
// Add hemisphere light to scene   
scene.add(hemiLight);


//light from the front of the man
var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 20);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
dirLight.shadow.camera = new THREE.OrthographicCamera(-5, 4, 10, -10, 0.1, 1000);
// Add directional Light to scene    
scene.add(dirLight);

//light from behind the man
var dirLight2 = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight2.position.set(8, -12, -20);
dirLight2.castShadow = true;
dirLight2.shadow.mapSize = new THREE.Vector2(1024, 1024);
// Add directional Light to scene    
scene.add(dirLight2);


// Floor
var floorGeometry = new THREE.PlaneGeometry(6000, 6000, 70, 70);
var floorMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFFFFF,
    shininess: 0
});


var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
scene.add(floor);

// Add controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI;
controls.minPolarAngle = Math.PI / 30;

controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 3;
controls.maxDistance = 25;
controls.dampingFactor = 0.04;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.8; // 30
controls.target = new THREE.Vector3(0, 5, 0);



function onMouseClick(event) {
    // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objectss);

    if (intersects.length > 0) {
        add_click_touch(intersects[0].object);
    }
}

function onTouchClick(event) {
    if (event.targetTouches.length == 3) {
        if (controls.target.y == targetMid.y) {
            controls.target.y = targetUp.y;
        } else if (controls.target.y == targetUp.y) {
            controls.target.y = targetDown.y;
        } else {
            controls.target.y = targetMid.y;
        }
        controls.update();
        return false;
    }

    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objectss);

    if (intersects.length > 0) {
        add_click_touch(intersects[0].object);
    }
}


function hoverMesh(mesh) {
    for (let obj of selectedPlaces) {
        if (obj.place == mesh.nameID && obj.activated == false && obj.hovered == false) {

            setMaterial(theModel, mesh.nameID, hover_color);
            lastHovered = obj;
            obj.hovered = true;

        } else if (obj.place != mesh.nameID && obj.activated == false && obj.hovered == true) {
            setTimeout(function () {
                obj.hovered = false;
                setMaterial(theModel, obj.place, INITIAL_MTL);
            }, 50);
        }
    }
}


let lastHovered;
function onMouseMove(event) {

    // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objectss);
    if (intersects.length > 0) {
        hoverMesh(intersects[0].object);
    } else if (lastHovered != undefined && lastHovered.activated == false) {
        setMaterial(theModel, lastHovered.place, INITIAL_MTL);
    }
}


function changeCamPosition(event) {
    event.preventDefault();
    if (controls.target.y == targetMid.y) {
        controls.target.y = targetUp.y;
    } else if (controls.target.y == targetUp.y) {
        controls.target.y = targetDown.y;
    } else {


        controls.target.y = targetMid.y;
    }
    controls.update();
    return false;
}

canvas.addEventListener('click', onMouseClick, false);
canvas.addEventListener('touchstart', onTouchClick, false);
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('contextmenu', changeCamPosition, false);



var text2 = document.createElement('div');
text2.setAttribute("id", "instructions");
text2.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this


text2.innerHTML = instructions;
text2.style.top = 10 + 'px';
text2.style.left = 5 + 'px';
// document.body.appendChild(text2);


function animate() {

    controls.update();
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);



    if (theModel != null && loaded == false) {
        initialRotation();
        // DRAG_NOTICE.classList.add('start');
    }
    // else {
    //    DRAG_NOTICE.classList.add('move');
    // }
}


let initRotate = 0;
animate();

// Function - New resizing method
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
        // var width = $("#my_modal").width();
        // var height = $("#my_modal").height();
        // var size = $("#my_modal").attr("data-size");
        // console.log("Width Is: " + width + " and Height Is:" + height);


        renderer.setSize(500, 300);
        // renderer.setSize(width / 2, height / 2);
    }
    return needResize;
}





function setMaterial(parent, type, mtl) {
    parent.traverse(o => {
        if (o.isMesh && o.nameID != null) {

            if (o.nameID == type) {
                o.material = mtl;
            }
        }
    });
}


// Function - Opening rotate

function initialRotation() {


    initRotate++;
    if (initRotate <= 120) {
        theModel.rotation.y += Math.PI / 60;
    } else {
        loaded = true;
    }
}

