import { getMetadata } from './aem.js';
// eslint-disable-next-line import/no-cycle
import { makePublicUrl, setJsonLd } from './scripts.js';

// eslint-disable-next-line import/prefer-default-export
export function buildArticleSchema() {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'Article',
    '@id': `https://www.abcam.com${makePublicUrl(window.location.pathname)}`,
    headline: getMetadata('og:title'),
    image: getMetadata('og:image'),
    datePublished: getMetadata('publishdate'),
    publisher: {
      '@type': 'Organization',
      name: 'Abcam',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.abcam.com/eds/icons/logo.svg',
      },
    },
    description: getMetadata('description'),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.abcam.com${makePublicUrl(window.location.pathname)}`,
    },
  };

  if (getMetadata('creationdate')) data.datePublished = getMetadata('creationdate');
  if (getMetadata('updatedate')) data.dateModified = getMetadata('updatedate');
  if (getMetadata('authorname')) {
    data.author = {
      '@type': 'Person',
      name: getMetadata('authorname'),
    };
  }

  setJsonLd(data, 'article');
}

// eslint-disable-next-line import/prefer-default-export
export function buildVideoSchema(posterImage, embedURL) {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'VideoObject',
    thumbnailUrl: posterImage,
    embedUrl: embedURL,
    publisher: {
      '@type': 'Organization',
      name: 'Abcam',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.abcam.com/eds/icons/logo.svg',
      },
    },
    hasPart: [
      {
        '@type': 'Clip',
        startOffset: 30,
        name: 'Introduction',
      },
      {
        '@type': 'Clip',
        startOffset: 120,
        name: 'Main Topic',
      },
    ],
  };

  setJsonLd(data, 'video');
}

// eslint-disable-next-line import/prefer-default-export
export function buildPodcastEpisodeSchema(mediaURL, episodeNum, seriesName, seriesURL, mode) {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'PodcastEpisode',
    url: `https://www.abcam.com${makePublicUrl(window.location.pathname)}`,
    name: getMetadata('og:title'),
    datePublished: getMetadata('publishdate'),
    timeRequired: getMetadata('readingtime'),
    description: getMetadata('description'),
    associatedMedia: {
      '@type': 'MediaObject',
      contentUrl: mediaURL,
    },
    episodeNumber: episodeNum,
    image: getMetadata('og:image'),
    accessMode: mode,
    inLanguage: 'en',
  };

  if (getMetadata('creationdate')) data.datePublished = getMetadata('creationdate');
  if (getMetadata('updatedate')) data.dateModified = getMetadata('updatedate');
  if (seriesName && seriesURL) {
    data.partOfSeries = {
      '@type': 'PodcastSeries',
      name: seriesName,
      url: seriesURL,
    };
  }
  if (getMetadata('authorname')) {
    data.creator = {
      '@type': 'Person',
      name: getMetadata('authorname'),
    };
  }

  setJsonLd(data, 'podcastepisode');
}

// eslint-disable-next-line import/prefer-default-export
export function buildPodcastSeriesSchema(mode) {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'PodcastSeries',
    name: getMetadata('og:title'),
    description: getMetadata('description'),
    url: `https://www.abcam.com${makePublicUrl(window.location.pathname)}`,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'Abcam',
      url: 'https://www.abcam.com/en-us',
    },
    image: getMetadata('og:image'),
    accessMode: mode,
    genre: 'Science, Research, Life Sciences',
  };

  if (getMetadata('authorname')) {
    data.author = {
      '@type': 'Person',
      name: getMetadata('authorname'),
    };
  }

  setJsonLd(data, 'podcastepisode');
}

function generateItemListElement(type, position, url, name) {
  return {
    '@type': type,
    position,
    item: {
      '@id': url,
      name,
    },
  };
}

export function buildStoryHubSchema(srcObj) {
  const data = {
    '@context': 'http://schema.org',
    '@type': 'ItemList',
    '@id': `https://www.abcam.com${makePublicUrl(window.location.pathname)}`,
    itemListElement: [],
  };

  srcObj.forEach((obj, index) => {
    data.itemListElement.push(generateItemListElement(
      'ListItem',
      index + 1,
      obj.path,
      obj.title,
    ));
  });

  setJsonLd(data, 'storyhub');
}