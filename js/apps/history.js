// =====================================================
// PROJECT UNTITLED
// APP — BROWSER HISTORY
// =====================================================

(function () {

    "use strict";


    // -------------------------------------------------
    // ELEMENTS
    // -------------------------------------------------

    const historyWindow =
        document.getElementById("historyWindow");

    const historyList =
        document.getElementById("browserHistoryList");

    const historyCount =
        document.getElementById("historyCount");

    const clearHistoryButton =
        document.getElementById("clearHistory");


    // -------------------------------------------------
    // STATE
    // -------------------------------------------------

    let historyEntries = [];


    // -------------------------------------------------
    // STORAGE KEY
    // -------------------------------------------------

    const STORAGE_KEY =
        "projectUntitled_browserHistory";


    // -------------------------------------------------
    // LOAD HISTORY
    // -------------------------------------------------

    function loadHistory() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                historyEntries = [];
                return;
            }

            const parsed =
                JSON.parse(saved);

            if (Array.isArray(parsed)) {
                historyEntries = parsed;
            } else {
                historyEntries = [];
            }

        } catch (error) {

            console.error(
                "HistorySystem: Failed to load history.",
                error
            );

            historyEntries = [];
        }
    }


    // -------------------------------------------------
    // SAVE HISTORY
    // -------------------------------------------------

    function saveHistory() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(historyEntries)
            );

        } catch (error) {

            console.error(
                "HistorySystem: Failed to save history.",
                error
            );
        }
    }


    // -------------------------------------------------
    // ADD HISTORY ENTRY
    // -------------------------------------------------

    function addEntry(site) {

        if (!site) {
            return;
        }


        /*
         * A site can be supplied in different formats.
         *
         * Example:
         *
         * {
         *     id: "north-ridge-news",
         *     title: "North Ridge News",
         *     url: "northridge.local/news"
         * }
         *
         * The important part is that the browser can
         * identify the site later.
         */

        const entry = {

            id:
                site.id ||
                site.siteId ||
                site.slug ||
                site.url ||
                site.title,

            title:
                site.title ||
                site.name ||
                "Unknown Website",

            url:
                site.url ||
                site.address ||
                site.href ||
                "",

            timestamp:
                Date.now()
        };


        // -------------------------------------------------
        // REMOVE DUPLICATE CURRENT ENTRY
        // -------------------------------------------------

        historyEntries =
            historyEntries.filter(function (existing) {

                return existing.id !== entry.id;

            });


        // -------------------------------------------------
        // ADD TO TOP
        // -------------------------------------------------

        historyEntries.unshift(entry);


        // -------------------------------------------------
        // LIMIT HISTORY
        // -------------------------------------------------

        const MAX_HISTORY_ENTRIES = 50;

        if (
            historyEntries.length >
            MAX_HISTORY_ENTRIES
        ) {

            historyEntries =
                historyEntries.slice(
                    0,
                    MAX_HISTORY_ENTRIES
                );
        }


        saveHistory();
        renderHistory();


        // Notify other systems.
        document.dispatchEvent(
            new CustomEvent(
                "historyUpdated",
                {
                    detail: entry
                }
            )
        );
    }


    // -------------------------------------------------
    // FORMAT TIME
    // -------------------------------------------------

    function formatTime(timestamp) {

        if (!timestamp) {
            return "";
        }

        const date =
            new Date(timestamp);

        return date.toLocaleString(
            [],
            {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    // -------------------------------------------------
    // CREATE HISTORY ENTRY
    // -------------------------------------------------

    function createHistoryElement(entry) {

        const element =
            document.createElement("div");

        element.className =
            "history-entry";


        // -------------------------------------------------
        // TITLE
        // -------------------------------------------------

        const title =
            document.createElement("div");

        title.className =
            "history-entry-title";

        title.textContent =
            entry.title ||
            "Unknown Website";


        // -------------------------------------------------
        // URL
        // -------------------------------------------------

        const url =
            document.createElement("div");

        url.className =
            "history-entry-url";

        url.textContent =
            entry.url ||
            "unknown://";


        // -------------------------------------------------
        // TIME
        // -------------------------------------------------

        const time =
            document.createElement("div");

        time.className =
            "history-entry-time";

        time.textContent =
            formatTime(entry.timestamp);


        // -------------------------------------------------
        // BUILD
        // -------------------------------------------------

        element.appendChild(title);
        element.appendChild(url);
        element.appendChild(time);


        // -------------------------------------------------
        // CLICK
        // -------------------------------------------------

        element.addEventListener(
            "click",
            function () {

                openHistoryEntry(entry);

            }
        );


        return element;
    }


    // -------------------------------------------------
    // RENDER HISTORY
    // -------------------------------------------------

    function renderHistory() {

        if (!historyList) {
            return;
        }


        // Clear existing content.
        historyList.innerHTML = "";


        // Empty state.
        if (historyEntries.length === 0) {

            const empty =
                document.createElement("div");

            empty.className =
                "history-empty";

            empty.textContent =
                "No browsing history.";

            historyList.appendChild(empty);

            updateHistoryCount();

            return;
        }


        // Render entries.
        historyEntries.forEach(
            function (entry) {

                const element =
                    createHistoryElement(entry);

                historyList.appendChild(element);

            }
        );


        updateHistoryCount();
    }


    // -------------------------------------------------
    // UPDATE HISTORY COUNT
    // -------------------------------------------------

    function updateHistoryCount() {

        if (!historyCount) {
            return;
        }

        const count =
            historyEntries.length;

        historyCount.textContent =
            `${count} ${count === 1 ? "entry" : "entries"}`;
    }


    // -------------------------------------------------
    // OPEN HISTORY ENTRY
    // -------------------------------------------------

    function openHistoryEntry(entry) {

        if (!entry) {
            return;
        }


        /*
         * IMPORTANT:
         *
         * We do NOT send the user to an actual URL.
         *
         * Project Untitled uses a FAKE INTERNET.
         *
         * Therefore the history system asks the browser
         * application to open the fake website.
         */

        document.dispatchEvent(
            new CustomEvent(
                "openHistorySite",
                {
                    detail: entry
                }
            )
        );


        // Close history window if the window manager
        // provides the appropriate function.
        if (
            typeof closeWindow === "function"
        ) {

            closeWindow("historyWindow");

        }


        // Also support the WindowManager API.
        if (
            window.WindowManager &&
            typeof window.WindowManager.close ===
                "function"
        ) {

            window.WindowManager.close(
                "historyWindow"
            );
        }


        // Play navigation sound.
        if (
            typeof playSound === "function"
        ) {

            playSound("navigate");

        }
    }


    // -------------------------------------------------
    // CLEAR HISTORY
    // -------------------------------------------------

    function clearHistory() {

        historyEntries = [];

        saveHistory();
        renderHistory();


        if (
            typeof playSound === "function"
        ) {

            playSound("delete");

        }


        document.dispatchEvent(
            new CustomEvent(
                "historyCleared"
            )
        );
    }


    // -------------------------------------------------
    // OPEN HISTORY WINDOW
    // -------------------------------------------------

    function openHistory() {

        if (!historyWindow) {
            return;
        }


        /*
         * Prefer the centralized WindowManager.
         */

        if (
            window.WindowManager &&
            typeof window.WindowManager.open ===
                "function"
        ) {

            window.WindowManager.open(
                "historyWindow"
            );

        } else {

            // Fallback in case WindowManager is unavailable.
            historyWindow.style.display =
                "block";
        }


        renderHistory();
    }


    // -------------------------------------------------
    // LISTEN FOR BROWSER NAVIGATION
    // -------------------------------------------------

    document.addEventListener(
        "browserVisited",
        function (event) {

            if (!event.detail) {
                return;
            }

            addEntry(event.detail);

        }
    );


    // -------------------------------------------------
    // ALTERNATIVE NAVIGATION EVENT
    // -------------------------------------------------

    document.addEventListener(
        "siteVisited",
        function (event) {

            if (!event.detail) {
                return;
            }

            addEntry(event.detail);

        }
    );


    // -------------------------------------------------
    // CLEAR BUTTON
    // -------------------------------------------------

    if (clearHistoryButton) {

        clearHistoryButton.addEventListener(
            "click",
            clearHistory
        );

    }


    // -------------------------------------------------
    // INITIALIZE
    // -------------------------------------------------

    loadHistory();


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            loadHistory();
            renderHistory();

        }
    );


    // -------------------------------------------------
    // PUBLIC API
    // -------------------------------------------------

    window.HistorySystem = {

        open: openHistory,

        add: addEntry,

        clear: clearHistory,

        render: renderHistory,

        getAll: function () {

            return [...historyEntries];

        },

        getCount: function () {

            return historyEntries.length;

        }

    };


})();