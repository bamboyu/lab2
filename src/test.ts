import { createElement } from "./jsx-runtime.js";

const vnode = createElement('div', { className: 'test' }, 'Hello World');
console.log(vnode);
