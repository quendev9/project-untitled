/* =====================================================
   PROJECT UNTITLED
   WINDOWS — TASKBAR
===================================================== */

(function () {

    "use strict";


    // =================================================
    // ELEMENTS
    // =================================================

    let startButton = null;
    let startMenu = null;
    let taskbarWindows = null;


    // =================================================
    // APPLICATION MAP
    // =================================================

    const windowMap = {

        files:
            "explorerWindow",

        explorer:
            "explorerWindow",

        browser:
            "browserWindow",

        history:
            "historyWindow",

        mail:
            "mailWindow",

        notepad:
            "notepadWindow"

    };


    // =================================================
    // APPLICATION NAMES
    // =================================================

    const applicationNames = {

        explorer:
            "My Files",

        files:
            "My Files",

        browser:
            "Internet",

        history:
            "Browser History",

        mail:
            "Mail",

        notepad:
            "Notepad"

    };


    // =================================================
    // INITIALIZE
    // =================================================

    function init() {

        startButton =
            document.getElementById(
                "startButton"
            );


        startMenu =
            document.getElementById(
                "startMenu"
            );


        taskbarWindows =
            document.getElementById(
                "taskbarWindows"
            );


        if (!startButton) {

            console.error(
                "[Taskbar] #startButton not found."
            );

            return;

        }


        if (!startMenu) {

            console.error(
                "[Taskbar] #startMenu not found."
            );

            return;

        }


        setupStartButton();

        setupStartMenu();

        update();


        console.log(
            "[Taskbar] Initialized."
        );

    }


    // =================================================
    // START BUTTON
    // =================================================

    function setupStartButton() {

        startButton.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                toggleStartMenu();

                playClickSound();

            }
        );

    }


    // =================================================
    // TOGGLE START MENU
    // =================================================

    function toggleStartMenu() {

        if (!startMenu) {
            return;
        }


        const isVisible =
            startMenu.classList.contains(
                "open"
            );


        if (isVisible) {

            closeStartMenu();

        } else {

            openStartMenu();

        }

    }


    // =================================================
    // OPEN START MENU
    // =================================================

    function openStartMenu() {

        if (!startMenu) {
            return;
        }


        startMenu.classList.add(
            "open"
        );


        startMenu.style.display =
            "block";

    }


    // =================================================
    // CLOSE START MENU
    // =================================================

    function closeStartMenu() {

        if (!startMenu) {
            return;
        }


        startMenu.classList.remove(
            "open"
        );


        startMenu.style.display =
            "none";

    }


    // =================================================
    // START MENU ITEMS
    // =================================================

    function setupStartMenu() {

        const startItems =
            document.querySelectorAll(
                ".start-item"
            );


        startItems.forEach(
            function (item) {

                item.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        const app =
                            item.dataset.app;


                        if (app) {

                            launchApplication(
                                app
                            );

                        }


                        // ---------------------------------
                        // Shutdown
                        // ---------------------------------

                        if (
                            item.id ===
                            "shutdownButton"
                        ) {

                            shutdown();

                        }


                        closeStartMenu();

                    }
                );

            }
        );


        // ---------------------------------------------
        // Clicking desktop closes Start menu.
        // ---------------------------------------------

        document.addEventListener(
            "click",
            function (event) {

                if (
                    !startMenu ||
                    !startButton
                ) {

                    return;

                }


                if (
                    startMenu.contains(
                        event.target
                    ) ||
                    startButton.contains(
                        event.target
                    )
                ) {

                    return;

                }


                closeStartMenu();

            }
        );

    }


    // =================================================
    // LAUNCH APPLICATION
    // =================================================

    function launchApplication(
        app
    ) {

        if (!app) {
            return;
        }


        const windowId =
            windowMap[app];


        if (!windowId) {

            console.warn(
                `[Taskbar] Unknown application: ${app}`
            );

            return;

        }


        // ---------------------------------------------
        // Prefer WindowManager.
        // ---------------------------------------------

        if (
            typeof WindowManager !==
                "undefined" &&
            typeof WindowManager.open ===
                "function"
        ) {

            WindowManager.open(
                windowId
            );


            playOpenSound();


            return;

        }


        // ---------------------------------------------
        // Fallback.
        // ---------------------------------------------

        const windowElement =
            document.getElementById(
                windowId
            );


        if (windowElement) {

            windowElement.style.display =
                "block";

        }

    }


    // =================================================
    // UPDATE TASKBAR
    // =================================================

    function update() {

        if (!taskbarWindows) {
            return;
        }


        taskbarWindows.innerHTML =
            "";


        if (
            typeof WindowManager ===
                "undefined" ||
            typeof WindowManager.getState !==
                "function"
        ) {

            return;

        }


        Object.entries(
            windowMap
        ).forEach(
            function ([app, windowId]) {

                // -------------------------------------
                // Avoid duplicate buttons for
                // files/explorer pointing to same window.
                // -------------------------------------

                if (
                    app === "explorer"
                ) {

                    return;

                }


                const state =
                    WindowManager.getState(
                        windowId
                    );


                if (!state || !state.open) {
                    return;
                }


                createTaskbarButton(
                    app,
                    windowId,
                    state
                );

            }
        );

    }


    // =================================================
    // CREATE TASKBAR BUTTON
    // =================================================

    function createTaskbarButton(
        app,
        windowId,
        state
    ) {

        if (!taskbarWindows) {
            return;
        }


        const button =
            document.createElement(
                "button"
            );


        button.className =
            "taskbar-window";


        button.dataset.window =
            windowId;


        button.textContent =
            applicationNames[app] ||
            app;


        // ---------------------------------------------
        // Minimized appearance.
        // ---------------------------------------------

        if (state.minimized) {

            button.classList.add(
                "minimized"
            );

        }


        // ---------------------------------------------
        // Click taskbar application.
        // ---------------------------------------------

        button.addEventListener(
            "click",
            function () {

                if (
                    typeof WindowManager ===
                        "undefined"
                ) {

                    return;

                }


                const currentState =
                    WindowManager.getState(
                        windowId
                    );


                if (!currentState) {
                    return;
                }


                // -----------------------------
                // Minimized → restore
                // -----------------------------

                if (
                    currentState.minimized
                ) {

                    WindowManager.restore(
                        windowId
                    );

                    return;

                }


                // -----------------------------
                // Open → focus
                // -----------------------------

                if (currentState.open) {

                    WindowManager.focus(
                        windowId
                    );

                    return;

                }


                // -----------------------------
                // Closed → open
                // -----------------------------

                WindowManager.open(
                    windowId
                );

            }
        );


        taskbarWindows.appendChild(
            button
        );

    }


    // =================================================
    // SHUTDOWN
    // =================================================

    function shutdown() {

        playShutdownSound();


        if (
            typeof WindowManager !==
                "undefined" &&
            typeof WindowManager.closeAll ===
                "function"
        ) {

            WindowManager.closeAll();

        }


        if (
            typeof Desktop !==
                "undefined" &&
            typeof Desktop.hide ===
                "function"
        ) {

            Desktop.hide();

        }


        // ---------------------------------------------
        // Show a simple shutdown state.
        // ---------------------------------------------

        const shutdownScreen =
            document.createElement(
                "div"
            );


        shutdownScreen.id =
            "shutdownScreen";


        shutdownScreen.textContent =
            "Shutting down...";


        shutdownScreen.style.position =
            "fixed";

        shutdownScreen.style.inset =
            "0";

        shutdownScreen.style.zIndex =
            "99999";

        shutdownScreen.style.display =
            "flex";

        shutdownScreen.style.alignItems =
            "center";

        shutdownScreen.style.justifyContent =
            "center";

        shutdownScreen.style.background =
            "#000";

        shutdownScreen.style.color =
            "#fff";

        shutdownScreen.style.fontFamily =
            "monospace";

        shutdownScreen.style.fontSize =
            "18px";


        document.body.appendChild(
            shutdownScreen
        );


        setTimeout(
            function () {

                shutdownScreen.textContent =
                    "System halted.";

            },
            1200
        );

    }


    // =================================================
    // SOUND HELPERS
    // =================================================

    function playClickSound() {

        if (
            typeof SoundSystem !==
                "undefined" &&
            typeof SoundSystem.click ===
                "function"
        ) {

            SoundSystem.click();

        }

    }


    function playOpenSound() {

        if (
            typeof SoundSystem !==
                "undefined" &&
            typeof SoundSystem.open ===
                "function"
        ) {

            SoundSystem.open();

        }

    }


    function playShutdownSound() {

        if (
            typeof SoundSystem !==
                "undefined" &&
            typeof SoundSystem.shutdown ===
                "function"
        ) {

            SoundSystem.shutdown();

        }

    }


    // =================================================
    // PUBLIC API
    // =================================================

    window.Taskbar = {

        init,

        update,

        launch:
            launchApplication,

        openStartMenu,

        closeStartMenu,

        toggleStartMenu,

        shutdown

    };


    // =================================================
    // INITIALIZE
    // =================================================

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

})();
