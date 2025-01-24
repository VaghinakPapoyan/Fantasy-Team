import { useState, useEffect, useRef } from "react";

/**
 * @param {number} offset - The distance in pixels you want to add
 *                          or subtract before the element is considered in view.
 *                          Positive means appear earlier, negative means appear later.
 * @param {Object} options - (Optional) IntersectionObserver options like threshold, root, etc.
 * @returns [ref, isIntersecting]
 */
export default function useInView(offset = 150, options = {}) {
  const { root = null, threshold = 0 } = options;
  const containerRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // rootMargin uses CSS-like notation: "top right bottom left"
    // If we want the element to be considered in view after it passes an extra 150px,
    // we typically use a negative bottom margin: "0px 0px -150px 0px".
    // If you prefer the element to show 150px earlier, use a positive margin.
    const offsetValue = offset >= 0 ? `-${offset}px` : `${Math.abs(offset)}px`;
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        root,
        rootMargin: `0px 0px ${offsetValue} 0px`,
        threshold,
      }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [offset, root, threshold]);

  return [containerRef, isIntersecting];
}
