import {load} from 'cheerio';
import fetch from 'cross-fetch';
import download from 'download';
import {createWriteStream} from 'node:fs';
import {join} from 'node:path';
import ora from 'ora';

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

// NOTE: separate spinner with download function
// NOTE: add unit test
export async function downloadFile(
  fileUrl: string,
  // eslint-disable-next-line unicorn/prefer-module
  outputFile = join(__dirname, `${Date.now()}.mp4`), // NOTE: add output directory if needed
) {
  const spinner = ora('Downloading file...').start();

  const writeStream = createWriteStream(outputFile);
  writeStream.on('finish', () => {
    spinner.succeed(`File saved as ${outputFile}`);
  });

  writeStream.on('error', error => {
    spinner.fail(error.message);
    console.error(error);
  });

  return download(fileUrl).pipe(writeStream);
}
