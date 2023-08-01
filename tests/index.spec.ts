import { afterEach, expect, test, vi } from "vitest";

import { downloadFile, downloadVideo } from "../src";

test("downloadVideo", async () => {
  expect(
    await downloadVideo(
      "https://twitter.com/mattpocockuk/status/1592130978234900484",
    ),
  ).toBe(
    "https://video.twimg.com/ext_tw_video/1591011883259133952/pu/vid/1280x720/oM3LZAIR79Ytr-3i.mp4?tag=12",
  );
});

test("downloadFile", async () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  vi.mock("fs", () => {
    return {
      createWriteStream: () => ({
        on: vi.fn(),
        once: vi.fn(),
        emit: vi.fn(),
      }),
    };
  });
  await downloadFile(
    "https://video.twimg.com/ext_tw_video/1591011883259133952/pu/vid/1280x720/oM3LZAIR79Ytr-3i.mp4?tag=12",
  );
});
