import { getMetadata } from '../../scripts/aem.js';
import {
  div, nav, ul, li, a,
} from '../../scripts/dom-builder.js';
import { removeAbcamTitle } from '../../scripts/scripts.js';

export default function decorate(block) {
  const pageUrl = window.location.pathname;
  const path = pageUrl.split('/').slice(2);
  const ogTitle = getMetadata('og:title');
  const title = removeAbcamTitle(ogTitle);
  const newUrl = new URL(window.location);

  const pathFragments = [
    '/technical-resources/guides',
    '/knowledge-center',
    '/webinars',
  ];
  const matchingFragment = pathFragments.find((fragment) => pageUrl.includes(fragment));
  if (matchingFragment) {
    newUrl.pathname = pageUrl.substring(0, pageUrl.indexOf(matchingFragment));
  }

  const { length } = path;
  if (length > 0) {
    const breadcrumbLiLinks = li({ class: 'flex gap-x-2' });
    let url = '';
    let breadcrumbLinks = a({ class: 'breadcrumblink hover:underline text-sm md:text-lg', href: '/en-us' }, 'Home');
    breadcrumbLiLinks.appendChild(breadcrumbLinks);
    for (let i = 0; i < length; i += 1) {
      url = `${url}/${path[i]}`;
      let link = i === length - 1 ? title : path[i].charAt(0).toUpperCase() + path[i].slice(1);
      link = link.replace(/-/g, ' ');
      breadcrumbLinks = a({ class: 'breadcrumblink text-sm md:text-lg', href: newUrl + url }, (`${link}`));
      breadcrumbLinks.classList.toggle('underline', i === length - 1);
      breadcrumbLinks.classList.toggle('hover:underline', i !== length - 1);
      breadcrumbLiLinks.append('/');
      breadcrumbLiLinks.appendChild(breadcrumbLinks);
    }
    const breadcrumNav = nav(
      { class: 'breadcrumb-wrapper relative z-10 flex max-w-max flex-1 items-center' },
      div({ style: 'position:relative' }, ul(breadcrumbLiLinks)),
    );
    block.classList.add(...'px-0 lg:px-4 font-sans text-base flex flex-col justify-center'.split(' '));
    block.appendChild(breadcrumNav);
  }
}
