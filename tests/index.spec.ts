import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough, Readable } from 'node:stream';
import fetch, { Response } from 'cross-fetch';
import download from 'download';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { downloadFile, downloadVideo } from '../src';
import { runBatch } from '../src/batch';

vi.mock('cross-fetch', async (original) => ({
  ...(await original<typeof import('cross-fetch')>()),
  default: vi.fn(),
}));
vi.mock('download', () => ({ default: vi.fn() }));

let directory: string;
beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'twt-dl-test-'));
  vi.spyOn(process, 'cwd').mockReturnValue(directory);
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.mocked(download).mockImplementation(
    () => Readable.from(['media bytes']) as ReturnType<typeof download>,
  );
});
afterEach(async () => {
  vi.restoreAllMocks();
  vi.resetAllMocks();
  await rm(directory, { recursive: true, force: true });
});

function tweet(mediaURLs: string[]) {
  return new Response(JSON.stringify({ mediaURLs }));
}

test.each(['twitter.com', 'x.com'])(
  'returns mixed media from %s',
  async (host) => {
    const media = [
      'https://pbs.twimg.com/photo.jpg',
      'https://video.twimg.com/video.mp4',
    ];
    vi.mocked(fetch).mockResolvedValue(tweet(media));
    expect(await downloadVideo(`https://${host}/user/status/123`)).toEqual(
      media,
    );
    expect(fetch).toHaveBeenCalledWith(
      'https://api.vxtwitter.com/user/status/123',
      expect.any(Object),
    );
  },
);

test.each(['{}', 'null', '{"mediaURLs":[]}'])(
  'returns an empty list for %s',
  async (body) => {
    vi.mocked(fetch).mockResolvedValue(new Response(body));
    expect(await downloadVideo('https://twitter.com/user/status/123')).toEqual(
      [],
    );
  },
);

test('waits for stream completion and keeps an explicit output path', async () => {
  const source = new PassThrough();
  vi.mocked(download).mockReturnValue(
    source as unknown as ReturnType<typeof download>,
  );
  let settled = false;
  const pending = downloadFile(
    'https://pbs.twimg.com/photo.jpg',
    join(directory, 'chosen.jpg'),
  );
  pending.then(() => {
    settled = true;
  });
  source.write('first ');
  await new Promise((resolve) => setTimeout(resolve, 20));
  expect(settled).toBe(false);
  source.end('last');
  const result = await pending;
  expect(result.writableFinished).toBe(true);
  expect(await readFile(result.path, 'utf8')).toBe('first last');
});

test('same-tick concurrent downloads use distinct filenames', async () => {
  vi.spyOn(Date, 'now').mockReturnValue(42);
  const files = await Promise.all([
    downloadFile('https://pbs.twimg.com/a.jpg'),
    downloadFile('https://pbs.twimg.com/b.jpg'),
  ]);
  expect(files[0].path).not.toBe(files[1].path);
  expect(await readdir(directory)).toHaveLength(2);
  for (const file of files) {
    expect(await readFile(file.path, 'utf8')).toBe('media bytes');
  }
});

test.each([
  ['https://pbs.twimg.com/media/photo?format=jpg&name=orig', '.jpg'],
  ['https://video.twimg.com/video.mp4?token=v1.2', '.mp4'],
  ['https://pbs.twimg.com/photo.png?format=../../bad', '.png'],
  ['https://pbs.twimg.com/photo?format=WEBP', '.webp'],
  ['https://pbs.twimg.com/photo?format=../../bad', '.mp4'],
])('uses a safe media extension for %s', async (url, extension) => {
  const result = await downloadFile(url);
  expect(String(result.path)).toMatch(new RegExp(`\\${extension}$`));
  expect(await readFile(result.path, 'utf8')).toBe('media bytes');
});

test('rejects source stream errors', async () => {
  const source = new PassThrough();
  vi.mocked(download).mockReturnValue(
    source as unknown as ReturnType<typeof download>,
  );
  const pending = downloadFile('https://pbs.twimg.com/photo.jpg');
  const assertion = expect(pending).rejects.toThrow('network failed');
  source.destroy(new Error('network failed'));
  await assertion;
});

test('rejects destination errors', async () => {
  await expect(
    downloadFile(
      'https://pbs.twimg.com/photo.jpg',
      join(directory, 'missing', 'photo.jpg'),
    ),
  ).rejects.toThrow('ENOENT');
});

test.each(['invalid', 'api', 'download'])(
  'continues after %s failure with nonzero status',
  async (failure) => {
    const first =
      failure === 'invalid'
        ? 'https://example.com/bad'
        : 'https://twitter.com/user/status/1';
    if (failure === 'api') {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response('error', { status: 503 }),
      );
    }
    if (failure === 'download') {
      vi.mocked(fetch).mockResolvedValueOnce(
        tweet(['https://pbs.twimg.com/bad.jpg']),
      );
      vi.mocked(download).mockImplementationOnce(() => {
        throw new Error('download failed');
      });
    }
    vi.mocked(fetch).mockResolvedValue(
      tweet(['https://pbs.twimg.com/good.jpg']),
    );
    expect(
      await runBatch(
        [first, 'https://x.com/user/status/2'],
        failure === 'download',
      ),
    ).toBe(1);
    expect(fetch).toHaveBeenLastCalledWith(
      'https://api.vxtwitter.com/user/status/2',
      expect.any(Object),
    );
    expect(console.log).toHaveBeenCalledWith(
      '- https://pbs.twimg.com/good.jpg',
    );
  },
);

test('downloads every media item and reports success', async () => {
  const media = [
    'https://pbs.twimg.com/photo.jpg',
    'https://video.twimg.com/video.mp4',
  ];
  vi.mocked(fetch).mockResolvedValue(tweet(media));
  expect(await runBatch(['https://twitter.com/user/status/1'], true)).toBe(0);
  expect(vi.mocked(download).mock.calls.map(([url]) => url)).toEqual(media);
  expect(await readdir(directory)).toHaveLength(2);
});

test('listing media does not download files', async () => {
  vi.mocked(fetch).mockResolvedValue(
    tweet(['https://pbs.twimg.com/photo.jpg']),
  );
  expect(await runBatch(['https://twitter.com/user/status/1'], false)).toBe(0);
  expect(download).not.toHaveBeenCalled();
});
