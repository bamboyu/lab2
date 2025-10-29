/** @jsx createElement */
import { createElement } from './jsx-runtime';

// 🪪 CARD
interface CardProps {
  title?: string;
  className?: string;
  onClick?: () => void;
  children?: any;
}
const Card = ({ title, className, onClick, children }: CardProps) => (
  <div className={`card ${className || ''}`} onClick={onClick} style={{
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
    margin: '10px',
    backgroundColor: '#fff'
  }}>
    {title && <h3>{title}</h3>}
    <div>{children}</div>
  </div>
);

// 💬 MODAL
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: any;
}
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick as any}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        className="modal-content"
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          minWidth: '300px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        }}
      >
        {title && <h2>{title}</h2>}
        <div>{children}</div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// 🧾 FORM
interface FormProps {
  onSubmit: (e: Event) => void;
  className?: string;
  children?: any;
}
const Form = ({ onSubmit, className, children }: FormProps) => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      className={className}
      onSubmit={handleSubmit as any}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      {children}
    </form>
  );
};

// ✏️ INPUT
interface InputProps {
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}
const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className
}: InputProps) => {
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onChange(target.value);
  };

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      className={className}
      onInput={handleChange as any}
      style={{
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem'
      }}
    />
  );
};

export { Card, Modal, Form, Input };
