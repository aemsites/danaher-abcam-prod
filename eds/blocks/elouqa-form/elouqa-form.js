import { loadScript } from '../../scripts/aem.js';
import { getFragmentFromFile } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  try {
    const fragment = await getFragmentFromFile('/eds/fragments/elouqa-form.html');
    const fragmentCSS = await getFragmentFromFile('/eds/styles/elouqa-form.css');
    const fragmentCustomScript = await getFragmentFromFile('/eds/scripts/elouqa-script.js');
    block.innerHTML = '';
    if (fragment) {
      await loadScript('https://img06.en25.com/i/livevalidation_standalone.compressed.js');
      const parser = new DOMParser();
      const fragmentHtml = parser.parseFromString(fragment, 'text/html');
      block.innerHTML = fragmentHtml.body.innerHTML;
    }
    if (fragmentCSS) {
      const fragmentStyle = document.createElement('style');
      fragmentStyle.type = 'text/css';
      fragmentStyle.append(fragmentCSS);
      document.head.append(fragmentStyle);
    }
    if (fragmentCustomScript) {
      const fragmentScript = document.createElement('script');
      fragmentScript.type = 'text/javascript';
      fragmentScript.append(fragmentCustomScript);
      document.body.append(fragmentScript);
    }
  } catch (e) {
    block.textContent = '';
    // eslint-disable-next-line no-console
    console.warn(`cannot load snippet at ${e}`);
  }
}
