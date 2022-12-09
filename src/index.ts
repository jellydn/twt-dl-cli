import {load} from 'cheerio';
import fetch from 'cross-fetch';

export async function downloadVideo(url?: string) {
  if (!url) {
    throw new Error('Missing url');
  }

  const parsedUrl = new URL(url);

  if (parsedUrl.hostname !== 'twitter.com') {
    throw new Error('Not a twitter url');
  }

  return fetch(url.replace('twitter.com', 'vxtwitter.com'), {
    headers: {
      'User-Agent': 'TelegramBot (like TwitterBot)',
    },
  })
    .then(async response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch tweet: ${response.status}`);
      }

      return response.text();
    })
    .then(html => {
      const $ = load(html);

      const getMetaContent = (name: string) => {
        const value
          = $(`meta[name="twitter:${name}"]`).attr('content')
          ?? $(`meta[property="og:${name}"]`).attr('content');
        return value;
      };

      return getMetaContent('video');
    });
}
