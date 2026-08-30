/* =========================================================
   PROJECT UNTITLED — BUILD 2
   NORTH RIDGE INVESTIGATION SYSTEM
   ========================================================= */


/* =========================================================
   SOUND SYSTEM
========================================================= */

const sounds = {};


function playSound(name) {

    try {

        if (!sounds[name]) {

            sounds[name] =
                new Audio(
                    `assets/sounds/${name}.wav`
                );
        }

        sounds[name].currentTime = 0;

        sounds[name].volume = 0.45;

        sounds[name]
            .play()
            .catch(() => {});

    } catch (error) {

        console.log(
            "Sound unavailable:",
            name
        );
    }
}


/* =========================================================
   SYSTEM STATE
========================================================= */

let zIndex = 100;

let minimizedWindows = [];

let maximizedWindows = {};

let windowPositions = {};

let explorerHistory = [
    "C:\\My Documents"
];

let explorerIndex = 0;


/* =========================================================
   BOOT SYSTEM
========================================================= */

const bootMessages = [

    "Checking memory...",

    "Loading system files...",

    "Initializing display...",

    "Starting network services...",

    "Loading user profile...",

    "Starting Untitled..."
];


let bootProgress = 0;


const bootProgressBar =
    document.getElementById(
        "bootProgress"
    );


const bootStatus =
    document.getElementById(
        "bootStatus"
    );


function runBoot() {

    const interval =
        setInterval(() => {

            bootProgress +=
                Math.floor(
                    Math.random() * 12
                ) + 5;


            if (bootProgress > 100) {

                bootProgress = 100;
            }


            if (bootProgressBar) {

                bootProgressBar.style.width =
                    `${bootProgress}%`;
            }


            const messageIndex =
                Math.min(

                    Math.floor(
                        bootProgress /
                        (
                            100 /
                            bootMessages.length
                        )
                    ),

                    bootMessages.length - 1
                );


            if (bootStatus) {

                bootStatus.textContent =
                    bootMessages[
                        messageIndex
                    ];
            }


            if (bootProgress >= 100) {

                clearInterval(interval);


                setTimeout(() => {

                    const bootScreen =
                        document.getElementById(
                            "bootScreen"
                        );


                    const desktop =
                        document.getElementById(
                            "desktop"
                        );


                    if (bootScreen) {

                        bootScreen.style.display =
                            "none";
                    }


                    if (desktop) {

                        desktop.style.display =
                            "block";
                    }


                    playSound("boot");

                    initializeSystem();

                }, 500);
            }

        }, 300);
}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeSystem() {

    loadNotes();

    renderNotes();

    renderMail();

    renderFiles();

    renderBrowserHome();

    renderHistory();

    updateExplorerButtons();

    updateClock();

    updateTaskbar();

    setInterval(
        updateClock,
        1000
    );
}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const clock =
        document.getElementById(
            "clock"
        );


    if (!clock) return;


    const now =
        new Date();


    let hours =
        now.getHours();


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    const seconds =
        String(
            now.getSeconds()
        ).padStart(2, "0");


    const suffix =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 || 12;


    clock.textContent =
        `${hours}:${minutes}:${seconds} ${suffix}`;
}


/* =========================================================
   WINDOW SYSTEM
========================================================= */

function openWindow(id) {

    const windowElement =
        document.getElementById(id);


    if (!windowElement) return;


    windowElement.style.display =
        "block";


    bringToFront(
        windowElement
    );


    centerWindowIfNeeded(
        windowElement
    );


    removeFromMinimized(id);


    updateTaskbar();

    playSound("open");
}


function closeWindow(id) {

    const windowElement =
        document.getElementById(id);


    if (!windowElement) return;


    windowElement.style.display =
        "none";


    removeFromMinimized(id);


    updateTaskbar();

    playSound("close");
}


function minimizeWindow(id) {

    const windowElement =
        document.getElementById(id);


    if (!windowElement) return;


    windowElement.style.display =
        "none";


    if (
        !minimizedWindows.includes(id)
    ) {

        minimizedWindows.push(id);
    }


    updateTaskbar();

    playSound("minimize");
}


function maximizeWindow(id) {

    const windowElement =
        document.getElementById(id);


    if (!windowElement) return;


    if (!maximizedWindows[id]) {

        windowPositions[id] = {

            left:
                windowElement.style.left,

            top:
                windowElement.style.top,

            width:
                windowElement.style.width,

            height:
                windowElement.style.height
        };


        windowElement.style.left =
            "0px";


        windowElement.style.top =
            "0px";


        windowElement.style.width =
            "100%";


        windowElement.style.height =
            "calc(100% - 38px)";


        maximizedWindows[id] =
            true;

    } else {

        const position =
            windowPositions[id];


        if (position) {

            windowElement.style.left =
                position.left;

            windowElement.style.top =
                position.top;

            windowElement.style.width =
                position.width;

            windowElement.style.height =
                position.height;
        }


        maximizedWindows[id] =
            false;
    }


    bringToFront(
        windowElement
    );


    playSound("maximize");
}


function bringToFront(element) {

    if (!element) return;

    zIndex++;

    element.style.zIndex =
        zIndex;
}


function centerWindowIfNeeded(element) {

    if (
        element.dataset.centered ===
        "true"
    ) {

        return;
    }


    const desktop =
        document.getElementById(
            "desktop"
        );


    if (!desktop) return;


    const desktopWidth =
        desktop.clientWidth;


    const desktopHeight =
        desktop.clientHeight - 38;


    const width =
        element.offsetWidth;


    const height =
        element.offsetHeight;


    const left =
        Math.max(
            10,
            (desktopWidth - width) / 2
        );


    const top =
        Math.max(
            10,
            (desktopHeight - height) / 2
        );


    element.style.left =
        `${left}px`;


    element.style.top =
        `${top}px`;


    element.dataset.centered =
        "true";
}


function removeFromMinimized(id) {

    minimizedWindows =
        minimizedWindows.filter(
            windowId =>
                windowId !== id
        );
}


/* =========================================================
   TASKBAR
========================================================= */

function updateTaskbar() {

    const taskbar =
        document.getElementById(
            "taskbarWindows"
        );


    if (!taskbar) return;


    taskbar.innerHTML = "";


    const windows =
        document.querySelectorAll(
            ".window"
        );


    windows.forEach(
        windowElement => {

            const visible =
                windowElement.style.display ===
                "block";


            if (!visible) return;


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "taskbar-window";


            button.textContent =
                windowElement.dataset.title ||
                windowElement.id;


            button.onclick = () => {

                bringToFront(
                    windowElement
                );
            };


            taskbar.appendChild(
                button
            );
        }
    );


    minimizedWindows.forEach(
        id => {

            const windowElement =
                document.getElementById(id);


            if (!windowElement) return;


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "taskbar-window";


            button.textContent =
                windowElement.dataset.title ||
                id;


            button.onclick = () => {

                windowElement.style.display =
                    "block";


                removeFromMinimized(id);


                bringToFront(
                    windowElement
                );


                updateTaskbar();
            };


            taskbar.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   DRAG WINDOWS
========================================================= */

document.addEventListener(
    "mousedown",
    event => {

        const titlebar =
            event.target.closest(
                ".window-titlebar"
            );


        if (!titlebar) return;


        const windowElement =
            titlebar.closest(
                ".window"
            );


        if (!windowElement) return;


        if (
            maximizedWindows[
                windowElement.id
            ]
        ) {

            return;
        }


        bringToFront(
            windowElement
        );


        const startX =
            event.clientX;


        const startY =
            event.clientY;


        const rect =
            windowElement.getBoundingClientRect();


        const startLeft =
            rect.left;


        const startTop =
            rect.top;


        function moveWindow(
            moveEvent
        ) {

            const newLeft =
                startLeft +
                moveEvent.clientX -
                startX;


            const newTop =
                startTop +
                moveEvent.clientY -
                startY;


            windowElement.style.left =
                `${newLeft}px`;


            windowElement.style.top =
                `${newTop}px`;
        }


        function stopDragging() {

            document.removeEventListener(
                "mousemove",
                moveWindow
            );


            document.removeEventListener(
                "mouseup",
                stopDragging
            );
        }


        document.addEventListener(
            "mousemove",
            moveWindow
        );


        document.addEventListener(
            "mouseup",
            stopDragging
        );
    }
);


/* =========================================================
   START MENU
========================================================= */

function toggleStartMenu() {

    const menu =
        document.getElementById(
            "startMenu"
        );


    if (!menu) return;


    menu.style.display =
        menu.style.display === "block"
            ? "none"
            : "block";


    playSound("click");
}


/* =========================================================
   SHUTDOWN
========================================================= */

function shutdown() {

    const menu =
        document.getElementById(
            "startMenu"
        );


    const desktop =
        document.getElementById(
            "desktop"
        );


    const bootScreen =
        document.getElementById(
            "bootScreen"
        );


    if (menu) {

        menu.style.display =
            "none";
    }


    if (desktop) {

        desktop.style.display =
            "none";
    }


    if (bootScreen) {

        bootScreen.style.display =
            "flex";
    }


    bootProgress = 0;


    if (bootProgressBar) {

        bootProgressBar.style.width =
            "0%";
    }


    if (bootStatus) {

        bootStatus.textContent =
            "Shutting down...";
    }


    setTimeout(() => {

        location.reload();

    }, 1200);
}


/* =========================================================
   FILE SYSTEM
========================================================= */

const files = [

    {
        name: "Welcome.txt",

        type: "txt",

        icon: "📄",

        content:
`WELCOME

This computer belongs to an unknown user.

Most of the files on this machine appear
to be ordinary personal documents.

Some files may not be.

If you found this computer because of
North Ridge, you should probably stop
reading now.

— E`
    },


    {
        name: "Read_Me.txt",

        type: "txt",

        icon: "📄",

        content:
`SYSTEM NOTE

This machine has not been used in
several years.

Some network services may still
be available.

If something looks strange,
check the browser history.

Especially anything connected
to North Ridge.`
    },


    {
        name: "North_Ridge.txt",

        type: "txt",

        icon: "📄",

        content:
`NORTH RIDGE

I don't remember why I wrote this down.

Search the old internet.

There used to be something here.

They say the facility was demolished
in 1992.

That isn't true.

— E`
    },


    {
        name: "Timeline.txt",

        type: "txt",

        icon: "📄",

        content:
`NORTH RIDGE TIMELINE

1987 — Facility opens.

1990 — Construction expanded.

1992 — Facility supposedly closed.

1994 — Property disappears from several
       public records.

1997 — North Ridge community celebrates
       its tenth anniversary.

1999 — Elias begins investigating.

Something doesn't fit.`
    },


    {
        name: "Pictures",

        type: "folder",

        icon: "📁"
    },


    {
        name: "Archive",

        type: "folder",

        icon: "📁"
    }
];


function renderFiles() {

    const grid =
        document.getElementById(
            "fileGrid"
        );


    if (!grid) return;


    grid.innerHTML = "";


    files.forEach(
        file => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "file-item";


            item.innerHTML = `

                <div class="file-icon">
                    ${file.icon}
                </div>

                <span>
                    ${escapeHTML(file.name)}
                </span>

            `;


            item.ondblclick = () => {

                if (
                    file.type === "txt"
                ) {

                    openFileInNotepad(
                        file
                    );

                } else if (
                    file.name ===
                    "Pictures"
                ) {

                    openPictures();

                } else if (
                    file.name ===
                    "Archive"
                ) {

                    openArchive();
                }
            };


            grid.appendChild(item);
        }
    );
}


function openFileInNotepad(file) {

    openWindow("notepad");


    const title =
        document.getElementById(
            "noteTitle"
        );


    const text =
        document.getElementById(
            "notepadText"
        );


    if (title) {

        title.value =
            file.name;
    }


    if (text) {

        text.value =
            file.content;
    }


    const status =
        document.getElementById(
            "notepadStatus"
        );


    if (status) {

        status.textContent =
            "Opened file";
    }


    playSound("file");
}


/* =========================================================
   PICTURES
========================================================= */

function openPictures() {

    openWindow("notepad");


    const title =
        document.getElementById(
            "noteTitle"
        );


    const text =
        document.getElementById(
            "notepadText"
        );


    if (title) {

        title.value =
            "Pictures";
    }


    if (text) {

        text.value =
`PICTURES

[IMG_001]

North Ridge facility.

Photo date:
03/18/1992

Notes:
Building appears intact.

--------------------------

[IMG_002]

North Ridge property.

Photo date:
07/02/1992

Notes:
Fence installed around
the western entrance.

--------------------------

[IMG_003]

UNKNOWN

Photo date:
UNKNOWN

The image file appears
to have been manually
renamed.

Original filename:
NR_GATE_04

--------------------------

[IMG_004]

Photo date:
06/13/1999

Notes:

The building is still there.
`;
    }


    const status =
        document.getElementById(
            "notepadStatus"
        );


    if (status) {

        status.textContent =
            "Pictures folder opened";
    }


    playSound("file");
}


/* =========================================================
   ARCHIVE
========================================================= */

function openArchive() {

    openWindow("notepad");


    const title =
        document.getElementById(
            "noteTitle"
        );


    const text =
        document.getElementById(
            "notepadText"
        );


    if (title) {

        title.value =
            "Archive";
    }


    if (text) {

        text.value =
`NORTH RIDGE ARCHIVE

--------------------------

DOCUMENT: NR-1987-04

PROPERTY:
North Ridge Research Facility

OPENED:
1987

CLOSED:
1992

CURRENT STATUS:
NO RECORD FOUND

--------------------------

DOCUMENT: NR-1992-07

STATUS:
CORRUPTED

DATE:
07/02/1992

CONTENTS:

[DATA MISSING]

--------------------------

DOCUMENT: NR-1994-11

STATUS:
REMOVED

REASON:
UNKNOWN

--------------------------

ADMINISTRATIVE NOTE:

Do not distribute copies
of these documents.
`;
    }


    const status =
        document.getElementById(
            "notepadStatus"
        );


    if (status) {

        status.textContent =
            "Archive opened";
    }


    playSound("file");
}


/* =========================================================
   EXPLORER HISTORY
========================================================= */

function goBackExplorer() {

    if (
        explorerIndex <= 0
    ) {

        return;
    }


    explorerIndex--;


    const path =
        document.getElementById(
            "explorerPath"
        );


    if (path) {

        path.textContent =
            explorerHistory[
                explorerIndex
            ];
    }


    updateExplorerButtons();
}


function goForwardExplorer() {

    if (
        explorerIndex >=
        explorerHistory.length - 1
    ) {

        return;
    }


    explorerIndex++;


    const path =
        document.getElementById(
            "explorerPath"
        );


    if (path) {

        path.textContent =
            explorerHistory[
                explorerIndex
            ];
    }


    updateExplorerButtons();
}


function updateExplorerButtons() {

    const back =
        document.getElementById(
            "explorerBack"
        );


    const forward =
        document.getElementById(
            "explorerForward"
        );


    if (back) {

        back.disabled =
            explorerIndex <= 0;
    }


    if (forward) {

        forward.disabled =
            explorerIndex >=
            explorerHistory.length - 1;
    }
}


/* =========================================================
   BROWSER DATA
========================================================= */

const websites = {

    "http://home.untitled": {

        title:
            "Untitled Internet",

        content: `

            <div class="site-header">

                <div class="site-title">
                    UNTITLED INTERNET
                </div>

                <div class="site-subtitle">
                    Your gateway to the World Wide Web
                </div>

            </div>


            <div class="homepage-banner">

                <strong>
                    WELCOME TO THE INTERNET
                </strong>

                <br><br>

                Search the web.

                <br><br>

                <div class="visitor-counter">
                    Visitors: 0001842
                </div>

            </div>


            <div class="web-box">

                <h3>
                    Search the Web
                </h3>


                <input
                    id="homeSearch"
                    placeholder="Enter search..."
                >


                <button
                    onclick="
                        performSearch(
                            document.getElementById(
                                'homeSearch'
                            ).value
                        )
                    "
                >
                    Search
                </button>

            </div>


            <div class="web-box">

                <h3>
                    Popular Searches
                </h3>


                <a
                    class="fake-link"
                    onclick="
                        searchFromLink(
                            'North Ridge'
                        )
                    "
                >
                    North Ridge
                </a>

            </div>


            <div class="strange-note">

                Last updated:
                06/14/1999

            </div>

        `
    },


    "http://news.untitled": {

        title:
            "Untitled Daily News",

        content: `

            <div class="site-header">

                <div class="site-title">
                    UNTITLED DAILY NEWS
                </div>

                <div class="site-subtitle">
                    Local news since 1984
                </div>

            </div>


            <div class="news-headline">
                NORTH RIDGE COMMUNITY
                CELEBRATES 10 YEARS
            </div>


            <div class="news-date">
                June 14, 1997
            </div>


            <div class="news-story">

                North Ridge residents gathered
                Saturday to celebrate the
                community's tenth anniversary.

                <br><br>

                Officials declined to comment
                on questions regarding the former
                industrial property located north
                of town.

            </div>


            <div class="news-story">

                According to municipal records,
                the property was officially
                closed in 1992.

            </div>


            <div class="strange-note">

                Article archive reference:
                NR-061497

            </div>

        `
    },


    "http://archive.untitled": {

        title:
            "Public Archives",

        content: `

            <div class="site-header">

                <div class="site-title">
                    PUBLIC ARCHIVES
                </div>

                <div class="site-subtitle">
                    Digitized municipal records
                </div>

            </div>


            <div class="archive-warning">

                ARCHIVE NOTICE

                <br><br>

                Some documents may be incomplete
                due to digitization errors.

            </div>


            <div class="archive-document">

NORTH RIDGE PROPERTY RECORD

Property ID: NR-1987-04

Opened: 1987

Status: CLOSED

Closure Date: 1992

Current Status:
NO RECORD FOUND

Additional documentation:
[REDACTED]

            </div>


            <div class="web-box">

                <h3>
                    Related Record
                </h3>


                <a
                    class="fake-link"
                    onclick="
                        navigateTo(
                            'http://archive.untitled/nr-1994'
                        )
                    "
                >
                    NR-1994-11
                </a>

            </div>

        `
    },


    "http://archive.untitled/nr-1994": {

        title:
            "Archive Record NR-1994-11",

        content: `

            <div class="site-header">

                <div class="site-title">
                    ARCHIVE RECORD
                </div>

                <div class="site-subtitle">
                    NR-1994-11
                </div>

            </div>


            <div class="archive-document">

RECORD STATUS:
REMOVED

REMOVAL DATE:
09/22/1994

REASON:
ADMINISTRATIVE REQUEST

REQUESTING PARTY:
[REDACTED]

NOTES:

Original document unavailable.

A duplicate copy was reportedly
stored at the North Ridge facility.

            </div>


            <div class="strange-note">

                RECORD ACCESS LOG:
                09/22/1994 — E. Mercer

            </div>

        `
    },


    "http://northridge.untitled": {

        title:
            "North Ridge Community",

        content: `

            <div class="site-header">

                <div class="site-title">
                    NORTH RIDGE
                </div>

                <div class="site-subtitle">
                    The official community website
                </div>

            </div>


            <div class="homepage-banner">

                Welcome to North Ridge!

                <br><br>

                Population:
                4,821

            </div>


            <div class="web-box">

                <h3>
                    Community Links
                </h3>


                <a
                    class="fake-link"
                    onclick="
                        navigateTo(
                            'http://northridge.untitled/guestbook'
                        )
                    "
                >
                    Guestbook
                </a>


                <br><br>


                <a
                    class="fake-link"
                    onclick="
                        navigateTo(
                            'http://northridge.untitled/history'
                        )
                    "
                >
                    Local History
                </a>


                <br><br>


                <a
                    class="fake-link"
                    onclick="
                        navigateTo(
                            'http://northridge.untitled/forum'
                        )
                    "
                >
                    Community Forum
                </a>

            </div>


            <div class="strange-note">

                Last updated:
                October 1998

            </div>

        `
    },


    "http://northridge.untitled/guestbook": {

        title:
            "North Ridge Guestbook",

        content: `

            <div class="site-header">

                <div class="site-title">
                    NORTH RIDGE GUESTBOOK
                </div>

            </div>


            <div class="forum-post">

                <div class="forum-title">
                    #142 — Tommy
                </div>

                <div class="forum-body">
                    Anyone know what happened
                    to the old facility?
                </div>

            </div>


            <div class="forum-post">

                <div class="forum-title">
                    #143 — maria77
                </div>

                <div class="forum-body">
                    what facility?
                </div>

            </div>


            <div class="forum-post">

                <div class="forum-title">
                    #144 — Tommy
                </div>

                <div class="forum-body">
                    The building north of the
                    old road.
                </div>

            </div>


            <div class="forum-post">

                <div class="forum-title">
                    #145 — admin
                </div>

                <div class="forum-body">
                    Please stop discussing this topic.
                </div>

            </div>


            <div class="forum-post">

                <div class="forum-title">
                    #146 — anonymous
                </div>

                <div class="forum-body">
                    It's still there.

                    I saw lights inside last week.
                </div>

            </div>

        `
    },


    "http://northridge.untitled/history": {

        title:
            "North Ridge History",

        content: `

            <div class="site-header">

                <div class="site-title">
                    NORTH RIDGE HISTORY
                </div>

            </div>


            <div class="web-box">

                <h3>
                    1987
                </h3>

                North Ridge community established.

            </div>


            <div class="web-box">

                <h3>
                    1992
                </h3>

                The old property was reportedly
                closed.

            </div>


            <div class="web-box">

                <h3>
                    1994
                </h3>

                No public records available.

            </div>


            <div class="web-box">

                <h3>
                    1997
                </h3>

                Community celebrates ten years.

            </div>


            <div class="strange-note">

                Some historical information
                has been removed.

            </div>

        `
    },


    "http://northridge.untitled/forum": {

        title:
            "North Ridge Forum",

        content: `

            <div class="site-header">

                <div class="site-title">
                    NORTH RIDGE COMMUNITY FORUM
                </div>

            </div>


            <div class="forum-post">

                <div class="forum-title">
                    Topic: Old Facility
                </div>

                <div class="forum-body">
                    Does anyone remember what
                    actually happened in 1992?
                </div>

            </div>


            <div class="forum-post">

                <div class="forum-title">
                    user: northstar
                </div>

                <div class="forum-body">
                    There was no facility.
                </div>

            </div>


            <div class="forum-post">

                <div class="forum-title">
                    user: redline
                </div>

                <div class="forum-body">
                    Then why is there a property
                    record?
                </div>

            </div>


            <div class="forum-post">

                <div class="forum-title">
                    ADMIN
                </div>

                <div class="forum-body">
                    Thread closed.
                </div>

            </div>

        `
    }
};


/* =========================================================
   BROWSER HISTORY
========================================================= */

let browserHistory = [];


try {

    browserHistory =
        JSON.parse(
            localStorage.getItem(
                "untitled_browser_history"
            ) || "[]"
        );

} catch (error) {

    browserHistory = [];
}


let browserHistoryIndex =
    browserHistory.length - 1;


/* =========================================================
   BROWSER NAVIGATION
========================================================= */

function navigateTo(url) {

    const addressBar =
        document.getElementById(
            "addressBar"
        );


    if (addressBar) {

        addressBar.value =
            url;
    }


    loadWebsite(url);


    browserHistory =
        browserHistory.slice(
            0,
            browserHistoryIndex + 1
        );


    browserHistory.push({

        url: url,

        title:
            websites[url]?.title ||
            "Unknown Page",

        time:
            new Date().toLocaleString()
    });


    browserHistoryIndex =
        browserHistory.length - 1;


    try {

        localStorage.setItem(

            "untitled_browser_history",

            JSON.stringify(
                browserHistory
            )

        );

    } catch (error) {

        console.log(
            "Unable to save browser history."
        );
    }


    renderHistory();
}


function loadWebsite(url) {

    const page =
        document.getElementById(
            "browserPage"
        );


    if (!page) return;


    if (websites[url]) {

        page.innerHTML =
            websites[url].content;

    } else {

        page.innerHTML = `

            <div class="error-page">

                <div class="error-code">
                    404
                </div>

                <h2>
                    Page Not Found
                </h2>

                <p>
                    The requested page could
                    not be found.
                </p>

            </div>

        `;

        playSound("error");

        return;
    }


    playSound("navigate");
}


function navigateBrowser() {

    const input =
        document.getElementById(
            "addressBar"
        );


    if (!input) return;


    let url =
        input.value.trim();


    if (!url) return;


    if (
        url
            .toLowerCase()
            .includes("north ridge")
    ) {

        performSearch(url);

        return;
    }


    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {

        url =
            "http://" + url;
    }


    navigateTo(url);
}


function renderBrowserHome() {

    const home =
        "http://home.untitled";


    const addressBar =
        document.getElementById(
            "addressBar"
        );


    const page =
        document.getElementById(
            "browserPage"
        );


    if (addressBar) {

        addressBar.value =
            home;
    }


    if (page) {

        page.innerHTML =
            websites[home].content;
    }
}


function browserHome() {

    navigateTo(
        "http://home.untitled"
    );
}


function browserBack() {

    if (
        browserHistoryIndex <= 0
    ) {

        return;
    }


    browserHistoryIndex--;


    const entry =
        browserHistory[
            browserHistoryIndex
        ];


    const addressBar =
        document.getElementById(
            "addressBar"
        );


    if (addressBar) {

        addressBar.value =
            entry.url;
    }


    loadWebsiteWithoutHistory(
        entry.url
    );


    renderHistory();
}


function browserForward() {

    if (
        browserHistoryIndex >=
        browserHistory.length - 1
    ) {

        return;
    }


    browserHistoryIndex++;


    const entry =
        browserHistory[
            browserHistoryIndex
        ];


    const addressBar =
        document.getElementById(
            "addressBar"
        );


    if (addressBar) {

        addressBar.value =
            entry.url;
    }


    loadWebsiteWithoutHistory(
        entry.url
    );


    renderHistory();
}


function loadWebsiteWithoutHistory(url) {

    const page =
        document.getElementById(
            "browserPage"
        );


    if (!page) return;


    if (websites[url]) {

        page.innerHTML =
            websites[url].content;

    } else {

        page.innerHTML = `

            <div class="error-page">

                <div class="error-code">
                    404
                </div>

                <h2>
                    Page Not Found
                </h2>

            </div>

        `;
    }
}


/* =========================================================
   SEARCH ENGINE
========================================================= */

function searchFromLink(query) {

    openWindow("browser");

    performSearch(query);
}


function performSearch(query) {

    query =
        String(
            query || ""
        ).trim();


    const page =
        document.getElementById(
            "browserPage"
        );


    const addressBar =
        document.getElementById(
            "addressBar"
        );


    if (!page) return;


    if (addressBar) {

        addressBar.value =
            "search.untitled/?q=" +
            encodeURIComponent(
                query
            );
    }


    const lowerQuery =
        query.toLowerCase();


    if (
        lowerQuery.includes(
            "north ridge"
        ) ||
        lowerQuery.includes(
            "northridge"
        )
    ) {

        page.innerHTML = `

            <div class="search-logo">
                SEARCH
            </div>


            <div class="search-area">

                <input
                    id="searchInput"
                    value="${escapeHTML(query)}"
                >


                <button
                    onclick="
                        performSearch(
                            document.getElementById(
                                'searchInput'
                            ).value
                        )
                    "
                >
                    Search
                </button>

            </div>


            <div class="search-result">

                <h3>

                    <a
                        class="fake-link"
                        onclick="
                            navigateTo(
                                'http://northridge.untitled'
                            )
                        "
                    >
                        North Ridge Community
                    </a>

                </h3>

                <p>
                    Official community website.
                </p>

            </div>


            <div class="search-result">

                <h3>

                    <a
                        class="fake-link"
                        onclick="
                            navigateTo(
                                'http://news.untitled'
                            )
                        "
                    >
                        North Ridge Community
                        Celebrates 10 Years
                    </a>

                </h3>

                <p>
                    Untitled Daily News —
                    June 14, 1997.
                </p>

            </div>


            <div class="search-result">

                <h3>

                    <a
                        class="fake-link"
                        onclick="
                            navigateTo(
                                'http://archive.untitled'
                            )
                        "
                    >
                        North Ridge Property Records
                    </a>

                </h3>

                <p>
                    Digitized municipal records.
                </p>

            </div>


            <div class="search-result">

                <h3>
                    North Ridge Research Facility
                </h3>

                <p>
                    No description available.
                </p>

            </div>


            <div class="search-result">

                <h3>
                    North Ridge — 1992
                </h3>

                <p>
                    Search result cached from
                    an unavailable page.
                </p>

            </div>


            <div class="strange-note">

                5 results found.

            </div>

        `;


        playSound("search");

        return;
    }


    page.innerHTML = `

        <div class="search-logo">
            SEARCH
        </div>


        <div class="search-area">

            <input
                id="searchInput"
                value="${escapeHTML(query)}"
            >


            <button
                onclick="
                    performSearch(
                        document.getElementById(
                            'searchInput'
                        ).value
                    )
                "
            >
                Search
            </button>

        </div>


        <div class="search-result">

            <h3>
                No results found.
            </h3>

            <p>
                Try another search term.
            </p>

        </div>

    `;


    playSound("search");
}


/* =========================================================
   HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================================
   BROWSER HISTORY UI
========================================================= */

function renderHistory() {

    const list =
        document.getElementById(
            "historyList"
        );


    const count =
        document.getElementById(
            "historyCount"
        );


    if (!list || !count) return;


    list.innerHTML = "";


    count.textContent =
        `${browserHistory.length} ${
            browserHistory.length === 1
                ? "entry"
                : "entries"
        }`;


    if (
        browserHistory.length === 0
    ) {

        list.innerHTML = `

            <div class="history-empty">
                No browsing history.
            </div>

        `;

        return;
    }


    [
        ...browserHistory
    ]
        .reverse()
        .forEach(
            entry => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "history-entry";


                item.innerHTML = `

                    <div class="history-entry-title">
                        ${escapeHTML(
                            entry.title
                        )}
                    </div>

                    <div class="history-entry-url">
                        ${escapeHTML(
                            entry.url
                        )}
                    </div>

                    <div class="history-entry-time">
                        ${escapeHTML(
                            entry.time
                        )}
                    </div>

                `;


                item.onclick = () => {

                    openWindow(
                        "browser"
                    );


                    navigateTo(
                        entry.url
                    );
                };


                list.appendChild(item);
            }
        );
}


function clearHistory() {

    browserHistory = [];

    browserHistoryIndex = -1;


    localStorage.removeItem(
        "untitled_browser_history"
    );


    renderHistory();

    playSound("click");
}


/* =========================================================
   MAIL SYSTEM
========================================================= */

const emails = [

    {
        from: "Elias",

        subject:
            "old computer",

        date:
            "06/14/1999",

        body:
`I think I'm going to leave this computer here.

If anyone ever finds it, most of this probably
won't mean anything.

There are some things I couldn't bring myself
to delete.

If you're reading this because of North Ridge,
don't trust the public records.

— E`
    },


    {
        from: "Daniel",

        subject:
            "RE: North Ridge",

        date:
            "06/11/1999",

        body:
`You need to stop looking into this.

I'm serious.

The records don't agree because someone changed
them.

Leave it alone.

Daniel`
    },


    {
        from: "Elias",

        subject:
            "North Ridge",

        date:
            "06/10/1999",

        body:
`I went back last night.

The building is still there.

That shouldn't be possible.

They told me it was demolished in '92.

I need to find the original records.`
    },


    {
        from: "Daniel",

        subject:
            "RE: RE: North Ridge",

        date:
            "06/12/1999",

        body:
`I told you already.

There are people who don't want this
looked into.

You aren't going to prove anything
by going back there.

Please stop.`
    },


    {
        from: "Unknown",

        subject:
            "[message corrupted]",

        date:
            "UNKNOWN",

        body:
`MESSAGE ERROR

The contents of this message could not
be recovered.

[CORRUPTED]

Recovered fragment:

"...fourth floor..."

"...lights..."

"...don't go inside..."

[END OF MESSAGE]`
    }
];


function renderMail() {

    const list =
        document.getElementById(
            "mailList"
        );


    if (!list) return;


    list.innerHTML = "";


    emails.forEach(
        (email, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "email";


            item.innerHTML = `

                <strong>
                    ${escapeHTML(
                        email.from
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        email.subject
                    )}
                </span>

                <span>
                    ${escapeHTML(
                        email.date
                    )}
                </span>

            `;


            item.onclick = () => {

                openEmail(index);
            };


            list.appendChild(item);
        }
    );
}


function openEmail(index) {

    const email =
        emails[index];


    if (!email) return;


    const list =
        document.getElementById(
            "mailList"
        );


    if (!list) return;


    list.innerHTML = `

        <div style="margin-bottom:15px;">

            <button
                onclick="renderMail()"
            >
                ← Back to Inbox
            </button>

        </div>


        <div class="web-box">

            <strong>
                From:
            </strong>

            ${escapeHTML(
                email.from
            )}

            <br><br>

            <strong>
                Subject:
            </strong>

            ${escapeHTML(
                email.subject
            )}

            <br><br>

            <strong>
                Date:
            </strong>

            ${escapeHTML(
                email.date
            )}

        </div>


        <div
            style="
                background:white;
                padding:15px;
                border:1px solid #999;
                white-space:pre-wrap;
                font-family:'Courier New',monospace;
            "
        >${escapeHTML(
            email.body
        )}</div>

    `;


    playSound("mail");
}


/* =========================================================
   NOTES
========================================================= */

let notes = [];

let currentNoteId = null;


function loadNotes() {

    try {

        notes =
            JSON.parse(
                localStorage.getItem(
                    "untitled_notes"
                ) || "[]"
            );

    } catch (error) {

        notes = [];
    }


    if (
        !Array.isArray(notes)
    ) {

        notes = [];
    }


    if (
        notes.length === 0
    ) {

        notes = [

            {
                id:
                    Date.now(),

                title:
                    "Investigation Notes",

                content:
`PROJECT UNTITLED

Things I need to investigate:

* North Ridge
* Old computer
* Elias
* Daniel
* The archive
* The missing facility
* The 1992 records

Something doesn't add up.`
            }

        ];


        saveNotes();
    }


    currentNoteId =
        notes[0].id;
}


function saveNotes() {

    localStorage.setItem(

        "untitled_notes",

        JSON.stringify(
            notes
        )
    );
}


function renderNotes() {

    const list =
        document.getElementById(
            "noteList"
        );


    if (!list) return;


    list.innerHTML = "";


    notes.forEach(
        note => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "note-item";


            if (
                note.id ===
                currentNoteId
            ) {

                item.classList.add(
                    "active"
                );
            }


            item.textContent =
                note.title ||
                "Untitled Note";


            item.onclick = () => {

                selectNote(
                    note.id
                );
            };


            list.appendChild(item);
        }
    );


    loadCurrentNote();
}


function selectNote(id) {

    saveCurrentNote(false);


    currentNoteId =
        id;


    renderNotes();
}


function loadCurrentNote() {

    const note =
        notes.find(
            n =>
                n.id ===
                currentNoteId
        );


    if (!note) return;


    const title =
        document.getElementById(
            "noteTitle"
        );


    const text =
        document.getElementById(
            "notepadText"
        );


    if (title) {

        title.value =
            note.title;
    }


    if (text) {

        text.value =
            note.content;
    }


    const status =
        document.getElementById(
            "notepadStatus"
        );


    if (status) {

        status.textContent =
            "Loaded";
    }
}


function saveCurrentNote(
    play = true
) {

    if (!currentNoteId) return;


    const note =
        notes.find(
            n =>
                n.id ===
                currentNoteId
        );


    if (!note) return;


    const title =
        document.getElementById(
            "noteTitle"
        );


    const text =
        document.getElementById(
            "notepadText"
        );


    note.title =
        title?.value ||
        "Untitled Note";


    note.content =
        text?.value ||
        "";


    saveNotes();


    renderNotes();


    const status =
        document.getElementById(
            "notepadStatus"
        );


    if (status) {

        status.textContent =
            "Saved";
    }


    if (play) {

        playSound("save");
    }
}


function createNote() {

    saveCurrentNote(false);


    const note = {

        id:
            Date.now(),

        title:
            "New Note",

        content:
            ""
    };


    notes.push(note);


    currentNoteId =
        note.id;


    saveNotes();


    renderNotes();


    const status =
        document.getElementById(
            "notepadStatus"
        );


    if (status) {

        status.textContent =
            "New note created";
    }


    playSound("new");
}


function deleteCurrentNote() {

    if (!currentNoteId) return;


    if (
        notes.length <= 1
    ) {

        alert(
            "At least one note must remain."
        );

        return;
    }


    notes =
        notes.filter(
            note =>
                note.id !==
                currentNoteId
        );


    currentNoteId =
        notes[0].id;


    saveNotes();


    renderNotes();


    playSound("delete");
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            document.activeElement?.id ===
            "addressBar"
        ) {

            navigateBrowser();
        }
    }
);


/* =========================================================
   WINDOW FOCUS
========================================================= */

document.addEventListener(
    "mousedown",
    event => {

        const windowElement =
            event.target.closest(
                ".window"
            );


        if (windowElement) {

            bringToFront(
                windowElement
            );
        }
    }
);


/* =========================================================
   CLOSE START MENU
========================================================= */

document.addEventListener(
    "click",
    event => {

        const menu =
            document.getElementById(
                "startMenu"
            );


        const button =
            document.getElementById(
                "startButton"
            );


        if (!menu || !button) return;


        if (
            menu.style.display ===
                "block" &&

            !menu.contains(
                event.target
            ) &&

            event.target !== button
        ) {

            menu.style.display =
                "none";
        }
    }
);


/* =========================================================
   START SYSTEM
========================================================= */

runBoot();

