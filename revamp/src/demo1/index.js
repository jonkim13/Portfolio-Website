// src/demo1/index.js

import { preloadImages } from '../utils';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

// Which themes we support from your CSS (.demo-1, .demo-2, .demo-3, .demo-4, .demo-8)
const DEMO_BODY_CLASSES = ['demo-1', 'demo-2', 'demo-3', 'demo-4', 'demo-8'];

/**
 * For each "demo" give the animation config.
 */
function getAnimationConfig(demoName) {
  switch (demoName) {
    case 'demo2':
      // Slide up & fade out
      return {
        set: { transformOrigin: '50% 50%' },
        to: { y: -200, opacity: 0, ease: 'none' },
      };

    case 'demo3':
      // Slight zoom in & move up
      return {
        set: { transformOrigin: '50% 100%' },
        to: { scale: 1.2, y: -120, ease: 'none' },
      };

    case 'demo4':
      // Rotate and drift down
      return {
        set: { transformOrigin: '50% 0%' },
        to: { rotation: 15, y: 160, ease: 'none' },
      };

    case 'demo8':
      // Shrink & desaturate
      return {
        set: { transformOrigin: '50% 50%' },
        to: { scale: 0.5, filter: 'grayscale(1)', ease: 'none' },
      };

    case 'demo1':
    default:
      // Original Codrops-like scale down
      return {
        set: {
          transformOrigin: `${Math.random() > 0.5 ? 0 : 100}% 100%`,
        },
        to: {
          ease: 'none',
          scale: 0,
        },
      };
  }
}

/**
 * Build scroll animations for all grid items based on the current demo/theme.
 */
function buildGridAnimations(demoName, gridItems) {
  // Kill existing ScrollTriggers so we can rebuild cleanly
  ScrollTrigger.getAll().forEach((t) => t.kill());

  const config = getAnimationConfig(demoName);

  gridItems.forEach((item) => {
    const image = item.querySelector('.grid__item-img');

    // Reset any previous transforms/filters
    gsap.set(image, { clearProps: 'transform,filter,opacity' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    if (config.set) {
      tl.set(image, config.set);
    }

    tl.to(image, config.to);
  });
}

/**
 * Change the body theme class (demo-1, demo-2, etc.)
 */
function setBodyTheme(demoName) {
  const body = document.body;

  DEMO_BODY_CLASSES.forEach((cls) => body.classList.remove(cls));

  // demoName is like "demo1" → we want "demo-1"
  const num = demoName.replace('demo', '');
  body.classList.add(`demo-${num}`);
}

/**
 * Set --nav-color based on the color of the main name title
 * (Jonathan Kim). Whatever color that text is, the nav & mouse scroll match.
 */
function updateNavColorFromTitle() {
  const titleEl = document.querySelector('.cover__title');
  if (!titleEl) return;

  const titleColor = getComputedStyle(titleEl).color; // e.g. "rgb(180, 23, 23)"
  document.documentElement.style.setProperty('--nav-color', titleColor);
}

// Preload and kick things off
preloadImages('.grid__item-img').then(() => {
  document.body.classList.remove('loading');

  const gridItems = [...document.querySelectorAll('.grid > .grid__item')];

  // Smooth scrolling with Lenis
  const lenis = new Lenis({
    lerp: 0.1,
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Current theme
  let currentDemo = 'demo1';

  // Initial theme + animations
  setBodyTheme(currentDemo);
  buildGridAnimations(currentDemo, gridItems);
  updateNavColorFromTitle();

  // === Top theme nav + Flip corners ===
  const navLinks = gsap.utils.toArray('.nav-link');
  const navCorners = document.querySelector('.nav-corners');

  if (navLinks.length && navCorners) {
    // Attach corners to the initially active button
    const initialActive =
      document.querySelector('.nav-link.is--active') || navLinks[0];
    if (initialActive) {
      initialActive.appendChild(navCorners);
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', function () {
        const targetDemo = this.dataset.demo || 'demo1';
        if (targetDemo === currentDemo) return;

        // Update active state classes
        navLinks.forEach((l) => l.classList.remove('is--active'));
        this.classList.add('is--active');

        // Switch theme & rebuild grid animations
        currentDemo = targetDemo;
        setBodyTheme(currentDemo);
        buildGridAnimations(currentDemo, gridItems);
        updateNavColorFromTitle();
      });

      // Hover – move corners to hovered link
      link.addEventListener('mouseenter', function () {
        const state = Flip.getState(navCorners);
        this.appendChild(navCorners);
        Flip.from(state, {
          duration: 0.4,
          ease: 'power1.inOut',
        });
      });

      // Mouse leave – snap corners back to active link
      link.addEventListener('mouseleave', function () {
        const activeLink = document.querySelector('.nav-link.is--active');
        if (!activeLink) return;
        const state = Flip.getState(navCorners);
        activeLink.appendChild(navCorners);
        Flip.from(state, {
          duration: 0.4,
          ease: 'power1.inOut',
        });
      });
    });
  } // <-- close top nav IF here

  // === Scroll indicator fade-out (class-based) ===
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    setTimeout(() => {
      scrollIndicator.classList.add('is-hidden');
    }, 5000);
  }

// ===== FOOTER NAV FLIP CORNERS =====
const footerLinks = gsap.utils.toArray('.footer-nav-link');
const footerCorners = document.querySelector('.footer-nav-corners');

if (footerLinks.length && footerCorners) {
  // Attach corners to first active
  const initialFooterActive =
    document.querySelector('.footer-nav-link.is--active') || footerLinks[0];
  if (initialFooterActive) {
    initialFooterActive.appendChild(footerCorners);
  }

  footerLinks.forEach((link) => {
    link.addEventListener('click', function () {
      const section = this.dataset.section;

      // update active state
      footerLinks.forEach((l) => l.classList.remove('is--active'));
      this.classList.add('is--active');

      // flip corners to clicked item
      const state = Flip.getState(footerCorners);
      this.appendChild(footerCorners);
      Flip.from(state, {
        duration: 0.4,
        ease: 'power1.inOut',
      });

      // ---- ACTIONS BASED ON SECTION ----
      if (section === 'resume') {
        window.open('/Jonathan_Kim_Resume.pdf', '_blank');
      } else if (section === 'github') {
        window.open('https://github.com/jonkim13', '_blank');
      } else if (section === 'linkedin') {
        window.open('https://www.linkedin.com/in/jonathan-kim-j1k3/', '_blank');
      } else if (section === 'email') {
        window.location.href =
          'mailto:jon.kim.mj@gmail.com';
      }
    });

    // Hover → move corners to hovered link
    link.addEventListener('mouseenter', function () {
      const state = Flip.getState(footerCorners);
      this.appendChild(footerCorners);
      Flip.from(state, {
        duration: 0.4,
        ease: 'power1.inOut',
      });
    });

    // Mouse leave → return corners to active
    link.addEventListener('mouseleave', function () {
      const activeFooter = document.querySelector('.footer-nav-link.is--active');
      if (!activeFooter) return;
      const state = Flip.getState(footerCorners);
      activeFooter.appendChild(footerCorners);
      Flip.from(state, {
        duration: 0.4,
        ease: 'power1.inOut',
      });
    });
  });
}
}); // closes preloadImages(...).then(...)