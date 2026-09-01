// =====================================================
// PROJECT UNTITLED
// WINDOWS — WINDOW MANAGER
// =====================================================

(function () {

    "use strict";


    // =================================================
    // STATE
    // =================================================

    const windows = new Map();

    let highestZIndex = 100;

    let initialized = false;


    // =================================================
    // INITIALIZE
    // =================================================

    function init() {

        if (initialized) {
            return;
        }


        const windowElements =
            document.querySelectorAll(".window");


        windowElements.forEach(
            function (windowElement) {

                registerWindow(
                    windowElement
                );

            }
        );


        initialized = true;


        console.log(
            `[WindowManager] Registered ${windows.size} window(s).`
        );

    }


    // =================================================
    // REGISTER WINDOW
    // =================================================

    function registerWindow(windowElement) {

        if (
            !windowElement ||
            !windowElement.id
        ) {

            return;

        }


        const id =
            windowElement.id;


        // ---------------------------------------------
        // PREVENT DUPLICATE REGISTRATION
        // ---------------------------------------------

        if (windows.has(id)) {
            return;
        }


        // ---------------------------------------------
        // WINDOW STATE
        // ---------------------------------------------

        const windowData = {

            element:
                windowElement,

            minimized:
                false,

            maximized:
                false,

            previousState:
                null

        };


        windows.set(
            id,
            windowData
        );


        // ---------------------------------------------
        // INITIAL WINDOW STATE
        // ---------------------------------------------

        windowElement.style.zIndex =
            "100";


        // ---------------------------------------------
        // BUTTONS
        // ---------------------------------------------

        setupWindowButtons(
            windowElement
        );


        // ---------------------------------------------
        // FOCUS ON CLICK
        // ---------------------------------------------

        windowElement.addEventListener(
            "mousedown",
            function () {

                focus(id);

            }
        );

    }


    // =================================================
    // WINDOW BUTTONS
    // =================================================

    function setupWindowButtons(windowElement) {

        const buttons =
            windowElement.querySelectorAll(
                ".window-buttons button"
            );


        buttons.forEach(
            function (button) {

                let action =
                    button.dataset.action;


                // -------------------------------------
                // SUPPORT CURRENT HTML
                // -------------------------------------

                if (!action) {

                    if (
                        button.classList.contains(
                            "window-close"
                        )
                    ) {

                        action = "close";

                    }

                    else if (
                        button.classList.contains(
                            "window-minimize"
                        )
                    ) {

                        action = "minimize";

                    }

                    else if (
                        button.classList.contains(
                            "window-maximize"
                        )
                    ) {

                        action = "maximize";

                    }

                }


                if (!action) {
                    return;
                }


                // -------------------------------------
                // STORE ACTION
                // -------------------------------------

                button.dataset.action =
                    action;


                // -------------------------------------
                // CLICK HANDLER
                // -------------------------------------

                button.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        const id =
                            windowElement.id;


                        if (action === "close") {

                            close(id);

                        }

                        else if (
                            action === "minimize"
                        ) {

                            minimize(id);

                        }

                        else if (
                            action === "maximize"
                        ) {

                            maximize(id);

                        }

                    }
                );

            }
        );

    }


    // =================================================
    // OPEN WINDOW
    // =================================================

    function open(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {

            console.warn(
                `[WindowManager] Window "${id}" not found.`
            );

            return;

        }


        const element =
            windowData.element;


        windowData.minimized =
            false;


        element.style.display =
            "block";


        focus(id);


        updateTaskbar();


        console.log(
            `[WindowManager] Opened "${id}".`
        );

    }


    // =================================================
    // CLOSE WINDOW
    // =================================================

    function close(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        const element =
            windowData.element;


        element.style.display =
            "none";


        windowData.minimized =
            false;


        // ---------------------------------------------
        // If closing a maximized window, restore its
        // internal state for the next opening.
        // ---------------------------------------------

        if (windowData.maximized) {

            restoreSize(id);

        }


        windowData.maximized =
            false;

        windowData.previousState =
            null;


        updateTaskbar();


        console.log(
            `[WindowManager] Closed "${id}".`
        );

    }


    // =================================================
    // MINIMIZE WINDOW
    // =================================================

    function minimize(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        windowData.element.style.display =
            "none";


        windowData.minimized =
            true;


        updateTaskbar();


        console.log(
            `[WindowManager] Minimized "${id}".`
        );

    }


    // =================================================
    // RESTORE WINDOW
    // =================================================

    function restore(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        windowData.minimized =
            false;


        windowData.element.style.display =
            "block";


        focus(id);


        updateTaskbar();


        console.log(
            `[WindowManager] Restored "${id}".`
        );

    }


    // =================================================
    // MAXIMIZE WINDOW
    // =================================================

    function maximize(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        const element =
            windowData.element;


        // ---------------------------------------------
        // If already maximized, restore size.
        // ---------------------------------------------

        if (windowData.maximized) {

            restoreSize(id);

            return;

        }


        // ---------------------------------------------
        // SAVE CURRENT STATE
        // ---------------------------------------------

        windowData.previousState = {

            width:
                element.style.width,

            height:
                element.style.height,

            top:
                element.style.top,

            left:
                element.style.left,

            right:
                element.style.right,

            bottom:
                element.style.bottom

        };


        // ---------------------------------------------
        // MAXIMIZED POSITION
        // ---------------------------------------------

        element.style.width =
            "100vw";

        element.style.height =
            "calc(100vh - 38px)";

        element.style.top =
            "0";

        element.style.left =
            "0";

        element.style.right =
            "auto";

        element.style.bottom =
            "38px";


        windowData.maximized =
            true;


        windowData.minimized =
            false;


        focus(id);


        updateTaskbar();


        console.log(
            `[WindowManager] Maximized "${id}".`
        );

    }


    // =================================================
    // RESTORE SIZE
    // =================================================

    function restoreSize(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        const element =
            windowData.element;


        const previous =
            windowData.previousState;


        if (previous) {

            element.style.width =
                previous.width;

            element.style.height =
                previous.height;

            element.style.top =
                previous.top;

            element.style.left =
                previous.left;

            element.style.right =
                previous.right;

            element.style.bottom =
                previous.bottom;

        }


        windowData.maximized =
            false;


        windowData.previousState =
            null;


        focus(id);


        updateTaskbar();


        console.log(
            `[WindowManager] Restored size "${id}".`
        );

    }


    // =================================================
    // FOCUS WINDOW
    // =================================================

    function focus(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        highestZIndex++;


        windowData.element.style.zIndex =
            highestZIndex;


        windowData.minimized =
            false;


        updateTaskbar();

    }


    // =================================================
    // TOGGLE WINDOW
    // =================================================

    function toggle(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        const element =
            windowData.element;


        const visible =
            element.style.display !==
            "none";


        if (!visible) {

            if (windowData.minimized) {

                restore(id);

            }

            else {

                open(id);

            }

            return;

        }


        minimize(id);

    }


    // =================================================
    // CHECK IF OPEN
    // =================================================

    function isOpen(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return false;
        }


        return (
            windowData.element.style.display !==
            "none"
        );

    }


    // =================================================
    // GET WINDOW ELEMENT
    // =================================================

    function get(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return null;
        }


        return windowData.element;

    }


    // =================================================
    // GET WINDOW STATE
    // =================================================

    function getState(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return null;
        }


        return {

            open:
                windowData.element.style.display !==
                "none",

            minimized:
                windowData.minimized,

            maximized:
                windowData.maximized,

            zIndex:
                Number(
                    windowData.element.style.zIndex
                ) || 0

        };

    }


    // =================================================
    // GET ALL WINDOWS
    // =================================================

    function getAll() {

        return Array.from(
            windows.entries()
        ).map(
            function ([id, data]) {

                return {

                    id,

                    element:
                        data.element,

                    minimized:
                        data.minimized,

                    maximized:
                        data.maximized

                };

            }
        );

    }


    // =================================================
    // UPDATE TASKBAR
    // =================================================

    function updateTaskbar() {

        if (
            typeof Taskbar !== "undefined" &&
            typeof Taskbar.update === "function"
        ) {

            Taskbar.update();

        }

    }


    // =================================================
    // CLOSE ALL WINDOWS
    // =================================================

    function closeAll() {

        windows.forEach(
            function (windowData) {

                windowData.element.style.display =
                    "none";


                windowData.minimized =
                    false;


                windowData.maximized =
                    false;


                windowData.previousState =
                    null;

            }
        );


        updateTaskbar();


        console.log(
            "[WindowManager] All windows closed."
        );

    }


    // =================================================
    // PUBLIC API
    // =================================================

    const WindowManager = {

        init,

        registerWindow,

        open,

        close,

        minimize,

        restore,

        maximize,

        restoreSize,

        focus,

        toggle,

        isOpen,

        get,

        getState,

        getAll,

        closeAll,

        isInitialized:
            function () {

                return initialized;

            }

    };


    // =================================================
    // GLOBAL API
    // =================================================

    window.WindowManager =
        WindowManager;


    // =================================================
    // MAIN.JS COMPATIBILITY
    // =================================================

    window.initializeWindowManager =
        function () {

            WindowManager.init();

        };


})();
