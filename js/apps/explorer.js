// =====================================================
// PROJECT UNTITLED
// APP — FILE EXPLORER
// =====================================================

(function () {

    "use strict";


    // =================================================
    // ELEMENTS
    // =================================================

    const explorerWindow =
        document.getElementById("explorerWindow");

    const fileGrid =
        document.getElementById("fileGrid");

    const pathDisplay =
        document.getElementById("pathDisplay");

    const backButton =
        document.getElementById("explorerBack");

    const forwardButton =
        document.getElementById("explorerForward");

    const upButton =
        document.getElementById("explorerUp");


    // =================================================
    // STATE
    // =================================================

    const ROOT_PATH = "C:\\";

    let currentPath = ROOT_PATH;

    let navigationHistory = [
        ROOT_PATH
    ];

    let historyIndex = 0;


    // =================================================
    // VALIDATION
    // =================================================

    if (!explorerWindow) {

        console.warn(
            "Explorer: #explorerWindow was not found."
        );

        return;
    }

    if (!fileGrid) {

        console.warn(
            "Explorer: #fileGrid was not found."
        );

        return;
    }


    // =================================================
    // SOUND HELPER
    // =================================================

    function sound(name) {

        if (
            typeof playSound === "function"
        ) {

            playSound(name);
        }
    }


    // =================================================
    // PATH HELPERS
    // =================================================

    function normalizePath(path) {

        if (
            typeof path !== "string" ||
            path.trim() === ""
        ) {

            return ROOT_PATH;
        }

        path = path.trim();

        // Convert forward slashes to
        // Windows-style backslashes.

        path = path.replace(/\//g, "\\");


        // Make sure the root stays exactly C:\

        if (
            path === "C:" ||
            path === "C:\\"
        ) {

            return ROOT_PATH;
        }


        // Remove trailing slash.

        while (
            path.length > 3 &&
            path.endsWith("\\")
        ) {

            path = path.slice(0, -1);
        }


        return path;
    }


    function getParentPath(path) {

        path = normalizePath(path);

        if (path === ROOT_PATH) {
            return ROOT_PATH;
        }


        const lastSlash =
            path.lastIndexOf("\\");


        if (lastSlash <= 2) {
            return ROOT_PATH;
        }


        return path.substring(
            0,
            lastSlash
        );
    }


    function getItemPath(item) {

        if (!item) {
            return ROOT_PATH;
        }


        return normalizePath(
            item.path ||
            item.location ||
            ROOT_PATH
        );
    }


    function getItemFullPath(item) {

        if (!item) {
            return ROOT_PATH;
        }


        if (item.fullPath) {

            return normalizePath(
                item.fullPath
            );
        }


        if (item.target) {

            return normalizePath(
                item.target
            );
        }


        const name =
            item.name || "";


        if (!name) {
            return currentPath;
        }


        if (currentPath === ROOT_PATH) {

            return normalizePath(
                ROOT_PATH + name
            );
        }


        return normalizePath(
            currentPath +
            "\\" +
            name
        );
    }


    // =================================================
    // DATA
    // =================================================

    function getFiles() {

        if (
            typeof FILES !== "undefined" &&
            Array.isArray(FILES)
        ) {

            return FILES;
        }


        console.warn(
            "Explorer: FILES data was not found."
        );

        return [];
    }


    // =================================================
    // GET CURRENT FOLDER CONTENTS
    // =================================================

    function getCurrentItems() {

        const files =
            getFiles();


        return files.filter(
            function (item) {

                if (!item) {
                    return false;
                }


                return (
                    getItemPath(item) ===
                    currentPath
                );
            }
        );
    }


    // =================================================
    // WINDOW
    // =================================================

    function openExplorer() {

        if (
            typeof WindowManager !== "undefined" &&
            typeof WindowManager.open === "function"
        ) {

            WindowManager.open(
                "explorerWindow"
            );

        } else {

            explorerWindow.style.display =
                "block";
        }


        render();

        updateNavigationButtons();

        sound("open");
    }


    function closeExplorer() {

        if (
            typeof WindowManager !== "undefined" &&
            typeof WindowManager.close === "function"
        ) {

            WindowManager.close(
                "explorerWindow"
            );

        } else {

            explorerWindow.style.display =
                "none";
        }


        sound("close");
    }


    // =================================================
    // NAVIGATION
    // =================================================

    function navigateTo(
        path,
        addToHistory = true
    ) {

        path =
            normalizePath(path);


        currentPath =
            path;


        if (addToHistory) {

            navigationHistory =
                navigationHistory.slice(
                    0,
                    historyIndex + 1
                );


            navigationHistory.push(
                path
            );


            historyIndex =
                navigationHistory.length - 1;
        }


        render();

        updateNavigationButtons();

        sound("navigate");
    }


    function goBack() {

        if (historyIndex <= 0) {
            return;
        }


        historyIndex--;


        currentPath =
            navigationHistory[
                historyIndex
            ];


        render();

        updateNavigationButtons();

        sound("navigate");
    }


    function goForward() {

        if (
            historyIndex >=
            navigationHistory.length - 1
        ) {

            return;
        }


        historyIndex++;


        currentPath =
            navigationHistory[
                historyIndex
            ];


        render();

        updateNavigationButtons();

        sound("navigate");
    }


    function goUp() {

        if (
            currentPath === ROOT_PATH
        ) {

            return;
        }


        const parentPath =
            getParentPath(
                currentPath
            );


        navigateTo(
            parentPath
        );
    }


    // =================================================
    // NAVIGATION BUTTONS
    // =================================================

    function updateNavigationButtons() {

        if (backButton) {

            backButton.disabled =
                historyIndex <= 0;
        }


        if (forwardButton) {

            forwardButton.disabled =
                historyIndex >=
                navigationHistory.length - 1;
        }


        if (upButton) {

            upButton.disabled =
                currentPath === ROOT_PATH;
        }
    }


    // =================================================
    // ICON SYSTEM
    // =================================================

    function createIcon(item) {

        const icon =
            document.createElement("div");


        icon.className =
            "file-icon";


        /*
         * BUILD 3 ICON SYSTEM
         *
         * If the file data provides an icon path,
         * create an actual image.
         *
         * Example:
         *
         * icon: "assets/icons/apps/files/text.png"
         *
         */


        if (
            item.icon &&
            typeof item.icon === "string" &&
            (
                item.icon.includes("/") ||
                item.icon.includes("\\") ||
                item.icon.endsWith(".png") ||
                item.icon.endsWith(".gif") ||
                item.icon.endsWith(".jpg")
            )
        ) {

            const image =
                document.createElement("img");


            image.src =
                item.icon;


            image.alt =
                "";


            image.draggable =
                false;


            icon.appendChild(
                image
            );


            return icon;
        }


        /*
         * Temporary fallback.
         *
         * This means Explorer still works before
         * all the OG pixel-art icons are created.
         */

        const fallback =
            document.createElement("span");


        fallback.textContent =
            getFallbackIcon(item);


        icon.appendChild(
            fallback
        );


        return icon;
    }


    function getFallbackIcon(item) {

        if (!item) {
            return "FILE";
        }


        if (
            item.type === "folder" ||
            item.type === "directory"
        ) {

            return "DIR";
        }


        if (
            item.type === "note" ||
            item.type === "text" ||
            item.type === "txt"
        ) {

            return "TXT";
        }


        if (
            item.type === "website" ||
            item.type === "html"
        ) {

            return "WEB";
        }


        return "FILE";
    }


    // =================================================
    // CREATE FILE ITEM
    // =================================================

    function createFileItem(item) {

        const element =
            document.createElement("div");


        element.className =
            "file-item";


        // ---------------------------------------------
        // ICON
        // ---------------------------------------------

        const icon =
            createIcon(item);


        // ---------------------------------------------
        // NAME
        // ---------------------------------------------

        const name =
            document.createElement("span");


        name.textContent =
            item.name ||
            "Unknown File";


        // ---------------------------------------------
        // BUILD ELEMENT
        // ---------------------------------------------

        element.appendChild(
            icon
        );


        element.appendChild(
            name
        );


        // ---------------------------------------------
        // SINGLE CLICK
        // ---------------------------------------------

        element.addEventListener(
            "click",
            function () {

                sound("click");
            }
        );


        // ---------------------------------------------
        // DOUBLE CLICK
        // ---------------------------------------------

        element.addEventListener(
            "dblclick",
            function () {

                openItem(item);
            }
        );


        return element;
    }


    // =================================================
    // OPEN ITEM
    // =================================================

    function openItem(item) {

        if (!item) {
            return;
        }


        // =============================================
        // FOLDER
        // =============================================

        if (
            item.type === "folder" ||
            item.type === "directory"
        ) {

            const folderPath =
                getItemFullPath(
                    item
                );


            navigateTo(
                folderPath
            );


            return;
        }


        // =============================================
        // TEXT / NOTE
        // =============================================

        if (
            item.type === "note" ||
            item.type === "text" ||
            item.type === "txt"
        ) {

            if (
                typeof openNotepad === "function"
            ) {

                openNotepad(
                    item.id ||
                    item.name
                );

                sound("file");

                return;
            }


            if (
                typeof Notepad !== "undefined" &&
                typeof Notepad.open === "function"
            ) {

                Notepad.open(
                    item.id ||
                    item.name
                );

                sound("file");

                return;
            }


            console.warn(
                "Explorer: Notepad is unavailable."
            );

            sound("error");

            return;
        }


        // =============================================
        // WEBSITE
        // =============================================

        if (
            item.type === "website" ||
            item.type === "html"
        ) {

            const url =
                item.url ||
                item.target;


            if (!url) {

                console.warn(
                    "Explorer: website has no URL.",
                    item
                );

                sound("error");

                return;
            }


            if (
                typeof openBrowser === "function"
            ) {

                openBrowser(
                    url
                );

                sound("file");

                return;
            }


            if (
                typeof Browser !== "undefined" &&
                typeof Browser.open === "function"
            ) {

                Browser.open(
                    url
                );

                sound("file");

                return;
            }


            console.warn(
                "Explorer: Browser is unavailable."
            );

            sound("error");

            return;
        }


        // =============================================
        // UNKNOWN FILE
        // =============================================

        console.log(
            "Explorer: opened item",
            item
        );


        sound("open");
    }


    // =================================================
    // RENDER EXPLORER
    // =================================================

    function render() {

        fileGrid.innerHTML =
            "";


        // ---------------------------------------------
        // UPDATE PATH
        // ---------------------------------------------

        if (pathDisplay) {

            pathDisplay.textContent =
                currentPath;
        }


        // ---------------------------------------------
        // GET ITEMS
        // ---------------------------------------------

        const items =
            getCurrentItems();


        // ---------------------------------------------
        // EMPTY FOLDER
        // ---------------------------------------------

        if (items.length === 0) {

            const empty =
                document.createElement("div");


            empty.className =
                "explorer-empty";


            empty.textContent =
                "This folder is empty.";


            fileGrid.appendChild(
                empty
            );


            return;
        }


        // ---------------------------------------------
        // RENDER ITEMS
        // ---------------------------------------------

        items.forEach(
            function (item) {

                const element =
                    createFileItem(
                        item
                    );


                fileGrid.appendChild(
                    element
                );
            }
        );
    }


    // =================================================
    // REFRESH
    // =================================================

    function refresh() {

        render();

        updateNavigationButtons();

        sound("navigate");
    }


    // =================================================
    // TOOLBAR EVENTS
    // =================================================

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


    if (upButton) {

        upButton.addEventListener(
            "click",
            goUp
        );
    }


    // =================================================
    // GLOBAL API
    // =================================================

    window.Explorer = {

        open: openExplorer,

        close: closeExplorer,

        navigate: navigateTo,

        back: goBack,

        forward: goForward,

        up: goUp,

        refresh: refresh,

        render: render,

        openItem: openItem,

        getCurrentPath:
            function () {

                return currentPath;
            },

        getHistory:
            function () {

                return [
                    ...navigationHistory
                ];
            }

    };


    // =================================================
    // LEGACY COMPATIBILITY
    // =================================================

    window.openExplorer =
        openExplorer;


    // =================================================
    // INITIALIZATION
    // =================================================

    updateNavigationButtons();

    render();


    console.log(
        "Explorer initialized."
    );

})();