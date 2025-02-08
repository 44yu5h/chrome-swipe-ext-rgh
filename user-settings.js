document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM fully loaded and parsed");

    const enableFeatureCheckbox = document.getElementById("enableFeature");
    const iconGrid = document.getElementById("iconGrid");
    const showMoreButton = document.getElementById("showMore");

    let allIcons = [];
    let displayedIcons = 8;
    let expanded = false;

    // Load saved settings
    chrome.storage.sync.get(["enableFeature", "selectedIcon"], function (data) {
        const enableFeature = data.enableFeature ?? true;
        const selectedIcon = data.selectedIcon ?? "4.svg";
    
        document.getElementById("enableFeature").checked = enableFeature;
        fetchIcons(selectedIcon);
    
        // Save default icon if not already set
        if (!data.selectedIcon) {
            chrome.storage.sync.set({ selectedIcon: selectedIcon });
        }
    });

    // Auto-save toggle setting
    enableFeatureCheckbox.addEventListener("change", function () {
        chrome.storage.sync.set({ enableFeature: enableFeatureCheckbox.checked });
    });

    // Fetch the list of icons from JSON
    async function fetchIcons(selectedIcon) {
        try {
            const response = await fetch(chrome.runtime.getURL("arrowStyles/icon-styles.json"));
            const data = await response.json();
            allIcons = data.icons;
            displayIcons(selectedIcon);
        } catch (error) {
            console.error("Error loading icons:", error);
        }
    }

    // Display icons in grid
    function displayIcons(selectedIcon) {
        iconGrid.innerHTML = "";
        const iconsToShow = expanded ? allIcons : allIcons.slice(0, displayedIcons);

        iconsToShow.forEach(icon => {
            const img = document.createElement("img");
            img.src = chrome.runtime.getURL(`arrowStyles/${icon}`);
            img.classList.add("icon-item");
            if (icon === selectedIcon) img.classList.add("selected");

            img.addEventListener("click", function () {
                document.querySelectorAll(".icon-item").forEach(el => el.classList.remove("selected"));
                img.classList.add("selected");

                // Save selected icon
                chrome.storage.sync.set({ selectedIcon: icon });
            });

            iconGrid.appendChild(img);
        });

        updateShowMoreButton();
    }

    // Show more/less icons when button is clicked
    showMoreButton.addEventListener("click", function () {
        expanded = !expanded;
        displayIcons();
    });

    // Update button text
    function updateShowMoreButton() {
        showMoreButton.textContent = expanded ? "Show Less" : "Show More";
    }
});
