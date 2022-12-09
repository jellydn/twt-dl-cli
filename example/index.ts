import { downloadVideo } from "../src";

downloadVideo("https://twitter.com/mattpocockuk/status/1592130978234900484")
  .then(console.log)
  .catch(console.error);
