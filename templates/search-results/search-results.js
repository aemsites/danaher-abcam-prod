/* eslint-disable import/no-unresolved */
import { loadCSS } from '../../scripts/aem.js';

function buildCoveo() {
  const hash = window.location.hash.substr(1);
  const params = new URLSearchParams(hash);
  const cType = params.get('f-categorytype');
  console.log(params.get('f-categorytype'));
  
  const coveoTower = `
    <atomic-search-interface localization-compatibility-version="v4"
      fields-to-include='["title", "productslug", "images", "numpublications", "reactivityapplications", "source", "conjugations", "target", "hostspecies", "categorytype"]'>
      <style>
        atomic-search-layout atomic-layout-section[section='pagination']{
          flex-direction:column;
          justify-content: space-around;
          align-items: normal;
        }
        atomic-search-layout atomic-layout-section[section='pagination']>* {
          margin-top: 0;
        }
        atomic-result-list::part(result-list) {
          gap: 0.0rem;
          row-gap: 0.25rem;
        }
        atomic-facet:has(atomic-facet::part(facet)) {
          background-color: red;
          // border-radius: 0.5rem;
        }
        .pagination {
          display: flex;
          flex-wrap: wrap;
          margin-top: 1rem;
          margin-bottom: 1rem;
          justify-content: center;
          align-items: center;
        }
      </style>
      <div class="container overflow-scroll mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-8 gap-4">
          <div class="col-span-2">
            <atomic-facet-manager class="space-y-4 [&_atomic-facet::part(facet)]:rounded-md">
              <atomic-facet label="Category Type" field="categorytype" with-search="false"></atomic-facet>
              <atomic-facet label="Applications" field="reactivityapplications" with-search="false"></atomic-facet>
              <atomic-facet label="Reactive Species" field="reactivespecies" with-search="false"></atomic-facet>
              <atomic-facet label="Target" field="target" with-search="false"></atomic-facet>
              <atomic-facet label="Host Species" field="hostspecies" with-search="false"></atomic-facet>
              <atomic-facet label="Conjugation" field="conjugations" with-search="false"></atomic-facet>
              <atomic-facet label="Sample Type" field="sampletype" with-search="false"></atomic-facet>
            </atomic-facet-manager>
          </div>
          <div class="col-span-6">
            <atomic-result-list display="table" class="[&_table]:table">
              <atomic-result-template>
                <template>
                  <atomic-table-element label="Product name">
                    <atomic-result-text field="title"></atomic-result-text>
                  </atomic-table-element>
                  <atomic-table-element label="Star Rating">
                    <atomic-result-number field="score"></atomic-result-number>
                  </atomic-table-element>
                  <atomic-table-element label="Images">
                    <atomic-result-image field="images"></atomic-result-image>
                  </atomic-table-element>
                  <atomic-table-element label="Publications">
                    <atomic-result-number field="numpublications"></atomic-result-number>
                  </atomic-table-element>
                  ${ cType === null ? `
                  <atomic-table-element label="Target">
                    <atomic-result-text field="target"></atomic-result-text>
                  </atomic-table-element> ` : ''}
                  <atomic-table-element label="Application">
                    <atomic-result-multi-value-text field="reactivityapplications"  delimiter=", "></atomic-result-multi-value-text>
                  </atomic-table-element>
                  ${cType === 'Secondary Antibodies' ? `
                  <atomic-table-element label="Host species">
                    <atomic-result-text field="hostspecies"></atomic-result-text>
                  </atomic-table-element> ` : 
                  !cType || cType === 'Primary Antibodies' ? `
                  <atomic-table-element label="Reactive Species">
                      <atomic-result-text field="title"></atomic-result-text>
                  </atomic-table-element> ` : ''}
                  ${ cType ? `
                  <atomic-table-element label="Conjugation">
                    <atomic-result-multi-value-text field="conjugations"></atomic-result-multi-value-text>
                  </atomic-table-element> ` : ''}
                </template>
              </atomic-result-template>
            </atomic-result-list>
          </div>
        </div>
      </div>
    </atomic-search-interface>
  `;
  return coveoTower;
}

async function loadAtomic() {
  await import('https://static.cloud.coveo.com/atomic/v2/atomic.esm.js');
  await loadCSS('https://static.cloud.coveo.com/atomic/v2/themes/coveo.css');
  await customElements.whenDefined('atomic-search-interface');
  const searchInterface = document.querySelector('atomic-search-interface');

  // Initialization
  await searchInterface.initialize({
    accessToken: 'xx27ea823a-e994-4d71-97f6-403174ec592a',
    organizationId: 'danahernonproduction1892f3fhz',
    organizationEndpoints: await searchInterface.getOrganizationEndpoints('danahernonproduction1892f3fhz'),
  });

  // Trigger a first search
  searchInterface.executeFirstSearch();
}

export default async function buildAutoBlocks() {
  const mainEl = document.querySelector('main');
  mainEl.classList.add(...'py-8'.split(' '));
  mainEl.innerHTML = buildCoveo();
  loadAtomic();
}
