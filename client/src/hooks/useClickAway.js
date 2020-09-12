import { useEffect } from 'react';
export function useClickAway(ref, closeHandler) {
  useEffect(() => {
    function handleClickOutside(event) {
      try {
        if (
          event.target.getAttribute('class') &&
          event.target
            .getAttribute('class')
            .localeCompare('MuiBackdrop-root') === 0
        ) {
          closeHandler();
        }
      } catch (e) {}
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}
