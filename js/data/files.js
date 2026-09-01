// =====================================================
// PROJECT UNTITLED
// DATA — FILE SYSTEM
// =====================================================

(function () {

    "use strict";


    // =================================================
    // FILE SYSTEM DATABASE
    // =================================================

    const FILES = [

        // -------------------------------------------------
        // ROOT
        // -------------------------------------------------

        {
            id: "folder_documents",
            name: "Documents",
            type: "folder",
            path: "C:\\",
            fullPath: "C:\\Documents",
            icon: "📁"
        },

        {
            id: "folder_system",
            name: "System",
            type: "folder",
            path: "C:\\",
            fullPath: "C:\\System",
            icon: "📁"
        },

        {
            id: "folder_archive",
            name: "Archive",
            type: "folder",
            path: "C:\\",
            fullPath: "C:\\Archive",
            icon: "📁"
        },


        // -------------------------------------------------
        // DOCUMENTS
        // -------------------------------------------------

        {
            id: "folder_personal",
            name: "Personal",
            type: "folder",
            path: "C:\\Documents",
            fullPath: "C:\\Documents\\Personal",
            icon: "📁"
        },

        {
            id: "folder_work",
            name: "Work",
            type: "folder",
            path: "C:\\Documents",
            fullPath: "C:\\Documents\\Work",
            icon: "📁"
        },


        // -------------------------------------------------
        // PERSONAL DOCUMENTS
        // -------------------------------------------------

        {
            id: "note_schedule",
            name: "schedule.txt",
            type: "text",
            path: "C:\\Documents\\Personal",
            icon: "📄",

            title: "Schedule",

            content: `
OCTOBER 16

08:00 AM — Work
12:00 PM — Lunch
05:00 PM — Leave facility

10:00 PM — Meet Daniel

Do not forget the key.
`
        },

        {
            id: "note_phone",
            name: "phone_numbers.txt",
            type: "text",
            path: "C:\\Documents\\Personal",
            icon: "📄",

            title: "Phone Numbers",

            content: `
NORTH RIDGE

Security:
Ext. 114

Facilities:
Ext. 203

Administration:
Ext. 101

Daniel:
555-0194

Sarah:
555-0137

Marcus:
555-0118
`
        },


        // -------------------------------------------------
        // WORK DOCUMENTS
        // -------------------------------------------------

        {
            id: "note_maintenance",
            name: "maintenance.txt",
            type: "text",
            path: "C:\\Documents\\Work",
            icon: "📄",

            title: "Maintenance Notes",

            content: `
BUILDING 4

Maintenance inspection:

- Electrical panel checked
- Main hallway lights replaced
- Storage room inspected

Basement:

DO NOT ENTER WITHOUT AUTHORIZATION.

The lower-level door has been producing
an unusual electrical noise.

Facilities has been notified.
`
        },

        {
            id: "note_inventory",
            name: "inventory.txt",
            type: "text",
            path: "C:\\Documents\\Work",
            icon: "📄",

            title: "Inventory",

            content: `
ROOM 14

Current inventory:

3x fluorescent bulbs
2x electrical cables
1x toolbox
1x emergency radio
1x old access terminal

NOTE:

The terminal should have been removed
during the previous renovation.

It is still connected to the network.
`
        },


        // -------------------------------------------------
        // SYSTEM
        // -------------------------------------------------

        {
            id: "folder_logs",
            name: "Logs",
            type: "folder",
            path: "C:\\System",
            fullPath: "C:\\System\\Logs",
            icon: "📁"
        },

        {
            id: "folder_config",
            name: "Config",
            type: "folder",
            path: "C:\\System",
            fullPath: "C:\\System\\Config",
            icon: "📁"
        },


        // -------------------------------------------------
        // SYSTEM LOGS
        // -------------------------------------------------

        {
            id: "log_system",
            name: "system.log",
            type: "text",
            path: "C:\\System\\Logs",
            icon: "📄",

            title: "System Log",

            content: `
SYSTEM LOG
--------------------------------

10/15/1999 22:41
Network connection established.

10/15/1999 23:02
User login: ELIAS

10/16/1999 00:47
Access terminal activated.

10/16/1999 01:13
Lower maintenance level accessed.

10/16/1999 01:14
UNKNOWN DEVICE DETECTED.

10/16/1999 01:15
Connection terminated.

10/16/1999 01:16
User session remains active.

--------------------------------
END OF LOG
`
        },

        {
            id: "log_access",
            name: "access.log",
            type: "text",
            path: "C:\\System\\Logs",
            icon: "📄",

            title: "Access Log",

            content: `
NORTH RIDGE ACCESS SYSTEM

DATE        TIME       USER       LOCATION
------------------------------------------------

10/15       18:02      ELIAS      MAIN ENTRANCE
10/15       18:14      SARAH      ADMIN
10/15       19:31      DANIEL     SECURITY
10/15       22:58      ELIAS      MAIN ENTRANCE
10/16       01:13      ELIAS      LOWER LEVEL

10/16       01:13      ?????      LOWER LEVEL

10/16       01:14      ?????      LOWER LEVEL

10/16       01:15      ELIAS      UNKNOWN

------------------------------------------------

WARNING:

Two active access sessions detected.
`
        },


        // -------------------------------------------------
        // SYSTEM CONFIG
        // -------------------------------------------------

        {
            id: "config_network",
            name: "network.cfg",
            type: "text",
            path: "C:\\System\\Config",
            icon: "📄",

            title: "Network Configuration",

            content: `
NORTH RIDGE INTERNAL NETWORK

NETWORK: NR-INTERNAL

STATUS: ACTIVE

PRIMARY SERVER:
NR-SRV-01

ARCHIVE SERVER:
NR-ARCHIVE

UNKNOWN NODE:
NR-???

WARNING:

An unidentified device is connected
to the internal network.

Connection cannot be terminated
through normal system controls.
`
        },


        // -------------------------------------------------
        // ARCHIVE
        // -------------------------------------------------

        {
            id: "folder_1998",
            name: "1998",
            type: "folder",
            path: "C:\\Archive",
            fullPath: "C:\\Archive\\1998",
            icon: "📁"
        },

        {
            id: "folder_1999",
            name: "1999",
            type: "folder",
            path: "C:\\Archive",
            fullPath: "C:\\Archive\\1999",
            icon: "📁"
        },


        // -------------------------------------------------
        // 1998 ARCHIVE
        // -------------------------------------------------

        {
            id: "archive_incident",
            name: "incident_041.txt",
            type: "text",
            path: "C:\\Archive\\1998",
            icon: "📄",

            title: "Incident 041",

            content: `
NORTH RIDGE INTERNAL ARCHIVE

INCIDENT: 041
DATE: 06/21/1998

STATUS: CLOSED

DESCRIPTION:

A temporary loss of power occurred
in the lower maintenance area.

Three employees reported hearing
a mechanical sound coming from
behind the western wall.

No equipment was found.

The area was sealed.

END OF REPORT.
`
        },


        // -------------------------------------------------
        // 1999 ARCHIVE
        // -------------------------------------------------

        {
            id: "archive_maintenance",
            name: "maintenance_1999.txt",
            type: "text",
            path: "C:\\Archive\\1999",
            icon: "📄",

            title: "Maintenance Report 1999",

            content: `
NORTH RIDGE FACILITIES

ANNUAL MAINTENANCE REPORT
1999

BUILDING 4

Several rooms were inspected.

Most systems remain operational.

LOWER MAINTENANCE LEVEL:

Inspection unavailable.

Reason:

ACCESS RESTRICTED.

Previous inspection records
have been removed from the archive.

AUTHORIZED PERSONNEL ONLY.
`
        },

        {
            id: "archive_missing",
            name: "missing_pages.txt",
            type: "text",
            path: "C:\\Archive\\1999",
            icon: "📄",

            title: "Missing Pages",

            content: `
ARCHIVE ERROR

DOCUMENT:

BUILDING4_LOWERLEVEL_REPORT

STATUS:

INCOMPLETE

PAGES MISSING:

04
05
06
07

LAST MODIFIED:

10/15/1999 — 23:51

USER:

ELIAS

--------------------------------

The original document may still exist
on the archive server.
`
        },


        // -------------------------------------------------
        // SPECIAL FILE
        // -------------------------------------------------

        {
            id: "note_readme",
            name: "README.txt",
            type: "text",
            path: "C:\\",
            icon: "📄",

            title: "README",

            content: `
NORTH RIDGE COMPUTER SYSTEM
--------------------------------

This computer belongs to:

ELIAS VANCE

PROPERTY OF NORTH RIDGE FACILITIES

If you are reading this file,
you are probably looking for something.

Start with the Documents folder.

Then check the System logs.

If you find anything unusual:

DO NOT DELETE IT.

--------------------------------
`
        }

    ];


    // =================================================
    // EXPOSE DATABASE
    // =================================================

    window.FILES = FILES;


})();