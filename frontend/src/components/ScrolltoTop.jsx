import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component scrolls the window to the top (0, 0) whenever the
 * route path changes. It should be placed inside your Router component.
 */
function ScrollToTop() {
  // Get the current location object, specifically the pathname
  const { pathname } = useLocation();

  // Use the useEffect hook to trigger a side effect (scrolling)
  useEffect(() => {
    // Scroll the window to the top left corner
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency array: this effect runs ONLY when the pathname changes

  // This component doesn't render anything visible
  return null;
}

export default ScrollToTop;