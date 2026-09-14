import { downloadFile, downloadVideo } from '.';

export async function runBatch(
  urls: string[],
  saveFiles: boolean,
): Promise<number> {
  let exitCode = 0;
  for (const url of urls) {
    console.log(`Processing URL: ${url}`);
    try {
      const mediaUrls = await downloadVideo(url);
      if (mediaUrls.length === 0) {
        console.log('No media found for this URL.');
        continue;
      }
      console.log(`Found ${mediaUrls.length} media items.`);
      for (const mediaUrl of mediaUrls) {
        console.log(`- ${mediaUrl}`);
        if (saveFiles) {
          await downloadFile(mediaUrl);
        }
      }
    } catch (error) {
      console.error(`Failed URL: ${url}`, error);
      exitCode = 1;
    }
  }
  return exitCode;
}
