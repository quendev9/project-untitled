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


        // -------------------------------------------------
        // SOUND SYSTEM
        // -------------------------------------------------

        if (
            typeof SoundSystem !== "undefined" &&
            typeof SoundSystem.init === "function"
        ) {

            SoundSystem.init();

            console.log(
                "[Main] Sound system initialized."
            );

        } else {

            console.warn(
                "[Main] Sound system not available."
            );

        }


        // -------------------------------------------------
        // DESKTOP SYSTEM
        // -------------------------------------------------

        if (
            typeof Desktop !== "undefined" &&
            typeof Desktop.init === "function"
        ) {

            Desktop.init();

            console.log(
                "[Main] Desktop initialized."
            );

        } else {

            console.warn(
                "[Main] Desktop system not available."
            );

        }


        // -------------------------------------------------
        // WINDOW MANAGER
        // -------------------------------------------------

        if (
            typeof WindowManager !== "undefined" &&
            typeof WindowManager.init === "function"
        ) {

            WindowManager.init();

            console.log(
                "[Main] Window manager initialized."
            );

        } else {

            console.warn(
                "[Main] Window manager not available."
            );

        }


        // -------------------------------------------------
        // TASKBAR
        // -------------------------------------------------

        if (
            typeof Taskbar !== "undefined" &&
            typeof Taskbar.init === "function"
        ) {

            Taskbar.init();

            console.log(
                "[Main] Taskbar initialized."
            );

        } else {

            console.warn(
                "[Main] Taskbar system not available."
            );

        }


        // -------------------------------------------------
        // APPLICATIONS
        // -------------------------------------------------

        initializeApplications();


        // -------------------------------------------------
        // GAME SYSTEMS
        // -------------------------------------------------

        initializeGameSystems();


        // -------------------------------------------------
        // SYSTEM READY
        // -------------------------------------------------

        console.log(
            "[Main] Core systems initialized."
        );


        // -------------------------------------------------
        // BOOT
        // -------------------------------------------------

        startSystemBoot();

    }


    // =================================================
    // APPLICATION INITIALIZATION
    // =================================================

    function initializeApplications() {

        console.log(
            "[Main] Checking applications..."
        );


        // -------------------------------------------------
        // FILE EXPLORER
        // -------------------------------------------------

        if (
            typeof Explorer !== "undefined"
        ) {

            console.log(
                "[Main] File Explorer loaded."
            );

        } else {

            console.warn(
                "[Main] File Explorer not found."
            );

        }


        // -------------------------------------------------
        // BROWSER
        // -------------------------------------------------

        if (
            typeof Browser !== "undefined"
        ) {

            console.log(
                "[Main] Browser loaded."
            );

        } else {

            console.warn(
                "[Main] Browser not found."
            );

        }


        // -------------------------------------------------
        // BROWSER HISTORY
        // -------------------------------------------------

        if (
            typeof HistoryApp !== "undefined"
        ) {

            console.log(
                "[Main] Browser History loaded."
            );

        } else if (
            typeof BrowserHistory !== "undefined"
        ) {

            console.log(
                "[Main] Browser History loaded."
            );

        } else {

            console.warn(
                "[Main] Browser History not found."
            );

        }


        // -------------------------------------------------
        // MAIL
        // -------------------------------------------------

        if (
            typeof Mail !== "undefined"
        ) {

            console.log(
                "[Main] Mail loaded."
            );

        } else {

            console.warn(
                "[Main] Mail system not found."
            );

        }


        // -------------------------------------------------
        // NOTEPAD
        // -------------------------------------------------

        if (
            typeof Notepad !== "undefined"
        ) {

            console.log(
                "[Main] Notepad loaded."
            );

        } else {

            console.warn(
                "[Main] Notepad system not found."
            );

        }

    }


    // =================================================
    // GAME SYSTEM INITIALIZATION
    // =================================================

    function initializeGameSystems() {

        console.log(
            "[Main] Checking investigation systems..."
        );


        // -------------------------------------------------
        // CLUES
        // -------------------------------------------------

        if (
            typeof Clues !== "undefined"
        ) {

            console.log(
                "[Main] Clue system loaded."
            );

        } else {

            console.warn(
                "[Main] Clue system not found."
            );

        }


        // -------------------------------------------------
        // INVESTIGATION
        // -------------------------------------------------

        if (
            typeof Investigation !== "undefined"
        ) {

            console.log(
                "[Main] Investigation system loaded."
            );

        } else {

            console.warn(
                "[Main] Investigation system not found."
            );

        }


        // -------------------------------------------------
        // PROGRESSION
        // -------------------------------------------------

        if (
            typeof Progression !== "undefined"
        ) {

            console.log(
                "[Main] Progression system loaded."
            );

        } else {

            console.warn(
                "[Main] Progression system not found."
            );

        }

    }


    // =================================================
    // START BOOT
    // =================================================

    function startSystemBoot() {

        console.log(
            "[Main] Starting boot sequence..."
        );


        // -------------------------------------------------
        // PREFERRED BOOT SYSTEM
        // -------------------------------------------------

        if (
            typeof BootSystem !== "undefined" &&
            typeof BootSystem.start === "function"
        ) {

            BootSystem.start();

            return;

        }


        // -------------------------------------------------
        // LEGACY FALLBACK
        // -------------------------------------------------

        if (
            typeof startBoot === "function"
        ) {

            startBoot();

            return;

        }


        // -------------------------------------------------
        // BOOT SYSTEM NOT FOUND
        // -------------------------------------------------

        console.warn(
            "[Main] Boot system not available."
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
    // PUBLIC MAIN API
    // =================================================

    window.ProjectUntitled =
        window.ProjectUntitled || {};


    window.ProjectUntitled.Main = {

        initialize:
            initializeSystem,

        initializeApplications:
            initializeApplications,

        initializeGame:
            initializeGameSystems,

        startBoot:
            startSystemBoot

    };


    // =================================================
    // START SYSTEM
    // =================================================

    document.addEventListener(
        "DOMContentLoaded",
        initializeSystem
    );

})();

