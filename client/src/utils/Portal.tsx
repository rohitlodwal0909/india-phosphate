// src/utils/Portal.tsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  wrapperId?: string; // Optional: specify a custom ID for the portal root
}

// Helper to create or get a div for the portal
function createWrapperAndAppendToBody(wrapperId: string) {
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}

const Portal = ({ children, wrapperId = 'react-portal-wrapper' }: PortalProps) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(wrapperId);
    let created = false;
    // If element does not exist, create it and append to document.body
    if (!element) {
      element = createWrapperAndAppendToBody(wrapperId);
      created = true;
    }
    setWrapperElement(element);

    // Cleanup function to remove the wrapper div if we created it
    return () => {
      if (created && element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);

  if (!wrapperElement) {
    return null; // Don't render until the wrapper element is ready
  }

  return createPortal(children, wrapperElement);
};

export default Portal;