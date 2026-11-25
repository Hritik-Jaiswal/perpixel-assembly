const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildText, makePdf } = require('../src/brief.js');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

test('all nine pages and their local navigation targets are in the build', () => {
  const routes = ['', 'about', 'catering', 'celebrations', 'corporate', 'work', 'atelier', 'planner', 'contact'];
  for (const route of routes) {
    const file = path.join(dist, route, 'index.html');
    assert.ok(fs.existsSync(file), `${route || 'home'} missing`);
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /<title>.+<\/title>/);
    assert.match(html, /<meta name="description"/);
    assert.match(html, /assets\/brief.js/);
  }
  const script = fs.readFileSync(path.join(root,'src','app.js'),'utf8');
  for (const [,target] of script.matchAll(/href="(\/[^"#?]*)"/g)) {
    if(target.startsWith('/assets/')) continue;
    assert.ok(fs.existsSync(path.join(dist,target,'index.html')),`broken route ${target}`);
  }
});

test('export includes edited planning choices and valid PDF cross references', async () => {
  const state = {
    occasion:'Brand launch',guests:225,dining:'Live food stations',direction:'Experiential',
    extras:['Event styling','Lighting & production'],date:'2027-03-18',city:'Mumbai',
    venue:'Open industrial space with flexible seating',service:'Live food stations',dishes:['rice']
  };
  const text = buildText(state,[{id:'rice',name:'Saffron rice & seasonal vegetables'}]);
  for(const value of ['Brand launch','225','Live food stations','Mumbai','Saffron rice & seasonal vegetables','No enquiry has been sent']) assert.ok(text.includes(value));
  const pdf = Buffer.from(await makePdf(text).arrayBuffer()).toString('latin1');
  assert.ok(pdf.startsWith('%PDF-1.4'));
  assert.match(pdf,/\/Type \/Page\b/);
  assert.match(pdf,/Occasion: Brand launch/);
  const xref = Number(pdf.match(/startxref\n(\d+)/)[1]);
  assert.equal(pdf.slice(xref,xref+4),'xref');
  const entries = [...pdf.matchAll(/(\d{10}) 00000 n/g)].map(m=>Number(m[1]));
  for(const offset of entries) assert.match(pdf.slice(offset,offset+15),/^\d+ 0 obj/);
});

test('long venue notes produce a readable multi-page PDF', async () => {
  const state={occasion:'Private gathering',guests:25,dining:'Plated dining',direction:'Classic',extras:[],date:'',city:'',venue:'A spacious room with natural light. '.repeat(100),service:'Plated dining',dishes:[]};
  const pdf=Buffer.from(await makePdf(buildText(state,[])).arrayBuffer()).toString('latin1');
  assert.match(pdf,/\/Count 2\b/);
  assert.equal((pdf.match(/\/Type \/Page\b/g)||[]).length,2);
});
