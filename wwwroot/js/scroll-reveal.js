// Smooth scroll (Lenis) + lightweight scroll-reveal.
// Elements with class "reveal" fade/slide into place the first time they
// enter the viewport. Respects prefers-reduced-motion: everything just
// shows up immediately, no smoothing, no motion.
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initLenis() {
        if (reduceMotion || typeof Lenis === 'undefined') return;

        var lenis = new Lenis({
            duration: 1.1,
            easing: function (t) { return 1 - Math.pow(1 - t, 3); } // ease-out cubic
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
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
        initLenis();
        initReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
