/* =========================================================
   PROJECT UNTITLED
   SYSTEM — BOOT
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const bootScreen =
        document.getElementById("bootScreen");

    const desktop =
        document.getElementById("desktop");

    const bootProgress =
        document.getElementById("bootProgress");

    const bootStatus =
        document.querySelector(".boot-status");


    /* =====================================================
       BOOT MESSAGES
       ===================================================== */

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


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const bootDuration = 3500;


    /* =====================================================
       STATE
       ===================================================== */

    let bootStarted = false;
    let bootFinished = false;


    /* =====================================================
       UPDATE STATUS
       ===================================================== */

    function updateStatus(message) {

        if (!bootStatus) {
            return;
        }

        bootStatus.textContent =
            message;

    }


    /* =====================================================
       UPDATE PROGRESS
       ===================================================== */

    function updateProgress(percent) {

        if (!bootProgress) {
            return;
        }

        const safePercent =
            Math.max(
                0,
                Math.min(
                    100,
                    percent
                )
            );

        bootProgress.style.width =
            `${safePercent}%`;

    }


    /* =====================================================
       START BOOT SOUND
       ===================================================== */

    function playBootSound() {

        if (
            typeof SoundSystem !== "undefined" &&
            typeof SoundSystem.boot === "function"
        ) {

            SoundSystem.boot();

        }

    }


    /* =====================================================
       FINISH BOOT
       ===================================================== */

    function finishBoot() {

        if (bootFinished) {
            return;
        }

        bootFinished = true;

        updateProgress(100);
        updateStatus("System ready.");


        setTimeout(function () {

            if (bootScreen) {

                bootScreen.style.display =
                    "none";

            }


            if (desktop) {

                desktop.style.display =
                    "block";

            }


            document.dispatchEvent(
                new CustomEvent("systemReady")
            );


        }, 300);

    }


    /* =====================================================
       BOOT LOOP
       ===================================================== */

    function runBootLoop(startTime) {

        if (bootFinished) {
            return;
        }


        const elapsed =
            Date.now() - startTime;


        const progress =
            Math.min(
                elapsed / bootDuration,
                1
            );


        const percentage =
            progress * 100;


        updateProgress(
            percentage
        );


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


        if (progress >= 1) {

            finishBoot();

            return;

        }


        requestAnimationFrame(
            function () {

                runBootLoop(
                    startTime
                );

            }
        );

    }


    /* =====================================================
       START BOOT
       ===================================================== */

    function startBoot() {

        if (bootStarted) {
            return;
        }

        bootStarted = true;


        /*
           Make absolutely sure the boot screen
           is visible before starting the sequence.
        */

        if (bootScreen) {

            bootScreen.style.display =
                "flex";

        }


        /*
           The desktop must stay hidden while
           the operating system is starting.
        */

        if (desktop) {

            desktop.style.display =
                "none";

        }


        updateProgress(0);
        updateStatus(
            bootMessages[0]
        );


        playBootSound();


        const startTime =
            Date.now();


        requestAnimationFrame(
            function () {

                runBootLoop(
                    startTime
                );

            }
        );

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.BootSystem = {

        start: startBoot,

        isStarted: function () {

            return bootStarted;

        },

        isFinished: function () {

            return bootFinished;

        }

    };


    /* =====================================================
       AUTOMATIC START
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        startBoot
    );


})();