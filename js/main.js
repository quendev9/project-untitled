// =====================================================
// PROJECT UNTITLED
// MAIN — SYSTEM ORCHESTRATOR
// =====================================================

(function () {

    "use strict";


    // =================================================
    // SYSTEM INITIALIZATION
    // =================================================

    function initializeSystem() {

        console.log("=================================");
        console.log("PROJECT UNTITLED");
        console.log("System initializing...");
        console.log("=================================");


        // ---------------------------------------------
        // SOUND
        // ---------------------------------------------

        if (
            typeof initializeSound === "function"
        ) {

            initializeSound();

        } else {

            console.warn(
                "Main: Sound system not found."
            );

        }


        // ---------------------------------------------
        // DESKTOP
        // ---------------------------------------------

        if (
            typeof initializeDesktop === "function"
        ) {

            initializeDesktop();

        } else {

            console.warn(
                "Main: Desktop system not found."
            );

        }


        // ---------------------------------------------
        // WINDOW MANAGER
        // ---------------------------------------------

        if (
            typeof initializeWindowManager === "function"
        ) {

            initializeWindowManager();

        } else {

            console.warn(
                "Main: Window manager not found."
            );

        }


        // ---------------------------------------------
        // TASKBAR
        // ---------------------------------------------

        if (
            typeof initializeTaskbar === "function"
        ) {

            initializeTaskbar();

        } else {

            console.warn(
                "Main: Taskbar system not found."
            );

        }


        // ---------------------------------------------
        // CLOCK
        // ---------------------------------------------

        if (
            typeof startClock === "function"
        ) {

            startClock();

        } else {

            console.warn(
                "Main: Clock system not found."
            );

        }


        // ---------------------------------------------
        // APPLICATION SYSTEMS
        // ---------------------------------------------

        initializeApplications();


        // ---------------------------------------------
        // GAME SYSTEM
        // ---------------------------------------------

        initializeGame();


        // ---------------------------------------------
        // BOOT
        // ---------------------------------------------

        startSystemBoot();

    }


    // =================================================
    // APPLICATION INITIALIZATION
    // =================================================

    function initializeApplications() {

        console.log(
            "Loading applications..."
        );


        // ---------------------------------------------
        // FILE EXPLORER
        // ---------------------------------------------

        if (
            typeof Explorer !== "undefined"
        ) {

            console.log(
                "✓ File Explorer loaded."
            );

        } else {

            console.warn(
                "Main: File Explorer not found."
            );

        }


        // ---------------------------------------------
        // BROWSER
        // ---------------------------------------------

        if (
            typeof Browser !== "undefined"
        ) {

            console.log(
                "✓ Browser loaded."
            );

        } else {

            console.warn(
                "Main: Browser not found."
            );

        }


        // ---------------------------------------------
        // BROWSER HISTORY
        // ---------------------------------------------

        if (
            typeof BrowserHistory !== "undefined"
        ) {

            console.log(
                "✓ Browser History loaded."
            );

        } else {

            console.warn(
                "Main: Browser History not found."
            );

        }


        // ---------------------------------------------
        // MAIL
        // ---------------------------------------------

        if (
            typeof Mail !== "undefined"
        ) {

            console.log(
                "✓ Mail loaded."
            );

        } else {

            console.warn(
                "Main: Mail system not found."
            );

        }


        // ---------------------------------------------
        // NOTEPAD
        // ---------------------------------------------

        if (
            typeof Notepad !== "undefined"
        ) {

            console.log(
                "✓ Notepad loaded."
            );

        } else {

            console.warn(
                "Main: Notepad not found."
            );

        }

    }


    // =================================================
    // GAME INITIALIZATION
    // =================================================

    function initializeGame() {

        console.log(
            "Loading investigation systems..."
        );


        // ---------------------------------------------
        // CLUES
        // ---------------------------------------------

        if (
            typeof Clues !== "undefined"
        ) {

            console.log(
                "✓ Clue system loaded."
            );

        } else {

            console.warn(
                "Main: Clue system not found."
            );

        }


        // ---------------------------------------------
        // INVESTIGATION
        // ---------------------------------------------

        if (
            typeof Investigation !== "undefined"
        ) {

            console.log(
                "✓ Investigation system loaded."
            );

        } else {

            console.warn(
                "Main: Investigation system not found."
            );

        }


        // ---------------------------------------------
        // PROGRESSION
        // ---------------------------------------------

        if (
            typeof Progression !== "undefined"
        ) {

            console.log(
                "✓ Progression system loaded."
            );

        } else {

            console.warn(
                "Main: Progression system not found."
            );

        }

    }


    // =================================================
    // START BOOT
    // =================================================

    function startSystemBoot() {

        console.log(
            "Starting boot sequence..."
        );


        // ---------------------------------------------
        // PREFERRED BOOT API
        // ---------------------------------------------

        if (
            typeof BootSystem !== "undefined" &&
            typeof BootSystem.start === "function"
        ) {

            BootSystem.start();

            return;
        }


        // ---------------------------------------------
        // LEGACY FALLBACK
        // ---------------------------------------------

        if (
            typeof startBoot === "function"
        ) {

            startBoot();

            return;
        }


        // ---------------------------------------------
        // BOOT NOT FOUND
        // ---------------------------------------------

        console.warn(
            "Main: Boot system not found."
        );

    }


    // =================================================
    // SYSTEM READY EVENT
    // =================================================

    document.addEventListener(
        "systemReady",
        function () {

            console.log(
                "================================="
            );

            console.log(
                "PROJECT UNTITLED READY"
            );

            console.log(
                "All systems operational."
            );

            console.log(
                "================================="
            );

        }
    );


    // =================================================
    // DOM READY
    // =================================================

    document.addEventListener(
        "DOMContentLoaded",
        initializeSystem
    );


    // =================================================
    // PUBLIC MAIN API
    // =================================================

    window.ProjectUntitled = {

        initialize: initializeSystem,

        initializeApplications:
            initializeApplications,

        initializeGame:
            initializeGame,

        startBoot:
            startSystemBoot

    };

})();
