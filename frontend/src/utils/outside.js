import { useState, useEffect, useRef } from "react";

const useOutsideClickDetector = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    event.stopPropagation();
    if (ref.current && !ref.current.contains(event.target)) {
      setTimeout(() => {
        if (isOpen) {
          setIsOpen(false);
        }
      }, 0);
    }
  };

  useEffect(() => {
    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    isOpen,
    setIsOpen,
    ref,
  };
};

export default useOutsideClickDetector;
