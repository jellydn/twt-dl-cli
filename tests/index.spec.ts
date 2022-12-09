import { downloadVideo } from "../src";

test("downloadVideo", async () => {
  expect(
    await downloadVideo(
      "https://twitter.com/mattpocockuk/status/1592130978234900484"
    )
  ).toBe(
    "https://video.twimg.com/ext_tw_video/1591011883259133952/pu/vid/1280x720/oM3LZAIR79Ytr-3i.mp4?tag=12"
  );
});
