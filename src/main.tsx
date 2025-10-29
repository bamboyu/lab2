/** @jsx createElement */
import { createElement, mount } from './jsx-runtime';
import { Dashboard } from './dashboard';

const app = <Dashboard />;

window.onload = () => {
  // mount into #root
  const root = document.getElementById('root');
  if (!root) {
    const r = document.createElement('div');
    r.id = 'root';
    document.body.appendChild(r);
    mount(app, r);
  } else {
    mount(app, root);
  }
};
