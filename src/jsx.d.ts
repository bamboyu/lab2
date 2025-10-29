// src/jsx.d.ts
declare namespace JSX {
  // Define the allowed built-in HTML tags
  interface IntrinsicElements {
    div: any;
    span: any;
    input: any;
    button: any;
    form: any;
    h2: any;
    p: any;
    h3: any;
    label: any;
    ul: any;
    li: any;
    fragment: any;
    canvas: any;
    main: any;
    select: any;
    option: any;
    header: any;
    h1: any;
    strong: any;
    br: any;
    // Add more HTML tags as needed
    }
}

  // This tells TypeScript that JSX elements can have "children"
  interface ElementChildrenAttribute {
    children: {};
}
  