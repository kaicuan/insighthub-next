import { useEffect, RefObject } from 'react';

export const useContentEditable = (
  ref: RefObject<HTMLElement | null>,
  initialValue: string
) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = initialValue;
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [ref, initialValue]);
};