const LOADER = document.getElementById('js-loader');

const TRAY = document.getElementById('js-tray-slide');
const DRAG_NOTICE = document.getElementById('js-drag-notice');




function startup() {
  var el = document.getElementById("canvas");
  if (el) {
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchmove", handleMove, false);
  }

}

document.addEventListener("DOMContentLoaded", startup);


var theModel;



//const MODEL_PATH = "Resized.glb";
const MODEL_PATH = "Resizedprova.glb";

var activeOption = 'nd';
var loaded = false;

let activated = 0;
selectedPlaces = [{
  place: "FinalBaseMesh001",
  activated: false
},
{
  place: "cavigliadx",
  activated: false
},
{
  place: "cavigliasx",
  activated: false
},
{
  place: "femoraledx",
  activated: false
},
{
  place: "femoralesx",
  activated: false
},
{
  place: "gluteodx",
  activated: false
},
{
  place: "gluteosx",
  activated: false
},
{
  place: "piededx",
  activated: false
},
{
  place: "piedesx",
  activated: false
},
{
  place: "polpacciodx",
  activated: false
},
{
  place: "polpacciosx",
  activated: false
},
{
  place: "pube",
  activated: false
},
{
  place: "quadricipitedx",
  activated: false
},
{
  place: "quadricipitesx",
  activated: false
},
{
  place: "stincodx",
  activated: false
},
{
  place: "stincosx",
  activated: false
}];


const colors = [

  {
    color: '27548D'
  },

  {
    color: '438AAC'
  }];


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

var cameraFar = 15;

document.body.appendChild(renderer.domElement);

// Add a camerra
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 2;
camera.position.y = 8;



// Initial material
const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xf1f1f1, shininess: 10 });

const INITIAL_MAP = [
  { childID: "cavigliasx", mtl: INITIAL_MTL },
  { childID: "cavigliadx", mtl: INITIAL_MTL },
  { childID: "femoraledx", mtl: INITIAL_MTL },
  { childID: "femoralesx", mtl: INITIAL_MTL },
  { childID: "gluteodx", mtl: INITIAL_MTL },
  { childID: "gluteosx", mtl: INITIAL_MTL },
  { childID: "piededx", mtl: INITIAL_MTL },
  { childID: "piedesx", mtl: INITIAL_MTL },
  { childID: "polpacciodx", mtl: INITIAL_MTL },
  { childID: "polpacciosx", mtl: INITIAL_MTL },
  { childID: "pube", mtl: INITIAL_MTL },
  { childID: "quadricipitedx", mtl: INITIAL_MTL },
  { childID: "quadricipitesx", mtl: INITIAL_MTL },
  { childID: "stincodx", mtl: INITIAL_MTL },
  { childID: "stincosx", mtl: INITIAL_MTL },
  { childID: "FinalBaseMesh001", mtl: INITIAL_MTL }];


// Init the object loader
var loader = new THREE.GLTFLoader();

loader.load(MODEL_PATH, function (gltf) {
  theModel = gltf.scene;

  theModel.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
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

  // Remove the loader
  LOADER.remove();

}, undefined, function (error) {
  console.error(error);
});


//function to add event listner from smartphone and pc
//on each mesh of theModel
//object is the mesh inside the collection of meshes in theModel
let add_click_touch = function (object) {
  let i = 0;
  let options = document.querySelectorAll(".option");
  let options2 = document.querySelectorAll(".option2");
  let temp;
  while (i < selectedPlaces.length) {

    if (selectedPlaces[i].place == object.nameID) {
      for (opt of options) {
        if (opt.classList.contains(object.nameID)) {
          temp = opt;
        }
      }
      for (opt of options2) {
        if (opt.classList.contains(object.nameID)) {
          temp = opt;
        }
      }

      if (selectedPlaces[i].activated == true) {
        selectedPlaces[i].activated = false;
        temp.classList.remove('--is-activated');
        activated--;
        temp.classList.add('hide');
        setMaterial(theModel, object.nameID, INITIAL_MTL);
      } else {
        selectedPlaces[i].activated = true;
        temp.classList.add('--is-activated');
        activated++;
        temp.classList.remove('hide');
        setMaterial(theModel, object.nameID, new_mtl);
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
        domEvents.addEventListener(o, 'click', function (event) {
          add_click_touch(o);

        }, false);
        domEvents.addEventListener(o, 'touchstart', function (event) {
          add_click_touch(o);
        }, false);
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
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 30;
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 8;
controls.maxDistance = 30;
controls.dampingFactor = 0.04;
controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
controls.autoRotateSpeed = 0.2; // 30
controls.target = new THREE.Vector3(0, 5, 0);

function animate() {

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if (theModel != null && loaded == false) {
    initialRotation();
    DRAG_NOTICE.classList.add('start');
  } else {
    DRAG_NOTICE.classList.add('move');
  }
}

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

    renderer.setSize(width, height, false);
  }
  return needResize;
}

// Function - Build Colors

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray__swatch');

    if (color.texture) {
      swatch.style.backgroundImage = "url(" + color.texture + ")";
    } else {
      swatch.style.background = "#" + color.color;
    }

    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}

buildColors(colors);

// Select Option
const options = document.querySelectorAll(".option");
const options2 = document.querySelectorAll(".option2");

for (const option of options) {
  option.addEventListener('click', selectOption);
  //option.addEventListener('contextmenu', unsetColor);
}
for (const option of options2) {
  option.addEventListener('click', selectOption);
  //option.addEventListener('contextmenu', unsetColor);
}


function selectOption(e) {
  let option = e.target;
  let activeOption2 = activeOption;
  activeOption = e.target.dataset.option;

  let i = 0;
  let j = i;
  for (const otherOption of options) {
    otherOption.classList.remove('--is-active');
    //salvo la posizione all'interno dell'array selectedPlaces dell'elemento cliccato
    if (selectedPlaces[i].place == activeOption) {
      j = i;
    }
    i++;
  }
  //deseleziono l'area che l'utente sta ricliccando e lo disattivo nel vettore
  if (activeOption2 == activeOption) {
    setMaterial(theModel, activeOption, INITIAL_MTL);

    option.classList.remove('--is-activated');
    activated--;
    option.classList.add('hide');
    activeOption = null;
    selectedPlaces[j].activated = false;
    setMaterial(theModel, activeOption, INITIAL_MTL);
  } else if (option.classList.contains('--is-activated')) {
    option.classList.remove('--is-activated');
    activated--;
    option.classList.add('hide');
    selectedPlaces[j].activated = false;
    setMaterial(theModel, activeOption, INITIAL_MTL);
  } else {

    //seleziono l'elemento scelto e lo attivo nel vettore

    option.classList.add('--is-activated');
    activated++;
    option.classList.remove('hide');
    selectedPlaces[j].activated = true;
    new_mtl = new THREE.MeshPhongMaterial({
      color: parseInt('0x00FE32'),
      shininess: 10
    });
    setMaterial(theModel, activeOption, new_mtl);
  }

}

var domEvents = new THREEx.DomEvents(camera, renderer.domElement);

// Swatches
// const swatches = document.querySelectorAll(".tray__swatch");

// for (const swatch of swatches) {
//   swatch.addEventListener('click', selectSwatch);
// }

// function selectSwatch(e) {
//   let color = colors[parseInt(e.target.dataset.key)];
//   let new_mtl;

//   if (color.texture) {

//     let txt = new THREE.TextureLoader().load(color.texture);

//     txt.repeat.set(color.size[0], color.size[1], color.size[2]);
//     txt.wrapS = THREE.RepeatWrapping;
//     txt.wrapT = THREE.RepeatWrapping;

//     new_mtl = new THREE.MeshPhongMaterial({
//       map: txt,
//       shininess: color.shininess ? color.shininess : 10
//     });

//   } else {
//     new_mtl = new THREE.MeshPhongMaterial({
//       color: parseInt('0x' + color.color),
//       shininess: color.shininess ? color.shininess : 10
//     });


//   }

//   setMaterial(theModel, activeOption, new_mtl);
// }

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
let initRotate = 0;

function initialRotation() {
  initRotate++;
  if (initRotate <= 120) {
    theModel.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}

var slider = document.getElementById('js-tray'), sliderItems = document.getElementById('js-tray-slide'), difference;

function slide(wrapper, items) {
  var posX1 = 0,
    posX2 = 0,
    posInitial,
    threshold = 20,
    posFinal,
    slides = items.getElementsByClassName('tray__swatch');

  // Mouse events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);


  function dragStart(e) {
    e = e || window.event;
    posInitial = items.offsetLeft;
    difference = sliderItems.offsetWidth - slider.offsetWidth;
    difference = difference * -1;

    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction(e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }

    if (items.offsetLeft - posX2 <= 0 && items.offsetLeft - posX2 >= difference) {
      items.style.left = items.offsetLeft - posX2 + "px";
    }
  }

  function dragEnd(e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {

    } else if (posFinal - posInitial > threshold) {

    } else {
      items.style.left = posInitial + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

}

slide(slider, sliderItems);