import express from 'express';
import { scrapeMarketplace } from './scraper.js';

const app = express();
const port = 3000;

app.get('/feed', async (req, res) => {
  const city = req.query.city || 'pensacola';
  const radiusKm = req.query.radiusKm || '50';
  const proxyUrl = process.env.FACEBOOK_RESIDENTIAL_PROXY_URL || null;

  try {
    const listings = await scrapeMarketplace({ city, radiusKm, proxyUrl });

    if (!listings || listings.length === 0) {
      return res.json({
        note: 'No listings found or Facebook changed the page layout. Try again later.'
      });
    }

    res.json({ city, radiusKm, listings });
  } catch (err) {
    console.error('Scrape error:', err);
    res.status(500).json({
      error: 'Scrape failed',
      note: 'Facebook may be blocking or the proxy may be failing.'
    });
  }
});

app.listen(port, () => {
  console.log(`Facebook scraper API listening on http://localhost:${port}`);
});
