import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import path from 'path';

// Force AL2023 environment runtime for Vercel Linux
process.env.AWS_LAMBDA_JS_RUNTIME = 'nodejs20.x';
chromium.setGraphicsMode = false;

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  // Allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, url } = req.query;
  const targetUrl = url || (id ? `https://samprotikee.com/photocard/${id}` : null);

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing id or url parameter' });
  }

  let browser = null;
  try {
    const executablePath = await chromium.executablePath();
    const execDir = path.dirname(executablePath);

    // CRITICAL: Point Linux dynamic loader to the extracted al2023 libraries in /tmp
    process.env.LD_LIBRARY_PATH = `${execDir}:${process.env.LD_LIBRARY_PATH || ''}`;

    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--hide-scrollbars',
        '--disable-web-security',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      defaultViewport: {
        width: 1080,
        height: 1080,
        deviceScaleFactor: 1,
      },
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080 });

    await page.goto(targetUrl, {
      waitUntil: 'networkidle0',
      timeout: 35000,
    });

    // Wait 800ms to guarantee custom font and background render
    await new Promise((resolve) => setTimeout(resolve, 800));

    const imageBuffer = await page.screenshot({
      type: 'png',
      omitBackground: false,
    });

    await browser.close();
    browser = null;

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(imageBuffer);
  } catch (error) {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {}
    }
    console.error('Screenshot error:', error);
    return res.status(500).json({
      error: 'Failed to capture screenshot',
      details: error.message,
    });
  }
}
