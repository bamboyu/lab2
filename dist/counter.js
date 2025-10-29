/** @jsx createElement */
import { createElement, useState } from "./jsx-runtime";
const Button = (props) => {
    const { onClick, className, children } = props;
    return (createElement("button", { onClick: onClick, className: className }, children));
};
const Counter = (props) => {
    // STEP 1: useState for count
    const [getCount, setCount] = useState(props.initialCount ?? 0);
    // STEP 2: define update functions
    const increment = () => setCount(getCount() + 1);
    const decrement = () => setCount(getCount() - 1);
    const reset = () => setCount(props.initialCount ?? 0);
    // STEP 3: return JSX
    return (createElement("div", { className: "counter" },
        createElement("h2", null,
            "Count: ",
            getCount()),
        createElement("div", { className: "buttons" },
            createElement(Button, { className: "btn", onClick: increment }, "+"),
            createElement(Button, { className: "btn", onClick: decrement }, "-"),
            createElement(Button, { className: "btn", onClick: reset }, "Reset"))));
};
export { Counter };
