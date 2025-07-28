// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to the top of the page when the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]); // Re-run effect whenever the URL path changes

  return null; // This component doesn't render anything
}

export default ScrollToTop;