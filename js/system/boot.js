// =====================================================
// PROJECT UNTITLED
// SYSTEM — BOOT
// =====================================================

(function () {

    "use strict";


    // =================================================
    // ELEMENTS
    // =================================================

    const bootScreen =
        document.getElementById("bootScreen");

    const desktop =
        document.getElementById("desktop");

    const bootProgress =
        document.getElementById("bootProgress");

    const bootStatus =
        document.getElementById("bootStatus");


    // =================================================
    // BOOT SETTINGS
    // =================================================

    const bootMessages = [

        "Initializing system...",
        "Loading system files...",
        "Checking memory...",
        "Loading desktop environment...",
        "Starting services...",
        "Initializing network...",
        "Checking user environment...",
        "System ready."

    ];


    const bootDuration = 3500;


    // =================================================
    // STATE
    // =================================================

    let bootStarted = false;
    let bootFinished = false;


    // =================================================
    // UPDATE STATUS
    // =================================================

    function updateStatus(message) {

        if (!bootStatus) {
            return;
        }

        bootStatus.textContent = message;
    }


    // =================================================
    // UPDATE PROGRESS
    // =================================================

    function updateProgress(percent) {

        if (!bootProgress) {
            return;
        }

        const safePercent =
            Math.max(
                0,
                Math.min(100, percent)
            );

        bootProgress.style.width =
            `${safePercent}%`;
    }


    // =================================================
    // FINISH BOOT
    // =================================================

    function finishBoot() {

        if (bootFinished) {
            return;
        }

        bootFinished = true;

        updateProgress(100);

        updateStatus(
            "System ready."
        );


        setTimeout(function () {

            if (bootScreen) {

                bootScreen.style.display =
                    "none";

            }


            if (desktop) {

                desktop.style.display =
                    "block";

            }


            // -----------------------------------------
            // SYSTEM READY EVENT
            // -----------------------------------------

            document.dispatchEvent(
                new CustomEvent("systemReady")
            );


        }, 300);

    }


    // =================================================
    // START BOOT
    // =================================================

    function startBoot() {

        // ---------------------------------------------
        // PREVENT DOUBLE BOOT
        // ---------------------------------------------

        if (bootStarted) {
            return;
        }

        bootStarted = true;


        // ---------------------------------------------
        // INITIAL STATE
        // ---------------------------------------------

        if (bootScreen) {

            bootScreen.style.display =
                "flex";

        }


        if (desktop) {

            desktop.style.display =
                "none";

        }


        updateProgress(0);

        updateStatus(
            bootMessages[0]
        );


        // ---------------------------------------------
        // BOOT SOUND
        // ---------------------------------------------

        if (
            typeof playSound === "function"
        ) {

            playSound("boot");

        }


        // ---------------------------------------------
        // BOOT TIMER
        // ---------------------------------------------

        const startTime =
            Date.now();


        function bootLoop() {

            const elapsed =
                Date.now() - startTime;


            const progress =
                Math.min(
                    elapsed / bootDuration,
                    1
                );


            const percent =
                Math.floor(
                    progress * 100
                );


            updateProgress(
                percent
            );


            // -----------------------------------------
            // BOOT MESSAGE
            // -----------------------------------------

            const messageIndex =
                Math.min(
                    Math.floor(
                        progress *
                        bootMessages.length
                    ),
                    bootMessages.length - 1
                );


            updateStatus(
                bootMessages[messageIndex]
            );


            // -----------------------------------------
            // CONTINUE / FINISH
            // -----------------------------------------

            if (progress < 1) {

                requestAnimationFrame(
                    bootLoop
                );

            } else {

                finishBoot();

            }

        }


        requestAnimationFrame(
            bootLoop
        );

    }


    // =================================================
    // PUBLIC API
    // =================================================

    window.BootSystem = {

        start: startBoot,

        isStarted: function () {

            return bootStarted;

        },

        isFinished: function () {

            return bootFinished;

        }

    };


    // =================================================
    // GLOBAL COMPATIBILITY API
    // =================================================

    window.startBoot =
        startBoot;


})();

