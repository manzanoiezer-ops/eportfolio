// Hero "viewport" scene: loads the Sitophilus oryzae (rice weevil) scan and
// renders it as a rim-lit silhouette — a solid shape with a thin glowing
// brass/gold outline, like a specimen caught under a display-case spotlight.
// The source scan is a dense photogrammetry mesh (~65k verts per part), so a
// literal wireframe would just be noise; the silhouette technique renders two
// copies of the same geometry (a slightly enlarged back-face-only "rim" copy
// behind a normal-size front-face-only "fill" copy) instead.
// Falls back to a simple wireframe specimen box if the model can't load.
(function () {
    var MODEL_URL = window.HERO_MODEL_URL || '/models/sitophilus_oryzae.glb';
    var ACCENT = 0xb8842b;
    var FILL = 0x3f5738;

    function init() {
        var canvas = document.getElementById('hero-scene');
        if (!canvas || typeof THREE === 'undefined') return;

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        var group = new THREE.Group();
        scene.add(group);

        function resize() {
            var size = canvas.parentElement.clientWidth;
            var h = canvas.parentElement.clientHeight || size;
            renderer.setSize(size, h, false);
            camera.aspect = size / h;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', resize);

        function startLoop() {
            resize();
            if (reduceMotion) {
                renderer.render(scene, camera);
                return;
            }
            (function animate() {
                group.rotation.y += 0.0022;
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            })();
        }

        function buildWeevilSilhouette(gltf) {
            var fillRoot = gltf.scene;
            var rimRoot = gltf.scene.clone(true);

            var fillMat = new THREE.MeshBasicMaterial({ color: FILL, side: THREE.FrontSide });
            var rimMat = new THREE.MeshBasicMaterial({ color: ACCENT, side: THREE.BackSide, transparent: true, opacity: 0.9 });

            fillRoot.traverse(function (c) { if (c.isMesh) c.material = fillMat; });
            rimRoot.traverse(function (c) { if (c.isMesh) c.material = rimMat; });

            // Fit + center: read the fill copy's bounds, apply the same offset/scale to both.
            var box = new THREE.Box3().setFromObject(fillRoot);
            var size = box.getSize(new THREE.Vector3());
            var center = box.getCenter(new THREE.Vector3());
            var maxDim = Math.max(size.x, size.y, size.z) || 1;
            var scale = 2.6 / maxDim;

            [fillRoot, rimRoot].forEach(function (root) {
                root.position.sub(center);
            });
            rimRoot.scale.setScalar(1.035); // slightly larger back-face pass = rim outline

            group.add(fillRoot, rimRoot);
            group.scale.setScalar(scale);
            group.rotation.set(-0.15, 0.7, 0.05);

            camera.position.set(2.6, 1.1, 3.4);
            camera.lookAt(0, 0, 0);
            startLoop();
        }

        function buildFallbackBox() {
            // Wireframe specimen box — used only if the weevil model can't load.
            var trayGeo = new THREE.BoxGeometry(2.4, 0.35, 1.6);
            group.add(new THREE.LineSegments(
                new THREE.EdgesGeometry(trayGeo),
                new THREE.LineBasicMaterial({ color: 0x3f5738, transparent: true, opacity: 0.85 })
            ));
            group.add(new THREE.Mesh(trayGeo, new THREE.MeshBasicMaterial({ color: 0xece4d3, transparent: true, opacity: 0.5 })));

            var hinge = new THREE.Object3D();
            hinge.position.set(0, 0.175, -0.8);
            group.add(hinge);
            var lidGeo = new THREE.BoxGeometry(2.4, 0.04, 1.6);
            lidGeo.translate(0, 0, 0.8);
            var lid = new THREE.LineSegments(new THREE.EdgesGeometry(lidGeo), new THREE.LineBasicMaterial({ color: 0xb8842b, transparent: true, opacity: 0.9 }));
            hinge.add(lid);
            hinge.rotation.x = -0.55;

            group.rotation.set(-0.18, 0.55, 0);
            camera.position.set(3.1, 2.3, 4.1);
            camera.lookAt(0, 0.05, 0);
            startLoop();
        }

        if (typeof THREE.GLTFLoader === 'undefined') {
            buildFallbackBox();
            return;
        }

        new THREE.GLTFLoader().load(
            MODEL_URL,
            buildWeevilSilhouette,
            undefined,
            buildFallbackBox
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
