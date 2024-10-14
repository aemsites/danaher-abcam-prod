import {
  div, h6, a, p,
} from '../../scripts/dom-builder.js';
import { getMetadata } from '../../scripts/aem.js';

export default function decorate(block) {
  const title = getMetadata('og:title');
  const downloadLink = block.querySelector('p > a');
  const linkText = downloadLink.textContent;
  const linkHref = downloadLink.href;
  const downloadDiv = div(
    { class: 'flex flex-col bg-[#f2f2f2] rounded-lg p-6 max-w-[544px] mt-6 mb-2' },
    h6({ class: 'download-title' }, `${title}`),
    a({
      class: 'button w-fit my-4 bg-black hover:bg-[#3B3B3B] h-10 whitespace-nowrap rounded-[28px] py-2.5 px-5 text-white text-sm capitalize',
      href: linkHref,
    }, linkText),
    p({ class: 'text-xs text-black-0' }, 'PDF'),
  );
  block.innerHTML = '';
  block.append(downloadDiv);
}
