document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("open-settings").addEventListener("click", function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL("settings.html"));
        }
    });
});
