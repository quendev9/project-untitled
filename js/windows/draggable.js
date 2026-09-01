// =====================================================
// PROJECT UNTITLED
// WINDOWS — DRAGGING SYSTEM
// =====================================================

(function () {

    "use strict";


    // =================================================
    // STATE
    // =================================================

    let activeWindow = null;

    let offsetX = 0;
    let offsetY = 0;

    let isDragging = false;


    // =================================================
    // GET WINDOW FROM EVENT
    // =================================================

    function getWindowFromEvent(event) {

        if (!event.target) {
            return null;
        }


        const titlebar =
            event.target.closest(
                ".window-titlebar"
            );


        if (!titlebar) {
            return null;
        }


        // ---------------------------------------------
        // Never drag when clicking window controls.
        // ---------------------------------------------

        if (
            event.target.closest(
                ".window-buttons"
            )
        ) {

            return null;

        }


        const windowElement =
            titlebar.closest(".window");


        if (!windowElement) {
            return null;
        }


        return windowElement;

    }


    // =================================================
    // START DRAG
    // =================================================

    function startDrag(event) {

        const windowElement =
            getWindowFromEvent(event);


        if (!windowElement) {
            return;
        }


        // ---------------------------------------------
        // Only left mouse button.
        // ---------------------------------------------

        if (
            event.type === "mousedown" &&
            event.button !== 0
        ) {

            return;

        }


        activeWindow =
            windowElement;


        const rect =
            activeWindow.getBoundingClientRect();


        offsetX =
            event.clientX - rect.left;

        offsetY =
            event.clientY - rect.top;


        isDragging = true;


        // ---------------------------------------------
        // Bring window to front.
        // ---------------------------------------------

        focusWindow(
            activeWindow
        );


        // ---------------------------------------------
        // Cursor.
        // ---------------------------------------------

        document.body.style.cursor =
            "move";


        // ---------------------------------------------
        // Prevent text selection.
        // ---------------------------------------------

        document.body.style.userSelect =
            "none";


        event.preventDefault();

    }


    // =================================================
    // DRAG WINDOW
    // =================================================

    function dragWindow(event) {

        if (
            !isDragging ||
            !activeWindow
        ) {

            return;

        }


        // ---------------------------------------------
        // Don't drag maximized windows.
        // ---------------------------------------------

        if (
            isWindowMaximized(
                activeWindow
            )
        ) {

            return;

        }


        let newLeft =
            event.clientX -
            offsetX;


        let newTop =
            event.clientY -
            offsetY;


        // ---------------------------------------------
        // Keep window inside viewport.
        // ---------------------------------------------

        const maxLeft =
            Math.max(
                0,
                window.innerWidth -
                activeWindow.offsetWidth
            );


        const maxTop =
            Math.max(
                0,
                window.innerHeight -
                activeWindow.offsetHeight
            );


        newLeft =
            Math.max(
                0,
                Math.min(
                    newLeft,
                    maxLeft
                )
            );


        newTop =
            Math.max(
                0,
                Math.min(
                    newTop,
                    maxTop
                )
            );


        activeWindow.style.left =
            `${newLeft}px`;


        activeWindow.style.top =
            `${newTop}px`;

    }


    // =================================================
    // STOP DRAG
    // =================================================

    function stopDrag() {

        if (!isDragging) {
            return;
        }


        isDragging =
            false;


        activeWindow =
            null;


        document.body.style.cursor =
            "";


        document.body.style.userSelect =
            "";

    }


    // =================================================
    // FOCUS WINDOW
    // =================================================

    function focusWindow(windowElement) {

        if (!windowElement) {
            return;
        }


        const id =
            windowElement.id;


        // ---------------------------------------------
        // Use our WindowManager.
        // ---------------------------------------------

        if (
            typeof WindowManager !== "undefined" &&
            typeof WindowManager.focus === "function"
        ) {

            WindowManager.focus(id);

            return;

        }

    }


    // =================================================
    // CHECK MAXIMIZED
    // =================================================

    function isWindowMaximized(
        windowElement
    ) {

        if (!windowElement) {
            return false;
        }


        const id =
            windowElement.id;


        if (
            typeof WindowManager !== "undefined" &&
            typeof WindowManager.getState ===
                "function"
        ) {

            const state =
                WindowManager.getState(id);


            if (state) {

                return state.maximized;

            }

        }


        return false;

    }


    // =================================================
    // MOUSE EVENTS
    // =================================================

    document.addEventListener(
        "mousedown",
        startDrag
    );


    document.addEventListener(
        "mousemove",
        dragWindow
    );


    document.addEventListener(
        "mouseup",
        stopDrag
    );


    // =================================================
    // TOUCH START
    // =================================================

    function startTouchDrag(event) {

        const touch =
            event.touches[0];


        if (!touch) {
            return;
        }


        const windowElement =
            getWindowFromEvent(event);


        if (!windowElement) {
            return;
        }


        activeWindow =
            windowElement;


        const rect =
            activeWindow.getBoundingClientRect();


        offsetX =
            touch.clientX -
            rect.left;


        offsetY =
            touch.clientY -
            rect.top;


        isDragging =
            true;


        focusWindow(
            activeWindow
        );


        document.body.style.userSelect =
            "none";


        event.preventDefault();

    }


    // =================================================
    // TOUCH MOVE
    // =================================================

    function touchDrag(event) {

        if (
            !isDragging ||
            !activeWindow
        ) {

            return;

        }


        if (
            isWindowMaximized(
                activeWindow
            )
        ) {

            return;

        }


        const touch =
            event.touches[0];


        if (!touch) {
            return;
        }


        let newLeft =
            touch.clientX -
            offsetX;


        let newTop =
            touch.clientY -
            offsetY;


        const maxLeft =
            Math.max(
                0,
                window.innerWidth -
                activeWindow.offsetWidth
            );


        const maxTop =
            Math.max(
                0,
                window.innerHeight -
                activeWindow.offsetHeight
            );


        newLeft =
            Math.max(
                0,
                Math.min(
                    newLeft,
                    maxLeft
                )
            );


        newTop =
            Math.max(
                0,
                Math.min(
                    newTop,
                    maxTop
                )
            );


        activeWindow.style.left =
            `${newLeft}px`;


        activeWindow.style.top =
            `${newTop}px`;


        event.preventDefault();

    }


    // =================================================
    // TOUCH END
    // =================================================

    function stopTouchDrag() {

        stopDrag();

    }


    document.addEventListener(
        "touchstart",
        startTouchDrag,
        {
            passive: false
        }
    );


    document.addEventListener(
        "touchmove",
        touchDrag,
        {
            passive: false
        }
    );


    document.addEventListener(
        "touchend",
        stopTouchDrag
    );


    document.addEventListener(
        "touchcancel",
        stopTouchDrag
    );


    // =================================================
    // PUBLIC API
    // =================================================

    window.Draggable = {

        start:
            startDrag,

        stop:
            stopDrag,

        isDragging:
            function () {

                return isDragging;

            },

        getActiveWindow:
            function () {

                return activeWindow;

            }

    };


})();

