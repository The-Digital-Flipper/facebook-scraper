import { chromium } from '@playwright/test';

export async function scrapeMarketplace({ city, radiusKm, proxyUrl }) {
  const browser = await chromium.launch({
    headless: true,
    proxy: proxyUrl ? { server: proxyUrl } : undefined
  });

  const page = await browser.newPage();
  const searchUrl = `https://www.facebook.com/marketplace/${encodeURIComponent(
    city.toLowerCase()
  )}/search?radius_km=${radiusKm}`;

  await page.goto(searchUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  const listings = await page.evaluate(() => {
    const items = [];
    const cards = document.querySelectorAll('[role="article"]');

    cards.forEach(card => {
      const titleEl = card.querySelector('span');
      const priceEl = card.querySelector('span[dir="auto"]');
      const linkEl = card.querySelector('a[href*="/marketplace/item/"]');

      items.push({
        title: titleEl?.innerText || null,
        price: priceEl?.innerText || null,
        url: linkEl ? `https://www.facebook.com${linkEl.getAttribute('href')}` : null
      });
    });

    return items;
  });

  await browser.close();
  return listings;
}
