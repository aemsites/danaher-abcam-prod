import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  if (block && block.classList.contains('title-image')) {
    block.classList.add(...'mx-auto items-center xl:max-w-[1120px] xl:px-0 px-[30px] pb-4 font-sans text-base flex flex-col justify-center'.split(' '));
    block.querySelector('h1').classList.add(...'text-center lg:text-3xl my-5 text-black-0 text-5xl md:text-6xl font-semibold tracking-normal'.split(' '));
    block.querySelector('p').classList.add('text-2xl', 'font-light', 'text-center', 'tracking-normal');
  } else {
    block.classList.add(...'mx-auto max-w-7xl px-4 pb-4 font-sans text-base md:flex flex-col justify-center'.split(' '));
    block.querySelector('h1').classList.add(...'my-5 text-black-0 sm:!text-[24px] md:!text-[42px] lg:!text-[56px] font-semibold tracking-normal'.split(' '));
    block.querySelector('h1').after(div({ class: 'w-1/6 mb-5 border-t-4 border-[#ff7223]' }));
    block.querySelector('p').classList.add(...'text-xl tracking-normal'.split(' '));
  }
}
