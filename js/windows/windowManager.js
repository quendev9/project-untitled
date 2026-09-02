// =====================================================
// PROJECT UNTITLED
// WINDOWS — WINDOW MANAGER
// =====================================================

(function () {

    "use strict";


    /* =====================================================
       STATE
    ===================================================== */

    const windows = new Map();

    let highestZIndex = 100;

    let initialized = false;


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function init() {

        if (initialized) {
            return;
        }


        const windowElements =
            document.querySelectorAll(
                ".window"
            );


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


    /* =====================================================
       REGISTER WINDOW
    ===================================================== */

    function registerWindow(windowElement) {

        if (
            !windowElement ||
            !windowElement.id
        ) {

            return;

        }


        const id =
            windowElement.id;


        if (windows.has(id)) {
            return;
        }


        const windowData = {

            element:
                windowElement,

            minimized:
                false,

            maximized:
                false,

            previousState:
                null,

            /*
               Used so a newly opened window is
               centered only the first time.
            */

            hasInitialPosition:
                false

        };


        windows.set(
            id,
            windowData
        );


        windowElement.style.zIndex =
            "100";


        setupWindowButtons(
            windowElement
        );


        windowElement.addEventListener(
            "mousedown",
            function () {

                focus(id);

            }
        );

    }


    /* =====================================================
       WINDOW BUTTONS
    ===================================================== */

    function setupWindowButtons(windowElement) {

        const buttons =
            windowElement.querySelectorAll(
                ".window-buttons button"
            );


        buttons.forEach(
            function (button) {

                const id =
                    windowElement.id;


                let action =
                    null;


                /*
                   Determine the action strictly
                   from the button's class.

                   MINIMIZE → minimize
                   MAXIMIZE → maximize
                   CLOSE → close
                */

                if (
                    button.classList.contains(
                        "window-minimize"
                    )
                ) {

                    action =
                        "minimize";

                }
                else if (
                    button.classList.contains(
                        "window-maximize"
                    )
                ) {

                    action =
                        "maximize";

                }
                else if (
                    button.classList.contains(
                        "window-close"
                    )
                ) {

                    action =
                        "close";

                }


                /*
                   Unknown button.
                */

                if (!action) {

                    console.warn(
                        `[WindowManager] Unknown window button in "${id}".`
                    );

                    return;

                }


                /*
                   Store the resolved action.
                */

                button.dataset.action =
                    action;


                /*
                   Prevent duplicate listeners.
                */

                if (
                    button.dataset.windowManagerBound ===
                    "true"
                ) {

                    return;

                }


                button.dataset.windowManagerBound =
                    "true";


                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        /*
                           MINIMIZE
                        */

                        if (
                            action ===
                            "minimize"
                        ) {

                            minimize(id);

                            return;

                        }


                        /*
                           MAXIMIZE
                        */

                        if (
                            action ===
                            "maximize"
                        ) {

                            maximize(id);

                            return;

                        }


                        /*
                           CLOSE
                        */

                        if (
                            action ===
                            "close"
                        ) {

                            close(id);

                            return;

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       CENTER WINDOW
    ===================================================== */

    function centerWindow(windowData) {

        if (!windowData) {
            return;
        }


        const element =
            windowData.element;


        if (!element) {
            return;
        }


        /*
           The window must be visible before
           offsetWidth / offsetHeight can be
           measured correctly.
        */

        if (
            element.style.display ===
            "none"
        ) {

            return;

        }


        const width =
            element.offsetWidth;


        const height =
            element.offsetHeight;


        if (
            width <= 0 ||
            height <= 0
        ) {

            return;

        }


        /*
           Find the taskbar height.

           If the taskbar cannot be found,
           use the normal 38px height.
        */

        const taskbar =
            document.getElementById(
                "taskbar"
            );


        const taskbarHeight =
            taskbar
                ? taskbar.offsetHeight
                : 38;


        const availableWidth =
            window.innerWidth;


        const availableHeight =
            window.innerHeight -
            taskbarHeight;


        /*
           Calculate centered position.
        */

        let left =
            (availableWidth - width) / 2;


        let top =
            (availableHeight - height) / 2;


        /*
           Prevent the window from going
           outside the visible screen.
        */

        left =
            Math.max(
                0,
                Math.min(
                    left,
                    availableWidth - width
                )
            );


        top =
            Math.max(
                0,
                Math.min(
                    top,
                    availableHeight - height
                )
            );


        /*
           Apply the position.
        */

        element.style.left =
            `${left}px`;

        element.style.top =
            `${top}px`;

        element.style.right =
            "auto";

        element.style.bottom =
            "auto";

    }


    /* =====================================================
       OPEN
    ===================================================== */

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


        /*
           A minimized window is no longer
           considered minimized when opened.
        */

        windowData.minimized =
            false;


        element.style.display =
            "block";


        /*
           Center the window only the first
           time it is opened.

           After that, its position is preserved.
        */

        if (
            !windowData.hasInitialPosition &&
            !windowData.maximized
        ) {

            centerWindow(
                windowData
            );


            windowData.hasInitialPosition =
                true;

        }


        focus(id);


        updateTaskbar();


        console.log(
            `[WindowManager] Opened "${id}".`
        );

    }


    /* =====================================================
       CLOSE
    ===================================================== */

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


        /*
           Closed ≠ minimized.

           This is important because the
           taskbar should remove the button
           completely when a window closes.
        */

        windowData.minimized =
            false;


        /*
           If maximized, restore its original
           dimensions before closing.
        */

        if (
            windowData.maximized
        ) {

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


    /* =====================================================
       MINIMIZE
    ===================================================== */

    function minimize(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        /*
           Hide the actual window.
        */

        windowData.element.style.display =
            "none";


        /*
           IMPORTANT:

           minimized = true

           This tells the Taskbar that the
           window is still open and should
           remain represented there.
        */

        windowData.minimized =
            true;


        updateTaskbar();


        console.log(
            `[WindowManager] Minimized "${id}".`
        );

    }


    /* =====================================================
       RESTORE
    ===================================================== */

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


    /* =====================================================
       MAXIMIZE
    ===================================================== */

    function maximize(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        const element =
            windowData.element;


        /*
           If already maximized,
           restore instead.
        */

        if (
            windowData.maximized
        ) {

            restoreSize(id);

            return;

        }


        /*
           Save the current window state
           so it can be restored later.
        */

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


        /*
           Fill the desktop while leaving
           room for the taskbar.
        */

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


    /* =====================================================
       RESTORE SIZE
    ===================================================== */

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


    /* =====================================================
       FOCUS
    ===================================================== */

    function focus(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return;
        }


        highestZIndex++;


        windowData.element.style.zIndex =
            highestZIndex;


        /*
           Focusing a window means it is
           no longer minimized.
        */

        windowData.minimized =
            false;


        updateTaskbar();

    }


    /* =====================================================
       TOGGLE
    ===================================================== */

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


        /*
           Hidden + minimized
           → restore
        */

        if (!visible) {

            if (
                windowData.minimized
            ) {

                restore(id);

            }
            else {

                open(id);

            }


            return;

        }


        /*
           Visible
           → minimize
        */

        minimize(id);

    }


    /* =====================================================
       IS OPEN
    ===================================================== */

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


    /* =====================================================
       GET WINDOW ELEMENT
    ===================================================== */

    function get(id) {

        const windowData =
            windows.get(id);


        if (!windowData) {
            return null;
        }


        return windowData.element;

    }


    /* =====================================================
       GET STATE
    ===================================================== */

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


    /* =====================================================
       GET ALL
    ===================================================== */

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


    /* =====================================================
       UPDATE TASKBAR
    ===================================================== */

    function updateTaskbar() {

        if (
            typeof Taskbar !==
                "undefined" &&
            typeof Taskbar.update ===
                "function"
        ) {

            Taskbar.update();

        }

    }


    /* =====================================================
       CLOSE ALL
    ===================================================== */

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


    /* =====================================================
       PUBLIC API
    ===================================================== */

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


    /* =====================================================
       GLOBAL API
    ===================================================== */

    window.WindowManager =
        WindowManager;


    window.initializeWindowManager =
        function () {

            WindowManager.init();

        };


})();