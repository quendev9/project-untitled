// =====================================================
// PROJECT UNTITLED
// APP — FAKE INTERNET BROWSER
// =====================================================

(function () {

    "use strict";

    // =================================================
    // BROWSER STATE
    // =================================================

    const state = {

        currentUrl: "",

        currentPage: null,

        history: [],

        historyIndex: -1,

        initialized: false

    };


    // =================================================
    // ELEMENTS
    // =================================================

    let browserWindow = null;

    let addressBar = null;

    let browserPage = null;

    let backButton = null;

    let forwardButton = null;

    let reloadButton = null;

    let homeButton = null;


    // =================================================
    // DEFAULT HOME PAGE
    // =================================================

    const HOME_URL = "http://www.northridge.local/";


    // =================================================
    // HELPERS
    // =================================================

    function getElement(selectors) {

        for (const selector of selectors) {

            const element =
                document.querySelector(selector);

            if (element) {
                return element;
            }
        }

        return null;
    }


    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function normalizeUrl(url) {

        if (!url) {
            return HOME_URL;
        }

        url = String(url).trim();

        if (!url) {
            return HOME_URL;
        }

        // Already has a protocol.
        if (
            url.startsWith("http://") ||
            url.startsWith("https://")
        ) {
            return url;
        }

        // Fake browser addresses should use HTTP.
        return "http://" + url;
    }


    function getCleanUrl(url) {

        return String(url)
            .replace(/^https?:\/\//i, "")
            .replace(/\/+$/, "");
    }


    // =================================================
    // WEBSITE DATA
    // =================================================

    function getWebsites() {

        /*
         * websites.js should expose the fake websites.
         *
         * We support several possible names so that
         * browser.js isn't tightly coupled to one
         * specific data implementation.
         */

        if (Array.isArray(window.websites)) {
            return window.websites;
        }

        if (Array.isArray(window.Websites)) {
            return window.Websites;
        }

        if (Array.isArray(window.WEBSITES)) {
            return window.WEBSITES;
        }

        if (
            window.WebsiteData &&
            Array.isArray(window.WebsiteData)
        ) {
            return window.WebsiteData;
        }

        return [];
    }


    // =================================================
    // FIND WEBSITE
    // =================================================

    function findWebsite(url) {

        const websites = getWebsites();

        const target =
            getCleanUrl(normalizeUrl(url))
                .toLowerCase();

        for (const site of websites) {

            if (!site) {
                continue;
            }

            const possibleUrls = [

                site.url,

                site.href,

                site.domain,

                site.address

            ];

            for (const siteUrl of possibleUrls) {

                if (!siteUrl) {
                    continue;
                }

                const cleanSiteUrl =
                    getCleanUrl(siteUrl)
                        .toLowerCase();

                if (
                    cleanSiteUrl === target
                ) {
                    return site;
                }
            }
        }

        return null;
    }


    // =================================================
    // FIND WEBSITE BY SEARCH TERM
    // =================================================

    function searchWebsites(query) {

        const websites = getWebsites();

        const search =
            String(query || "")
                .trim()
                .toLowerCase();

        if (!search) {
            return [];
        }

        return websites.filter(site => {

            if (!site) {
                return false;
            }

            const searchableText = [

                site.title,

                site.name,

                site.description,

                site.url,

                site.domain,

                site.category,

                site.content,

                site.keywords

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(search);
        });
    }


    // =================================================
    // UPDATE ADDRESS BAR
    // =================================================

    function updateAddressBar(url) {

        if (!addressBar) {
            return;
        }

        addressBar.value = url;
    }


    // =================================================
    // UPDATE NAVIGATION BUTTONS
    // =================================================

    function updateNavigationButtons() {

        if (backButton) {

            backButton.disabled =
                state.historyIndex <= 0;
        }

        if (forwardButton) {

            forwardButton.disabled =
                state.historyIndex >=
                state.history.length - 1;
        }
    }


    // =================================================
    // RECORD HISTORY
    // =================================================

    function recordHistory(url) {

        if (!url) {
            return;
        }

        /*
         * If the user went backward and then navigates
         * somewhere new, remove the old forward history.
         */

        if (
            state.historyIndex <
            state.history.length - 1
        ) {

            state.history =
                state.history.slice(
                    0,
                    state.historyIndex + 1
                );
        }


        /*
         * Don't create duplicate entries when the
         * browser is already on the same page.
         */

        if (
            state.history.length > 0 &&
            state.history[
                state.history.length - 1
            ] === url
        ) {

            state.historyIndex =
                state.history.length - 1;

            updateNavigationButtons();

            return;
        }


        state.history.push(url);

        state.historyIndex =
            state.history.length - 1;


        updateNavigationButtons();


        /*
         * Tell the history application that a new
         * browser visit occurred.
         */

        document.dispatchEvent(
            new CustomEvent(
                "browserHistoryChanged",
                {
                    detail: {
                        url: url,
                        history:
                            [...state.history]
                    }
                }
            )
        );
    }


    // =================================================
    // SAVE BROWSER HISTORY
    // =================================================

    function saveHistory() {

        try {

            localStorage.setItem(
                "projectUntitledBrowserHistory",
                JSON.stringify(
                    state.history
                )
            );

        } catch (error) {

            console.warn(
                "Could not save browser history.",
                error
            );
        }
    }


    // =================================================
    // LOAD BROWSER HISTORY
    // =================================================

    function loadHistory() {

        try {

            const saved =
                localStorage.getItem(
                    "projectUntitledBrowserHistory"
                );

            if (!saved) {
                return;
            }

            const parsed =
                JSON.parse(saved);

            if (Array.isArray(parsed)) {

                state.history =
                    parsed;

                state.historyIndex =
                    state.history.length - 1;
            }

        } catch (error) {

            console.warn(
                "Could not load browser history.",
                error
            );
        }

        updateNavigationButtons();
    }


    // =================================================
    // PLAY NAVIGATION SOUND
    // =================================================

    function navigationSound() {

        if (
            typeof playSound === "function"
        ) {

            playSound("navigate");
        }
    }


    // =================================================
    // RENDER PAGE
    // =================================================

    function renderPage(site) {

        if (!browserPage) {
            return;
        }

        if (!site) {

            render404(
                state.currentUrl
            );

            return;
        }


        /*
         * Different websites can use different property
         * names depending on how websites.js is written.
         */

        const title =
            site.title ||
            site.name ||
            "Untitled Site";

        const description =
            site.description ||
            "";

        let content =
            site.content ||
            site.html ||
            site.body ||
            "";


        /*
         * If the data contains a complete HTML string,
         * render it directly.
         *
         * Otherwise build a basic old-web page.
         */

        if (
            site.html ||
            site.content
        ) {

            browserPage.innerHTML =
                content;

        } else {

            browserPage.innerHTML = `

                <div class="site-header">

                    <div class="site-title">
                        ${escapeHTML(title)}
                    </div>

                    <div class="site-subtitle">
                        ${escapeHTML(description)}
                    </div>

                </div>

                <div class="web-box">

                    ${escapeHTML(
                        site.text ||
                        description ||
                        "This page contains no information."
                    )}

                </div>

            `;
        }


        /*
         * Some data objects may specify their own title.
         */

        if (site.pageTitle) {

            const titleElement =
                document.createElement("title");

            titleElement.textContent =
                site.pageTitle;
        }


        /*
         * Turn internal fake links into browser
         * navigation instead of letting the real browser
         * leave Project Untitled.
         */

        attachFakeLinks();
    }


    // =================================================
    // 404 PAGE
    // =================================================

    function render404(url) {

        if (!browserPage) {
            return;
        }

        const cleanUrl =
            getCleanUrl(url);

        browserPage.innerHTML = `

            <div class="error-page">

                <div class="error-code">
                    404
                </div>

                <h2>
                    Page Not Found
                </h2>

                <p>
                    The requested page could not be
                    located on this network.
                </p>

                <p>
                    <strong>
                        ${escapeHTML(cleanUrl)}
                    </strong>
                </p>

                <hr>

                <p>
                    The address may be incorrect,
                    unavailable, or no longer exists.
                </p>

                <p>
                    <a
                        href="#"
                        data-browser-action="home"
                    >
                        Return to the North Ridge homepage
                    </a>
                </p>

            </div>

        `;

        attachFakeLinks();
    }


    // =================================================
    // SEARCH PAGE
    // =================================================

    function renderSearchPage(query) {

        if (!browserPage) {
            return;
        }

        const results =
            searchWebsites(query);


        let resultHTML = "";


        if (results.length === 0) {

            resultHTML = `

                <div class="search-result">

                    <h3>
                        No results found
                    </h3>

                    <p>
                        No pages matched
                        "<strong>
                            ${escapeHTML(query)}
                        </strong>".
                    </p>

                </div>

            `;

        } else {

            results.forEach(site => {

                const title =
                    site.title ||
                    site.name ||
                    "Unknown Site";

                const url =
                    site.url ||
                    site.domain ||
                    "#";

                const description =
                    site.description ||
                    site.text ||
                    "No description available.";


                resultHTML += `

                    <div class="search-result">

                        <h3>

                            <a
                                href="#"
                                class="fake-link"
                                data-browser-url="${escapeHTML(
                                    normalizeUrl(url)
                                )}"
                            >
                                ${escapeHTML(title)}
                            </a>

                        </h3>

                        <div>
                            <small>
                                ${escapeHTML(
                                    normalizeUrl(url)
                                )}
                            </small>
                        </div>

                        <p>
                            ${escapeHTML(description)}
                        </p>

                    </div>

                `;
            });
        }


        browserPage.innerHTML = `

            <div class="search-logo">
                NORTH SEARCH
            </div>

            <div class="search-area">

                <input
                    id="browserSearchInput"
                    type="text"
                    value="${escapeHTML(query)}"
                    autocomplete="off"
                >

                <button
                    id="browserSearchButton"
                    type="button"
                >
                    Search
                </button>

            </div>

            <div>

                <strong>
                    Search results for:
                </strong>

                "${escapeHTML(query)}"

            </div>

            <br>

            ${resultHTML}

        `;


        const searchInput =
            document.getElementById(
                "browserSearchInput"
            );

        const searchButton =
            document.getElementById(
                "browserSearchButton"
            );


        if (searchButton) {

            searchButton.addEventListener(
                "click",
                function () {

                    performSearch(
                        searchInput
                            ? searchInput.value
                            : ""
                    );
                }
            );
        }


        if (searchInput) {

            searchInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        performSearch(
                            searchInput.value
                        );
                    }
                }
            );

            setTimeout(() => {

                searchInput.focus();

            }, 0);
        }


        attachFakeLinks();
    }


    // =================================================
    // PERFORM SEARCH
    // =================================================

    function performSearch(query) {

        query =
            String(query || "")
                .trim();

        if (!query) {
            return;
        }


        const searchUrl =
            "http://northsearch.local/search?q=" +
            encodeURIComponent(query);


        state.currentUrl =
            searchUrl;


        updateAddressBar(
            searchUrl
        );


        recordHistory(
            searchUrl
        );

        saveHistory();

        navigationSound();


        renderSearchPage(
            query
        );
    }


    // =================================================
    // ATTACH FAKE LINKS
    // =================================================

    function attachFakeLinks() {

        if (!browserPage) {
            return;
        }


        const links =
            browserPage.querySelectorAll(
                "[data-browser-url]"
            );


        links.forEach(link => {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const url =
                        link.dataset.browserUrl;

                    if (url) {

                        navigateTo(
                            url
                        );
                    }
                }
            );
        });


        const homeLinks =
            browserPage.querySelectorAll(
                "[data-browser-action='home']"
            );


        homeLinks.forEach(link => {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    goHome();
                }
            );
        });
    }


    // =================================================
    // NAVIGATE TO URL
    // =================================================

    function navigateTo(
        url,
        options = {}
    ) {

        url =
            normalizeUrl(url);


        /*
         * Handle search URLs.
         */

        if (
            url.startsWith(
                "http://northsearch.local/search"
            )
        ) {

            try {

                const parsed =
                    new URL(url);

                const query =
                    parsed.searchParams.get(
                        "q"
                    );

                state.currentUrl =
                    url;

                updateAddressBar(url);

                if (!options.fromHistory) {

                    recordHistory(url);

                    saveHistory();
                }

                navigationSound();

                renderSearchPage(
                    query || ""
                );

                return;
            }

            catch (error) {

                console.warn(
                    "Could not parse search URL.",
                    error
                );
            }
        }


        const site =
            findWebsite(url);


        state.currentUrl =
            url;


        updateAddressBar(
            url
        );


        if (!options.fromHistory) {

            recordHistory(
                url
            );

            saveHistory();
        }


        navigationSound();


        state.currentPage =
            site;


        renderPage(
            site
        );


        /*
         * Tell other systems that the browser changed.
         */

        document.dispatchEvent(
            new CustomEvent(
                "browserNavigated",
                {
                    detail: {
                        url: url,
                        site: site
                    }
                }
            )
        );
    }


    // =================================================
    // HOME
    // =================================================

    function goHome() {

        navigateTo(
            HOME_URL
        );
    }


    // =================================================
    // BACK
    // =================================================

    function goBack() {

        if (
            state.historyIndex <= 0
        ) {
            return;
        }


        state.historyIndex--;


        const url =
            state.history[
                state.historyIndex
            ];


        navigateTo(
            url,
            {
                fromHistory: true
            }
        );


        updateNavigationButtons();
    }


    // =================================================
    // FORWARD
    // =================================================

    function goForward() {

        if (
            state.historyIndex >=
            state.history.length - 1
        ) {
            return;
        }


        state.historyIndex++;


        const url =
            state.history[
                state.historyIndex
            ];


        navigateTo(
            url,
            {
                fromHistory: true
            }
        );


        updateNavigationButtons();
    }


    // =================================================
    // RELOAD
    // =================================================

    function reload() {

        if (!state.currentUrl) {
            goHome();
            return;
        }


        const site =
            findWebsite(
                state.currentUrl
            );


        if (
            state.currentUrl.startsWith(
                "http://northsearch.local/search"
            )
        ) {

            try {

                const parsed =
                    new URL(
                        state.currentUrl
                    );

                renderSearchPage(
                    parsed.searchParams.get(
                        "q"
                    ) || ""
                );

            } catch (error) {

                render404(
                    state.currentUrl
                );
            }

            return;
        }


        renderPage(
            site
        );


        navigationSound();
    }


    // =================================================
    // ADDRESS BAR SUBMIT
    // =================================================

    function submitAddress() {

        if (!addressBar) {
            return;
        }


        let value =
            addressBar.value.trim();


        if (!value) {
            return;
        }


        /*
         * If the user types something that doesn't look
         * like a URL, treat it as a search.
         */

        const looksLikeUrl =
            value.includes(".") ||
            value.startsWith("http://") ||
            value.startsWith("https://");


        if (!looksLikeUrl) {

            performSearch(
                value
            );

            return;
        }


        navigateTo(
            value
        );
    }


    // =================================================
    // OPEN BROWSER
    // =================================================

    function openBrowser(
        url = null
    ) {

        if (!browserWindow) {
            initialize();
        }


        if (!browserWindow) {
            console.warn(
                "Browser window not found."
            );

            return;
        }


        /*
         * Use the window manager if available.
         */

        if (
            typeof windowManager !==
            "undefined" &&
            windowManager.open
        ) {

            windowManager.open(
                browserWindow
            );

        } else {

            browserWindow.style.display =
                "block";
        }


        if (url) {

            navigateTo(
                url
            );

        } else if (!state.currentUrl) {

            goHome();

        } else {

            updateAddressBar(
                state.currentUrl
            );

            const site =
                findWebsite(
                    state.currentUrl
                );

            renderPage(
                site
            );
        }
    }


    // =================================================
    // INITIALIZE
    // =================================================

    function initialize() {

        if (state.initialized) {
            return;
        }


        state.initialized = true;


        // ---------------------------------------------
        // FIND BROWSER WINDOW
        // ---------------------------------------------

        browserWindow =
            getElement([
                "#browserWindow",
                ".browser-window"
            ]);


        if (!browserWindow) {

            console.warn(
                "Browser window element not found."
            );

            return;
        }


        // ---------------------------------------------
        // FIND CONTROLS
        // ---------------------------------------------

        addressBar =
            getElement([
                "#browserAddress",
                "#addressBar",
                "#browserUrl",
                ".browser-toolbar input"
            ]);


        browserPage =
            getElement([
                "#browserPage",
                ".browser-page"
            ]);


        const buttons =
            browserWindow.querySelectorAll(
                ".browser-toolbar button"
            );


        /*
         * First four toolbar buttons are expected to
         * be:
         *
         * Back
         * Forward
         * Reload
         * Home
         *
         * We also support IDs when available.
         */

        backButton =
            getElement([
                "#browserBack",
                "#backButton"
            ]);


        forwardButton =
            getElement([
                "#browserForward",
                "#forwardButton"
            ]);


        reloadButton =
            getElement([
                "#browserReload",
                "#reloadButton"
            ]);


        homeButton =
            getElement([
                "#browserHome",
                "#homeButton"
            ]);


        if (!backButton && buttons[0]) {
            backButton = buttons[0];
        }

        if (!forwardButton && buttons[1]) {
            forwardButton = buttons[1];
        }

        if (!reloadButton && buttons[2]) {
            reloadButton = buttons[2];
        }

        if (!homeButton && buttons[3]) {
            homeButton = buttons[3];
        }


        // ---------------------------------------------
        // BUTTON EVENTS
        // ---------------------------------------------

        if (backButton) {

            backButton.addEventListener(
                "click",
                goBack
            );
        }


        if (forwardButton) {

            forwardButton.addEventListener(
                "click",
                goForward
            );
        }


        if (reloadButton) {

            reloadButton.addEventListener(
                "click",
                reload
            );
        }


        if (homeButton) {

            homeButton.addEventListener(
                "click",
                goHome
            );
        }


        // ---------------------------------------------
        // ADDRESS BAR
        // ---------------------------------------------

        if (addressBar) {

            addressBar.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        submitAddress();
                    }
                }
            );
        }


        // ---------------------------------------------
        // LOAD SAVED HISTORY
        // ---------------------------------------------

        loadHistory();


        // ---------------------------------------------
        // INITIAL PAGE
        // ---------------------------------------------

        state.currentUrl =
            HOME_URL;


        updateAddressBar(
            HOME_URL
        );


        renderPage(
            findWebsite(
                HOME_URL
            )
        );


        // ---------------------------------------------
        // GLOBAL BROWSER EVENTS
        // ---------------------------------------------

        document.addEventListener(
            "openBrowserUrl",
            function (event) {

                if (
                    event.detail &&
                    event.detail.url
                ) {

                    openBrowser(
                        event.detail.url
                    );
                }
            }
        );


        document.addEventListener(
            "browserGoBack",
            goBack
        );


        document.addEventListener(
            "browserGoForward",
            goForward
        );


        document.addEventListener(
            "browserGoHome",
            goHome
        );


        document.addEventListener(
            "browserReload",
            reload
        );


        updateNavigationButtons();
    }


    // =================================================
    // DOM READY
    // =================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();
    }


    // =================================================
    // PUBLIC BROWSER API
    // =================================================

    window.BrowserApp = {

        open: openBrowser,

        navigate: navigateTo,

        back: goBack,

        forward: goForward,

        home: goHome,

        reload: reload,

        search: performSearch,

        getCurrentUrl: function () {

            return state.currentUrl;
        },

        getHistory: function () {

            return [
                ...state.history
            ];
        },

        getCurrentPage: function () {

            return state.currentPage;
        }

    };


})();