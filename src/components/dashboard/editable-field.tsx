'use client';

import { 
  useEffect, 
  useRef, 
  forwardRef, 
  useState 
} from 'react';

interface EditableFieldProps {
  value: string;
  placeholder: string;
  className?: string;
  onBlur: (value: string) => void;
  onChange: (value: string) => void;
  onEnter?: () => void;
  tag?: 'h1' | 'p';
  ariaLabel: string;
}

const EditableField = forwardRef<HTMLDivElement, EditableFieldProps>(
  ({ value, placeholder, className, onBlur, onChange, onEnter, tag = 'p', ariaLabel }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);

    const moveCursorToEnd = (element: HTMLElement) => {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    };

    useEffect(() => {
      if (internalRef.current && !isFocused) {
        internalRef.current.textContent = value;
      }
    }, [value, isFocused]);

    return (
      <div className="relative">
        <div
          ref={(node) => {
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            internalRef.current = node;
          }}
          contentEditable
          className={`outline-none focus:outline-none cursor-text focus:bg-accent/30 ${className}`}
          onInput={(e) => {
            onChange(e.currentTarget.textContent || '');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (onEnter) onEnter();
            }
          }}
          onFocus={() => {
            setIsFocused(true);
            if (internalRef.current) {
              moveCursorToEnd(internalRef.current);
            }
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur(e.currentTarget.textContent || '');
          }}
          suppressContentEditableWarning
          role="textbox"
          aria-label={ariaLabel}
        />
        {!value && (
          <div
            className={`absolute top-0 left-0 text-muted-foreground/50 cursor-text pointer-events-none ${className}`}
            aria-hidden="true"
          >
            {placeholder}
          </div>
        )}
      </div>
    );
  }
);

EditableField.displayName = 'EditableField';

export default EditableField;