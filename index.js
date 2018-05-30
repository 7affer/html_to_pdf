const express = require('express');
const fs = require('fs');
const path = require('path');
const phantom = require('phantom');
const PORT = process.env.PORT || 5000

const app = express();

app.get('/', async (req, res) => {
  const sourcePath = path.join(__dirname, 'index.html');
  const baseUrl = path.resolve(__dirname);
  const source = fs.readFileSync(sourcePath, 'utf8');
  const parsed = source.replace(/\{baseUrl\}/g, baseUrl);
  const instance = await phantom.create();
  const page = await instance.createPage();

  await page.property('paperSize', {
    format: 'Letter',
    margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
  });

  await page.setContent(parsed, 'http://localhost');
  await page.render('/tmp/page.phantom.pdf', { format: 'pdf' });
  await instance.exit();

  res.sendFile('/tmp/page.phantom.pdf');
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
