import { expectType } from "tsd";

import { downloadVideo } from "../dist/index.js";

expectType<Promise<string | undefined>>(downloadVideo("https://twitter.com"));
