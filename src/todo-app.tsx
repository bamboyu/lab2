/** @jsx createElement */
import { createElement, useState, VNode } from './jsx-runtime';

// Interfaces
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

// TodoItem Component
const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps): VNode => {
  const handleToggle = () => onToggle(todo.id);
  const handleDelete = () => onDelete(todo.id);

  return (
    <div className="todo-item" style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
      <input type="checkbox" checked={todo.completed} onChange={handleToggle} />
      <span
        style={{
          marginLeft: "8px",
          textDecoration: todo.completed ? "line-through" : "none",
          flexGrow: 1
        }}
      >
        {todo.text}
      </span>
      <button onClick={handleDelete} style={{ marginLeft: "8px" }}>
        🗑
      </button>
    </div>
  );
};

// AddTodoForm Component
const AddTodoForm = ({ onAdd }: AddTodoFormProps): VNode => {
  const [getInput, setInput] = useState("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const text = getInput().trim();
    if (text) {
      onAdd(text);
      setInput("");
    }
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setInput(target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo" style={{ marginBottom: "16px" }}>
      <input
        type="text"
        value={getInput()}
        onInput={handleInput}
        placeholder="Add a new task..."
        style={{ padding: "8px", width: "200px" }}
      />
      <button type="submit" style={{ marginLeft: "8px" }}>
        Add
      </button>
    </form>
  );
};

// TodoApp Component
const TodoApp = (): VNode => {
  const [getTodos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...getTodos(), newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      getTodos().map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(getTodos().filter((t) => t.id !== id));
  };

  const todos = getTodos();
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div
      className="todo-app"
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center" }}>📝 My Todo List</h2>
      <AddTodoForm onAdd={addTodo} />
      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </div>
      <p style={{ marginTop: "12px", textAlign: "center" }}>
        ✅ Completed: {completedCount} / {todos.length}
      </p>
    </div>
  );
};

// Export
export { TodoApp };
