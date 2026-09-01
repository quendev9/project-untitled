// =====================================================
// PROJECT UNTITLED
// GAME — CLUES
// =====================================================

(function () {

    "use strict";


    // =================================================
    // CLUE DATABASE
    // =================================================

    /*
        Every clue has:

        id
            Unique identifier.

        title
            Name displayed to the player.

        type
            Used to categorize the clue.

        description
            What the player sees after discovering it.

        source
            Where the clue came from.

        importance
            How important the clue is to the investigation.

        related
            IDs of clues connected to this clue.

        discovered
            Whether the player has found it yet.
    */

    const clues = [

        // -------------------------------------------------
        // NORTH RIDGE
        // -------------------------------------------------

        {
            id: "clue_north_ridge_report",

            title: "North Ridge Incident Report",

            type: "document",

            description:
                "An official incident report concerning the disappearance at North Ridge. Several sections appear to have been redacted.",

            source: "Documents",

            importance: 3,

            related: [
                "clue_missing_person",
                "clue_black_vehicle"
            ],

            discovered: false
        },


        {
            id: "clue_missing_person",

            title: "Missing Person Record",

            type: "record",

            description:
                "A personnel record for someone reported missing shortly after the North Ridge incident.",

            source: "Files",

            importance: 3,

            related: [
                "clue_north_ridge_report",
                "clue_last_known_location"
            ],

            discovered: false
        },


        {
            id: "clue_last_known_location",

            title: "Last Known Location",

            type: "location",

            description:
                "The missing person's last confirmed location was recorded near an abandoned service road outside North Ridge.",

            source: "Police Database",

            importance: 4,

            related: [
                "clue_missing_person",
                "clue_black_vehicle",
                "clue_service_road"
            ],

            discovered: false
        },


        // -------------------------------------------------
        // VEHICLE
        // -------------------------------------------------

        {
            id: "clue_black_vehicle",

            title: "Black Vehicle",

            type: "evidence",

            description:
                "Several witnesses reported seeing an unidentified black vehicle near North Ridge on the night of the incident.",

            source: "Witness Reports",

            importance: 4,

            related: [
                "clue_north_ridge_report",
                "clue_last_known_location",
                "clue_license_plate"
            ],

            discovered: false
        },


        {
            id: "clue_license_plate",

            title: "Partial License Plate",

            type: "evidence",

            description:
                "A witness remembered part of the vehicle's license plate. Only four characters could be confirmed.",

            source: "Witness Statement",

            importance: 5,

            related: [
                "clue_black_vehicle",
                "clue_vehicle_record"
            ],

            discovered: false
        },


        {
            id: "clue_vehicle_record",

            title: "Vehicle Registration",

            type: "record",

            description:
                "A vehicle registration matching the partial plate was found in an old database entry. The owner information has been partially removed.",

            source: "Government Database",

            importance: 5,

            related: [
                "clue_license_plate",
                "clue_redacted_owner"
            ],

            discovered: false
        },


        {
            id: "clue_redacted_owner",

            title: "Redacted Vehicle Owner",

            type: "record",

            description:
                "The vehicle's registered owner appears to have been deliberately removed from the accessible record.",

            source: "Government Database",

            importance: 5,

            related: [
                "clue_vehicle_record",
                "clue_government_notice"
            ],

            discovered: false
        },


        // -------------------------------------------------
        // SERVICE ROAD
        // -------------------------------------------------

        {
            id: "clue_service_road",

            title: "Service Road Map",

            type: "location",

            description:
                "An old map shows a maintenance road leading toward a restricted section of North Ridge.",

            source: "Archive",

            importance: 4,

            related: [
                "clue_last_known_location",
                "clue_old_facility"
            ],

            discovered: false
        },


        {
            id: "clue_old_facility",

            title: "Abandoned Facility",

            type: "location",

            description:
                "The service road leads to an abandoned facility that officially ceased operation years ago.",

            source: "Archive",

            importance: 5,

            related: [
                "clue_service_road",
                "clue_facility_shutdown"
            ],

            discovered: false
        },


        {
            id: "clue_facility_shutdown",

            title: "Facility Shutdown Notice",

            type: "document",

            description:
                "The facility was officially shut down after an unexplained equipment failure. The original report contains several missing pages.",

            source: "Government Archive",

            importance: 5,

            related: [
                "clue_old_facility",
                "clue_missing_pages"
            ],

            discovered: false
        },


        {
            id: "clue_missing_pages",

            title: "Missing Archive Pages",

            type: "document",

            description:
                "The archive references several pages that are no longer present. Someone appears to have removed them after the shutdown.",

            source: "Government Archive",

            importance: 5,

            related: [
                "clue_facility_shutdown",
                "clue_archive_access"
            ],

            discovered: false
        },


        // -------------------------------------------------
        // GOVERNMENT CONNECTION
        // -------------------------------------------------

        {
            id: "clue_government_notice",

            title: "Restricted Information Notice",

            type: "government",

            description:
                "A government notice warns unauthorized personnel against accessing information connected to the North Ridge facility.",

            source: "Government Website",

            importance: 5,

            related: [
                "clue_redacted_owner",
                "clue_archive_access"
            ],

            discovered: false
        },


        {
            id: "clue_archive_access",

            title: "Unauthorized Archive Access",

            type: "digital",

            description:
                "A system log indicates that restricted archive files were accessed several times after the facility was supposedly abandoned.",

            source: "System Logs",

            importance: 5,

            related: [
                "clue_missing_pages",
                "clue_government_notice",
                "clue_unknown_user"
            ],

            discovered: false
        },


        {
            id: "clue_unknown_user",

            title: "Unknown User Account",

            type: "digital",

            description:
                "The restricted archive was accessed using an account that does not appear in the current employee database.",

            source: "System Logs",

            importance: 5,

            related: [
                "clue_archive_access",
                "clue_elias_connection"
            ],

            discovered: false
        },


        // -------------------------------------------------
        // ELIAS
        // -------------------------------------------------

        {
            id: "clue_elias_connection",

            title: "Elias Connection",

            type: "person",

            description:
                "Several unrelated records contain references to someone named Elias. The connection between these records is unclear.",

            source: "Multiple Sources",

            importance: 5,

            related: [
                "clue_unknown_user",
                "clue_elias_note",
                "clue_elias_timestamp"
            ],

            discovered: false
        },


        {
            id: "clue_elias_note",

            title: "Handwritten Note",

            type: "document",

            description:
                "A short handwritten note contains the name 'Elias' and a warning not to trust the official records.",

            source: "Personal Files",

            importance: 5,

            related: [
                "clue_elias_connection",
                "clue_fake_report"
            ],

            discovered: false
        },


        {
            id: "clue_elias_timestamp",

            title: "Impossible Timestamp",

            type: "digital",

            description:
                "A system record attributed to Elias appears to have been created after the account was supposedly deactivated.",

            source: "System Logs",

            importance: 5,

            related: [
                "clue_elias_connection",
                "clue_fake_report"
            ],

            discovered: false
        },


        // -------------------------------------------------
        // FALSE INFORMATION
        // -------------------------------------------------

        {
            id: "clue_fake_report",

            title: "Altered Report",

            type: "document",

            description:
                "A copy of the official report differs from the archived version. Dates, names, and several key details have been changed.",

            source: "Archive",

            importance: 5,

            related: [
                "clue_elias_note",
                "clue_elias_timestamp",
                "clue_document_tampering"
            ],

            discovered: false
        },


        {
            id: "clue_document_tampering",

            title: "Document Tampering",

            type: "evidence",

            description:
                "The metadata suggests that official documents were modified after their original creation dates.",

            source: "File Metadata",

            importance: 5,

            related: [
                "clue_fake_report",
                "clue_unknown_user"
            ],

            discovered: false
        }

    ];


    // =================================================
    // INTERNAL HELPERS
    // =================================================

    function findClue(id) {

        return clues.find(function (clue) {

            return clue.id === id;

        }) || null;
    }


    function cloneClue(clue) {

        if (!clue) {
            return null;
        }

        return {
            id: clue.id,
            title: clue.title,
            type: clue.type,
            description: clue.description,
            source: clue.source,
            importance: clue.importance,
            related: [...clue.related],
            discovered: clue.discovered
        };
    }


    // =================================================
    // DISCOVER CLUE
    // =================================================

    function discoverClue(id) {

        const clue = findClue(id);

        if (!clue) {

            console.warn(
                "Clues: attempted to discover unknown clue:",
                id
            );

            return null;
        }


        // Already discovered.

        if (clue.discovered) {
            return cloneClue(clue);
        }


        clue.discovered = true;


        // Tell the investigation system.

        document.dispatchEvent(
            new CustomEvent(
                "clueDiscovered",
                {
                    detail: {
                        clue: cloneClue(clue)
                    }
                }
            )
        );


        return cloneClue(clue);
    }


    // =================================================
    // HIDE / RESET CLUE
    // =================================================

    function undiscoverClue(id) {

        const clue = findClue(id);

        if (!clue) {
            return false;
        }

        clue.discovered = false;

        return true;
    }


    // =================================================
    // GET CLUE
    // =================================================

    function getClue(id) {

        const clue = findClue(id);

        return cloneClue(clue);
    }


    // =================================================
    // GET ALL CLUES
    // =================================================

    function getAllClues() {

        return clues.map(function (clue) {

            return cloneClue(clue);

        });

    }


    // =================================================
    // GET DISCOVERED CLUES
    // =================================================

    function getDiscoveredClues() {

        return clues
            .filter(function (clue) {

                return clue.discovered;

            })
            .map(function (clue) {

                return cloneClue(clue);

            });

    }


    // =================================================
    // GET UNDISCOVERED CLUES
    // =================================================

    function getUndiscoveredClues() {

        return clues
            .filter(function (clue) {

                return !clue.discovered;

            })
            .map(function (clue) {

                return cloneClue(clue);

            });

    }


    // =================================================
    // GET RELATED CLUES
    // =================================================

    function getRelatedClues(id) {

        const clue = findClue(id);

        if (!clue) {
            return [];
        }


        return clue.related
            .map(function (relatedId) {

                return findClue(relatedId);

            })
            .filter(function (relatedClue) {

                return relatedClue !== null;

            })
            .map(function (relatedClue) {

                return cloneClue(relatedClue);

            });

    }


    // =================================================
    // GET CLUES BY TYPE
    // =================================================

    function getCluesByType(type) {

        if (!type) {
            return [];
        }


        return clues
            .filter(function (clue) {

                return clue.type === type;

            })
            .map(function (clue) {

                return cloneClue(clue);

            });

    }


    // =================================================
    // GET CLUES BY IMPORTANCE
    // =================================================

    function getImportantClues(minimumImportance = 4) {

        return clues
            .filter(function (clue) {

                return (
                    clue.importance >=
                    minimumImportance
                );

            })
            .map(function (clue) {

                return cloneClue(clue);

            });

    }


    // =================================================
    // CHECK DISCOVERY
    // =================================================

    function isDiscovered(id) {

        const clue = findClue(id);

        if (!clue) {
            return false;
        }

        return clue.discovered;
    }


    // =================================================
    // DISCOVERY COUNT
    // =================================================

    function getDiscoveryCount() {

        return clues.filter(
            function (clue) {

                return clue.discovered;

            }
        ).length;

    }


    function getTotalCount() {

        return clues.length;

    }


    // =================================================
    // INVESTIGATION COMPLETION
    // =================================================

    function getCompletionPercentage() {

        if (clues.length === 0) {
            return 0;
        }


        return Math.round(
            (
                getDiscoveryCount() /
                clues.length
            ) * 100
        );

    }


    // =================================================
    // RESET ALL CLUES
    // =================================================

    function reset() {

        clues.forEach(function (clue) {

            clue.discovered = false;

        });


        document.dispatchEvent(
            new CustomEvent(
                "cluesReset"
            )
        );

    }


    // =================================================
    // DEBUGGING
    // =================================================

    function debug() {

        console.group(
            "PROJECT UNTITLED — CLUE DATABASE"
        );

        console.log(
            "Total clues:",
            clues.length
        );

        console.log(
            "Discovered:",
            getDiscoveryCount()
        );

        console.log(
            "Completion:",
            getCompletionPercentage() + "%"
        );

        console.table(
            clues.map(function (clue) {

                return {
                    ID: clue.id,
                    Title: clue.title,
                    Type: clue.type,
                    Importance: clue.importance,
                    Discovered: clue.discovered
                };

            })
        );

        console.groupEnd();

    }


    // =================================================
    // PUBLIC API
    // =================================================

    window.ClueSystem = {

        get: getClue,

        getAll: getAllClues,

        getDiscovered: getDiscoveredClues,

        getUndiscovered: getUndiscoveredClues,

        getRelated: getRelatedClues,

        getByType: getCluesByType,

        getImportant: getImportantClues,

        discover: discoverClue,

        undiscover: undiscoverClue,

        isDiscovered: isDiscovered,

        getDiscoveryCount: getDiscoveryCount,

        getTotalCount: getTotalCount,

        getCompletionPercentage:
            getCompletionPercentage,

        reset: reset,

        debug: debug

    };


    // =================================================
    // LEGACY / SIMPLE ACCESS
    // =================================================

    window.getClue = getClue;
    window.discoverClue = discoverClue;


    // =================================================
    // READY EVENT
    // =================================================

    document.dispatchEvent(
        new CustomEvent(
            "clueSystemReady"
        )
    );


})();