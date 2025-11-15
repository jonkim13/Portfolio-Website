// src/demo1/utils.js
import imagesLoaded from 'imagesloaded';

export const lerp = (a, b, n) => (1 - n) * a + n * b;

/**
 * Preload images
 * @param {String} selector - Selector from where images need to be preloaded.
 */
export const preloadImages = (selector = 'img') => {
  return new Promise((resolve) => {
    imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
  });
};