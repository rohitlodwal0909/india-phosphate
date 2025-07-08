import { RouterProvider } from "react-router";
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from "./routes/Router";
import { useEffect } from "react";

  import { ToastContainer} from 'react-toastify';
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
    translateElementInitialized?: boolean;
  }
}
function App() {
 
   useEffect(() => {
    const initializeGoogleTranslate = () => {
      if (window.google?.translate?.TranslateElement && !window.translateElementInitialized) {
        window.translateElementInitialized = true;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout: window.google.translate.TranslateElement.InlineLayout.LIST
          },
          "google_translate_element"
        );
      }
    };

    const addGoogleTranslateScript = () => {
      const existingScript = document.querySelector("script[src*='translate_a/element.js']");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      } else {
        initializeGoogleTranslate();
      }
    };

    window.googleTranslateElementInit = () => initializeGoogleTranslate();

    addGoogleTranslateScript();
  }, []); // Empty dependency array means this runs once on mount


  return (
    <>
      <ThemeModeScript />
      
      <Flowbite theme={{ theme: customTheme }}>
        {/* Hidden Google Translate widget */}
        <div id="google_translate_element" style={{ display: "none" }}></div>
  <ToastContainer
  theme="light"
 hideProgressBar={true}
  />
        <RouterProvider router={router} />
      </Flowbite>
    </>
  );
}

export default App;
