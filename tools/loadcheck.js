// Smoke test: execute the built bundle factory with a stub DOM.
let captured = null;
global.window = { __ModuleLoader__: { load: (def) => { captured = def; } } };
const el = () => ({ style: { setProperty() {}, removeProperty() {} }, setAttribute() {}, removeAttribute() {}, remove() {}, appendChild() {}, addEventListener() {}, classList: { add() {}, remove() {} } });
global.document = {
  createElement: el,
  head: el(),
  body: { hasAttribute: () => false, appendChild() {}, addEventListener() {} },
  documentElement: { setAttribute() {}, removeAttribute() {}, hasAttribute: () => false },
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener() {},
};
global.getComputedStyle = () => ({ getPropertyValue: () => '' });
global.MutationObserver = class { observe() {} disconnect() {} };
require('../build/macos-desktop-build/client.js');
// React is provided by the bundle that hosts us; a stub is enough to prove the factory runs.
const React = {
  createElement: () => null,
  useState: (v) => [typeof v === 'function' ? v() : v, () => {}],
  useEffect: () => {},
  useRef: (v) => ({ current: v }),
  useSyncExternalStore: (sub, get) => get(),
};
const realRequire = (id) => {
  if (id === 'react') return React;
  if (id === 'react-dom') { const e = new Error('missing'); throw e; }
  throw new Error('no module ' + id);
};
const exp = captured.factory(realRequire);
console.log('exports', Object.keys(exp), exp.name, JSON.stringify(exp.inject));
