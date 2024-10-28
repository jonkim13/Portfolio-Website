// main.js

// Update tagline every 1 seconds
const taglineEl = document.getElementById('dynamic-tagline');
const taglines = ["Golfer", "Boba Maniac", "Gamer", "CS Major", "Traveler", "R&B Lover (K & J)"];
let taglineIndex = 0;

setInterval(() => {
  taglineIndex = (taglineIndex + 1) % taglines.length;
  taglineEl.textContent = taglines[taglineIndex];
}, 1000);

/* Infinite Loop (Treadmill Effect) Implementation */

// Get references to background and scrolling images container
const backgroundEl = document.getElementById('background');
const scrollingImages = document.querySelector('.scrolling-images');

// Duplicate the images to create a seamless loop
const originalImagesHTML = scrollingImages.innerHTML;
scrollingImages.innerHTML += originalImagesHTML;

// Function to calculate the height of one set of images
let imageSetHeight = 0;

function calculateImageSetHeight() {
  imageSetHeight = scrollingImages.scrollHeight / 2;
  // Set initial scroll position to the start of the original images
  backgroundEl.scrollTop = 0;
}

// Wait for all images to load
const images = scrollingImages.querySelectorAll('img');
let imagesLoaded = 0;

images.forEach((img) => {
  if (img.complete) {
    imagesLoaded++;
    if (imagesLoaded === images.length) {
      calculateImageSetHeight();
    }
  } else {
    img.addEventListener('load', () => {
      imagesLoaded++;
      if (imagesLoaded === images.length) {
        calculateImageSetHeight();
      }
    });
    img.addEventListener('error', () => {
      imagesLoaded++;
      if (imagesLoaded === images.length) {
        calculateImageSetHeight();
      }
    });
  }
});

// Handle scroll events for infinite scrolling
let isAdjustingScroll = false;

function handleScroll() {
  if (isAdjustingScroll) return;

  // Debounce the scroll event
  isAdjustingScroll = true;
  requestAnimationFrame(() => {
    if (backgroundEl.scrollTop >= imageSetHeight) {
      // Adjust the scroll position to the equivalent position in the first set
      backgroundEl.scrollTop = backgroundEl.scrollTop - imageSetHeight;
    } else if (backgroundEl.scrollTop <= 0) {
      // Jump to the equivalent position in the second set
      backgroundEl.scrollTop = backgroundEl.scrollTop + imageSetHeight;
    }
    isAdjustingScroll = false;
  });
}

// Add event listener for scrolling
backgroundEl.addEventListener('scroll', handleScroll);

/* Forward Scroll Events from #content and Modals to #background */

// Get reference to the content element
const contentEl = document.getElementById('content');

// Function to forward wheel events
function forwardWheelEvent(e) {
  e.preventDefault(); // Prevent default scroll behavior on the element

  // Scroll the #background element by the delta of the wheel event
  backgroundEl.scrollBy({
    top: e.deltaY,
    left: 0,
    behavior: 'auto', // Instant scrolling to match user input
  });
}

// Function to forward touch events (for mobile devices)
let touchStartY = 0;

function handleTouchStart(e) {
  if (e.touches.length === 1) {
    touchStartY = e.touches[0].clientY;
  }
}

function handleTouchMove(e) {
  if (e.touches.length === 1) {
    e.preventDefault();
    const touchCurrentY = e.touches[0].clientY;
    const deltaY = touchStartY - touchCurrentY;
    touchStartY = touchCurrentY;

    backgroundEl.scrollBy({
      top: deltaY,
      left: 0,
      behavior: 'auto',
    });
  }
}

// Add scroll forwarding to #content
contentEl.addEventListener('wheel', forwardWheelEvent, { passive: false });
contentEl.addEventListener('touchstart', handleTouchStart, { passive: false });
contentEl.addEventListener('touchmove', handleTouchMove, { passive: false });

/* Modal Functionality */

// Function to handle opening and closing modals
function setupModal(buttonId, modalId) {
  const button = document.getElementById(buttonId);
  const modal = document.getElementById(modalId);
  const closeButton = modal.querySelector('.close-button');
  const typingTextEls = modal.querySelectorAll('.typing-text');

  // Add scroll forwarding to the modal
  modal.addEventListener('wheel', forwardWheelEvent, { passive: false });
  modal.addEventListener('touchstart', handleTouchStart, { passive: false });
  modal.addEventListener('touchmove', handleTouchMove, { passive: false });

  // Open the modal when the button is clicked
  button.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    contentEl.classList.add('hidden'); 

    // Start typing animation
    if (typingTextEls.length > 0) {
      // Clear text content and reset isTypingCancelled flag
      typingTextEls.forEach((el) => {
        el.textContent = '';
        el.isTypingCancelled = false;
      });

      let index = 0;
      function typeNext() {
        const element = typingTextEls[index];
        const fullText = element.getAttribute('data-content');
        startTyping(element, fullText, 15, () => {
          index++;
          if (index < typingTextEls.length) {
            typeNext();
          } else if (modalId === 'projects-modal') {
            // Fade in project items after typing animation
            fadeInProjects();
          }
        });
      }
      typeNext();
    } else if (modalId === 'projects-modal') {
      fadeInProjects();
    }
  });

  // Close the modal when the close button is clicked
  closeButton.addEventListener('click', () => {
    closeModal(modalId);
  });

  // Close the modal when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('hidden');
  contentEl.classList.remove('hidden'); // Show the main content

  // Stop typing animation
  const typingTextEls = modal.querySelectorAll('.typing-text');
  typingTextEls.forEach((el) => {
    el.isTypingCancelled = true; 
    el.textContent = ''; 
  });

  // Reset project items if modal is projects-modal
  if (modalId === 'projects-modal') {
    const projectItems = modal.querySelectorAll('.project-item');
    projectItems.forEach((item) => {
      item.classList.remove('visible');
    });
  }
}

// Setup modals for About Me, Projects, and Socials
setupModal('about-button', 'about-modal');
setupModal('projects-button', 'projects-modal');
setupModal('socials-button', 'socials-modal');

// Close modals when pressing the Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      if (!modal.classList.contains('hidden')) {
        closeModal(modal.id);
      }
    });
  }
});

/* Typing Animation Function */

function startTyping(element, text, speed = 50, callback) {
  let index = 0;
  element.isTypingCancelled = false;

  function typeCharacter() {
    if (element.isTypingCancelled) {
      element.textContent = ''; 
      return;
    }
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(typeCharacter, speed);
    } else {
      if (callback) {
        callback();
      }
    }
  }

  typeCharacter();
}

/* Fade-in Effect for Project Items */

function fadeInProjects() {
  const modal = document.getElementById('projects-modal');
  const projectItems = modal.querySelectorAll('.project-item');
  let delay = 0;

  projectItems.forEach((item) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, delay);
    delay += 300; 
  });
}

/* Prevent Copying on Non-Selectable Elements */

// Get all elements with the 'non-selectable' class
const nonSelectableElements = document.querySelectorAll('.non-selectable');

nonSelectableElements.forEach((el) => {
  // Disable right-click context menu
  el.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // Disable copy action
  el.addEventListener('copy', function (e) {
    e.preventDefault();
  });

  // Disable drag events
  el.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });
});

// Disable copy via keyboard shortcuts (Ctrl+C / Cmd+C)
document.addEventListener('keydown', function (e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
    const selection = window.getSelection();
    if (selection) {
      const selectedElements = Array.from(
        selection.getRangeAt(0).cloneContents().querySelectorAll('.non-selectable')
      );
      if (selectedElements.length > 0) {
        e.preventDefault();
      }
    }
  }
});
