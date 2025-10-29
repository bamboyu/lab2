/** @jsx createElement */
import { createElement, useState, ComponentProps } from "./jsx-runtime";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  children?: any;
}

const Button = (props: ButtonProps) => {
  const { onClick, className, children } = props;

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

interface CounterProps {
  initialCount?: number; // optional starting count
}

const Counter = (props: CounterProps) => {
  // STEP 1: useState for count
  const [getCount, setCount] = useState(props.initialCount ?? 0);

  // STEP 2: define update functions
  const increment = () => setCount(getCount() + 1);
  const decrement = () => setCount(getCount() - 1);
  const reset = () => setCount(props.initialCount ?? 0);

  // STEP 3: return JSX
  return (
    <div className="counter">
      <h2>Count: {getCount()}</h2>
      <div className="buttons">
        <Button className="btn" onClick={increment}>+</Button>
        <Button className="btn" onClick={decrement}>-</Button>
        <Button className="btn" onClick={reset}>Reset</Button>
      </div>
    </div>
  );
};

export { Counter };
