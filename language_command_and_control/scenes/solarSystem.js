export function initializeSolarSystem(onPlanetSelected) {
    let scene, camera, renderer, controls;
    let spaceship, planets = [];
    let speed = 0.1, velocity = new THREE.Vector3();

    const planetData = [
        { name: 'Chinese', planet: 'Jupiter', size: 2.0, color: 0xFFD700, distance: 20 },
        { name: 'Spanish', planet: 'Saturn', size: 1.8, color: 0xC0C0C0, distance: 30 },
        { name: 'Portuguese', planet: 'Neptune', size: 1.6, color: 0x0000FF, distance: 40 },
        { name: 'French', planet: 'Uranus', size: 1.4, color: 0x00FFFF, distance: 50 },
        { name: 'Greek', planet: 'Earth', size: 1.2, color: 0x2E8B57, distance: 60 },
        { name: 'Russian', planet: 'Mars', size: 1.0, color: 0xFF4500, distance: 70 }
    ];

    init();
    animate();

    function init() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 5, 100);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Add OrbitControls for click and drag functionality
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 2;

        // Space background for solar system
        scene.background = new THREE.Color(0x000000);
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({color: 0xffffff});
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            starVertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
            starVertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
            starVertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Spaceship
        const spaceshipGeometry = new THREE.ConeGeometry(1, 2.5, 32);
        const spaceshipMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
        spaceship = new THREE.Mesh(spaceshipGeometry, spaceshipMaterial);
        spaceship.rotation.x = Math.PI / 2;
        spaceship.position.set(0, 0, 90);
        scene.add(spaceship);

        // Create planets
        planetData.forEach((data, index) => {
            createPlanet(data, index);
        });

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('keydown', onKeyPress, false);
        document.addEventListener('click', onClick, false);
    }

    function createPlanet(data, index) {
        const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({color: data.color});
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.set(data.distance, 0, 0);
        planet.language = data.name;
        planet.planetName = data.planet;

        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textGeometry = new THREE.TextGeometry(`${data.name} (${data.planet})`, {
                font: font,
                size: 1.5,
                height: 0.1,
            });
            const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(-data.size * 1.5, data.size + 2, 0);
            planet.add(textMesh);
        });

        planets.push(planet);
        scene.add(planet);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onKeyPress(event) {
        switch (event.key) {
            case 'w':
                velocity.z = -speed;
                break;
            case 's':
                velocity.z = speed;
                break;
            case 'a':
                velocity.x = -speed;
                break;
            case 'd':
                velocity.x = speed;
                break;
            case 'Enter':
                checkSelection();
                break;
        }
    }

    function onClick(event) {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(planets);
        if (intersects.length > 0) {
            onPlanetSelected(intersects[0].object.language);
        }
    }

    function checkSelection() {
        planets.forEach(planet => {
            const distance = spaceship.position.distanceTo(planet.position);
            if (distance < 3) {
                document.getElementById('language-name').innerText = `Selected: ${planet.language} (${planet.planetName})`;
            }
        });
    }

    function animate() {
        requestAnimationFrame(animate);

        // Update spaceship position
        spaceship.position.add(velocity);
        camera.position.add(velocity);

        // Slow down velocity over time (inertia)
        velocity.multiplyScalar(0.98);

        controls.update();
        renderer.render(scene, camera);
    }
}
