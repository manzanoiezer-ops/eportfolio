// Interactive 3D Showcase: a fully lit, user-orbitable render of the same
// Sitophilus oryzae scan used (as a flat rim-lit silhouette) in the hero.
// Unlike the hero canvas, this one keeps the glTF's original materials and
// adds real lights, so it reads as an actual specimen rather than an icon —
// then hands rotation/zoom to the user via OrbitControls instead of
// auto-spinning forever.
(function () {
    var MODEL_URL = window.SHOWCASE_MODEL_URL || '/models/sitophilus_oryzae.glb';
    var ACCENT = 0xd9a143;   // --accent / --pop
    var ACCENT_2 = 0x8fae7c; // --accent-2
    var RIM = 0xdce8ff;

    function init() {
        var canvas = document.getElementById('showcase-canvas');
        var wrap = document.getElementById('showcase-frame');
        var loader = document.getElementById('showcase-loader');
        var toggleBtn = document.getElementById('showcase-rotate-toggle');
        if (!canvas || !wrap || typeof THREE === 'undefined') return;

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        if (renderer.outputEncoding !== undefined) renderer.outputEncoding = THREE.sRGBEncoding;

        var pivot = new THREE.Group();
        scene.add(pivot);

        // Lighting: soft ambient fill + a warm gold key light (matches the
        // accent used across the rest of the site) + a cool rim light so the
        // specimen doesn't flatten out against the dark backdrop.
        scene.add(new THREE.AmbientLight(0xffffff, 0.65));

        var key = new THREE.DirectionalLight(ACCENT, 1.3);
        key.position.set(2.5, 3, 2.5);
        scene.add(key);

        var rim = new THREE.DirectionalLight(RIM, 0.6);
        rim.position.set(-3, 1.5, -2);
        scene.add(rim);

        var fill = new THREE.PointLight(ACCENT_2, 0.4, 0, 2);
        fill.position.set(0, -1, 2);
        scene.add(fill);

        var controls = null;
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.08;
            controls.enablePan = false;
            controls.minDistance = 1.6;
            controls.maxDistance = 6;
            controls.autoRotate = !reduceMotion;
            controls.autoRotateSpeed = 1.4;
        }

        function resize() {
            var size = wrap.clientWidth;
            var h = wrap.clientHeight || size;
            renderer.setSize(size, h, false);
            camera.aspect = size / h;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', resize);

        var rafId = null;
        function animate() {
            rafId = requestAnimationFrame(animate);
            if (controls) controls.update();
            renderer.render(scene, camera);
        }

        function showLoaded() {
            if (loader) loader.classList.add('showcase-loader-hidden');
        }

        function buildSpecimen(gltf) {
            var root = gltf.scene;

            // Center + scale to a consistent, comfortable framing regardless
            // of the source scan's original units (same approach as the hero
            // silhouette, so both views agree on what "the specimen" looks
            // sized like).
            var box = new THREE.Box3().setFromObject(root);
            var size = box.getSize(new THREE.Vector3());
            var center = box.getCenter(new THREE.Vector3());
            var maxDim = Math.max(size.x, size.y, size.z) || 1;
            var scale = 2 / maxDim;

            root.position.sub(center);
            pivot.add(root);
            pivot.scale.setScalar(scale);

            camera.position.set(0, 0.3, 3);
            if (controls) controls.target.set(0, 0, 0);

            resize();
            showLoaded();
            animate();
        }

        function buildFallback() {
            // Simple faceted placeholder if the model fails to load, so the
            // section never shows a dead gray box.
            var geo = new THREE.IcosahedronGeometry(1, 0);
            var mat = new THREE.MeshStandardMaterial({ color: ACCENT, flatShading: true, metalness: 0.2, roughness: 0.6 });
            pivot.add(new THREE.Mesh(geo, mat));
            camera.position.set(0, 0.3, 3);
            resize();
            showLoaded();
            if (loader) loader.textContent = 'Specimen preview unavailable — showing placeholder.';
            animate();
        }

        if (toggleBtn && controls) {
            toggleBtn.addEventListener('click', function () {
                controls.autoRotate = !controls.autoRotate;
                toggleBtn.classList.toggle('active', controls.autoRotate);
                toggleBtn.textContent = controls.autoRotate ? 'Pause rotation' : 'Auto-rotate';
            });
            toggleBtn.textContent = controls.autoRotate ? 'Pause rotation' : 'Auto-rotate';
            toggleBtn.classList.toggle('active', controls.autoRotate);
        }

        if (typeof THREE.GLTFLoader === 'undefined') {
            buildFallback();
            return;
        }

        new THREE.GLTFLoader().load(MODEL_URL, buildSpecimen, undefined, buildFallback);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
