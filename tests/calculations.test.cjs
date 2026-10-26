'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const inline = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(inline, 'Inline calculation script must be present');
const pure = inline[1].split('function updateResult(r)')[0];
assert.ok(pure.includes('function computeLegacy'), 'Historical mix method must exist');
const context = vm.createContext({ console, Intl, Number, Math, Date, String, Object });
vm.runInContext(pure, context, { timeout: 3000 });
vm.runInContext('globalThis.testCompute=compute; globalThis.sieveSizes=OLD_SIEVES;', context);
const compute = context.testCompute;
const assertClose = (actual, expected, epsilon=0.02) => assert.ok(Math.abs(actual-expected)<=epsilon, `Expected ${expected}, got ${actual}`);
const legacyInput = JSON.parse(fs.readFileSync(path.join(root, 'examples', 'Contoh_20MPa_SNI1993.json'), 'utf8')).input;

// Reproduces the uploaded 20 MPa educational worked example.
test('SNI 03-2834-1993: 20 MPa example, SSD and field water corrections', () => {
  const r = compute(legacyInput);
  assertClose(r.fcr, 30);
  assertClose(r.water, 205);
  assertClose(r.cement, 404);
  assertClose(r.fineSSD, 741.72);
  assertClose(r.coarseSSD, 1024.28);
  assertClose(r.addWater, 199.01);
  assertClose(r.fineWet, 753.96);
  assertClose(r.coarseWet, 1018.03);
  assertClose(r.density, 2375);
  assertClose(r.actualDensity, 2375);
  assertClose(r.addWater*r.scale, 23.881, 0.002);
  assertClose(r.sieve[2].blend, 95.36, 0.001);
});

test('Legacy parameters outside the documented environment category are rejected', () => {
  assert.throws(()=>compute({...legacyInput, oldEnv:'special',oldCap:null,oldMin:null}), /lingkungan khusus/i);
});

test('SNI 7656:2012: sample numerical regression and absolute-volume balance', () => {
  const settings = {
    method:'7656', fc:25, margin:8.3, slump:'1',size:'25',airMode:'plain',exposure:'light',
    airOverride:null,waterAdj:0,coarseAdj:'0',sgC:3.15,minCement:0,sgF:2.62,fm:2.7,
    absF:1.3,mcF:3.5,sgG:2.68,druw:1550,absG:0.6,mcG:1,wcMode:'auto',wcManual:0.5,
    wcCap:null,volume:1,waste:0
  };
  const r = compute(settings);
  assertClose(r.fcr, 33.3);
  assertClose(r.water, 193);
  assertClose(r.cement, 390.8465);
  assertClose(r.fineSSD, 713.3696);
  assertClose(r.coarseSSD, 1060.324);
  assertClose(r.volSum, 1, 1e-9);
  assertClose(r.density, r.actualDensity, 1e-9);
});

test('Deployment site is self-contained, with no remote JavaScript or CSS dependency', () => {
  assert.match(html, /<html lang="id">/);
  assert.match(html, /<meta name="viewport"/);
  assert.doesNotMatch(html, /<script[^>]+src\s*=/i);
  assert.doesNotMatch(html, /<link[^>]+href=["']https?:\/\//i);
});
