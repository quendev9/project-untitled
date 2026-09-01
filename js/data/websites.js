 // =====================================================
// PROJECT UNTITLED
// DATA — WEBSITES
// =====================================================

(function () {

    "use strict";


    // =================================================
    // WEBSITE DATABASE
    // =================================================

    const WEBSITES = [

        // -------------------------------------------------
        // NORTH RIDGE INTERNAL
        // -------------------------------------------------

        {
            id: "site_northridge",

            domain: "northridge.local",

            title: "North Ridge Facilities",

            category: "internal",

            description:
                "North Ridge Facility internal information portal.",

            searchable: true,

            content: {
                heading: "NORTH RIDGE FACILITIES",

                text:
`Welcome to the North Ridge Facilities
internal information portal.

AUTHORIZED PERSONNEL ONLY.

Departments:

• Administration
• Security
• Facilities
• Records
• Maintenance

For system assistance, contact
the Network Administration Office.`
            }
        },


        // -------------------------------------------------
        // NORTH RIDGE DIRECTORY
        // -------------------------------------------------

        {
            id: "site_directory",

            domain: "directory.northridge.local",

            title: "North Ridge Employee Directory",

            category: "internal",

            description:
                "Employee directory for North Ridge personnel.",

            searchable: true,

            content: {
                heading: "EMPLOYEE DIRECTORY",

                text:
`NORTH RIDGE EMPLOYEE DIRECTORY

Administration
----------------
Marcus Hale
Ext. 101

Sarah Miller
Ext. 137

Facilities
----------------
Elias Vance
Ext. 203

Daniel Ross
Ext. 194

Security
----------------
Robert Kane
Ext. 114

NOTE:

Several employee records are
currently unavailable.`
            }
        },


        // -------------------------------------------------
        // NORTH RIDGE SECURITY
        // -------------------------------------------------

        {
            id: "site_security",

            domain: "security.northridge.local",

            title: "North Ridge Security",

            category: "internal",

            description:
                "Security department information portal.",

            searchable: true,

            content: {
                heading: "SECURITY DEPARTMENT",

                text:
`NORTH RIDGE SECURITY

SECURITY STATUS:

NORMAL

Recent system notices:

• Badge reader maintenance
• Camera system maintenance
• Lower-level access review

IMPORTANT:

All personnel must report
unusual activity immediately.

Do not enter restricted areas
without authorization.`
            }
        },


        // -------------------------------------------------
        // NORTH RIDGE ARCHIVE
        // -------------------------------------------------

        {
            id: "site_archive",

            domain: "archive.northridge.local",

            title: "North Ridge Archive",

            category: "archive",

            description:
                "Archived North Ridge documents and reports.",

            searchable: true,

            content: {
                heading: "ARCHIVE DATABASE",

                text:
`NORTH RIDGE ARCHIVE

Available records:

1997
1998
1999

Some records may be unavailable
due to archival maintenance.

SEARCH TIP:

Use the incident number if known.

Example:

INCIDENT 041`
            }
        },


        // -------------------------------------------------
        // INCIDENT 041
        // -------------------------------------------------

        {
            id: "site_incident_041",

            domain: "archive.northridge.local/incident/041",

            title: "Incident 041",

            category: "restricted",

            description:
                "Archived incident record.",

            searchable: true,

            locked: false,

            content: {
                heading: "INCIDENT 041",

                text:
`NORTH RIDGE ARCHIVE

INCIDENT NUMBER: 041

DATE:
06/21/1998

LOCATION:
Building 4
Lower Maintenance Level

STATUS:
CLOSED

SUMMARY:

A temporary power failure occurred
in the lower maintenance area.

Three employees reported hearing
a mechanical sound behind the
western wall.

No equipment was discovered.

The area was subsequently sealed.

ADDITIONAL RECORDS:

[FILE 041-A]
[FILE 041-B]
[FILE 041-C]

ACCESS ERROR.

Additional records unavailable.`
            }
        },


        // -------------------------------------------------
        // OLD NORTH RIDGE WEBSITE
        // -------------------------------------------------

        {
            id: "site_old_north",

            domain: "old.northridge.local",

            title: "North Ridge — Old Website",

            category: "archive",

            description:
                "An outdated version of the North Ridge website.",

            searchable: true,

            content: {
                heading: "NORTH RIDGE",

                text:
`NORTH RIDGE FACILITIES

ESTABLISHED 1974

Providing maintenance,
administration, and technical
services to the North Ridge
facility.

NEWS

06/21/1998

Temporary closure of Building 4
maintenance facilities.

Further information unavailable.

--------------------------------

Copyright 1998
North Ridge Facilities`
            }
        },


        // -------------------------------------------------
        // NETWORK STATUS
        // -------------------------------------------------

        {
            id: "site_network",

            domain: "network.northridge.local",

            title: "Network Status",

            category: "system",

            description:
                "North Ridge internal network monitoring.",

            searchable: true,

            content: {
                heading: "NETWORK STATUS",

                text:
`NORTH RIDGE NETWORK

SERVER STATUS

NR-SRV-01
ONLINE

NR-ARCHIVE
ONLINE

NR-MAIL
ONLINE

NR-TERMINAL
UNKNOWN

NETWORK LOAD
NORMAL

ACTIVE CONNECTIONS
17

WARNING:

One unidentified network node
is currently responding.

NODE:

NR-???

STATUS:

CONNECTED`
            }
        },


        // -------------------------------------------------
        // WEATHER SERVICE
        // -------------------------------------------------

        {
            id: "site_weather",

            domain: "weather.local",

            title: "Local Weather Service",

            category: "public",

            description:
                "Local weather information.",

            searchable: true,

            content: {
                heading: "LOCAL WEATHER",

                text:
`NORTH RIDGE WEATHER SERVICE

OCTOBER 16, 1999

Temperature:
54°F

Conditions:
Overcast

Wind:
12 MPH

Forecast:
Rain expected overnight.

NOTICE:

Severe weather warnings will
appear on this page.`
            }
        },


        // -------------------------------------------------
        // COMMUNITY BOARD
        // -------------------------------------------------

        {
            id: "site_messageboard",

            domain: "community.local",

            title: "North Ridge Community Board",

            category: "public",

            description:
                "Local community message board.",

            searchable: true,

            content: {
                heading: "COMMUNITY MESSAGE BOARD",

                text:
`NORTH RIDGE COMMUNITY BOARD

LATEST POSTS

--------------------------------

[10/14]

Anyone else hearing that noise
from Building 4 at night?

— user: nightshift

--------------------------------

[10/15]

Probably the ventilation system.

— user: maintenance

--------------------------------

[10/15]

It's not the ventilation system.

— user: ???

--------------------------------

[10/16]

Post removed by administrator.

--------------------------------`
            }
        },


        // -------------------------------------------------
        // NEWS ARCHIVE
        // -------------------------------------------------

        {
            id: "site_news",

            domain: "news.local",

            title: "North Ridge News Archive",

            category: "public",

            description:
                "Local news archive.",

            searchable: true,

            content: {
                heading: "NEWS ARCHIVE",

                text:
`NORTH RIDGE NEWS ARCHIVE

OCTOBER 1999

LOCAL FACILITY EXPANDS
TECHNICAL OPERATIONS

North Ridge Facilities has announced
an expansion of its technical
infrastructure.

Officials declined to comment on
the purpose of the new equipment.

--------------------------------

ARCHIVE

June 1998

Power failure temporarily closes
Building 4.

No injuries reported.

--------------------------------`
            }
        },


        // -------------------------------------------------
        // ERROR / UNKNOWN SITE
        // -------------------------------------------------

        {
            id: "site_unknown",

            domain: "nr-041.local",

            title: "NR-041",

            category: "unknown",

            description:
                "Unknown network destination.",

            searchable: false,

            hidden: true,

            content: {
                heading: "CONNECTION ESTABLISHED",

                text:
`NR-041

CONNECTED.

IDENTITY:
UNKNOWN

STATUS:
ACTIVE

USER:
ELIAS

LAST CONNECTION:
01:14 AM

...

...

WHY ARE YOU HERE?`
            }
        }

    ];


    // =================================================
    // SEARCH DATABASE
    // =================================================

    function searchWebsites(query) {

        if (!query) {
            return [];
        }

        const searchTerm =
            query
                .toLowerCase()
                .trim();

        if (!searchTerm) {
            return [];
        }

        return WEBSITES.filter(site => {

            if (!site.searchable) {
                return false;
            }

            const searchableText = [

                site.domain,
                site.title,
                site.category,
                site.description,
                site.content?.heading,
                site.content?.text

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
                searchTerm
            );
        });
    }


    // =================================================
    // FIND WEBSITE
    // =================================================

    function getWebsiteByDomain(domain) {

        if (!domain) {
            return null;
        }

        const normalizedDomain =
            domain
                .toLowerCase()
                .trim()
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "");

        return WEBSITES.find(site => {

            return site.domain.toLowerCase() ===
                normalizedDomain;

        }) || null;
    }


    // =================================================
    // FIND WEBSITE BY ID
    // =================================================

    function getWebsiteById(id) {

        if (!id) {
            return null;
        }

        return WEBSITES.find(site => {

            return site.id === id;

        }) || null;
    }


    // =================================================
    // EXPOSE DATABASE
    // =================================================

    window.WEBSITES = WEBSITES;

    window.searchWebsites = searchWebsites;

    window.getWebsiteByDomain =
        getWebsiteByDomain;

    window.getWebsiteById =
        getWebsiteById;


})();