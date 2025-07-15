import { RouterProvider } from "react-router";
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from "./routes/Router";
import { useEffect } from "react";

  import { ToastContainer} from 'react-toastify';
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { GetAuthenticationmodule } from "./features/authentication/AuthenticationSlice";
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
    translateElementInitialized?: boolean;
  }
}
function App() {
     const dispatch = useDispatch<AppDispatch>();
     useEffect(() => {
    if (!document.getElementById("react-portal-wrapper")) {
      const portalDiv = document.createElement("div");
      portalDiv.id = "react-portal-wrapper";
      portalDiv.classList.add("notranslate");
      portalDiv.setAttribute("translate", "no");
      document.body.appendChild(portalDiv);
    }
  }, []);
       useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('logincheck') || '{}');
    if (stored?.admin?.id) {
      dispatch(GetAuthenticationmodule(stored.admin.id));
    }
  }, [dispatch]);
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
