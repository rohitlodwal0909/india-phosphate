import { RouterProvider, useNavigate } from 'react-router';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from './routes/Router';
import { useEffect } from 'react';

import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';
import { GetAuthenticationmodule } from './features/authentication/AuthenticationSlice';
import { GetNotification } from './features/Notifications/NotificationSlice';
import { io } from 'socket.io-client';
import { ImageUrl } from './constants/contant';
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
    translateElementInitialized?: boolean;
  }
}
const socket = io(ImageUrl);
function App() {
  const dispatch = useDispatch<AppDispatch>();

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000; // seconds
      return payload.exp < currentTime;
    } catch (e) {
      return true;
    }
  };

  useEffect(() => {
    if (!document.getElementById('react-portal-wrapper')) {
      const portalDiv = document.createElement('div');
      portalDiv.id = 'react-portal-wrapper';
      portalDiv.classList.add('notranslate');
      portalDiv.setAttribute('translate', 'no');
      document.body.appendChild(portalDiv);
    }
  }, []);

  useEffect(() => {
    socket.on('new_notification', () => {});
    return () => {
      socket.off('new_notification');
    };
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('logincheck') || '{}');
    const token = localStorage.getItem('token');

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('logincheck');
      localStorage.removeItem('token');
    }

    if (stored?.admin?.id) {
      dispatch(GetAuthenticationmodule(stored.admin.id));
      dispatch(GetNotification(stored?.admin?.id));
    }
  }, [dispatch]);

  useEffect(() => {
    const initializeGoogleTranslate = () => {
      if (window.google?.translate?.TranslateElement && !window.translateElementInitialized) {
        window.translateElementInitialized = true;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.LIST,
          },
          'google_translate_element',
        );
      }
    };

    const addGoogleTranslateScript = () => {
      const existingScript = document.querySelector("script[src*='translate_a/element.js']");
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
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
        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <ToastContainer theme="light" hideProgressBar={true} />
        <RouterProvider router={router} />
      </Flowbite>
    </>
  );
}

export default App;
