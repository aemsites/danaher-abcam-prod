import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  div,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  block.classList.add(...'w-4/5 m-auto mb-8'.split(' '));
  block.querySelectorAll('img').forEach((img) => {
    const picture = img.closest('picture');
    const pTag = picture.closest('p');
    pTag.classList.add('cards-card-image');
    const cardImage = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const imgTag = cardImage.querySelector('img');
    imgTag.classList.add('max-[799px]:w-full');
    if (picture) picture.replaceWith(cardImage);
  });
  [...block.children].forEach((row, index) => {
    if (index === 0) {
      const heading = row.querySelector('h2');
      if (heading) heading.className = 'card-title text-5xl mb-8 mt-[72px]';
    } else {
      const ulContainer = row.querySelectorAll('div');
      ulContainer.forEach((parentDiv) => {
        parentDiv.className = 'flex flex-col bg-[#e5e7eb]';
      });
      [...row.children].forEach((elem) => {
        if (elem.querySelector('.cards-card-image')) {
          const pContainer = row.querySelector('p');
          const divContainer = div({ class: 'cards-card-image' });
          divContainer.innerHTML = pContainer.innerHTML;
          pContainer.replaceWith(divContainer);
        }
        const cardContainer = div({ class: 'cards-card-body py-9 px-8 flex flex-col grow' });
        const cardHeading = row.querySelector('h3');
        cardHeading.classList.add(...'card-heading text-2xl tracking-[-0.03em]'.split(' '));

        const cardDescription = row.querySelector('div > p');
        if (cardDescription) {
          cardDescription.classList.add(...'card-description h-full mt-2.5 mb-3 text-base tracking-wide'.split(' '));
        }

        const cardLink = row.querySelector('p a');
        if (cardLink) {
          cardLink.classList.add(...'card-link w-fit text-sm text-white bg-[#2A5F65] hover:bg-[#255159] py-2.5 px-5 rounded-[28px]'.split(' '));
        }
        cardContainer.appendChild(cardHeading);
        cardContainer.appendChild(cardDescription);
        cardContainer.appendChild(cardLink);
        row.append(cardContainer);
      });
    }
  });
}
