import { loadVideoLinks, saveVideoLink } from '../utils/videoLinks.js';

export function initializeFarmingWorld(preferences) {
    let scene, camera, renderer, controls;
    let avatar, flowers = [];

    init();
    animate();

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 20);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;

        // Farming world setup
        scene.background = new THREE.Color(0x87CEEB); // Sky blue

        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshBasicMaterial({color: 0x228B22}); // Green
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        // Avatar
        const avatarGeometry = new THREE.BoxGeometry(1, 2, 1);
        const avatarMaterial = new THREE.MeshBasicMaterial({color: 0x8B4513}); // Brown
        avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
        avatar.position.set(0, 1, 0);
        scene.add(avatar);

        // Flowers
        for (let i = 0; i < 50; i++) {
            const flowerGeometry = new THREE.ConeGeometry(0.2, 0.5, 16);
            const flowerMaterial = new THREE.MeshBasicMaterial({color: 0xFF69B4}); // Pink
            const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
            flower.position.set(
                THREE.MathUtils.randFloatSpread(50),
                0.25,
                THREE.MathUtils.randFloatSpread(50)
            );
            flower.rotation.x = Math.PI / 2;
            flowers.push(flower);
            scene.add(flower);
        }

        // Load and create floating video links
        loadVideoLinks(preferences.selectedPlanet).then(links => {
            displayVideoLinks(links);
        });

        document.addEventListener('keydown', onKeyPress, false);
        document.addEventListener('click', onClick, false);
    }

    function displayVideoLinks(links) {
        links.forEach((linkData, index) => {
            const loader = new THREE.FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
                const textGeometry = new THREE.TextGeometry(linkData.label, {
                    font: font,
                    size: 1,
                    height: 0.1,
                });
                const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.position.set(
                    THREE.MathUtils.randFloatSpread(50),
                    2,
                    THREE.MathUtils.randFloatSpread(50)
                );
                textMesh.url = linkData.url;
                scene.add(textMesh);
            });
        });
    }

    function onKeyPress(event) {
        const moveSpeed = 0.5;
        switch (event.key) {
            case 'w':
                avatar.position.z -= moveSpeed;
                break;
            case 's':
                avatar.position.z += moveSpeed;
                break;
            case 'a':
                avatar.position.x -= moveSpeed;
                break;
            case 'd':
                avatar.position.x += moveSpeed;
                break;
        }
        camera.position.set(avatar.position.x, avatar.position.y + 5, avatar.position.z + 20);
        controls.target.set(avatar.position.x, avatar.position.y + 1, avatar.position.z);
        controls.update();
    }

    function onClick(event) {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0 && intersects[0].object.url) {
            window.open(intersects[0].object.url, '_blank');
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
}
