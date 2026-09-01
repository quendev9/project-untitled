// =====================================================
// PROJECT UNTITLED
// DATA — EMAILS
// =====================================================

(function () {

    "use strict";


    // =================================================
    // EMAIL DATABASE
    // =================================================

    const EMAILS = [

        {
            id: "email_001",

            sender: "marcus.hale@northridge.local",

            senderName: "Marcus Hale",

            recipient: "elias@northridge.local",

            subject: "RE: Maintenance Request",

            date: "10/14/1999",

            time: "08:42 PM",

            read: false,

            body: `
Elias,

The maintenance request for Building 4 has been approved.

Someone from facilities should come by tomorrow morning.

Keep the basement door locked until then.

— Marcus
`
        },


        {
            id: "email_002",

            sender: "sarah.miller@northridge.local",

            senderName: "Sarah Miller",

            recipient: "elias@northridge.local",

            subject: "You still have the key?",

            date: "10/15/1999",

            time: "09:17 AM",

            read: false,

            body: `
Elias,

Do you still have the spare key for the records room?

I checked the cabinet this morning and it wasn't there.

Please let me know.

Sarah
`
        },


        {
            id: "email_003",

            sender: "unknown@northridge.local",

            senderName: "Unknown Sender",

            recipient: "elias@northridge.local",

            subject: "Don't go downstairs.",

            date: "10/15/1999",

            time: "11:03 PM",

            read: false,

            body: `
Elias,

I don't know if you're going to read this.

But if you do:

Don't go downstairs.

You weren't supposed to find the door.

Forget you saw anything.

Do not reply to this message.
`
        },


        {
            id: "email_004",

            sender: "admin@northridge.local",

            senderName: "North Ridge Administration",

            recipient: "elias@northridge.local",

            subject: "System Maintenance Notice",

            date: "10/16/1999",

            time: "06:30 AM",

            read: true,

            body: `
NOTICE

The North Ridge internal network will undergo scheduled maintenance tonight.

Expected downtime:

11:00 PM — 02:00 AM

During this period, access to archived records may be unavailable.

North Ridge Administration
`
        },


        {
            id: "email_005",

            sender: "daniel.ross@northridge.local",

            senderName: "Daniel Ross",

            recipient: "elias@northridge.local",

            subject: "About last night",

            date: "10/16/1999",

            time: "07:11 AM",

            read: false,

            body: `
Elias,

I saw you leaving the facility last night.

You looked like you had seen a ghost.

Whatever happened down there, don't tell anyone yet.

We need to talk in person.

Come to the old maintenance office.

10:00 PM.

Daniel
`
        },


        {
            id: "email_006",

            sender: "elias@northridge.local",

            senderName: "Elias",

            recipient: "marcus.hale@northridge.local",

            subject: "RE: Maintenance Request",

            date: "10/16/1999",

            time: "09:26 AM",

            read: true,

            body: `
Marcus,

Thanks.

I'll take care of it.

Elias
`
        },


        {
            id: "email_007",

            sender: "security@northridge.local",

            senderName: "North Ridge Security",

            recipient: "elias@northridge.local",

            subject: "Access Log Irregularity",

            date: "10/16/1999",

            time: "01:42 AM",

            read: false,

            body: `
Elias,

Our access system recorded your badge entering the lower maintenance level at 01:13 AM.

There is no corresponding exit record.

Please contact security immediately.

Security Office
North Ridge Facility
`
        },


        {
            id: "email_008",

            sender: "unknown@northridge.local",

            senderName: "Unknown Sender",

            recipient: "elias@northridge.local",

            subject: "RE: Don't go downstairs.",

            date: "10/16/1999",

            time: "02:04 AM",

            read: false,

            body: `
You went anyway.

I told you not to.

Now they know you were there.

Delete this message.

`
        }

    ];


    // =================================================
    // EXPOSE DATA
    // =================================================

    window.EMAILS = EMAILS;


})();