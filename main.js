import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import html2canvas from 'html2canvas'
import { nodeFrame } from 'three/addons/renderers/webgl/nodes/WebGLNodes.js';

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

if(urlParams.lightIntensity) {
    urlParams.lightIntensity = Number(urlParams.lightIntensity);
} else {
    urlParams.lightIntensity = 100
}

if(urlParams.cardMetalness) {
    urlParams.cardMetalness = Number(urlParams.cardMetalness);
} else {
    urlParams.cardMetalness = 1
}

if(urlParams.cardRoughness) {
    urlParams.cardRoughness = Number(urlParams.cardRoughness);
} else {
    urlParams.cardRoughness = 0.06
}

if(urlParams.cameraX) {
    urlParams.cameraX = Number(urlParams.cameraX);
} else {
    urlParams.cameraX = -12
}

if(urlParams.cameraX) {
    urlParams.cameraX = Number(urlParams.cameraX);
} else {
    urlParams.cameraX = -12
}

if(urlParams.cameraY) {
    urlParams.cameraY = Number(urlParams.cameraY);
} else {
    urlParams.cameraY = 0
}

if(urlParams.cameraZ) {
    urlParams.cameraZ = Number(urlParams.cameraZ);
} else {
    urlParams.cameraZ = 36
}

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
    urlParams.cardColor = parseInt('0x681D9A', 16);
    // urlParams.cardColor = parseInt('0x753EBC', 16);
}

if(urlParams.backgroundColor) {
    urlParams.backgroundColor = parseInt(urlParams.backgroundColor, 16);
} else {
    urlParams.backgroundColor = parseInt('0x0000ff', 16);
    // urlParams.backgroundColor = parseInt('0x681D9A', 16);
}

function init() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color( urlParams.backgroundColor );
    // scene.fog = new THREE.Fog( 0xffffff, 0, 60 );
    
    new RGBELoader().setPath( 'textures/' ).load( 'kloppenheim_06_puresky_1k.hdr', async ( texture ) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;
    })

    // var ambientLight = new THREE.AmbientLight(0xffffff, 1000);
    // scene.add(ambientLight);

    setLight(0, 5, 15, urlParams.lightIntensity * 1);
    setLight(0, 5, -15, urlParams.lightIntensity * 1);
    setLight(15, 5, 0, urlParams.lightIntensity * 1);
    setLight(-15, 5, 0, urlParams.lightIntensity * 1);

    scene.add(group);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = .5;
    renderer.setAnimationLoop( render );
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 80);
    camera.position.x = urlParams.cameraX;
    camera.position.y = urlParams.cameraY;
    camera.position.z = urlParams.cameraZ;
    camera.lookAt(scene.position);

    let controls = new OrbitControls(camera, renderer.domElement);
    // 禁止缩放
    controls.enableZoom = false;
    // 禁止平移
    controls.enablePan = false;
    // 只允许水平旋转
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2 + Math.PI / 4;

    let cardOptions = {
        width: 12,
        height: 19,
        depth: 0.7,
        radius: 1,
    }

    let fontDepth = 0.1;

    setCubeCard(cardOptions.width, cardOptions.height, cardOptions.depth, cardOptions.radius);

    setText('光子之城', 0, 6.8, cardOptions.depth + 0.2, 0.8, urlParams.fontColor);
    setText(urlParams.name, 0, 0, cardOptions.depth + 0.2, 1.5, urlParams.fontColor);
    setText(urlParams.time, 0, -7, cardOptions.depth + 0.2, 0.6, urlParams.fontColor);
    setText('光子市民', 0, -5.5, 0 - 0.2, 1, urlParams.fontColor, 0.5);
    setText(urlParams.code, 0, -7, 0 - 0.2, 0.7, urlParams.fontColor, 0.5);

    setFlashModel(-1, 7, -0.2, 4);

    window.addEventListener('resize', onResize, false);
}

window.onload = init;

function render(time) {
    nodeFrame.update();
    renderer.render(scene, camera);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

async function setCubeCard(width, height, depth, radius) {
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
    const shape = new RoundedRectShape(width, height, radius);
    const extrudeSettings = { depth: depth, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    let material = new THREE.MeshStandardMaterial({ 
        color: urlParams.cardColor, 
        metalness: urlParams.cardMetalness, 
        roughness: urlParams.cardRoughness,
    });

    // 创建网格
    const card = new THREE.Mesh(geometry, material);
    group.add(card);
}

function setLight(x, y, z, intensity){
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(x, y, z);
    scene.add(light);
}

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
                child.material.roughness = 0.015;
                child.material.metalness = 1;
                child.material.color = new THREE.Color(urlParams.lightingColor);
                child.material.emissive = new THREE.Color(urlParams.lightingColor);
            }
        });
    });
}

function setText(content, x, y, z, height, color, rotationY = 0) {
    let domDiv = document.createElement('div');

    let bigger = 100 // 米单位与像素值的缩放倍数
    domDiv.style.color = '#' + color.toString(16).padStart(6, '0');  // 设置绝对定位
    domDiv.style.height = height * bigger + 'px'  // 设置绝对定位
    domDiv.style.lineHeight = height * bigger + 'px'  // 设置绝对定位
    domDiv.style.fontSize = height * bigger + 'px'  // 设置绝对定位
    domDiv.style.position = 'absolute'  // 设置绝对定位
    domDiv.style.fontWeight = 'bold' // 设置绝对定位
    domDiv.style.backgroundColor = 'rgba(0, 0, 0, 0)' // 设置绝对定位
    domDiv.textContent = content;  // 设置内容

    document.getElementById('html2canvas').appendChild(domDiv)
    
    setTimeout(() => {
        let widthPlane = domDiv.getBoundingClientRect().width || 1
        let heightPlane = domDiv.getBoundingClientRect().height || 1

        html2canvas(domDiv, {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            allowTaint: false,
          }).then(canvas => {
            let texture = new THREE.CanvasTexture(canvas);

            let planeGeometry = new THREE.PlaneGeometry(widthPlane/bigger, heightPlane/bigger); 
            let planeMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true });

            let textMesh = new THREE.Mesh(planeGeometry, planeMaterial);

            textMesh.position.x = x;
            textMesh.position.y = y;
            textMesh.position.z = z;

            textMesh.rotation.y = rotationY * 2 * Math.PI;
            group.add(textMesh);
        })
    })
}
