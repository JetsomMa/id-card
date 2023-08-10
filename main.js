import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import TWEEN from 'three/addons/libs/tween.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import html2canvas from 'html2canvas'
// import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

// import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

var camera, scene, renderer, group = new THREE.Group();
const container = document.createElement('div');
container.setAttribute("data-html2canvas-ignore", "true")
container.style.zIndex = 2;
container.style.position = 'fixed';
container.style.width = '100%';
container.style.height = '100%';
document.body.appendChild(container);
var urlParams = getUrlParameters();

urlParams.name = urlParams.name || '某某某'
urlParams.time = urlParams.time || '9999.99.99 加入'
urlParams.code = urlParams.code || 'H00000000'
if(urlParams.fontColor) {
    urlParams.fontColor = parseInt(urlParams.fontColor, 16);
} else {
    urlParams.fontColor = parseInt('0xffffff', 16);
}

if(urlParams.lightingColor) {
    urlParams.lightingColor = parseInt(urlParams.lightingColor, 16);
} else {
    urlParams.lightingColor = parseInt('0xffff00', 16);
}

if(urlParams.cardColor) {
    urlParams.cardColor = parseInt(urlParams.cardColor, 16);
} else {
    urlParams.cardColor = parseInt('0x0000ff', 16);
}

if(urlParams.backgroundColor) {
    urlParams.backgroundColor = parseInt(urlParams.backgroundColor, 16);
} else {
    urlParams.backgroundColor = parseInt('0x2e0f7c', 16);
}

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( urlParams.backgroundColor );
    // scene.fog = new THREE.Fog( urlParams.cardColor, 0, 60 );

    group.castShadow = true;
    scene.add(group);

    // setPlane(100, 100, urlParams.backgroundColor);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    // 启用阴影贴图
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 这种类型的阴影会有更柔和的边缘
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 80);
    camera.position.x = -15;
    camera.position.y = 0;
    camera.position.z = 45;
    camera.lookAt(scene.position);

    let controls = new OrbitControls(camera, renderer.domElement);
    // 禁止缩放
    controls.enableZoom = false;
    // 禁止平移
    controls.enablePan = false;
    // 只允许水平旋转
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2 + Math.PI / 4;

    var ambientLight = new THREE.AmbientLight(0xffffff, 100);
    scene.add(ambientLight);

    // setDirectionalLight(0, 30, 0, 1);
    setDirectionalLight(0, 5, 100, 0.4);
    setDirectionalLight(0, 5, -100, 0.4);

    setDirectionalLight(100, 5, 0, 0.8);
    setDirectionalLight(-100, 5, 0, 0.8);

    // setDirectionalLight(100, 5, 100, 0.01);
    // setDirectionalLight(-100, 5, 100, 0.01);
    // setDirectionalLight(100, 5, -100, 0.01);
    // setDirectionalLight(-100, 5, -100, 0.01);

    let cardOptions = {
        width: 12,
        height: 19,
        depth: 0.7,
        radius: 1,
    }

    let fontDepth = 0.1;

    setCubeCard(cardOptions.width, cardOptions.height, cardOptions.depth, cardOptions.radius);
    // setCubeCard2();

    setText('光子之城', 0, 6.8, cardOptions.depth + 0.2, 0.8, urlParams.fontColor);
    setText(urlParams.name, 0, 0, cardOptions.depth + 0.2, 1.5, urlParams.fontColor);
    setText(urlParams.time, 0, -7, cardOptions.depth + 0.2, 0.6, urlParams.fontColor);
    setText('光子市民', 0, -5.5, 0 - 0.2, 1, urlParams.fontColor, 0.5);
    setText(urlParams.code, 0, -7, 0 - 0.2, 0.7, urlParams.fontColor, 0.5);

    // setText2('光子之城', -1.6, 6, cardOptions.depth, 0.6, fontDepth, urlParams.fontColor);
    // setText2(urlParams.name, -1.9, 0, cardOptions.depth, 1, fontDepth, urlParams.fontColor);
    // setText2(urlParams.time + ' 加入', -2.4, -6, cardOptions.depth, 0.5, fontDepth, urlParams.fontColor);
    // setText2('光子市民', 1.4, -4.5, 0, 0.5, fontDepth, urlParams.fontColor, 0.5);
    // setText2(urlParams.code, 1.5, -6, 0, 0.5, fontDepth, urlParams.fontColor, 0.5);

    setFlashModel(-1, 7, -0.2, 4);

    window.addEventListener('resize', onResize, false);
    render();
}

function render(time) {
    requestAnimationFrame(render);
    // TWEEN.update(time); // update the Tween animations
    renderer.render(scene, camera);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

function setCubeCard2() {
    // 加载GLB模型
    const loader = new GLTFLoader();
    loader.load('model/id_card.glb', (gltf) => {
        const model = gltf.scene;

        group.add(model);

        // model.position.set(x, y, z);
        // model.scale.set(size, size, size);
        // model.rotation.y = Math.PI;

        // model.traverse(function (child) {
        //     if (child.isMesh) {
        //         child.material.roughness = 0.15;
        //         child.material.color = new THREE.Color(urlParams.lightingColor);
        //         child.material.emissive = new THREE.Color(urlParams.lightingColor);
        //     }
        // });
    });
}

function setCubeCard(width, height, depth, radius) {
    // 创建圆角矩形路径
    function RoundedRectShape(width, height, radius) {
        let shape = new THREE.Shape();
        shape.moveTo(- width / 2 + radius, - height / 2);
        shape.lineTo(width / 2 - radius, - height / 2);
        shape.quadraticCurveTo(width / 2, - height / 2, width / 2, - height / 2 + radius);
        shape.lineTo(width / 2, height / 2 - radius);
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
        shape.lineTo(- width / 2 + radius, height / 2);
        shape.quadraticCurveTo(- width / 2, height / 2, - width / 2, height / 2 - radius);
        shape.lineTo(- width / 2, - height / 2 + radius);
        shape.quadraticCurveTo(- width / 2, - height / 2, - width / 2 + radius, - height / 2);
        return shape;
    }

    // 创建几何体
    let shape = new RoundedRectShape(width, height, radius);
    let extrudeSettings = { depth: depth, bevelEnabled: false };
    let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);


    // manager
    // const manager = new THREE.LoadingManager( render );

    // // matcap
    // const loaderEXR = new EXRLoader( manager );
    // const matcap = loaderEXR.load( 'model/040full.exr' );

    // // normalmap
    // const loader = new THREE.TextureLoader( manager );

    // const normalmap = loader.load( 'model/face.jpg' );
    // // 创建材质
    // let material = new THREE.MeshMatcapMaterial( {
    //     color: 0xffffff, 
    //     matcap: matcap,
    //     normalMap: normalmap
    // } );

    let material = new THREE.MeshStandardMaterial({ 
        color: urlParams.cardColor, 
        metalness: 1, 
        roughness: 0.35,
    });

    // 创建网格
    let card = new THREE.Mesh(geometry, material);
    // card.castShadow = true;
    // card.receiveShadow = true;

    group.add(card);
}

function setDirectionalLight(x, y, z, intensity){
    var directionalLight = new THREE.DirectionalLight(0xffffff, intensity);
    directionalLight.position.set(x, y, z);
    directionalLight.castShadow = true;

    // 定义可见阴影的区域
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;

    scene.add(directionalLight);
}

// function setPlane(width, height, color){
//     // 创建平面几何体
//     let planeGeometry = new THREE.PlaneGeometry(width, height);
//     let planeMaterial = new THREE.MeshStandardMaterial({color: color});
//     let plane = new THREE.Mesh(planeGeometry, planeMaterial);

//     // 旋转并设置平面的位置
//     plane.rotation.x = -0.5 * Math.PI;
//     plane.position.y = -8.5;
    
//     // 平面应该接收阴影
//     plane.receiveShadow = true;

//     // 添加平面到场景中
//     scene.add(plane);
// }

// function reverseModel() {
//     // Define the final values for the rotation (additional 180 degrees)
//     var finalRotationX = group.rotation.x; // + Math.PI;
//     var finalRotationY = group.rotation.y + Math.PI;
//     var finalRotationZ = group.rotation.z; // + Math.PI;

//     // Create a new tween that modifies 'group.rotation'
//     new TWEEN.Tween(group.rotation)
//         .to({ x: finalRotationX, y: finalRotationY, z: finalRotationZ }, 500) // 2000 ms = 2 seconds
//         .easing(TWEEN.Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
//         .start(); // Start the tween immediately.
// }

// 获取url参数
function getUrlParameters(url = window.location.href) {
    let params = new URLSearchParams((new URL(url)).search);
    let paramsObject = {};
    for(let [key, value] of params.entries()) {
        paramsObject[key] = value;
    }
    return paramsObject;
}

function setFlashModel(x, y, z, size){
    // 加载GLB模型
    const loader = new GLTFLoader();
    loader.load('model/splash.glb', (gltf) => {
        const model = gltf.scene;
        group.add(model);

        model.position.set(x, y, z);
        model.scale.set(size, size, size);
        model.rotation.y = Math.PI;

        model.traverse(function (child) {
            if (child.isMesh) {
                child.material.roughness = 0.15;
                child.material.color = new THREE.Color(urlParams.lightingColor);
                child.material.emissive = new THREE.Color(urlParams.lightingColor);
            }
        });
    });
}

function setText(content, x, y, z, height, color, rotationY = 0) {
    // 1. 创建一个新的div元素
    let domDiv = document.createElement('div');

    let bigger = 100

    // 2. 为div设置属性和内容
    // domDiv.className = 'text-dom-class'  // 设置类名
    domDiv.style.color = '#' + color.toString(16).padStart(6, '0');  // 设置绝对定位
    domDiv.style.height = height * bigger + 'px'  // 设置绝对定位
    domDiv.style.lineHeight = height * bigger + 'px'  // 设置绝对定位
    domDiv.style.fontSize = height * bigger + 'px'  // 设置绝对定位
    domDiv.style.position = 'absolute'  // 设置绝对定位
    domDiv.style.fontWeight = 'bold' // 设置绝对定位
    domDiv.style.backgroundColor = 'rgba(0, 0, 0, 0)' // 设置绝对定位

    domDiv.textContent = content;  // 设置内容

    document.getElementById('html2canvas').appendChild(domDiv)
    
    // domDiv = document.getElementById("text")


    setTimeout(() => {
        let widthPlane = domDiv.getBoundingClientRect().width || 1
        let heightPlane = domDiv.getBoundingClientRect().height || 1

        html2canvas(domDiv, {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            allowTaint: false,
          }).then(canvas => {
            let texture = new THREE.CanvasTexture(canvas);

            let planeGeometry = new THREE.PlaneGeometry(widthPlane/bigger, heightPlane/bigger); 
            let planeMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

            let textMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            textMesh.position.x = x;
            textMesh.position.y = y;
            textMesh.position.z = z;

            textMesh.rotation.y = rotationY * 2 * Math.PI;
            group.add(textMesh);
        })
    })
}

// function setText2(content, x, y, z, size, deep, color, rotationY = 0) {
//     // 加载字体
//     let fontLoader = new FontLoader();
//     fontLoader.load('fonts/SugarCake_Regular.json', function(font) {
//         // 创建文本几何
//         let textGeometry = new TextGeometry(content, {
//             font: font,
//             size: size, // 字体大小
//             height: deep, // 文本深度
//             curveSegments: 7, // 曲线分段数，更高的值会增加准确度但降低性能
//             bevelEnabled: false, // 不启用斜角
//         });
//         // 创建纯色文本材质
//         let textMaterial = new THREE.MeshBasicMaterial({ color: color }); // 红色
//         // 创建文本网格
//         let textMesh = new THREE.Mesh(textGeometry, textMaterial);
//         textMesh.position.x = x;
//         textMesh.position.y = y;
//         textMesh.position.z = z;

//         textMesh.rotation.y = rotationY * 2 * Math.PI;

//         // 添加到场景
//         group.add(textMesh);
//     });
// }
