/* =========================================================
   PROJECT UNTITLED
   APPLICATION — MAIL
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const mailWindow =
        document.getElementById(
            "mailWindow"
        );

    /*
       IMPORTANT:

       The HTML uses #emailList.

       The old JavaScript searched for #mailList,
       which caused the entire module to exit.
    */

    const mailList =
        document.getElementById(
            "emailList"
        );


    /* =====================================================
       STATE
       ===================================================== */

    let currentEmail =
        null;

    let initialized =
        false;


    /* =====================================================
       EMAIL DATA
       ===================================================== */

    function getEmails() {

        if (
            Array.isArray(
                window.emails
            )
        ) {

            return window.emails;

        }


        if (
            Array.isArray(
                window.Emails
            )
        ) {

            return window.Emails;

        }


        if (
            Array.isArray(
                window.EMAILS
            )
        ) {

            return window.EMAILS;

        }


        if (
            Array.isArray(
                window.EmailData
            )
        ) {

            return window.EmailData;

        }


        return [];

    }


    /* =====================================================
       CREATE VIEWER
       ===================================================== */

    function createViewer() {

        if (!mailWindow) {
            return null;
        }


        let viewer =
            document.getElementById(
                "mailViewer"
            );


        /*
           If the viewer already exists in
           HTML, use it.
        */

        if (viewer) {
            return viewer;
        }


        /*
           Otherwise create one dynamically.

           This lets us fix the broken Mail
           system without forcing an HTML
           restructure right now.
        */

        viewer =
            document.createElement(
                "div"
            );


        viewer.id =
            "mailViewer";


        viewer.style.display =
            "none";


        viewer.style.height =
            "100%";


        viewer.style.boxSizing =
            "border-box";


        viewer.innerHTML = `

            <div
                class="mail-viewer-toolbar"
                style="
                    margin-bottom: 10px;
                    display: flex;
                    gap: 6px;
                "
            >

                <button
                    id="mailBack"
                    type="button"
                    class="win-button"
                >
                    Back
                </button>

            </div>


            <div
                class="mail-viewer-header"
                style="
                    border-bottom: 1px solid #808080;
                    padding-bottom: 8px;
                    margin-bottom: 10px;
                "
            >

                <h2
                    id="mailViewerTitle"
                    style="
                        margin: 0 0 8px 0;
                        font-size: 18px;
                    "
                ></h2>


                <div
                    id="mailViewerFrom"
                    style="
                        margin-bottom: 4px;
                    "
                ></div>


                <div
                    id="mailViewerDate"
                    style="
                        color: #555;
                        font-size: 12px;
                    "
                ></div>

            </div>


            <div
                id="mailViewerBody"
                style="
                    white-space: pre-wrap;
                    line-height: 1.5;
                "
            ></div>

        `;


        /*
           Put the viewer into the same
           window content area as the inbox.
        */

        const content =
            mailWindow.querySelector(
                ".window-content"
            );


        if (content) {

            content.appendChild(
                viewer
            );

        } else {

            mailWindow.appendChild(
                viewer
            );

        }


        const backButton =
            viewer.querySelector(
                "#mailBack"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                backToInbox
            );

        }


        return viewer;

    }


    /* =====================================================
       GET VIEWER ELEMENTS
       ===================================================== */

    function getViewerElements() {

        const viewer =
            createViewer();


        if (!viewer) {
            return null;
        }


        return {

            viewer,

            title:
                document.getElementById(
                    "mailViewerTitle"
                ),

            from:
                document.getElementById(
                    "mailViewerFrom"
                ),

            date:
                document.getElementById(
                    "mailViewerDate"
                ),

            body:
                document.getElementById(
                    "mailViewerBody"
                )

        };

    }


    /* =====================================================
       RENDER INBOX
       ===================================================== */

    function renderInbox() {

        if (!mailList) {
            return;
        }


        /*
           Make sure the inbox is visible
           and the viewer is hidden.
        */

        mailList.style.display =
            "block";


        const viewer =
            document.getElementById(
                "mailViewer"
            );


        if (viewer) {

            viewer.style.display =
                "none";

        }


        mailList.innerHTML =
            "";


        const emails =
            getEmails();


        if (!emails.length) {

            const empty =
                document.createElement(
                    "div"
                );


            empty.className =
                "mail-empty";


            empty.textContent =
                "No messages."


            mailList.appendChild(
                empty
            );


            return;

        }


        emails.forEach(
            function (
                email,
                index
            ) {

                if (!email) {
                    return;
                }


                const item =
                    document.createElement(
                        "button"
                    );


                item.type =
                    "button";


                item.className =
                    "email-item";


                /*
                   Support several possible
                   email data formats.
                */

                const subject =
                    email.subject ||
                    email.title ||
                    "No subject";


                const sender =
                    email.from ||
                    email.sender ||
                    email.email ||
                    "Unknown sender";


                const preview =
                    email.preview ||
                    email.body ||
                    email.content ||
                    "";


                const read =
                    email.read === true;


                if (!read) {

                    item.classList.add(
                        "unread"
                    );

                }


                item.innerHTML = `

                    <div
                        class="email-sender"
                    >
                        ${escapeHtml(sender)}
                    </div>

                    <div
                        class="email-subject"
                    >
                        ${escapeHtml(subject)}
                    </div>

                    <div
                        class="email-preview"
                    >
                        ${escapeHtml(
                            String(preview)
                                .replace(
                                    /\s+/g,
                                    " "
                                )
                                .slice(
                                    0,
                                    120
                                )
                        )}
                    </div>

                `;


                item.addEventListener(
                    "click",
                    function () {

                        openEmail(
                            email,
                            index
                        );

                    }
                );


                mailList.appendChild(
                    item
                );

            }
        );

    }


    /* =====================================================
       OPEN EMAIL
       ===================================================== */

    function openEmail(
        email,
        index
    ) {

        if (!email) {
            return;
        }


        currentEmail =
            email;


        /*
           If only an index was provided,
           retrieve the email from the data.
        */

        if (
            !currentEmail &&
            typeof index ===
            "number"
        ) {

            const emails =
                getEmails();


            currentEmail =
                emails[index] ||
                null;

        }


        if (!currentEmail) {
            return;
        }


        const viewer =
            getViewerElements();


        if (!viewer) {
            return;
        }


        const subject =
            currentEmail.subject ||
            currentEmail.title ||
            "No subject";


        const sender =
            currentEmail.from ||
            currentEmail.sender ||
            "Unknown sender";


        const date =
            currentEmail.date ||
            currentEmail.timestamp ||
            currentEmail.time ||
            "";


        const body =
            currentEmail.body ||
            currentEmail.content ||
            currentEmail.message ||
            "";


        if (viewer.title) {

            viewer.title.textContent =
                subject;

        }


        if (viewer.from) {

            viewer.from.textContent =
                `From: ${sender}`;

        }


        if (viewer.date) {

            viewer.date.textContent =
                date
                    ? `Date: ${formatDate(date)}`
                    : "";

        }


        if (viewer.body) {

            /*
               Use textContent rather than innerHTML
               for email bodies so email data cannot
               accidentally break the application UI.
            */

            viewer.body.textContent =
                String(body);

        }


        /*
           Mark the email as read.

           We modify the in-memory object because
           the existing data architecture appears
           to use objects directly.
        */

        currentEmail.read =
            true;


        if (mailList) {

            mailList.style.display =
                "none";

        }


        viewer.viewer.style.display =
            "block";


        playMailSound();

    }


    /* =====================================================
       BACK TO INBOX
       ===================================================== */

    function backToInbox() {

        currentEmail =
            null;


        renderInbox();


        playMailSound();

    }


    /* =====================================================
       OPEN MAIL APPLICATION
       ===================================================== */

    function openMail() {

        if (!mailWindow) {

            console.warn(
                "[Mail] #mailWindow not found."
            );

            return;

        }


        if (
            typeof WindowManager !==
                "undefined" &&
            typeof WindowManager.open ===
                "function"
        ) {

            WindowManager.open(
                "mailWindow"
            );

        } else {

            mailWindow.style.display =
                "block";

        }


        renderInbox();


        playMailSound();

    }


    /* =====================================================
       CLOSE MAIL APPLICATION
       ===================================================== */

    function closeMail() {

        if (
            typeof WindowManager !==
                "undefined" &&
            typeof WindowManager.close ===
                "function"
        ) {

            WindowManager.close(
                "mailWindow"
            );

            return;

        }


        if (mailWindow) {

            mailWindow.style.display =
                "none";

        }

    }


    /* =====================================================
       REFRESH
       ===================================================== */

    function refreshInbox() {

        renderInbox();

    }


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(value) {

        const date =
            new Date(
                value
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(
                value
            );

        }


        return date.toLocaleString();

    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHtml(value) {

        return String(
            value ?? ""
        )
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


    /* =====================================================
       SOUND
       ===================================================== */

    function playMailSound() {

        if (
            typeof SoundSystem !==
                "undefined" &&
            typeof SoundSystem.mail ===
                "function"
        ) {

            SoundSystem.mail();

        }

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initialize() {

        if (initialized) {
            return;
        }


        if (!mailWindow) {

            console.warn(
                "[Mail] #mailWindow not found."
            );

            return;

        }


        if (!mailList) {

            console.warn(
                "[Mail] #emailList not found."
            );

            return;

        }


        createViewer();


        renderInbox();


        initialized = true;


        console.log(
            "[Mail] Initialized."
        );

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    const MailAPI = {

        init:
            initialize,

        open:
            openMail,

        close:
            closeMail,

        refresh:
            refreshInbox,

        openEmail:
            openEmail,

        back:
            backToInbox,

        getCurrentEmail:
            function () {

                return currentEmail;

            }

    };


    /*
       Official API.
    */

    window.Mail =
        MailAPI;


    /*
       Convenience global.
    */

    window.openMail =
        openMail;


    /* =====================================================
       AUTOMATIC INITIALIZATION
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );


})();