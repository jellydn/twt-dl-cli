import {cli} from 'cleye';

import {downloadFile, downloadVideo} from '.';

const downloadOptions = ['yes', 'no'] as const;

type Downloads = typeof downloadOptions[number];

// Custom type function
function downloadSchema(download: Downloads) {
  if (!downloadOptions.includes(download)) {
    throw new Error(`Invalid download option: "${download}"`);
  }

  return download;
}

// Parse argv
const argv = cli({
  name: 'twt-dl-cli',

  // Define parameters
  parameters: [
    '<url>', // Twitter url is required
  ],

  // Define flags/options
  flags: {
    // Parses `--download` as a string
    download: {
      type: downloadSchema,
      description: 'Allow to download video (yes/no)',
      default: 'yes',
    },
  },
});

async function main() {
  const video = await downloadVideo(argv._?.url);
  console.log(video);
  if (argv.flags.download === 'yes' && video) {
    await downloadFile(video);
  }
}

// eslint-disable-next-line  unicorn/prefer-top-level-await
main().catch(console.error);
