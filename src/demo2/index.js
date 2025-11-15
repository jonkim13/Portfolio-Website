// src/demo2/index.js
import { preloadImages } from '../utils';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const gridItems = [...document.querySelectorAll('.grid > .grid__item')];

preloadImages('.grid__item-img').then(() => {
  document.body.classList.remove('loading');

  // smooth scroll
  const lenis = new Lenis({
    lerp: 0.1,
    smooth: true,
  });

  const scrollFn = (time) => {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(scrollFn);
  };
  requestAnimationFrame(scrollFn);

  gridItems.forEach((item) => {
    const image = item.querySelector('.grid__item-img');

    gsap
      .timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top bottom', // tile enters viewport
          end: 'top top',      // tile hits top
          scrub: true,
        },
      })
      .set(image, {
        transformOrigin: `${Math.random() > 0.5 ? 0 : 100}% 200%`,
        scale: 1,
      })
      .to(image, {
        ease: 'none',
        scale: 0.2,
        borderRadius: '50%',
      });
  });
});