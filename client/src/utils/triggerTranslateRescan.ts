

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