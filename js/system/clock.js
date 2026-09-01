// =====================================================
// PROJECT UNTITLED
// SYSTEM — CLOCK
// =====================================================

(function () {

    "use strict";


    // =================================================
    // ELEMENT
    // =================================================

    const clock =
        document.getElementById("clock");


    // =================================================
    // STATE
    // =================================================

    let clockStarted = false;
    let clockInterval = null;


    // =================================================
    // CHECK ELEMENT
    // =================================================

    if (!clock) {

        console.error(
            "CLOCK ERROR: #clock element not found."
        );

        return;
    }


    // =================================================
    // UPDATE CLOCK
    // =================================================

    function updateClock() {

        const now =
            new Date();


        let hours =
            now.getHours();


        const minutes =
            now.getMinutes();


        // ---------------------------------------------
        // AM / PM
        // ---------------------------------------------

        const ampm =
            hours >= 12
                ? "PM"
                : "AM";


        // ---------------------------------------------
        // 12-HOUR FORMAT
        // ---------------------------------------------

        hours =
            hours % 12;


        if (hours === 0) {

            hours = 12;

        }


        // ---------------------------------------------
        // FORMAT MINUTES
        // ---------------------------------------------

        const formattedMinutes =
            minutes
                .toString()
                .padStart(2, "0");


        // ---------------------------------------------
        // DISPLAY
        // ---------------------------------------------

        clock.textContent =
            `${hours}:${formattedMinutes} ${ampm}`;

    }


    // =================================================
    // START CLOCK
    // =================================================

    function startClock() {

        // ---------------------------------------------
        // PREVENT DUPLICATE CLOCKS
        // ---------------------------------------------

        if (clockStarted) {
            return;
        }


        clockStarted = true;


        // ---------------------------------------------
        // INITIAL UPDATE
        // ---------------------------------------------

        updateClock();


        // ---------------------------------------------
        // UPDATE EVERY SECOND
        // ---------------------------------------------

        clockInterval =
            setInterval(
                updateClock,
                1000
            );

    }


    // =================================================
    // STOP CLOCK
    // =================================================

    function stopClock() {

        if (!clockStarted) {
            return;
        }


        if (clockInterval !== null) {

            clearInterval(
                clockInterval
            );

            clockInterval = null;

        }


        clockStarted = false;

    }


    // =================================================
    // PUBLIC API
    // =================================================

    window.ClockSystem = {

        start: startClock,

        stop: stopClock,

        update: updateClock,

        isStarted: function () {

            return clockStarted;

        }

    };


    // =================================================
    // GLOBAL COMPATIBILITY API
    // =================================================

    window.startClock =
        startClock;


})();

