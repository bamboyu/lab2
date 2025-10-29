// src/jsx-runtime.ts

export interface VNode {
  children: any;
  type: any;
  props: {
    [key: string]: any;
    children?: VNode[]; // ✅ Optional children stored inside props
  };
}

export interface ComponentProps {
  [key: string]: any;
  children?: (VNode | string | number)[];
}

export type ComponentFunction = (props: ComponentProps) => VNode;

export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  props = props || {};
  const flatChildren = children.flat().filter(c => c != null);
  return { type, props, children: flatChildren };
}

export function createFragment(
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  return createElement("fragment", props, ...children);
}

// --------------------- DOM RENDERING ---------------------

export function renderToDOM(vnode: VNode | string | number): Node {
  // TEXT NODES
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  // FRAGMENTS
  if (vnode.type === "fragment") {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach((child: string | number | VNode) => fragment.appendChild(renderToDOM(child)));
    return fragment;
  }

  // FUNCTION COMPONENTS
  if (typeof vnode.type === "function") {
    const componentVNode = vnode.type({ ...vnode.props, children: vnode.children });
    return renderToDOM(componentVNode);
  }

  // HTML ELEMENTS
  const el = document.createElement(vnode.type as string);

  // --- HANDLE PROPS ---
  for (const [key, value] of Object.entries(vnode.props)) {
    if (key === "className") {
      el.setAttribute("class", value);
    } 
    else if (key === "style") {
      if (typeof value === "object") {
        const styleString = Object.entries(value)
          .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${v}`)
          .join(';');
        el.setAttribute("style", styleString);
      } else {
        el.setAttribute("style", value);
      }
    } 
    else if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      el.addEventListener(eventType, value);
    } 
    else if (key === "ref" && typeof value === "function") {
      // Refs: give access to the DOM node
      value(el);
    } 
    else {
      el.setAttribute(key, value);
    }
  }

  // --- APPEND CHILDREN ---
  vnode.children.forEach((child: string | number | VNode) => el.appendChild(renderToDOM(child)));

  return el;
}

// MOUNT
export function mount(vnode: VNode, container: HTMLElement): void {
  const node = renderToDOM(vnode);
  container.appendChild(node);
}

// --------------------- SIMPLE STATE ---------------------

export function useState<T>(initialValue: T): [() => T, (newValue: T) => void] {
  let value = initialValue;

  const getter = () => value;
  const setter = (newValue: T) => {
    value = newValue;
    // (Optional) trigger re-render logic here if needed
  };

  return [getter, setter];
}

