import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";

export const useNavigationScroll = ({ show = true }) => {
  const elementRef = useRef(null);
  const childWidth = useRef(0);
  const [navigationVisibility, setNavigationVisibility] = useState({ left: false, right: true });



  useEffect(() => {
    if (elementRef.current && show) {
        const childWidthOfSelectedElement = elementRef.current.querySelector("img")?.clientWidth;
        childWidth.current = childWidthOfSelectedElement;
    }
    const updateNavigationVisibility = () => {
      if (elementRef.current) {
        const currentElement = elementRef.current;
        currentElement.style.scrollBehavior = "unset";
        const totalScrollableWidth = currentElement.scrollWidth - currentElement.clientWidth;
        if (currentElement.scrollLeft > 0 && currentElement.scrollLeft < totalScrollableWidth - 2) {
          setNavigationVisibility({
            left: true,
            right: true,
          });
        } else if (currentElement.scrollLeft < totalScrollableWidth - 2) {
          setNavigationVisibility({
            left: false,
            right: true,
          });
        } else if (currentElement.scrollLeft > 0) {
          setNavigationVisibility({
            left: true,
            right: false,
          });
        }
      }
    };

    const debouncedUpdateNavigationVisibility = debounce(updateNavigationVisibility, 100);

    if (!show) {
      setNavigationVisibility({
        left: false,
        right: false,
      });
    } else {
      debouncedUpdateNavigationVisibility();
    }

    if (elementRef.current) {
      elementRef.current.addEventListener("scroll", debouncedUpdateNavigationVisibility);
    }
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener("scroll", debouncedUpdateNavigationVisibility);
      }
    };
  }, [show]);

  const scrollLeft = () => {
    if (elementRef.current) {
      elementRef.current.style.scrollBehavior = "smooth";
      elementRef.current.scrollBy(-childWidth.current, 0);
    }
  };

  const scrollRight = () => {
    if (elementRef.current) {
      elementRef.current.style.scrollBehavior = "smooth";
      elementRef.current.scrollBy(childWidth.current, 0);
    }
  };

  return { scrollLeft, scrollRight, elementRef, navigationVisibility };
};