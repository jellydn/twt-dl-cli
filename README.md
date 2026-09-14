# Welcome to twt-dl-cli 👋

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Version](https://img.shields.io/npm/v/twt-dl-cli.svg)](https://www.npmjs.com/package/twt-dl-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: jellydn](https://img.shields.io/twitter/follow/jellydn.svg?style=social)](https://twitter.com/jellydn)

> Download videos and photos from Twitter/X tweet URLs with the CLI.

Inspired by [egoist/download-twitter-video: The easiest way to download any Twitter video](https://github.com/egoist/download-twitter-video).

[![IT Man - Tip #29 - How I create download Twitter URL with ChatGPT [Vietnamese]](https://i.ytimg.com/vi/jiC7EmKT64U/hqdefault.jpg)](https://www.youtube.com/watch?v=jiC7EmKT64U)

## Install

```sh
npm install -g twt-dl-cli@latest
```

## Built with

- [jellydn/typescript-starter: Typescript starter project](https://github.com/jellydn/typescript-starter)
- [privatenumber/cleye: 👁‍🗨 cleye — The intuitive & typed CLI development tool for Node.js](https://github.com/privatenumber/cleye)
- [kevva/download: Download and extract files](https://github.com/kevva/download)
- [sindresorhus/ora: Elegant terminal spinner](https://github.com/sindresorhus/ora)
- And ChatGPT :)

<img width="1447" alt="image" src="https://user-images.githubusercontent.com/870029/206899075-3e620fb8-f210-488e-918e-6e6c876c8b19.png">

## Usage

```sh
npx twt-dl-cli@latest --help
```

### Example:

```sh
npx twt-dl-cli@latest https://twitter.com/mattpocockuk/status/1592130978234900484
```

### Download a Thread (Multiple URLs):

Pass multiple URLs to download videos/photos from several tweets. For a thread, supply each tweet URL; the CLI does not discover thread replies automatically.

```sh
npx twt-dl-cli@latest https://twitter.com/user/status/123 https://twitter.com/user/status/456
```

![twt-dl-cli](usage.png)

If a URL fails, the CLI reports it and continues with later URLs. The final exit code is 1 if any URL fails, or 0 if all URLs succeed. A tweet with no media is not a failure.

### Library API

`downloadVideo(url)` now returns `Promise<string[]>`, not a single URL or `undefined`. It returns all media URLs for one tweet, or an empty array when the tweet has no media.

`downloadFile(mediaUrl, outputFile?)` returns `Promise<WriteStream>` only after the file finishes writing. It rejects on download or write errors. Without `outputFile`, it uses a unique filename in the current directory. An explicit output path is preserved and overwrites an existing file.

## Author

👤 **Huynh Duc Dung**

- Website: https://productsway.com/
- Twitter: [@jellydn](https://twitter.com/jellydn)
- Github: [@jellydn](https://github.com/jellydn)

## Show your support

Give a ⭐️ if this project helped you!

[![kofi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/dunghd)
[![paypal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/dunghd)
[![buymeacoffee](https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/dunghd)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://productsway.com/"><img src="https://avatars.githubusercontent.com/u/870029?v=4?s=100" width="100px;" alt="Dung Duc Huynh (Kaka)"/><br /><sub><b>Dung Duc Huynh (Kaka)</b></sub></a><br /><a href="https://github.com/jellydn/twt-dl-cli/commits?author=jellydn" title="Code">💻</a> <a href="https://github.com/jellydn/twt-dl-cli/commits?author=jellydn" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/yetone"><img src="https://avatars.githubusercontent.com/u/1206493?v=4?s=100" width="100px;" alt="yetone"/><br /><sub><b>yetone</b></sub></a><br /><a href="https://github.com/jellydn/twt-dl-cli/commits?author=yetone" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://devosfera.vercel.app"><img src="https://avatars.githubusercontent.com/u/101137391?v=4?s=100" width="100px;" alt="Andrés Ujpán"/><br /><sub><b>Andrés Ujpán</b></sub></a><br /><a href="https://github.com/jellydn/twt-dl-cli/commits?author=0xdres" title="Code">💻</a> <a href="https://github.com/jellydn/twt-dl-cli/commits?author=0xdres" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

Contributor records are stored in `.all-contributorsrc`; the badge and table above are generated from those records. Keep the existing records when updating the table.

To recognize a confirmed contribution, comment on an issue or pull request with `@all-contributors please add @USERNAME for CONTRIBUTION_TYPE`. Replace the placeholders with the contributor's GitHub login and the types from the [emoji key](https://allcontributors.org/docs/en/emoji-key). Do not add unverified contributions.

A repository owner must [install the All Contributors GitHub App](https://github.com/apps/allcontributors) for this repository if the bot does not respond. As a local alternative, run `pnpm dlx all-contributors-cli generate` to regenerate the README from the existing configuration, then review the diff before committing.
