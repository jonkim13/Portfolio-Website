// src/demo1/index.js

import { preloadImages } from '../utils';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Preload all grid background images
preloadImages('.grid__item-img').then(() => {
  // Remove loading state (hides pink circle + reveals grid)
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

  // GSAP scroll animations for each grid item
  gridItems.forEach((item) => {
    const image = item.querySelector('.grid__item-img');

    gsap
      .timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      .set(image, {
        transformOrigin: `${Math.random() > 0.5 ? 0 : 100}% 100%`,
      })
      .to(image, {
        ease: 'none',
        scale: 0,
      });
  });
});