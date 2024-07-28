import { getProductResponse } from '../../scripts/search.js';
import {
  h3, h6, p, button, div, span, hr,
} from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/aem.js';
import { getStarRating } from '../product-overview/product-overview.js';

function createSliderNavigation() {
  const prevButton = div(
    { class: 'slider-button absolute z-[1] left-[4%] top-[44%] cursor-pointer prev hidden rotate-90' },
    span({ class: 'icon icon-chevron-down' }),
  );
  const nextButton = div(
    { class: 'slider-button absolute z-[1] right-[4%] top-[44%] cursor-pointer next hidden rotate-[270deg]' },
    span({ class: 'icon icon-chevron-down' }),
  );
  decorateIcons(prevButton);
  decorateIcons(nextButton);
  return { prevButton, nextButton };
}

function createSlides(productsArray) {
  const container = div({
    class: 'slider-wrapper flex gap-4 group transition-transform duration-300 ease-in-out w-full pl-[5px] pr-[6px] max-[768px]:pl-[7px] max-[768px]:pr-[8px] max-[1024px]:pr-[10px]',
  });

  productsArray.forEach((product) => {
    const slide = div({
      class: 'slide-item flex-none bg-white',
      style: window.matchMedia('(max-width: 768px)').matches ? 'width: 100%' : 'width: calc((100% - 3rem) / 4)',
    });

    const ratingContainer = div({ class: 'flex items-center mt-2 gap-x-1' });

    if (product.numberOfReviews > 0) {
      const rating = getStarRating(product.aggregatedRating, ratingContainer, 'w-4');
      rating.append(span({ class: 'text-xs text-[#65797c]' }, `(${product.numberOfReviews || 0} reviews)`));
      decorateIcons(ratingContainer);
    } else {
      ratingContainer.style.display = 'none';
    }

    const recentlyContainer = button(
      {
        class: 'h-full flex flex-col align-center p-4 bg-white w-full border border-interactive-grey-transparent-active rounded-4px hover:bg-[#0000000d] cursor-pointer text-left',
      },
      div(
        { class: 'h-5/6' },
        div(
          { class: 'flex gap-2' },
          p({ class: 'w-fit px-2 py-1 rounded-4px text-xs font-semibold bg-[#edf6f7] text-[#2c656b] border-blue-70 border' }, `${product.category}`),
        ),
        div(
          { class: 'flex flex-col font-semibold' },
          h6({ class: 'mt-4 text-xs text-[#65797c]' }, `${product.code}`),
          p({ class: 'mb-4 mt-2 text-sm text-black-0' }, `${product.title}`),
        ),
      ),
      div(
        { class: 'rating-section h-1/5 w-full' },
        hr({ class: 'h-[1px] bg-interactive-grey-active my-0' }),
        ratingContainer,
      ),
    );

    slide.appendChild(recentlyContainer);
    container.appendChild(slide);
  });

  return container;
}

function createDots(totalSlides) {
  const dotsContainer = div({ class: 'dots flex justify-center gap-2 mt-8' });
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;

  if (totalSlides <= 1) {
    dotsContainer.style.display = 'none';
    return dotsContainer;
  }

  let totalDots;
  if (isTablet) {
    totalDots = totalSlides;
  } else {
    totalDots = isMobile ? totalSlides : Math.ceil((totalSlides - 4) / 1) + 1;
  }

  for (let i = 0; i < totalDots; i++) {
    const dot = div({ class: 'dot w-[10px] h-[10px] rounded-full bg-gray-400 cursor-pointer' });
    dotsContainer.appendChild(dot);
  }

  return dotsContainer;
}

function updateDots(dotsContainer, currentIndex) {
  const dots = dotsContainer.children;
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove('bg-gray-600');
    dots[i].classList.add('bg-gray-400');
  }
  dots[currentIndex].classList.add('bg-gray-600');
}

function initializeSlider(sliderContainer, wrapper, prevButton, nextButton, dotsContainer) {
  let index = 0;
  const totalSlides = wrapper.children.length;

  function updateSlider() {
    if (totalSlides === 0) return;

    let slideWidth;
    if (window.matchMedia('(max-width: 768px)').matches) {
      slideWidth = wrapper.clientWidth / 1;
    } else if (window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches) {
      slideWidth = wrapper.clientWidth / 2;
    } else if (window.matchMedia('(min-width: 1025px) and (max-width: 1280px)').matches) {
      slideWidth = wrapper.clientWidth / 3;
    } else {
      slideWidth = wrapper.clientWidth / 4;
    }

    if (index === 0) {
      wrapper.style.transform = 'translateX(0)';
    } else {
      wrapper.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    updateDots(dotsContainer, index);
  }

  function updateButtonsVisibility() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
    const isMedium = window.matchMedia('(min-width: 1025px) and (max-width: 1280px)').matches;

    if ((isMobile && totalSlides <= 1) || (!isMobile && totalSlides <= 4)) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    } else if (isTablet) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    } else if (isMedium) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    } else {
      prevButton.classList.toggle('cursor-pointer', index > 0);
      prevButton.classList.toggle('cursor-default', index === 0);
      prevButton.classList.toggle('hidden', index === 0);

      nextButton.classList.toggle('cursor-pointer', index < totalSlides - (isMobile ? 1 : 4));
      nextButton.classList.toggle('cursor-default', index >= totalSlides - (isMobile ? 1 : 4));
      nextButton.classList.toggle('hidden', index >= totalSlides - (isMobile ? 1 : 4));
    }
  }

  prevButton.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      updateSlider();
      updateButtonsVisibility();
    }
  });

  nextButton.addEventListener('click', () => {
    if (index < totalSlides - (window.matchMedia('(max-width: 768px)').matches ? 1 : 4)) {
      index += 1;
      updateSlider();
      updateButtonsVisibility();
    }
  });

  Array.from(dotsContainer.children).forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      index = dotIndex;
      updateSlider();
      updateButtonsVisibility();
    });
  });

  window.addEventListener('resize', () => {
    updateSlider();
    updateButtonsVisibility();
  });

  updateSlider();
  updateButtonsVisibility();
}

function applyResponsiveStyles() {
  const mediaQuery768 = window.matchMedia('(max-width: 768px)');
  const mediaQuery1024 = window.matchMedia('(min-width: 769px) and (max-width: 1024px)');
  const mediaQuery1280 = window.matchMedia('(min-width: 1025px) and (max-width: 1280px)');

  function handleMediaQueryChange() {
    const slideItems = document.querySelectorAll('.slide-item');
    slideItems.forEach((item) => {
      if (mediaQuery768.matches) {
        item.style.width = '100%';
      } else if (mediaQuery1024.matches) {
        item.style.width = 'calc((100% - 1rem) / 2)';
      } else if (mediaQuery1280.matches) {
        item.style.width = 'calc((100% - 2rem) / 3)';
      } else {
        item.style.width = 'calc((100% - 3rem) / 4)';
      }
    });

    const prevButton = document.querySelector('.slider-button.prev');
    const nextButton = document.querySelector('.slider-button.next');

    if (mediaQuery768.matches || mediaQuery1024.matches || mediaQuery1280.matches) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    } else {
      prevButton.style.display = '';
      nextButton.style.display = '';
    }
  }

  mediaQuery768.addListener(handleMediaQueryChange);
  mediaQuery1024.addListener(handleMediaQueryChange);
  mediaQuery1280.addListener(handleMediaQueryChange);
  handleMediaQueryChange();
}

export default async function decorate(block) {
  const response = await getProductResponse();
  const responseData = response[0].raw;

  const recentlyHead = h3({ class: 'text-[1.3125rem] text-[#2a3c3c]' }, 'Recently Viewed');
  block.append(recentlyHead);

  const recentlyWrapper = document.querySelector('.recently-viewed-wrapper');
  recentlyWrapper.classList.add('relative');

  const recentlyBlock = document.querySelector('.recently-viewed');
  recentlyBlock.classList.add('m-auto', 'w-[87%]', 'max-[768px]:w-[100%]');

  const sliderContainer = div({ class: 'slider-container w-full overflow-hidden py-5' });
  const { prevButton, nextButton } = createSliderNavigation();

  sliderContainer.appendChild(prevButton);
  sliderContainer.appendChild(nextButton);

  let productsArray = JSON.parse(localStorage.getItem('products')) || [];

  const productCategory = responseData.categorytype;
  const productCode = responseData.productcode ? responseData.productcode.trim() : '';
  const productTitle = responseData.title ? responseData.title : '';
  let agrRating = null;
  let numOfReviews;

  const reviewSummary = responseData.reviewssummaryjson ? JSON.parse(responseData.reviewssummaryjson) : null;
  if (reviewSummary) {
    agrRating = reviewSummary.aggregatedRating;
    numOfReviews = reviewSummary.numberOfReviews;
  }

  const existingProduct = productsArray.find((product) => product.code === productCode);

  if (!existingProduct) {
    productsArray.push({
      category: productCategory,
      code: productCode,
      title: productTitle,
      aggregatedRating: agrRating,
      numberOfReviews: numOfReviews,
    });

    localStorage.setItem('products', JSON.stringify(productsArray));
  }

  productsArray = productsArray.filter((product, index, self) => index === self.findIndex((productIndex) => productIndex.code === product.code));

  const filteredProductsArray = productsArray.filter((product) => product.code !== productCode);

  const blogsCardContainer = createSlides(filteredProductsArray);
  sliderContainer.appendChild(blogsCardContainer);
  block.appendChild(sliderContainer);

  const sliderWrapper = sliderContainer.querySelector('.slider-wrapper');
  if (!sliderWrapper) {
    return;
  }

  const dotsContainer = createDots(filteredProductsArray.length);
  sliderContainer.appendChild(dotsContainer);

  initializeSlider(sliderContainer, sliderWrapper, prevButton, nextButton, dotsContainer);
  applyResponsiveStyles();
}
