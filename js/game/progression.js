// =====================================================
// PROJECT UNTITLED
// GAME — PROGRESSION
// =====================================================

(function () {

    "use strict";


    // =================================================
    // GAME STATE
    // =================================================

    const defaultProgression = {
        started: false,

        currentCase: "north-ridge",

        cluesFound: [],

        investigationStage: 0,

        completedObjectives: [],

        unlockedFiles: [],

        unlockedEmails: [],

        unlockedWebsites: [],

        endingsUnlocked: [],

        gameComplete: false
    };


    let progression = loadProgression();


    // =================================================
    // LOAD / SAVE
    // =================================================

    function loadProgression() {

        try {

            const saved =
                localStorage.getItem(
                    "projectUntitledProgression"
                );

            if (!saved) {

                return {
                    ...defaultProgression,
                    cluesFound: [],
                    completedObjectives: [],
                    unlockedFiles: [],
                    unlockedEmails: [],
                    unlockedWebsites: [],
                    endingsUnlocked: []
                };
            }


            const parsed =
                JSON.parse(saved);


            return {
                ...defaultProgression,
                ...parsed,

                cluesFound:
                    Array.isArray(parsed.cluesFound)
                        ? parsed.cluesFound
                        : [],

                completedObjectives:
                    Array.isArray(
                        parsed.completedObjectives
                    )
                        ? parsed.completedObjectives
                        : [],

                unlockedFiles:
                    Array.isArray(
                        parsed.unlockedFiles
                    )
                        ? parsed.unlockedFiles
                        : [],

                unlockedEmails:
                    Array.isArray(
                        parsed.unlockedEmails
                    )
                        ? parsed.unlockedEmails
                        : [],

                unlockedWebsites:
                    Array.isArray(
                        parsed.unlockedWebsites
                    )
                        ? parsed.unlockedWebsites
                        : [],

                endingsUnlocked:
                    Array.isArray(
                        parsed.endingsUnlocked
                    )
                        ? parsed.endingsUnlocked
                        : []
            };

        } catch (error) {

            console.error(
                "Progression: failed to load saved game.",
                error
            );

            return {
                ...defaultProgression,
                cluesFound: [],
                completedObjectives: [],
                unlockedFiles: [],
                unlockedEmails: [],
                unlockedWebsites: [],
                endingsUnlocked: []
            };
        }
    }


    function saveProgression() {

        try {

            localStorage.setItem(
                "projectUntitledProgression",
                JSON.stringify(progression)
            );

            document.dispatchEvent(
                new CustomEvent(
                    "progressionSaved",
                    {
                        detail: getProgression()
                    }
                )
            );

        } catch (error) {

            console.error(
                "Progression: failed to save game.",
                error
            );
        }
    }


    // =================================================
    // UTILITY
    // =================================================

    function contains(array, value) {

        return Array.isArray(array) &&
               array.includes(value);
    }


    function addUnique(array, value) {

        if (!Array.isArray(array)) {
            return false;
        }

        if (array.includes(value)) {
            return false;
        }

        array.push(value);

        return true;
    }


    function removeValue(array, value) {

        if (!Array.isArray(array)) {
            return false;
        }

        const index =
            array.indexOf(value);

        if (index === -1) {
            return false;
        }

        array.splice(index, 1);

        return true;
    }


    // =================================================
    // START GAME
    // =================================================

    function startGame(caseId = "north-ridge") {

        progression.started = true;

        progression.currentCase =
            caseId || "north-ridge";

        progression.gameComplete = false;

        saveProgression();

        document.dispatchEvent(
            new CustomEvent(
                "gameStarted",
                {
                    detail: {
                        caseId:
                            progression.currentCase
                    }
                }
            )
        );

        return true;
    }


    // =================================================
    // CLUES
    // =================================================

    function unlockClue(clueId) {

        if (!clueId) {
            return false;
        }

        const added =
            addUnique(
                progression.cluesFound,
                clueId
            );

        if (added) {

            saveProgression();

            document.dispatchEvent(
                new CustomEvent(
                    "clueUnlocked",
                    {
                        detail: {
                            clueId,
                            totalClues:
                                progression.cluesFound.length
                        }
                    }
                )
            );
        }

        return added;
    }


    function hasClue(clueId) {

        return contains(
            progression.cluesFound,
            clueId
        );
    }


    function getClues() {

        return [
            ...progression.cluesFound
        ];
    }


    // =================================================
    // INVESTIGATION STAGE
    // =================================================

    function setInvestigationStage(stage) {

        stage =
            Number(stage);


        if (
            Number.isNaN(stage) ||
            stage < 0
        ) {

            return false;
        }


        if (
            stage <
            progression.investigationStage
        ) {

            return false;
        }


        progression.investigationStage =
            stage;


        saveProgression();


        document.dispatchEvent(
            new CustomEvent(
                "investigationStageChanged",
                {
                    detail: {
                        stage
                    }
                }
            )
        );


        return true;
    }


    function getInvestigationStage() {

        return progression.investigationStage;
    }


    function advanceInvestigation() {

        return setInvestigationStage(
            progression.investigationStage + 1
        );
    }


    // =================================================
    // OBJECTIVES
    // =================================================

    function completeObjective(objectiveId) {

        if (!objectiveId) {
            return false;
        }


        const added =
            addUnique(
                progression.completedObjectives,
                objectiveId
            );


        if (added) {

            saveProgression();


            document.dispatchEvent(
                new CustomEvent(
                    "objectiveCompleted",
                    {
                        detail: {
                            objectiveId
                        }
                    }
                )
            );
        }


        return added;
    }


    function hasCompletedObjective(
        objectiveId
    ) {

        return contains(
            progression.completedObjectives,
            objectiveId
        );
    }


    function getCompletedObjectives() {

        return [
            ...progression.completedObjectives
        ];
    }


    // =================================================
    // FILE UNLOCKS
    // =================================================

    function unlockFile(fileId) {

        if (!fileId) {
            return false;
        }


        const added =
            addUnique(
                progression.unlockedFiles,
                fileId
            );


        if (added) {

            saveProgression();


            document.dispatchEvent(
                new CustomEvent(
                    "fileUnlocked",
                    {
                        detail: {
                            fileId
                        }
                    }
                )
            );
        }


        return added;
    }


    function isFileUnlocked(fileId) {

        return contains(
            progression.unlockedFiles,
            fileId
        );
    }


    function getUnlockedFiles() {

        return [
            ...progression.unlockedFiles
        ];
    }


    // =================================================
    // EMAIL UNLOCKS
    // =================================================

    function unlockEmail(emailId) {

        if (!emailId) {
            return false;
        }


        const added =
            addUnique(
                progression.unlockedEmails,
                emailId
            );


        if (added) {

            saveProgression();


            document.dispatchEvent(
                new CustomEvent(
                    "emailUnlocked",
                    {
                        detail: {
                            emailId
                        }
                    }
                )
            );
        }


        return added;
    }


    function isEmailUnlocked(emailId) {

        return contains(
            progression.unlockedEmails,
            emailId
        );
    }


    function getUnlockedEmails() {

        return [
            ...progression.unlockedEmails
        ];
    }


    // =================================================
    // WEBSITE UNLOCKS
    // =================================================

    function unlockWebsite(websiteId) {

        if (!websiteId) {
            return false;
        }


        const added =
            addUnique(
                progression.unlockedWebsites,
                websiteId
            );


        if (added) {

            saveProgression();


            document.dispatchEvent(
                new CustomEvent(
                    "websiteUnlocked",
                    {
                        detail: {
                            websiteId
                        }
                    }
                )
            );
        }


        return added;
    }


    function isWebsiteUnlocked(
        websiteId
    ) {

        return contains(
            progression.unlockedWebsites,
            websiteId
        );
    }


    function getUnlockedWebsites() {

        return [
            ...progression.unlockedWebsites
        ];
    }


    // =================================================
    // ENDINGS
    // =================================================

    function unlockEnding(endingId) {

        if (!endingId) {
            return false;
        }


        const added =
            addUnique(
                progression.endingsUnlocked,
                endingId
            );


        if (added) {

            saveProgression();


            document.dispatchEvent(
                new CustomEvent(
                    "endingUnlocked",
                    {
                        detail: {
                            endingId
                        }
                    }
                )
            );
        }


        return added;
    }


    function hasEnding(endingId) {

        return contains(
            progression.endingsUnlocked,
            endingId
        );
    }


    function getEndings() {

        return [
            ...progression.endingsUnlocked
        ];
    }


    // =================================================
    // COMPLETE GAME
    // =================================================

    function completeGame(endingId = null) {

        progression.gameComplete = true;


        if (endingId) {

            addUnique(
                progression.endingsUnlocked,
                endingId
            );
        }


        saveProgression();


        document.dispatchEvent(
            new CustomEvent(
                "gameCompleted",
                {
                    detail: {
                        endingId
                    }
                }
            )
        );


        return true;
    }


    function isGameComplete() {

        return progression.gameComplete;
    }


    // =================================================
    // CURRENT CASE
    // =================================================

    function getCurrentCase() {

        return progression.currentCase;
    }


    function setCurrentCase(caseId) {

        if (!caseId) {
            return false;
        }


        progression.currentCase =
            caseId;


        saveProgression();


        return true;
    }


    // =================================================
    // GET COMPLETE PROGRESSION
    // =================================================

    function getProgression() {

        return {
            started:
                progression.started,

            currentCase:
                progression.currentCase,

            cluesFound:
                [...progression.cluesFound],

            investigationStage:
                progression.investigationStage,

            completedObjectives:
                [
                    ...progression.completedObjectives
                ],

            unlockedFiles:
                [
                    ...progression.unlockedFiles
                ],

            unlockedEmails:
                [
                    ...progression.unlockedEmails
                ],

            unlockedWebsites:
                [
                    ...progression.unlockedWebsites
                ],

            endingsUnlocked:
                [
                    ...progression.endingsUnlocked
                ],

            gameComplete:
                progression.gameComplete
        };
    }


    // =================================================
    // RESET GAME
    // =================================================

    function resetProgression() {

        progression = {
            ...defaultProgression,

            cluesFound: [],

            completedObjectives: [],

            unlockedFiles: [],

            unlockedEmails: [],

            unlockedWebsites: [],

            endingsUnlocked: []
        };


        saveProgression();


        document.dispatchEvent(
            new CustomEvent(
                "progressionReset"
            )
        );


        return true;
    }


    // =================================================
    // DEBUG
    // =================================================

    function debug() {

        console.log(
            "PROJECT UNTITLED — PROGRESSION"
        );

        console.table(
            getProgression()
        );

        return getProgression();
    }


    // =================================================
    // PUBLIC API
    // =================================================

    window.Progression = {

        // Game
        startGame,
        completeGame,
        isGameComplete,

        // Case
        getCurrentCase,
        setCurrentCase,

        // Clues
        unlockClue,
        hasClue,
        getClues,

        // Investigation
        setInvestigationStage,
        getInvestigationStage,
        advanceInvestigation,

        // Objectives
        completeObjective,
        hasCompletedObjective,
        getCompletedObjectives,

        // Files
        unlockFile,
        isFileUnlocked,
        getUnlockedFiles,

        // Emails
        unlockEmail,
        isEmailUnlocked,
        getUnlockedEmails,

        // Websites
        unlockWebsite,
        isWebsiteUnlocked,
        getUnlockedWebsites,

        // Endings
        unlockEnding,
        hasEnding,
        getEndings,

        // Save / load
        save: saveProgression,
        get: getProgression,
        reset: resetProgression,

        // Debug
        debug
    };


    // =================================================
    // LEGACY GLOBALS
    // =================================================

    window.getGameProgress =
        getProgression;

    window.saveGameProgress =
        saveProgression;


    // =================================================
    // INITIALIZATION
    // =================================================

    console.log(
        "Progression system initialized."
    );

})();