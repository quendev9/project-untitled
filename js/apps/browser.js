/* =========================================================
   PROJECT UNTITLED
   APPLICATION — BROWSER
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    let browserWindow = null;
    let addressBar = null;
    let browserPage = null;

    let backButton = null;
    let forwardButton = null;
    let refreshButton = null;
    let homeButton = null;
    let goButton = null;


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const HOME_URL =
        "http://www.northridge.local/";


    const HISTORY_STORAGE_KEY =
        "projectUntitledBrowserHistory";


    /* =====================================================
       STATE
       ===================================================== */

    let currentUrl =
        HOME_URL;

    let currentPage =
        null;


    /*
       This is the Browser's navigation history.

       It is NOT the same thing as the
       Browser History application.

       Browser history:
       - Back
       - Forward

       History application:
       - visited websites
       - persistent records
    */

    let navigationHistory = [];

    let historyIndex = -1;

    let initialized = false;


    /* =====================================================
       WEBSITE DATA
       ===================================================== */

    function getWebsites() {

        if (
            Array.isArray(
                window.websites
            )
        ) {

            return window.websites;

        }


        if (
            Array.isArray(
                window.Websites
            )
        ) {

            return window.Websites;

        }


        if (
            Array.isArray(
                window.WEBSITES
            )
        ) {

            return window.WEBSITES;

        }


        if (
            Array.isArray(
                window.WebsiteData
            )
        ) {

            return window.WebsiteData;

        }


        return [];

    }


    /* =====================================================
       NORMALIZE URL
       ===================================================== */

    function normalizeUrl(url) {

        if (!url) {
            return "";
        }


        let normalized =
            String(url)
                .trim()
                .toLowerCase();


        normalized =
            normalized.replace(
                /\/+$/,
                ""
            );


        return normalized;

    }


    /* =====================================================
       FIND WEBSITE
       ===================================================== */

    function findWebsite(url) {

        const normalizedUrl =
            normalizeUrl(url);


        const websites =
            getWebsites();


        return (
            websites.find(
                function (site) {

                    if (!site) {
                        return false;
                    }


                    const candidates = [

                        site.url,
                        site.href,
                        site.domain,
                        site.address

                    ];


                    return candidates.some(
                        function (candidate) {

                            return (
                                normalizeUrl(
                                    candidate
                                ) ===
                                normalizedUrl
                            );

                        }
                    );

                }
            ) ||
            null
        );

    }


    /* =====================================================
       SEARCH WEBSITES
       ===================================================== */

    function searchWebsites(query) {

        const websites =
            getWebsites();


        const search =
            String(query || "")
                .trim()
                .toLowerCase();


        if (!search) {
            return [];
        }


        return websites.filter(
            function (site) {

                if (!site) {
                    return false;
                }


                const searchable = [

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


                return searchable.includes(
                    search
                );

            }
        );

    }


    /* =====================================================
       LOAD BROWSER HISTORY
       ===================================================== */

    function loadNavigationHistory() {

        try {

            const stored =
                localStorage.getItem(
                    HISTORY_STORAGE_KEY
                );


            if (!stored) {

                navigationHistory = [];
                historyIndex = -1;

                return;

            }


            const parsed =
                JSON.parse(stored);


            if (
                Array.isArray(parsed)
            ) {

                navigationHistory =
                    parsed;

                historyIndex =
                    navigationHistory.length - 1;

            } else {

                navigationHistory = [];
                historyIndex = -1;

            }

        } catch (error) {

            console.warn(
                "[Browser] Could not load navigation history.",
                error
            );


            navigationHistory = [];
            historyIndex = -1;

        }

    }


    /* =====================================================
       SAVE BROWSER NAVIGATION HISTORY
       ===================================================== */

    function saveNavigationHistory() {

        try {

            localStorage.setItem(
                HISTORY_STORAGE_KEY,
                JSON.stringify(
                    navigationHistory
                )
            );

        } catch (error) {

            console.warn(
                "[Browser] Could not save navigation history.",
                error
            );

        }

    }


    /* =====================================================
       RECORD NAVIGATION
       ===================================================== */

    function recordNavigation(url) {

        if (!url) {
            return;
        }


        /*
           If we navigated after pressing Back,
           discard the old Forward history.
        */

        if (
            historyIndex <
            navigationHistory.length - 1
        ) {

            navigationHistory =
                navigationHistory.slice(
                    0,
                    historyIndex + 1
                );

        }


        navigationHistory.push(
            url
        );


        /*
           Keep the Browser navigation history
           reasonably small.
        */

        if (
            navigationHistory.length >
            100
        ) {

            navigationHistory.shift();

        }


        historyIndex =
            navigationHistory.length - 1;


        saveNavigationHistory();


        document.dispatchEvent(
            new CustomEvent(
                "browserHistoryChanged",
                {
                    detail: {

                        url,

                        history:
                            [
                                ...navigationHistory
                            ]

                    }

                }
            )
        );

    }


    /* =====================================================
       PLAY NAVIGATION SOUND
       ===================================================== */

    function navigationSound() {

        if (
            typeof SoundSystem !==
                "undefined" &&
            typeof SoundSystem.navigate ===
                "function"
        ) {

            SoundSystem.navigate();

        }

    }


    /* =====================================================
       CREATE HISTORY RECORD
       ===================================================== */

    function createHistoryRecord(
        url,
        site
    ) {

        return {

            id:
                site?.id ||
                site?.siteId ||
                site?.slug ||
                url,

            title:
                site?.title ||
                site?.name ||
                url,

            url,

            site:
                site || null

        };

    }


    /* =====================================================
       EMIT WEBSITE VISIT
       ===================================================== */

    function emitWebsiteVisit(
        url,
        site
    ) {

        const detail =
            createHistoryRecord(
                url,
                site
            );


        /*
           This is the event HistorySystem
           listens for.
        */

        document.dispatchEvent(
            new CustomEvent(
                "browserVisited",
                {
                    detail
                }
            )
        );


        /*
           Keep the older event too.
           Other future systems may use it.
        */

        document.dispatchEvent(
            new CustomEvent(
                "browserNavigated",
                {
                    detail: {

                        url,

                        site

                    }

                }
            )
        );

    }


    /* =====================================================
       RENDER WEBSITE
       ===================================================== */

    function renderPage(site) {

        if (!browserPage) {
            return;
        }


        currentPage =
            site || null;


        /*
           A website can provide its own HTML.
        */

        if (
            site &&
            typeof site.html ===
                "string"
        ) {

            browserPage.innerHTML =
                site.html;


            attachFakeLinks();


            return;

        }


        /*
           Some website data may use
           "content" instead.
        */

        if (
            site &&
            typeof site.content ===
                "string"
        ) {

            browserPage.innerHTML = `

                <div class="browser-site">

                    <h1>
                        ${escapeHtml(
                            site.title ||
                            site.name ||
                            "Untitled Website"
                        )}
                    </h1>

                    <div>
                        ${site.content}
                    </div>

                </div>

            `;


            attachFakeLinks();


            return;

        }


        /*
           Generic fallback website.
        */

        if (site) {

            browserPage.innerHTML = `

                <div class="browser-site">

                    <h1>
                        ${escapeHtml(
                            site.title ||
                            site.name ||
                            "Untitled Website"
                        )}
                    </h1>

                    <p>
                        ${
                            escapeHtml(
                                site.description ||
                                "No additional information is available."
                            )
                        }
                    </p>

                </div>

            `;


            attachFakeLinks();


            return;

        }


        render404();

    }


    /* =====================================================
       RENDER HOME PAGE
       ===================================================== */

    function renderHomePage() {

        const homeSite =
            findWebsite(
                HOME_URL
            );


        if (homeSite) {

            renderPage(
                homeSite
            );

            return;

        }


        if (!browserPage) {
            return;
        }


        browserPage.innerHTML = `

            <div class="browser-site browser-home">

                <h1>
                    NORTH RIDGE NETWORK
                </h1>

                <p>
                    Welcome to the North Ridge
                    local network.
                </p>

                <p>
                    Enter a website address
                    or search the network.
                </p>

            </div>

        `;

    }


    /* =====================================================
       RENDER 404
       ===================================================== */

    function render404() {

        if (!browserPage) {
            return;
        }


        browserPage.innerHTML = `

            <div class="browser-site browser-404">

                <h1>
                    404
                </h1>

                <p>
                    Website not found.
                </p>

                <p>
                    The requested address does not
                    exist on the North Ridge network.
                </p>

            </div>

        `;

    }


    /* =====================================================
       RENDER SEARCH
       ===================================================== */

    function renderSearchResults(
        query,
        results
    ) {

        if (!browserPage) {
            return;
        }


        let html = `

            <div class="browser-site browser-search">

                <h1>
                    NORTHSEARCH
                </h1>

                <p>
                    Search results for:
                    <strong>
                        ${escapeHtml(query)}
                    </strong>
                </p>

                <hr>

        `;


        if (!results.length) {

            html += `

                <p>
                    No results found.
                </p>

            `;

        } else {

            results.forEach(
                function (site) {

                    const title =
                        site.title ||
                        site.name ||
                        site.url ||
                        "Untitled";


                    const url =
                        site.url ||
                        site.href ||
                        site.address ||
                        "";


                    html += `

                        <div
                            class="browser-search-result"
                        >

                            <a
                                href="${escapeHtml(url)}"
                                data-internal-link="true"
                            >
                                ${escapeHtml(title)}
                            </a>

                            <p>
                                ${
                                    escapeHtml(
                                        site.description ||
                                        ""
                                    )
                                }
                            </p>

                        </div>

                    `;

                }
            );

        }


        html += `

            </div>

        `;


        browserPage.innerHTML =
            html;


        attachFakeLinks();

    }


    /* =====================================================
       PERFORM SEARCH
       ===================================================== */

    function performSearch(query) {

        const search =
            String(query || "")
                .trim();


        if (!search) {
            return;
        }


        const results =
            searchWebsites(
                search
            );


        const searchUrl =
            `http://northsearch.local/search?q=${encodeURIComponent(search)}`;


        currentUrl =
            searchUrl;


        if (addressBar) {

            addressBar.value =
                searchUrl;

        }


        recordNavigation(
            searchUrl
        );


        renderSearchResults(
            search,
            results
        );


        navigationSound();


        document.dispatchEvent(
            new CustomEvent(
                "browserNavigated",
                {
                    detail: {

                        url:
                            searchUrl,

                        site:
                            null,

                        query:
                            search

                    }

                }
            )
        );

    }


    /* =====================================================
       NAVIGATE
       ===================================================== */

    function navigateTo(
        url,
        options
    ) {

        const settings =
            options || {};


        if (!url) {
            return;
        }


        let targetUrl =
            String(url).trim();


        /*
           Allow users to type a bare
           north ridge address.
        */

        if (
            !targetUrl.includes("://")
        ) {

            targetUrl =
                `http://${targetUrl}`;

        }


        /*
           NORTHSEARCH
        */

        if (
            targetUrl.startsWith(
                "http://northsearch.local/search"
            )
        ) {

            const queryMatch =
                targetUrl.match(
                    /[?&]q=([^&]+)/i
                );


            const query =
                queryMatch
                    ? decodeURIComponent(
                        queryMatch[1]
                    )
                    : "";


            if (addressBar) {

                addressBar.value =
                    targetUrl;

            }


            currentUrl =
                targetUrl;


            if (
                !settings.fromHistory
            ) {

                recordNavigation(
                    targetUrl
                );

            }


            renderSearchResults(
                query,
                searchWebsites(query)
            );


            navigationSound();


            return;

        }


        const site =
            findWebsite(
                targetUrl
            );


        currentUrl =
            targetUrl;


        if (addressBar) {

            addressBar.value =
                targetUrl;

        }


        if (
            !settings.fromHistory
        ) {

            recordNavigation(
                targetUrl
            );

        }


        renderPage(
            site
        );


        navigationSound();


        /*
           Tell the History application
           that the user visited a site.
        */

        emitWebsiteVisit(
            targetUrl,
            site
        );

    }


    /* =====================================================
       GO HOME
       ===================================================== */

    function goHome() {

        navigateTo(
            HOME_URL
        );

    }


    /* =====================================================
       GO BACK
       ===================================================== */

    function goBack() {

        if (
            historyIndex <= 0
        ) {

            return;

        }


        historyIndex--;


        const url =
            navigationHistory[
                historyIndex
            ];


        navigateTo(
            url,
            {
                fromHistory:
                    true
            }
        );


        saveNavigationHistory();

    }


    /* =====================================================
       GO FORWARD
       ===================================================== */

    function goForward() {

        if (
            historyIndex >=
            navigationHistory.length - 1
        ) {

            return;

        }


        historyIndex++;


        const url =
            navigationHistory[
                historyIndex
            ];


        navigateTo(
            url,
            {
                fromHistory:
                    true
            }
        );


        saveNavigationHistory();

    }


    /* =====================================================
       RELOAD
       ===================================================== */

    function reload() {

        if (
            currentUrl ===
            HOME_URL
        ) {

            renderHomePage();

            return;

        }


        navigateTo(
            currentUrl,
            {
                fromHistory:
                    true
            }
        );

    }


    /* =====================================================
       SUBMIT ADDRESS
       ===================================================== */

    function submitAddress() {

        if (!addressBar) {
            return;
        }


        const value =
            addressBar.value.trim();


        if (!value) {
            return;
        }


        /*
           If the user typed something that looks
           like a search rather than a URL,
           send it to NorthSearch.
        */

        if (
            !value.includes(".local") &&
            !value.includes("://")
        ) {

            performSearch(
                value
            );


            return;

        }


        navigateTo(
            value
        );

    }


    /* =====================================================
       ATTACH FAKE LINKS
       ===================================================== */

    function attachFakeLinks() {

        if (!browserPage) {
            return;
        }


        const links =
            browserPage.querySelectorAll(
                "a"
            );


        links.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        if (!href) {
                            return;
                        }


                        /*
                           We own fake/internal links.
                        */

                        if (
                            link.dataset.internalLink ===
                                "true" ||
                            href.startsWith(
                                "http://"
                            ) ||
                            href.startsWith(
                                "https://"
                            )
                        ) {

                            event.preventDefault();


                            navigateTo(
                                href
                            );

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHtml(value) {

        return String(
            value ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* =====================================================
       OPEN BROWSER
       ===================================================== */

    function openBrowser(
        url
    ) {

        if (!initialized) {

            initialize();

        }


        if (!browserWindow) {

            console.warn(
                "[Browser] Browser window not found."
            );

            return;

        }


        /*
           IMPORTANT:

           The old code used:

               windowManager.open(browserWindow)

           That object does not exist.

           Project Untitled's actual manager is:

               WindowManager.open("browserWindow")
        */

        if (
            typeof WindowManager !==
                "undefined" &&
            typeof WindowManager.open ===
                "function"
        ) {

            WindowManager.open(
                "browserWindow"
            );

        } else {

            browserWindow.style.display =
                "block";

        }


        if (
            typeof url ===
            "string" &&
            url.trim()
        ) {

            navigateTo(
                url
            );

        } else if (
            currentUrl ===
            HOME_URL
        ) {

            renderHomePage();

        }

    }


    /* =====================================================
       OPEN URL FROM HISTORY
       ===================================================== */

    function handleHistoryOpen(
        event
    ) {

        const detail =
            event.detail;


        if (!detail) {
            return;
        }


        const url =
            typeof detail ===
            "string"
                ? detail
                : detail.url;


        if (!url) {
            return;
        }


        openBrowser(
            url
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initialize() {

        if (initialized) {
            return;
        }


        browserWindow =
            document.getElementById(
                "browserWindow"
            );

        addressBar =
            document.getElementById(
                "browserAddress"
            );

        browserPage =
            document.getElementById(
                "browserPage"
            );


        backButton =
            document.getElementById(
                "browserBack"
            );

        forwardButton =
            document.getElementById(
                "browserForward"
            );

        refreshButton =
            document.getElementById(
                "browserRefresh"
            );

        homeButton =
            document.getElementById(
                "browserHome"
            );

        goButton =
            document.getElementById(
                "browserGo"
            );


        if (!browserWindow) {

            console.warn(
                "[Browser] #browserWindow not found."
            );

            return;

        }


        loadNavigationHistory();


        /*
           Start at the North Ridge home page.
        */

        currentUrl =
            HOME_URL;


        if (addressBar) {

            addressBar.value =
                HOME_URL;

        }


        renderHomePage();


        /* =================================================
           TOOLBAR EVENTS
           ================================================= */

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


        if (refreshButton) {

            refreshButton.addEventListener(
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


        if (goButton) {

            goButton.addEventListener(
                "click",
                submitAddress
            );

        }


        if (addressBar) {

            addressBar.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        submitAddress();

                    }

                }
            );

        }


        /*
           History application can ask the
           Browser to open a specific URL.
        */

        document.addEventListener(
            "openBrowserUrl",
            handleHistoryOpen
        );


        initialized = true;


        console.log(
            "[Browser] Initialized."
        );

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    const BrowserAPI = {

        init:
            initialize,

        open:
            openBrowser,

        navigate:
            navigateTo,

        back:
            goBack,

        forward:
            goForward,

        home:
            goHome,

        reload:
            reload,

        search:
            performSearch,

        getCurrentUrl:
            function () {

                return currentUrl;

            },

        getHistory:
            function () {

                return [
                    ...navigationHistory
                ];

            },

        getCurrentPage:
            function () {

                return currentPage;

            }

    };


    /*
       Primary API.
    */

    window.Browser =
        BrowserAPI;


    /*
       Backwards compatibility.

       Anything from the previous Build 2 code
       still calling BrowserApp will continue working.
    */

    window.BrowserApp =
        BrowserAPI;


    /* =====================================================
       AUTOMATIC INITIALIZATION
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );


})();