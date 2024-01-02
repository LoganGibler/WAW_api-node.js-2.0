const fs = require("fs");
const { SitemapStream, streamToPromise } = require('sitemap');

// Replace these URLs with the actual URLs of your React app
const urls = [
  { url: "/", changefreq: "daily", priority: 0.9 },
  { url: "/AboutUs", changefreq: "weekly", priority: 0.5 },
  { url: "/guides", changefreq: "daily", priority: 0.9 },
  { url: "/register", changefreq: "daily", priority: 0.3 },
  { url: "/login", changefreq: "daily", priority: 0.3 },
  // Add more URLs as needed
];

const sitemapStream = new SitemapStream({ hostname: 'https://webappwarfare.netlify.app' }); // Replace with your domain

// Add URLs to the stream
urls.forEach((url) => {
  sitemapStream.write(url);
});

// End the stream
sitemapStream.end();

// Convert the stream to a promise
streamToPromise(sitemapStream).then((sitemapXML) => {
  fs.writeFileSync('./sitemap.xml', sitemapXML);
});
