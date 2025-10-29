export function createElement(type, props, ...children) {
    props = props || {};
    const flatChildren = children.flat().filter((child) => child !== null && child !== undefined);
    return { type, props, children: flatChildren };
}
export function createFragment(props, ...children) {
    return createElement("fragment", props, ...children);
}
export function renderToDOM(vnode) {
    // STEP 1: Handle text nodes
    if (typeof vnode === "string" || typeof vnode === "number") {
        return document.createTextNode(String(vnode));
    }
    // STEP 2: Handle fragments
    if (vnode.type === "fragment") {
        const fragment = document.createDocumentFragment();
        vnode.children.forEach(child => {
            fragment.appendChild(renderToDOM(child));
        });
        return fragment;
    }
    // STEP 3: Handle component functions
    if (typeof vnode.type === "function") {
        const componentResult = vnode.type({
            ...vnode.props,
            children: vnode.children,
        });
        return renderToDOM(componentResult);
    }
    // STEP 4: Handle regular HTML elements
    const el = document.createElement(vnode.type);
    // Set attributes and event listeners
    for (const [key, value] of Object.entries(vnode.props || {})) {
        if (key === "className") {
            el.setAttribute("class", value);
        }
        else if (key === "style" && typeof value === "object") {
            Object.assign(el.style, value);
        }
        else if (key.startsWith("on") && typeof value === "function") {
            // Example: onClick → click
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, value);
        }
        else {
            el.setAttribute(key, value);
        }
    }
    // Append children
    vnode.children.forEach(child => {
        el.appendChild(renderToDOM(child));
    });
    return el;
}
export function mount(vnode, container) {
    const domNode = renderToDOM(vnode);
    container.appendChild(domNode);
}
export function useState(initialValue) {
    let value = initialValue;
    const getValue = () => value;
    const setValue = (newValue) => {
        value = newValue;
        console.log("State updated:", value);
    };
    return [getValue, setValue];
}
