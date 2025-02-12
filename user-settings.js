document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM fully loaded and parsed");

    const enableFeatureCheckbox = document.getElementById("enableFeature");
    const iconGrid = document.getElementById("iconGrid");
    const showMoreButton = document.getElementById("showMore");
    const fadeDelaySlider = document.getElementById("fadeDelay");
    const fadeDelayValue = document.getElementById("fadeDelayValue");
    const sensitivitySlider = document.getElementById("sensitivity");
    const sensitivityValue = document.getElementById("sensitivityValue");
    const arrowSizeInput = document.getElementById("arrowSize");
    const travelDistanceInput = document.getElementById("travelDistance");

    let allIcons = [];
    let expanded = false;

    // Load saved settings
    chrome.storage.sync.get(["enableFeature", "selectedIcon", "fadeDelay", "sensitivity", "arrowSize", "travelDistance"], function (data) {
        enableFeatureCheckbox.checked = data.enableFeature ?? true;
        fadeDelaySlider.value = data.fadeDelay ?? 1000;
        sensitivitySlider.value = data.sensitivity ?? 50;
        arrowSizeInput.value = data.arrowSize ?? 60;
        travelDistanceInput.value = data.travelDistance ?? 120;

        // Update pills
        fadeDelayValue.textContent = fadeDelaySlider.value;
        sensitivityValue.textContent = sensitivitySlider.value;

        fetchIcons(data.selectedIcon ?? "4.svg");

        updateSliderBackground(fadeDelaySlider);
        updateSliderBackground(sensitivitySlider);
    });

    // Auto-save toggle setting
    enableFeatureCheckbox.addEventListener("change", function () {
        chrome.storage.sync.set({ enableFeature: enableFeatureCheckbox.checked });
    });

    // Auto-save input setting
    arrowSizeInput.addEventListener("input", function () {
        chrome.storage.sync.set({ arrowSize: arrowSizeInput.value });
    });
    travelDistanceInput.addEventListener("input", function () {
        chrome.storage.sync.set({ travelDistance: travelDistanceInput.value });
    });

    // Handle slider changes
    function handleSliderChange(slider, valueElement, key) {
        slider.addEventListener("input", function () {
            valueElement.textContent = slider.value;
            updateSliderBackground(slider);
            chrome.storage.sync.set({ [key]: slider.value });
        });
    }
    handleSliderChange(fadeDelaySlider, fadeDelayValue, "fadeDelay");
    handleSliderChange(sensitivitySlider, sensitivityValue, "sensitivity");

    function updateSliderBackground(slider) {
        let percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        if (percentage < 50) percentage += 4; // for visual appeal
        slider.style.setProperty("--progress-width", `${percentage}%`);
    }

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
        const iconsToShow = expanded ? allIcons : allIcons.slice(0, 8);

        iconsToShow.forEach(icon => {
            const img = document.createElement("img");
            img.src = chrome.runtime.getURL(`arrowStyles/${icon}`);
            img.classList.add("icon-item");
            if (icon === selectedIcon) img.classList.add("selected");

            img.addEventListener("click", function () {
                document.querySelectorAll(".icon-item").forEach(el => el.classList.remove("selected"));
                img.classList.add("selected");
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
