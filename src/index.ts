import { load } from "cheerio";
import fetch from "cross-fetch";
import download from "download";
import ora from "ora";

import { createWriteStream } from "node:fs";
import { join } from "node:path";
import process from "node:process";

export async function downloadVideo(url?: string) {
  if (!url) {
    throw new Error("Missing URL");
  }

  const newUrl = url.replace("x.com", "twitter.com");

  const parsedUrl = new URL(newUrl);

  if (parsedUrl.hostname !== "twitter.com") {
    throw new Error("Not a Twitter URL");
  }

  return fetch(newUrl.replace("twitter.com", "vxtwitter.com"), {
    headers: {
      "User-Agent": "TelegramBot (like TwitterBot)",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch tweet: ${response.status}`);
      }

      return response.text();
    })
    .then((html) => {
      const $ = load(html);

      const getMetaContent = (name: string) => {
        const value =
          $(`meta[name="twitter:${name}"]`).attr("content") ??
          $(`meta[property="og:${name}"]`).attr("content");
        return value;
      };

      return getMetaContent("video");
    });
}

// TODO: separate spinner with download function
// TODO: add output directory if needed
export async function downloadFile(
  fileUrl: string,
  outputFile = join(process.env.PWD ?? process.cwd(), `${Date.now()}.mp4`),
) {
  const spinner = ora("Downloading file...").start();

  const writeStream = createWriteStream(outputFile);
  writeStream.on("finish", () => {
    spinner.succeed(`File saved as ${outputFile}`);
  });

  writeStream.on("error", (error) => {
    spinner.fail(error.message);
    console.error(error);
  });

  return download(fileUrl).pipe(writeStream);
}
