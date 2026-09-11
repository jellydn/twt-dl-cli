import { cli } from "cleye";

import { downloadFile, downloadVideo } from ".";

const downloadOptions = ["yes", "no"] as const;

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
  name: "twt-dl-cli",

  // Define parameters
  parameters: [
    "<twitter urls...>", // Twitter URLs are required
  ],

  // Define flags/options
  flags: {
    // Parses `--download` as a string
    download: {
      type: downloadSchema,
      description: "Allow to download video (yes/no)",
      default: "yes",
    },
  },
});

async function main() {
  const urls = argv._.twitterUrls;
  for (const url of urls) {
    console.log(`Processing URL: ${url}`);
    const mediaUrls = await downloadVideo(url);
    
    if (mediaUrls && mediaUrls.length > 0) {
      console.log(`Found ${mediaUrls.length} media items.`);
      for (const mediaUrl of mediaUrls) {
        console.log(`- ${mediaUrl}`);
        if (argv.flags.download === "yes") {
          await downloadFile(mediaUrl);
        }
      }
    } else {
      console.log("No media found for this URL.");
    }
  }
}

main().catch(console.error);
