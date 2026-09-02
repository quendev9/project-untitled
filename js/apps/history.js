/* =========================================================
   PROJECT UNTITLED
   APPLICATION — BROWSER HISTORY
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const historyWindow =
        document.getElementById(
            "historyWindow"
        );

    const historyList =
        document.getElementById(
            "browserHistoryList"
        );

    const historyCount =
        document.getElementById(
            "historyCount"
        );

    const clearHistoryButton =
        document.getElementById(
            "clearHistory"
        );


    /* =====================================================
       STORAGE
       ===================================================== */

    const STORAGE_KEY =
        "projectUntitled_browserHistory";


    /* =====================================================
       STATE
       ===================================================== */

    let historyEntries = [];


    /* =====================================================
       LOAD HISTORY
       ===================================================== */

    function loadHistory() {

        try {

            const stored =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!stored) {

                historyEntries = [];

                return;

            }


            const parsed =
                JSON.parse(
                    stored
                );


            if (
                Array.isArray(
                    parsed
                )
            ) {

                historyEntries =
                    parsed;

            } else {

                historyEntries = [];

            }

        } catch (error) {

            console.warn(
                "[History] Could not load history.",
                error
            );


            historyEntries = [];

        }

    }


    /* =====================================================
       SAVE HISTORY
       ===================================================== */

    function saveHistory() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    historyEntries
                )
            );

        } catch (error) {

            console.warn(
                "[History] Could not save history.",
                error
            );

        }

    }


    /* =====================================================
       ADD HISTORY ENTRY
       ===================================================== */

    function addEntry(site) {

        if (!site) {
            return;
        }


        /*
           Browser sends us a normalized history
           record.

           We still support a raw website object
           for backwards compatibility.
        */

        const entry = {

            id:
                site.id ||
                site.siteId ||
                site.slug ||
                site.url ||
                site.title ||
                Date.now(),

            title:
                site.title ||
                site.name ||
                site.url ||
                "Unknown Website",

            url:
                site.url ||
                site.address ||
                site.href ||
                "",

            timestamp:
                site.timestamp ||
                Date.now()

        };


        if (!entry.url) {
            return;
        }


        /*
           If the same website is visited again,
           remove the previous copy first.
        */

        historyEntries =
            historyEntries.filter(
                function (existing) {

                    return (
                        existing.id !==
                        entry.id
                    );

                }
            );


        /*
           Newest entries appear first.
        */

        historyEntries.unshift(
            entry
        );


        /*
           Keep the history manageable.
        */

        if (
            historyEntries.length >
            50
        ) {

            historyEntries =
                historyEntries.slice(
                    0,
                    50
                );

        }


        saveHistory();
        renderHistory();


        document.dispatchEvent(
            new CustomEvent(
                "historyUpdated",
                {
                    detail:
                        entry
                }
            )
        );

    }


    /* =====================================================
       RENDER HISTORY
       ===================================================== */

    function renderHistory() {

        if (!historyList) {
            return;
        }


        historyList.innerHTML =
            "";


        if (!historyEntries.length) {

            const empty =
                document.createElement(
                    "div"
                );


            empty.className =
                "history-empty";


            empty.textContent =
                "No browsing history.";


            historyList.appendChild(
                empty
            );


            updateCount();

            return;

        }


        historyEntries.forEach(
            function (entry) {

                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "history-entry";


                item.dataset.url =
                    entry.url;


                const title =
                    document.createElement(
                        "div"
                    );


                title.className =
                    "history-entry-title";


                title.textContent =
                    entry.title ||
                    entry.url;


                const url =
                    document.createElement(
                        "div"
                    );


                url.className =
                    "history-entry-url";


                url.textContent =
                    entry.url;


                const time =
                    document.createElement(
                        "div"
                    );


                time.className =
                    "history-entry-time";


                time.textContent =
                    formatTimestamp(
                        entry.timestamp
                    );


                item.appendChild(
                    title
                );

                item.appendChild(
                    url
                );

                item.appendChild(
                    time
                );


                item.addEventListener(
                    "click",
                    function () {

                        openHistoryEntry(
                            entry
                        );

                    }
                );


                historyList.appendChild(
                    item
                );

            }
        );


        updateCount();

    }


    /* =====================================================
       FORMAT TIMESTAMP
       ===================================================== */

    function formatTimestamp(
        timestamp
    ) {

        if (!timestamp) {
            return "";
        }


        const date =
            new Date(
                timestamp
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        return date.toLocaleString();

    }


    /* =====================================================
       UPDATE COUNT
       ===================================================== */

    function updateCount() {

        if (!historyCount) {
            return;
        }


        const count =
            historyEntries.length;


        historyCount.textContent =
            `${count} ${
                count === 1
                    ? "entry"
                    : "entries"
            }`;

    }


    /* =====================================================
       OPEN HISTORY ENTRY
       ===================================================== */

    function openHistoryEntry(
        entry
    ) {

        if (!entry) {
            return;
        }


        if (!entry.url) {
            return;
        }


        /*
           Ask Browser to open the URL.

           Browser listens for this event.
        */

        document.dispatchEvent(
            new CustomEvent(
                "openBrowserUrl",
                {
                    detail: {

                        url:
                            entry.url

                    }

                }
            )
        );


        /*
           Close the History window.
        */

        if (
            typeof WindowManager !==
                "undefined" &&
            typeof WindowManager.close ===
                "function"
        ) {

            WindowManager.close(
                "historyWindow"
            );

        } else if (
            historyWindow
        ) {

            historyWindow.style.display =
                "none";

        }


        playNavigateSound();

    }


    /* =====================================================
       CLEAR HISTORY
       ===================================================== */

    function clearHistory() {

        historyEntries = [];


        saveHistory();
        renderHistory();


        document.dispatchEvent(
            new CustomEvent(
                "historyCleared"
            )
        );


        playDeleteSound();

    }


    /* =====================================================
       OPEN HISTORY WINDOW
       ===================================================== */

    function openHistory() {

        if (!historyWindow) {

            console.warn(
                "[History] #historyWindow not found."
            );

            return;

        }


        if (
            typeof WindowManager !==
                "undefined" &&
            typeof WindowManager.open ===
                "function"
        ) {

            WindowManager.open(
                "historyWindow"
            );

        } else {

            historyWindow.style.display =
                "block";

        }


        renderHistory();

    }


    /* =====================================================
       CLOSE HISTORY WINDOW
       ===================================================== */

    function closeHistory() {

        if (
            typeof WindowManager !==
                "undefined" &&
            typeof WindowManager.close ===
                "function"
        ) {

            WindowManager.close(
                "historyWindow"
            );

            return;

        }


        if (historyWindow) {

            historyWindow.style.display =
                "none";

        }

    }


    /* =====================================================
       SOUND HELPERS
       ===================================================== */

    function playNavigateSound() {

        if (
            typeof SoundSystem !==
                "undefined" &&
            typeof SoundSystem.navigate ===
                "function"
        ) {

            SoundSystem.navigate();

        }

    }


    function playDeleteSound() {

        if (
            typeof SoundSystem !==
                "undefined" &&
            typeof SoundSystem.delete ===
                "function"
        ) {

            SoundSystem.delete();

        }

    }


    /* =====================================================
       BROWSER VISIT EVENT
       ===================================================== */

    document.addEventListener(
        "browserVisited",
        function (event) {

            if (
                event.detail
            ) {

                addEntry(
                    event.detail
                );

            }

        }
    );


    /*
       Backwards compatibility with older
       game systems.
    */

    document.addEventListener(
        "siteVisited",
        function (event) {

            if (
                event.detail
            ) {

                addEntry(
                    event.detail
                );

            }

        }
    );


    /* =====================================================
       CLEAR BUTTON
       ===================================================== */

    if (clearHistoryButton) {

        clearHistoryButton.addEventListener(
            "click",
            clearHistory
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    loadHistory();


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            loadHistory();
            renderHistory();

        }
    );


    /* =====================================================
       PUBLIC API
       ===================================================== */

    const HistoryAPI = {

        init:
            function () {

                loadHistory();
                renderHistory();

            },

        open:
            openHistory,

        close:
            closeHistory,

        add:
            addEntry,

        clear:
            clearHistory,

        render:
            renderHistory,

        getAll:
            function () {

                return [
                    ...historyEntries
                ];

            },

        getCount:
            function () {

                return historyEntries.length;

            }

    };


    /*
       Official Build 3 API.
    */

    window.History =
        HistoryAPI;


    /*
       Backwards compatibility.
    */

    window.HistorySystem =
        HistoryAPI;

    window.HistoryApp =
        HistoryAPI;

    window.BrowserHistory =
        HistoryAPI;


})();