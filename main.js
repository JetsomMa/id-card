import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import html2canvas from 'html2canvas'

var camera, scene, renderer, group = new THREE.Group();
const container = document.createElement('div');
container.setAttribute("data-html2canvas-ignore", "true")
container.style.zIndex = 2;
container.style.position = 'fixed';
container.style.width = '100%';
container.style.height = '100%';
document.body.appendChild(container);
var urlParams = getUrlParameters();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( urlParams.backgroundColor );
    // scene.fog = new THREE.Fog( urlParams.cardColor, 0, 60 );

    group.castShadow = true;
    scene.add(group);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    // 启用阴影贴图
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 这种类型的阴影会有更柔和的边缘
    renderer.setSize(window.innerWidth, window.innerHeight);
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

    // var ambientLight = new THREE.AmbientLight(0xffffff, urlParams.lightIntensity * 100);
    // scene.add(ambientLight);

    setDirectionalLight(0, 5, 100, urlParams.lightIntensity * 0.5);
    setDirectionalLight(0, 5, -100, urlParams.lightIntensity * 0.5);
    setDirectionalLight(100, 5, 0, urlParams.lightIntensity * 0.8);
    setDirectionalLight(-100, 5, 0, urlParams.lightIntensity * 0.8);

    let cardOptions = {
        width: 12,
        height: 19,
        depth: 0.7,
        radius: 1,
    }

    // 创建卡牌
    setCubeCard(cardOptions.width, cardOptions.height, cardOptions.depth, cardOptions.radius);

    if(urlParams.isHeader) { // 是否展示头像
        // 创建闪光模型
        setFlashModel(5, -1.6, cardOptions.depth + 0.1, 0.7);

        // 正面
        setImage(urlParams.header, 0, 3.5, cardOptions.depth + 0.15, 10.5, 10.5, 1);
        setText(urlParams.name, -3.8, -2.5, cardOptions.depth + 0.15, 1, urlParams.fontColor);
        setText(urlParams.description, 0, -5.5, cardOptions.depth + 0.15, 0.5, urlParams.fontColor, 0, 10.5);
        setText(urlParams.author, -3.55, -8.5, cardOptions.depth + 0.15, 0.5, urlParams.fontColor);

        // 背面
        setText('光子之城', 0, 6.8, -0.15, 0.8, urlParams.fontColor, 0.5);
        setText(urlParams.name, 0, 0, -0.15, 1.5, urlParams.fontColor, 0.5);
        setText(urlParams.time, 0, -7, -0.15, 0.6, urlParams.fontColor, 0.5);
    } else {
        // 创建闪光模型
        setFlashModel(-1, 7, -0.15, 4, 0.5);
            
        // 创建文字
        // 正面
        setText('光子之城', 0, 6.8, cardOptions.depth + 0.15, 0.8, urlParams.fontColor);
        setText(urlParams.name, 0, 0, cardOptions.depth + 0.15, 1.5, urlParams.fontColor);
        setText(urlParams.time, 0, -7, cardOptions.depth + 0.15, 0.6, urlParams.fontColor);
        // 背面
        setText('光子市民', 0, -5.5, -0.15, 1, urlParams.fontColor, 0.5);
        setText(urlParams.code, 0, -7, -0.15, 0.7, urlParams.fontColor, 0.5);
    }
    
    window.addEventListener('resize', onResize, false);
    render();
}

window.onload = init;

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

    let material = new THREE.MeshStandardMaterial({ 
        color: urlParams.cardColor, 
        metalness: urlParams.cardMetalness, 
        roughness: urlParams.cardRoughness,
    });

    // 创建网格
    let card = new THREE.Mesh(geometry, material);
    
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

// 获取url参数
function getUrlParameters(url = window.location.href) {
    let params = new URLSearchParams((new URL(url)).search);
    let paramsObject = {
        name: '某某某',              // 姓名
        time: '9999.99.99 加入',     // 加入时间
        code: 'H00000000',          // 光子市民码
        lightIntensity: 4,          // 光照强度
        cardMetalness: 1,           // 卡片金属度
        cardRoughness: 0.35,        // 卡片粗糙度
        cameraX: -12,               // 相机位置x
        cameraY: 0,                 // 相机位置y
        cameraZ: 36,                // 相机位置z
        fontColor: 0xffffff,        // 字体颜色
        lightingColor: 0xffff00,    // 闪光颜色
        cardColor: 0x2E0F7C,        // 卡片颜色
        backgroundColor: 0x753EBC,  // 背景色

        isHeader: false,  // 是否展示头像
        header: 'https://download.mashaojie.cn/image/header.png',  // 头像地址
        description: '我是一段介绍文字，总之很牛逼就对了！我是一段介绍文字，总之很牛逼就对了！我是一段介绍文字，总之很牛逼就对了！我是一段介绍文字，总之很牛逼就对了！我是一段介绍文字，总之很牛逼就对了！我是一段介绍文字，总之很牛逼就对了！我是一段介绍文字，总之很牛逼就对了！我是一段介绍文字，总之很牛逼就对了！',
        author: '创建者@某某某',  // 作者
    };

    for(let [key, value] of params.entries()) {
        paramsObject[key] = value;
    }

    if(paramsObject.lightIntensity) {
        paramsObject.lightIntensity = Number(paramsObject.lightIntensity);
    } 
    
    if(paramsObject.cardMetalness) {
        paramsObject.cardMetalness = Number(paramsObject.cardMetalness);
    }

    if(paramsObject.cardRoughness) {
        paramsObject.cardRoughness = Number(paramsObject.cardRoughness);
    }
    
    if(paramsObject.cameraX) {
        paramsObject.cameraX = Number(paramsObject.cameraX);
    }

    if(paramsObject.cameraY) {
        paramsObject.cameraY = Number(paramsObject.cameraY);
    }

    if(paramsObject.cameraZ) {
        paramsObject.cameraZ = Number(paramsObject.cameraZ);
    }

    if(paramsObject.fontColor && typeof paramsObject.fontColor === 'string') {
        paramsObject.fontColor = parseInt(paramsObject.fontColor, 16);
    }

    if(paramsObject.lightingColor && typeof paramsObject.lightingColor === 'string') {
        paramsObject.lightingColor = parseInt(paramsObject.lightingColor, 16);
    }

    if(paramsObject.cardColor && typeof paramsObject.cardColor === 'string') {
        paramsObject.cardColor = parseInt(paramsObject.cardColor, 16);
    }

    if(paramsObject.backgroundColor && typeof paramsObject.backgroundColor === 'string') {
        paramsObject.backgroundColor = parseInt(paramsObject.backgroundColor, 16);
    }

    return paramsObject;
}

function setFlashModel(x, y, z, size, rotationY = 0){
    // 加载GLB模型
    const loader = new GLTFLoader();
    loader.load('model/splash.glb', (gltf) => {
        const model = gltf.scene;
        group.add(model);

        model.position.set(x, y, z);
        model.scale.set(size, size, size);
        model.rotation.y = rotationY * 2 * Math.PI;

        model.traverse(function (child) {
            if (child.isMesh) {
                child.material.roughness = 0.01;
                child.material.metalness = 1;
                child.material.color = new THREE.Color(urlParams.lightingColor);
                child.material.emissive = new THREE.Color(urlParams.lightingColor);
                child.material.emissiveIntensity = 0.2;
            }
        });
    });
}


function setText(content, x, y, z, height, color, rotationY = 0, width = 0) {
    let domDiv = document.createElement('div');

    let bigger = 100;  // 米单位到像素值的放大倍数
    domDiv.style.color = '#' + color.toString(16).padStart(6, '0');  // 设置绝对定位
    
    domDiv.style.position = 'absolute'  // 设置绝对定位
    domDiv.style.fontWeight = 'bold' // 设置绝对定位
    domDiv.style.backgroundColor = 'rgba(0, 0, 0, 0)' // 设置绝对定位
    domDiv.textContent = content;  // 设置内容

    if(width) {
        domDiv.style.width = width * bigger + 'px'  // 设置绝对定位
        domDiv.style.textAlign = 'left'  // 设置绝对定位
        domDiv.style.lineHeight = height * 1.2 * bigger + 'px'  // 设置绝对定位
        domDiv.style.fontSize = height * bigger + 'px'  // 设置绝对定位
    } else {
        domDiv.style.height = height * bigger + 'px'  // 设置绝对定位
        domDiv.style.lineHeight = height * bigger + 'px'  // 设置绝对定位
        domDiv.style.fontSize = height * bigger + 'px'  // 设置绝对定位
    }

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
            let planeMaterial = new THREE.MeshStandardMaterial({ map: texture, transparent: true, emissive: color });

            let textMesh = new THREE.Mesh(planeGeometry, planeMaterial);
            textMesh.position.x = x;
            textMesh.position.y = y;
            textMesh.position.z = z;

            textMesh.rotation.y = rotationY * 2 * Math.PI;

            group.add(textMesh);
        })
    })
}

function setImage(src, x, y, z, width, height, radius, rotationY = 0) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // 尝试请求 CORS 权限
    img.src = src
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置canvas尺寸并绘制图像
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // 从canvas获取blob
        canvas.toBlob(function(blob) {
            // 从Blob对象创建一个URL
            const url = URL.createObjectURL(blob);
            let bigger = 100;  // 米单位到像素值的放大倍数
            let domDiv = document.createElement('img');
    
            domDiv.src = url;
            domDiv.style.height = height * bigger + 'px'  // 设置绝对定位
            domDiv.style.width = width * bigger + 'px'  // 设置绝对定位
            domDiv.style.borderRadius = radius * bigger + 'px'  // 设置绝对定位
            domDiv.style.position = 'absolute'  // 设置绝对定位
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
        }, 'image/png'); // 'image/png' 是输出的格式，可以根据需要更改
    };
}
