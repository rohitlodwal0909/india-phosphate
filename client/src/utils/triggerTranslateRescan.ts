

export const triggerGoogleTranslateRescan = () => {
 console.log("triggerGoogleTranslateRescan called — but node creation/removal skipped.");
//     if (
//     typeof window !== "undefined" &&
//     window.google &&
//     window.google.translate &&
//     window.google.translate.TranslateElement
//   ) {
//     const dummy = document.createElement("span");
//     dummy.textContent = ".";
//     dummy.style.display = "none";
//     document.body.appendChild(dummy);

//     setTimeout(() => {
//       dummy.remove();
//     }, 100);

//     console.log("Safe re-scan triggered (no body.innerHTML change).");
//   }
};

// export const triggerGoogleTranslateRescan = () => {
//   if (window.google && window.google.translate && window.google.translate.TranslateElement) {
//     try {
//       const googleTranslateFrame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement | null;
//       if (googleTranslateFrame && googleTranslateFrame.contentWindow) {
//         const innerDoc = googleTranslateFrame.contentWindow.document;
//         const selectElement = innerDoc.querySelector('.goog-te-combo') as HTMLSelectElement | null;

//         if (selectElement) {
//           const event = new Event('change', { bubbles: true });
//           selectElement.dispatchEvent(event);
//           console.log("Google Translate: Rescan triggered successfully by simulating a language change.");
//         } else {
//           console.warn("Google Translate: Could not find the language select element within the iframe. Rescan attempt might not be fully effective.");
//         }
//       } else {
//         console.warn("Google Translate: Iframe or its content window not found. Rescan could not be triggered.");
//       }
//     } catch (e) {
//       console.error("Error attempting to trigger Google Translate rescan:", e);
//     }
//   } else {
//     // console.log("Google Translate API not yet loaded. Skipping rescan.");
//   }
// };