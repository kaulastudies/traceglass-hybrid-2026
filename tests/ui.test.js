import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const script=readdirSync(new URL('../dist/assets/',import.meta.url)).find(x=>x.endsWith('.js'));
const code=readFileSync(new URL(`../dist/assets/${script}`,import.meta.url),'utf8');
function app(){
  const dom=new JSDOM('<div id="app"></div>',{url:'http://127.0.0.1:8793',runScripts:'outside-only'});
  dom.window.eval(code);return dom;
}
test('production bundle renders eight inspectable cases and no invented results',()=>{
  const dom=app(),d=dom.window.document;
  assert.equal(d.querySelectorAll('#cases details').length,8);
  assert.equal(d.querySelector('#attempts').textContent,'0');
  assert.equal(d.querySelector('#mode').value,'ONLY_ON_DEVICE');
  assert.equal(d.querySelector('#export').disabled,true);dom.window.close();
});
test('reference check is labelled and cannot inflate live counts',()=>{
  const dom=app(),d=dom.window.document;d.querySelector('#control').click();
  assert.match(d.querySelector('#control-result').textContent,/8\/8 reference answers accepted; 8\/8 unsupported answers rejected/);
  assert.equal(d.querySelector('#attempts').textContent,'0');dom.window.close();
});
test('missing configuration blocks a live run without fabricating a model verdict',()=>{
  const dom=app(),d=dom.window.document;d.querySelector('#run').click();
  assert.match(d.querySelector('#status').textContent,/new, dedicated Firebase project/);
  assert.equal(d.querySelectorAll('#results tr').length,0);dom.window.close();
});
test('cloud mode without consent fails before initialization',()=>{
  const dom=app(),d=dom.window.document;d.querySelector('#mode').value='ONLY_IN_CLOUD';d.querySelector('#run').click();
  assert.match(d.querySelector('#status').textContent,/explicit consent/);
  assert.equal(d.querySelectorAll('#results tr').length,0);dom.window.close();
});
