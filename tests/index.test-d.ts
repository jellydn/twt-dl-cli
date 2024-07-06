import { expectType } from "tsd";

import type { WriteStream } from "node:fs";

import { downloadFile, downloadVideo } from "../dist/index.js";

expectType<Promise<string | undefined>>(
  downloadVideo("https://twitter.com/mattpocockuk/status/1592130978234900484"),
);
expectType<Promise<WriteStream>>(
  downloadFile(
    "https://video.twimg.com/ext_tw_video/1591011883259133952/pu/vid/1280x720/oM3LZAIR79Ytr-3i.mp4?tag=12",
  ),
);
