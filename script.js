'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const section1 = document.querySelector('#section--1');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const message_cookie = document.createElement('div');
const navLinks = document.querySelector('.nav__links');
const operationsContainer = document.querySelector(
  '.operations__tab-container'
);
const operationBtns = document.querySelectorAll('.btn.operations__tab');
const operationsContent = document.querySelectorAll('.operations__content');
const navLinksList = navLinks.querySelectorAll('.nav__link');
const logo = navLinks.closest('.nav').querySelector('img');
const nav = document.querySelector('.nav');
const sections = document.querySelectorAll('.section');
const imgs = document.querySelectorAll('.features__img[data-src]');
const slider = document.querySelector('.slider');
const sliderBtns = document.querySelectorAll('.slider__btn');
const slides = document.querySelectorAll('.slide');

// Functions & Objects --------------------------

// Opening modal function.
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// Closing modal function.
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Adding listener for all buttons.
btnsOpenModal.forEach((val, index, arr) =>
  val.addEventListener('click', openModal)
);

// Fading animation for nav bar.
const navAnimation = function (e) {
  // Guard clause for naviation link rectangle.
  if (e.target.classList.contains('nav__links')) return;

  // Make all opacity 0.5, except our target link.
  navLinksList.forEach(link => {
    if (e.target !== link) link.style.opacity = this;
  });
  // Logo opacity.
  logo.style.opacity = this;
};

// Entries for headerobserver.
const headObserverFunc = function (entries, observer) {
  const [entry] = entries;

  // entry.target gives the element that causes the execution of observer call back function.

  // Sticky header.
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

// Revealing Sections Functions
const sectionObserverFunc = function (entries, observer) {
  const [entry] = entries;

  // When starts intersects of any sections!!
  // Not really need if statement since entry.target variable already follows the sections that trigger observer!
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    sectionObserver.unobserve(entry.target);
  }
};
// Null for root option is going to be cause a default which is view port.
// Options for headerobserver.
const options = {
  root: null,
  threshold: 0,
};

// Processes --------------------------

// Making a cookie element;
message_cookie.classList.add('cookie-message');
message_cookie.innerHTML = `this is a cookie! <button class ='btn btn--close-cookie'>Got it!</button>`;
//message_cookie.textContent = 'This is a cookie!';
header.append(message_cookie);

// Styling the cookie element
message_cookie.style.backgroundColor = '#37383d';
message_cookie.style.width = '120%';

// Event Handlers --------------------------

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Closing the cookie element. (Deleting it on a specified event)
message_cookie.addEventListener('click', function () {
  message_cookie.remove();
});

// Smooth scrolling (Modern Way : Only works on new browsers!)
btnLearnMore.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Old way of implementing smooth scrolling.
//
// btnLearnMore.addEventListener('click', function () {
//   const featureCoor = section1.getBoundingClientRect();
//   window.scrollTo({
//     left: featureCoor.x + window.scrollX,
//     top: featureCoor.y + window.scrollY,
//     behavior: 'smooth',
//   });
// });

// Using Event Propagation for Event Delegation! (Implementing Nav Bar Feature In an Efficient Way!)
// Using the parent to have same function for all children, this way we do not have to copy function for each child! This is called Event Delegation! They are empowered by their parent selectively!
navLinks.addEventListener('click', function (e) {
  // From event propagation child element's default prevented!
  e.preventDefault();

  // Match Filtering Strategy
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    // Target is where event happened, current where eventhandler attachted to and basically gives same as this keyword.
    let scrollingSec = e.target.getAttribute('href');
    document.querySelector(scrollingSec).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component Functionality
operationsContainer.addEventListener('click', function (e) {
  // Activating class.

  // Closest will look all parents including its attached element!
  const targetBtn = e.target.closest('.operations__tab');

  // Guard Clause : if targetBtn Null return immediately. Closest return null if couldn't find!
  if (!targetBtn) return;

  // Remove active class from all.
  operationBtns.forEach(btn => btn.classList.remove('operations__tab--active'));
  // Adding active class.
  targetBtn.classList.add('operations__tab--active');

  // Activating content

  // Removing active from all contents.
  operationsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );

  // Matching strategy, using dataset from html.
  // Traversing
  // const tab = e.target
  //   .closest('.operations')
  //   .querySelector(`.operations__content--${targetBtn.dataset.tab}`);
  // or
  // Dynamically Selecting from document
  const tab = document.querySelector(
    `.operations__content--${targetBtn.dataset.tab}`
  );

  // Adding active class.
  tab.classList.add('operations__content--active');
});

//-------------------------------
// Navigation Fade Animation (Passing argument to evenet handler)

navLinks.addEventListener('mouseover', navAnimation.bind(0.5));
navLinks.addEventListener('mouseout', navAnimation.bind(1.0));

//-------------------------------
// Sticky navigation -- Unefficient

// const sec1Coor = section1.getBoundingClientRect();
// const stickyMoving = function (e) {
//   if (sec1Coor.y < window.scrollY) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// };
// document.addEventListener('scroll', stickyMoving);

//-------------------------------
// Sticky navigation -- Efficient Way

const headerObserver = new IntersectionObserver(headObserverFunc, options);
headerObserver.observe(header);

//-------------------------------
// Revealing Section's -- Using Intersection Observer for making them appear as user scroll

const sectionObserver = new IntersectionObserver(sectionObserverFunc, {
  root: null,
  threshold: 0.15,
});
sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//-------------------------------
// Lazy Loading Images -- Using Intersection Observer API again (BETTER PERFORMANCE)

const imageObserverFunc = function (entries, observer__) {
  const [entry] = entries;

  // Adding guard clause for only intersecting change the source.
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.getAttribute('data-src');

  // Removing lazy image only when quality image loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  imageObserver.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(imageObserverFunc, {
  root: null,
  threshold: 0,
  // Adding root margin to start loading early in the page.
  rootMargin: '200px',
});

imgs.forEach(img => imageObserver.observe(img));

//-------------------------------
// Building a Slider Component

slider.style.overflow = 'visible';
let currentSlide = 0;

const goToSlide = function (curSlide) {
  slides.forEach(
    (slide, i, __) =>
      (slide.style.transform = `translateX(${100 * (i - curSlide)}%)`)
  );
};

slides.forEach(
  (slide, i, __) =>
    (slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`)
);

const sliderFunc = function (e) {
  // For Click
  e.target.classList.contains('slider__btn--right')
    ? currentSlide++
    : currentSlide--;

  // For Keys
  e.key === 'ArrowRight' ? currentSlide++ : currentSlide--;

  currentSlide = currentSlide < 0 ? 2 : currentSlide;
  currentSlide = currentSlide > 2 ? 0 : currentSlide;
  goToSlide(currentSlide);
};

sliderBtns.forEach(btn => btn.addEventListener('click', sliderFunc));

document.addEventListener('keydown', sliderFunc);
