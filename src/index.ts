import fetch from 'cross-fetch';
import download from 'download';
import ora from 'ora';

import { randomUUID } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { extname, join } from 'node:path';
import process from 'node:process';
import { pipeline } from 'node:stream/promises';

export async function downloadVideo(url?: string): Promise<string[]> {
  if (!url) {
    throw new Error('Missing URL');
  }

  const newUrl = url.replace('x.com', 'twitter.com');

  const parsedUrl = new URL(newUrl);

  if (parsedUrl.hostname !== 'twitter.com') {
    throw new Error('Not a Twitter URL');
  }

  // Use the API endpoint for JSON response
  const apiUrl = newUrl.replace('twitter.com', 'api.vxtwitter.com');

  return fetch(apiUrl, {
    headers: {
      'User-Agent': 'TelegramBot (like TwitterBot)',
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch tweet: ${response.status}`);
      }
      return response.json();
    })
    .then((data: any) => {
      if (data?.mediaURLs?.length > 0) {
        return data.mediaURLs;
      }
      return [];
    });
}

// TODO: separate spinner with download function
// TODO: add output directory if needed
export async function downloadFile(fileUrl: string, outputFile?: string) {
  const spinner = ora('Downloading file...').start();

  try {
    const url = new URL(fileUrl);
    const format = url.searchParams.get('format')?.toLowerCase();
    const pathExtension = extname(url.pathname).slice(1).toLowerCase();
    const supported = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4'];
    const extension = supported.includes(format ?? '')
      ? format
      : supported.includes(pathExtension)
        ? pathExtension
        : 'mp4';
    const finalOutputFile =
      outputFile ?? join(process.cwd(), `${randomUUID()}.${extension}`);
    const source = download(fileUrl);
    const writeStream = createWriteStream(finalOutputFile, {
      flags: outputFile ? 'w' : 'wx',
    });
    await pipeline(source, writeStream);
    spinner.succeed(`File saved as ${finalOutputFile}`);
    return writeStream;
  } catch (error) {
    spinner.fail(error instanceof Error ? error.message : String(error));
    throw error;
  }
}
