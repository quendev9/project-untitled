// =====================================================
// PROJECT UNTITLED
// GAME — INVESTIGATION SYSTEM
// =====================================================

(function () {

    "use strict";


    // =================================================
    // STATE
    // =================================================

    const state = {

        started: false,

        completed: false,

        discoveredClues: [],

        discoveredLocations: [],

        visitedWebsites: [],

        openedFiles: [],

        readEmails: [],

        readNotes: [],

        eventsTriggered: [],

        currentObjective: null

    };


    // =================================================
    // HELPERS
    // =================================================

    function contains(array, value) {

        return array.includes(value);
    }


    function addUnique(array, value) {

        if (!contains(array, value)) {

            array.push(value);

            return true;
        }

        return false;
    }


    function dispatchGameEvent(name, detail = {}) {

        document.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail: detail
                }
            )
        );
    }


    // =================================================
    // START INVESTIGATION
    // =================================================

    function startInvestigation() {

        if (state.started) {
            return;
        }

        state.started = true;

        state.completed = false;

        state.currentObjective =
            "Investigate the North Ridge incident.";

        dispatchGameEvent(
            "investigationStarted",
            {
                objective:
                    state.currentObjective
            }
        );

        updateProgression();
    }


    // =================================================
    // CLUES
    // =================================================

    function discoverClue(clueId) {

        if (!clueId) {
            return false;
        }

        const added =
            addUnique(
                state.discoveredClues,
                clueId
            );

        if (!added) {
            return false;
        }

        dispatchGameEvent(
            "clueDiscovered",
            {
                clueId: clueId,

                totalClues:
                    state.discoveredClues.length
            }
        );

        updateProgression();

        return true;
    }


    function hasClue(clueId) {

        return contains(
            state.discoveredClues,
            clueId
        );
    }


    function getClues() {

        return [
            ...state.discoveredClues
        ];
    }


    // =================================================
    // LOCATIONS
    // =================================================

    function discoverLocation(locationId) {

        if (!locationId) {
            return false;
        }

        const added =
            addUnique(
                state.discoveredLocations,
                locationId
            );

        if (!added) {
            return false;
        }

        dispatchGameEvent(
            "locationDiscovered",
            {
                locationId: locationId
            }
        );

        updateProgression();

        return true;
    }


    function hasVisitedLocation(locationId) {

        return contains(
            state.discoveredLocations,
            locationId
        );
    }


    // =================================================
    // WEBSITES
    // =================================================

    function visitWebsite(websiteId) {

        if (!websiteId) {
            return false;
        }

        const added =
            addUnique(
                state.visitedWebsites,
                websiteId
            );

        if (!added) {
            return false;
        }

        dispatchGameEvent(
            "websiteVisited",
            {
                websiteId: websiteId
            }
        );

        updateProgression();

        return true;
    }


    function hasVisitedWebsite(websiteId) {

        return contains(
            state.visitedWebsites,
            websiteId
        );
    }


    // =================================================
    // FILES
    // =================================================

    function openFile(fileId) {

        if (!fileId) {
            return false;
        }

        const added =
            addUnique(
                state.openedFiles,
                fileId
            );

        if (!added) {
            return false;
        }

        dispatchGameEvent(
            "fileOpened",
            {
                fileId: fileId
            }
        );

        updateProgression();

        return true;
    }


    function hasOpenedFile(fileId) {

        return contains(
            state.openedFiles,
            fileId
        );
    }


    // =================================================
    // EMAILS
    // =================================================

    function readEmail(emailId) {

        if (!emailId) {
            return false;
        }

        const added =
            addUnique(
                state.readEmails,
                emailId
            );

        if (!added) {
            return false;
        }

        dispatchGameEvent(
            "emailRead",
            {
                emailId: emailId
            }
        );

        updateProgression();

        return true;
    }


    function hasReadEmail(emailId) {

        return contains(
            state.readEmails,
            emailId
        );
    }


    // =================================================
    // NOTES
    // =================================================

    function readNote(noteId) {

        if (!noteId) {
            return false;
        }

        const added =
            addUnique(
                state.readNotes,
                noteId
            );

        if (!added) {
            return false;
        }

        dispatchGameEvent(
            "noteRead",
            {
                noteId: noteId
            }
        );

        updateProgression();

        return true;
    }


    function hasReadNote(noteId) {

        return contains(
            state.readNotes,
            noteId
        );
    }


    // =================================================
    // EVENTS
    // =================================================

    function triggerEvent(eventId) {

        if (!eventId) {
            return false;
        }

        const added =
            addUnique(
                state.eventsTriggered,
                eventId
            );

        if (!added) {
            return false;
        }

        dispatchGameEvent(
            "investigationEvent",
            {
                eventId: eventId
            }
        );

        return true;
    }


    function hasTriggeredEvent(eventId) {

        return contains(
            state.eventsTriggered,
            eventId
        );
    }


    // =================================================
    // OBJECTIVE
    // =================================================

    function setObjective(objective) {

        if (!objective) {
            return;
        }

        state.currentObjective =
            objective;

        dispatchGameEvent(
            "objectiveChanged",
            {
                objective: objective
            }
        );
    }


    function getObjective() {

        return state.currentObjective;
    }


    // =================================================
    // PROGRESSION CHECK
    // =================================================

    function updateProgression() {

        if (!state.started || state.completed) {
            return;
        }


        /*
         * If progression.js exists, let it handle
         * the actual story requirements.
         */

        if (
            typeof Progression !== "undefined" &&
            typeof Progression.update === "function"
        ) {

            Progression.update(
                getState()
            );

            return;
        }


        /*
         * Fallback progression.
         *
         * This keeps the investigation functional even
         * before progression.js has been implemented.
         */

        const clueCount =
            state.discoveredClues.length;


        if (
            clueCount >= 1 &&
            state.currentObjective ===
            "Investigate the North Ridge incident."
        ) {

            setObjective(
                "Find out what happened at North Ridge."
            );
        }


        if (clueCount >= 3) {

            setObjective(
                "Connect the evidence."
            );
        }
    }


    // =================================================
    // COMPLETE INVESTIGATION
    // =================================================

    function completeInvestigation() {

        if (state.completed) {
            return;
        }

        state.completed = true;

        state.currentObjective =
            "Investigation complete.";

        dispatchGameEvent(
            "investigationCompleted",
            {
                clues:
                    getClues(),

                objective:
                    state.currentObjective
            }
        );
    }


    // =================================================
    // RESET
    // =================================================

    function resetInvestigation() {

        state.started = false;

        state.completed = false;

        state.discoveredClues = [];

        state.discoveredLocations = [];

        state.visitedWebsites = [];

        state.openedFiles = [];

        state.readEmails = [];

        state.readNotes = [];

        state.eventsTriggered = [];

        state.currentObjective = null;


        dispatchGameEvent(
            "investigationReset"
        );
    }


    // =================================================
    // STATE
    // =================================================

    function getState() {

        return {

            started:
                state.started,

            completed:
                state.completed,

            discoveredClues:
                [
                    ...state.discoveredClues
                ],

            discoveredLocations:
                [
                    ...state.discoveredLocations
                ],

            visitedWebsites:
                [
                    ...state.visitedWebsites
                ],

            openedFiles:
                [
                    ...state.openedFiles
                ],

            readEmails:
                [
                    ...state.readEmails
                ],

            readNotes:
                [
                    ...state.readNotes
                ],

            eventsTriggered:
                [
                    ...state.eventsTriggered
                ],

            currentObjective:
                state.currentObjective
        };
    }


    // =================================================
    // SAVE STATE
    // =================================================

    function save() {

        try {

            localStorage.setItem(
                "projectUntitled_investigation",
                JSON.stringify(
                    getState()
                )
            );

        } catch (error) {

            console.warn(
                "Investigation: unable to save state.",
                error
            );
        }
    }


    // =================================================
    // LOAD STATE
    // =================================================

    function load() {

        try {

            const saved =
                localStorage.getItem(
                    "projectUntitled_investigation"
                );

            if (!saved) {
                return false;
            }

            const data =
                JSON.parse(saved);


            state.started =
                data.started === true;

            state.completed =
                data.completed === true;

            state.discoveredClues =
                Array.isArray(
                    data.discoveredClues
                )
                    ? data.discoveredClues
                    : [];

            state.discoveredLocations =
                Array.isArray(
                    data.discoveredLocations
                )
                    ? data.discoveredLocations
                    : [];

            state.visitedWebsites =
                Array.isArray(
                    data.visitedWebsites
                )
                    ? data.visitedWebsites
                    : [];

            state.openedFiles =
                Array.isArray(
                    data.openedFiles
                )
                    ? data.openedFiles
                    : [];

            state.readEmails =
                Array.isArray(
                    data.readEmails
                )
                    ? data.readEmails
                    : [];

            state.readNotes =
                Array.isArray(
                    data.readNotes
                )
                    ? data.readNotes
                    : [];

            state.eventsTriggered =
                Array.isArray(
                    data.eventsTriggered
                )
                    ? data.eventsTriggered
                    : [];

            state.currentObjective =
                data.currentObjective ||
                null;


            return true;

        } catch (error) {

            console.warn(
                "Investigation: unable to load saved state.",
                error
            );

            return false;
        }
    }


    // =================================================
    // AUTO SAVE
    // =================================================

    document.addEventListener(
        "clueDiscovered",
        save
    );

    document.addEventListener(
        "locationDiscovered",
        save
    );

    document.addEventListener(
        "websiteVisited",
        save
    );

    document.addEventListener(
        "fileOpened",
        save
    );

    document.addEventListener(
        "emailRead",
        save
    );

    document.addEventListener(
        "noteRead",
        save
    );

    document.addEventListener(
        "investigationEvent",
        save
    );

    document.addEventListener(
        "objectiveChanged",
        save
    );

    document.addEventListener(
        "investigationCompleted",
        save
    );


    // =================================================
    // INITIALIZE
    // =================================================

    load();


    // =================================================
    // PUBLIC API
    // =================================================

    window.Investigation = {

        start:
            startInvestigation,

        reset:
            resetInvestigation,

        complete:
            completeInvestigation,

        discoverClue:
            discoverClue,

        hasClue:
            hasClue,

        getClues:
            getClues,

        discoverLocation:
            discoverLocation,

        hasVisitedLocation:
            hasVisitedLocation,

        visitWebsite:
            visitWebsite,

        hasVisitedWebsite:
            hasVisitedWebsite,

        openFile:
            openFile,

        hasOpenedFile:
            hasOpenedFile,

        readEmail:
            readEmail,

        hasReadEmail:
            hasReadEmail,

        readNote:
            readNote,

        hasReadNote:
            hasReadNote,

        triggerEvent:
            triggerEvent,

        hasTriggeredEvent:
            hasTriggeredEvent,

        setObjective:
            setObjective,

        getObjective:
            getObjective,

        getState:
            getState,

        save:
            save,

        load:
            load

    };


    // =================================================
    // LEGACY GLOBALS
    // =================================================

    window.startInvestigation =
        startInvestigation;

    window.discoverClue =
        discoverClue;

})();