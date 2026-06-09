import { scrapeMarketplace } from '../src/scraper.js';

const proxyUrl = process.env.FACEBOOK_RESIDENTIAL_PROXY_URL || null;

(async () => {
  try {
    console.log('Running Facebook Marketplace debug scrape...');
    const listings = await scrapeMarketplace({
      city: 'pensacola',
      radiusKm: '50',
      proxyUrl
    });

    console.log(`Found ${listings.length} listings:`);
    console.log(listings.slice(0, 10));
  } catch (err) {
    console.error('Debug scrape failed:', err);
  }
})();
