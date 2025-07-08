// ==UserScript==
// @name         Destroy examtopics popup (persistent)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @author       mlabuda2 (Mateusz Labuda)
// @description  Hide + block the popup from reappearing on www.examtopics.com
// @match        https://www.examtopics.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("📘 Tampermonkey script initialized...");

    const hidePopup = () => {
        const popup = document.getElementById('notRemoverPopup');
        if (popup) {
            console.log("✅ Hiding popup...");
            popup.style.display = 'none';
            popup.style.visibility = 'hidden';
            popup.setAttribute('aria-hidden', 'true');

            // Restore scroll
            document.body.style.overflow = 'auto';
            document.body.style.position = 'static';
            document.documentElement.style.overflow = 'auto';
            document.documentElement.style.position = 'static';
        }
    };

    const blockReinsertion = () => {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const node of mutation.addedNodes) {
                    if (node.id === 'notRemoverPopup') {
                        console.log("🚫 Popup re-added — hiding again");
                        node.style.display = 'none';
                        node.style.visibility = 'hidden';
                        node.setAttribute('aria-hidden', 'true');
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const main = async () => {
        await sleep(6000); // Wait 6s
        hidePopup();
        await sleep(300);  // Wait 300ms more
        hidePopup();
        blockReinsertion();

        // Optional: Run periodically for 20s
        const intervalId = setInterval(hidePopup, 300);
        setTimeout(() => {
            clearInterval(intervalId);
            console.log("🛑 Stopped periodic hiding");
        }, 20000);
    };

    main();
})();
