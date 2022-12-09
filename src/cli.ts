import {cli} from 'cleye';

import {downloadVideo} from '.';

// Parse argv
const argv = cli({
  name: 'twt-dl-cli',

  // Define parameters
  parameters: [
    '<url>', // Twitter url is required
  ],
});

async function main() {
  const video = await downloadVideo(argv._?.url);
  console.log(video);
}

// eslint-disable-next-line  unicorn/prefer-top-level-await
main().catch(console.error);
