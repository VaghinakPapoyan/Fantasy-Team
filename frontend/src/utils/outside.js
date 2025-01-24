import { useState, useEffect, useRef } from "react";

const useOutsideClickDetector = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
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
