import { getMetadata } from '../../scripts/aem.js';
import { div, p } from '../../scripts/dom-builder.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const section = main.querySelector('div');
  const contactInfo = div({ class: 'contactinfo-wrapper flex flex-col py-10 px-[6.25%] max-w-7xl box-content mx-auto justify-center' }, div({ class: 'tracking-wider font-normal text-xs/6 mb-2 text-[#65797C]' }, p(getMetadata('contact-info-1')), p(getMetadata('contact-info-2'))));
  section.append(contactInfo);
}