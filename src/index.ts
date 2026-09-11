import { load } from "cheerio";
import fetch from "cross-fetch";
import download from "download";
import ora from "ora";

import { createWriteStream } from "node:fs";
import { join } from "node:path";
import process from "node:process";

export async function downloadVideo(url?: string): Promise<string[]> {
  if (!url) {
    throw new Error("Missing URL");
  }

  const newUrl = url.replace("x.com", "twitter.com");

  const parsedUrl = new URL(newUrl);

  if (parsedUrl.hostname !== "twitter.com") {
    throw new Error("Not a Twitter URL");
  }

  // Use the API endpoint for JSON response
  const apiUrl = newUrl.replace("twitter.com", "api.vxtwitter.com");

  return fetch(apiUrl, {
    headers: {
      "User-Agent": "TelegramBot (like TwitterBot)",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch tweet: ${response.status}`);
      }
      return response.json();
    })
    .then((data: any) => {
      if (data && data.mediaURLs && data.mediaURLs.length > 0) {
        return data.mediaURLs;
      }
      return [];
    });
}

// TODO: separate spinner with download function
// TODO: add output directory if needed
export async function downloadFile(
  fileUrl: string,
  outputFile?: string,
) {
  const spinner = ora("Downloading file...").start();

  let finalOutputFile = outputFile;
  if (!finalOutputFile) {
    const ext = fileUrl.split(".").pop()?.split("?")[0] || "mp4";
    finalOutputFile = join(process.env.PWD ?? process.cwd(), `${Date.now()}.${ext}`);
  }

  const writeStream = createWriteStream(finalOutputFile);
  writeStream.on("finish", () => {
    spinner.succeed(`File saved as ${finalOutputFile}`);
  });

  writeStream.on("error", (error) => {
    spinner.fail(error.message);
    console.error(error);
  });

  return download(fileUrl).pipe(writeStream);
}
