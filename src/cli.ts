import { cli } from 'cleye';

import { runBatch } from './batch';

const downloadOptions = ['yes', 'no'] as const;

type Downloads = (typeof downloadOptions)[number];

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
    '<twitter urls...>', // Twitter URLs are required
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
  process.exitCode = await runBatch(
    argv._.twitterUrls,
    argv.flags.download === 'yes',
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
