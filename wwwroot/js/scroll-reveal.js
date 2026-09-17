// Smooth scroll (Lenis) + section snapping + lightweight scroll-reveal.
// Elements with class "reveal" fade/slide into place the first time they
// enter the viewport. Sections with class "snap-section" (homepage only)
// pull the page to rest on them so scrolling settles on each part instead
// of gliding straight past it. Respects prefers-reduced-motion: everything
// just shows up immediately, no smoothing, no motion, no snapping.
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lenisInstance = null;

    function initLenis() {
        if (reduceMotion || typeof window.LenisCore === 'undefined') return null;

        var lenis = new window.LenisCore({
            duration: 1.3,
            wheelMultiplier: 2,
            touchMultiplier: 2.2,
            easing: function (t) { return 1 - Math.pow(1 - t, 4); } // ease-out quartic — longer glide at the tail
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return lenis;
    }

    function initSnap(lenis) {
        var sections = document.querySelectorAll('.snap-section');
        if (!lenis || !sections.length || typeof window.LenisSnap === 'undefined') return;

        var snap = new window.LenisSnap(lenis, {
            type: 'proximity',
            duration: 0.9,
            easing: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }, // ease-in-out cubic — no hard grab at the start
            velocityThreshold: 1.2 // commits as soon as scroll speed drops below this, so it doesn't wait for a near-dead-stop
        });

        sections.forEach(function (el) { snap.addElement(el, { align: ['start'] }); });

        // Giving the footer its own snap anchor didn't fully stop it from
        // getting pulled back into the last section — the plugin's proximity
        // check still fights over that boundary. Instead, once the footer is
        // actually in view, turn snapping off completely so nothing can drag
        // it back up. It turns back on once you scroll above the footer again.
        var footer = document.querySelector('.site-footer');
        if (footer && typeof IntersectionObserver !== 'undefined') {
            var footerObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        snap.stop();
                    } else {
                        snap.start();
                    }
                });
            }, { threshold: 0 });
            footerObserver.observe(footer);
        }
    }

    function initReveal() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (reduceMotion || typeof IntersectionObserver === 'undefined') {
            items.forEach(function (el) { el.classList.add('in-view'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

        items.forEach(function (el) { observer.observe(el); });
    }

    function init() {
        lenisInstance = initLenis();
        initSnap(lenisInstance);
        initReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();