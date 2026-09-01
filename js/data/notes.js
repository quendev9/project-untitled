// =====================================================
// PROJECT UNTITLED
// DATA — NOTES
// =====================================================

(function () {

    "use strict";


    // =================================================
    // NOTEPAD DATABASE
    // =================================================

    const NOTES = [

        // -------------------------------------------------
        // NOTE 001 — PERSONAL
        // -------------------------------------------------

        {
            id: "note_001",

            title: "Things to Remember",

            date: "10/14/1999",

            modified: "08:14 PM",

            content:
`Things to remember:

- Pick up the spare key.
- Call Daniel.
- Finish the maintenance report.
- Check the basement lights.

Don't forget the appointment Friday.`

        },


        // -------------------------------------------------
        // NOTE 002 — MAINTENANCE
        // -------------------------------------------------

        {
            id: "note_002",

            title: "Maintenance Notes",

            date: "10/15/1999",

            modified: "06:32 PM",

            content:
`BUILDING 4

Maintenance checklist:

[✓] Main hallway
[✓] Electrical room
[✓] Storage room
[ ] Lower maintenance

Lower maintenance door is locked.

Key should be in the facilities cabinet.

Something is wrong with the lock.

It looks like someone tried to open it
from the other side.`

        },


        // -------------------------------------------------
        // NOTE 003 — PHONE MESSAGE
        // -------------------------------------------------

        {
            id: "note_003",

            title: "Phone Message",

            date: "10/15/1999",

            modified: "09:05 PM",

            content:
`PHONE MESSAGE

Daniel called.

He sounded nervous.

He said:

"Don't use the main entrance."

He wouldn't explain why.

Asked me to meet him later.

10:00 PM.

Old maintenance office.`

        },


        // -------------------------------------------------
        // NOTE 004 — STRANGE OBSERVATION
        // -------------------------------------------------

        {
            id: "note_004",

            title: "Observation",

            date: "10/16/1999",

            modified: "12:48 AM",

            content:
`Something is wrong with the lower level.

The lights turn on even when
the breaker is off.

I checked the wiring.

There shouldn't be power down there.

I heard something behind the wall.

Three knocks.

Then silence.

I am not going back down there alone.`

        },


        // -------------------------------------------------
        // NOTE 005 — HANDWRITTEN
        // -------------------------------------------------

        {
            id: "note_005",

            title: "DO NOT FORGET",

            date: "10/16/1999",

            modified: "01:02 AM",

            content:
`DO NOT FORGET

The door.

The old terminal.

The number:

041

I don't know what it means yet.

Need to check the archive.

If Daniel is right,
someone has been using the old system.`

        },


        // -------------------------------------------------
        // NOTE 006 — PASSWORD
        // -------------------------------------------------

        {
            id: "note_006",

            title: "Old Passwords",

            date: "10/16/1999",

            modified: "01:17 AM",

            content:
`OLD SYSTEM PASSWORDS

Facilities:
NORTHRIDGE

Archive:
ARCHIVE99

Maintenance:
MNT-041

Terminal:
[REMOVED]

One password doesn't belong here.

NR-041

I don't remember creating it.`

        },


        // -------------------------------------------------
        // NOTE 007 — CORRUPTED NOTE
        // -------------------------------------------------

        {
            id: "note_007",

            title: "untitled.txt",

            date: "10/16/1999",

            modified: "01:29 AM",

            content:
`ERROR: FILE CONTENT DAMAGED

Beginning recovery...

--------------------------------

...door...

...someone was already there...

...terminal was running...

...screen said:

USER: ELIAS

but I wasn't logged in.

--------------------------------

RECOVERY FAILED.

Some text could not be recovered.`

        },


        // -------------------------------------------------
        // NOTE 008 — MAP
        // -------------------------------------------------

        {
            id: "note_008",

            title: "Building 4 Layout",

            date: "10/16/1999",

            modified: "01:36 AM",

            content:
`BUILDING 4

MAIN FLOOR
|
|-- Administration
|-- Security
|-- Storage
|
|-- Maintenance
      |
      |-- Electrical
      |
      |-- Records
      |
      |-- LOWER LEVEL
             |
             |-- ????
             |
             |-- ARCHIVE TERMINAL

The original building plans
show another room.

It isn't on the current plans.`

        },


        // -------------------------------------------------
        // NOTE 009 — DANIEL
        // -------------------------------------------------

        {
            id: "note_009",

            title: "Daniel",

            date: "10/16/1999",

            modified: "01:44 AM",

            content:
`Daniel knows something.

He said the lower level
was sealed years ago.

He said nobody should know
about the old terminal.

Then he asked me:

"Did you see the second door?"

I didn't tell him that I did.`

        },


        // -------------------------------------------------
        // NOTE 010 — FINAL NOTE
        // -------------------------------------------------

        {
            id: "note_010",

            title: "Last Entry",

            date: "10/16/1999",

            modified: "01:51 AM",

            content:
`01:51 AM

I found the archive.

There are records from 1998
that shouldn't exist.

Someone deleted most of them.

But they missed one.

Incident 041.

I'm going to open it.

If this computer shuts down,
the information should still be here.

I think someone is watching this terminal.

--------------------------------

END OF ENTRY`

        }

    ];


    // =================================================
    // EXPOSE DATABASE
    // =================================================

    window.NOTES = NOTES;


})();