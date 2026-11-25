const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const pages = ['','about','catering','celebrations','corporate','work','atelier','planner','contact'];
const titles = {
  '': 'Assembly — Made for gathering',
  about: 'About — Assembly', catering: 'Catering — Assembly',
  celebrations: 'Weddings & Celebrations — Assembly', corporate: 'Corporate & Brand — Assembly',
  work: 'Selected Work — Assembly', atelier: 'The Culinary Atelier — Assembly',
  planner: 'The Assembly Planner — Assembly', contact: 'Contact — Assembly'
};
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'assets'), { recursive: true });
for (const file of ['app.js','brief.js','style.css','room.svg']) fs.copyFileSync(path.join(root,'src',file),path.join(dist,'assets',file));
for (const file of fs.readdirSync(path.join(root,'assets'))) fs.copyFileSync(path.join(root,'assets',file),path.join(dist,'assets',file));
for (const page of pages) {
  const directory = path.join(dist,page);
  fs.mkdirSync(directory,{recursive:true});
  const canonical = 'https://assembly.perpixel.agency/' + (page ? page + '/' : '');
  fs.writeFileSync(path.join(directory,'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#eae8df"><title>${titles[page]}</title><meta name="description" content="Assembly is a fictional hospitality and events concept by PerPixel. Explore food, space and gatherings, then assemble an illustrative event brief."><link rel="canonical" href="${canonical}"><link rel="icon" href="/assets/mark.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/style.css"><script defer src="/assets/brief.js"></script><script defer src="/assets/app.js"></script></head><body data-page="${page || 'home'}"><div id="app"></div></body></html>`);
}
console.log(`Built ${pages.length} pages in dist/`);
