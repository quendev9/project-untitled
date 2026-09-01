// =====================================================
// PROJECT UNTITLED
// APP — MAIL
// =====================================================

(function () {

    "use strict";

    // -------------------------------------------------
    // ELEMENTS
    // -------------------------------------------------

    const mailWindow =
        document.getElementById("mailWindow");

    const mailList =
        document.getElementById("mailList");

    const mailViewer =
        document.getElementById("mailViewer");

    const mailViewerTitle =
        document.getElementById("mailViewerTitle");

    const mailViewerFrom =
        document.getElementById("mailViewerFrom");

    const mailViewerDate =
        document.getElementById("mailViewerDate");

    const mailViewerBody =
        document.getElementById("mailViewerBody");

    const mailBackButton =
        document.getElementById("mailBack");

    const mailCloseButton =
        document.getElementById("mailClose");


    // -------------------------------------------------
    // STATE
    // -------------------------------------------------

    let currentEmail = null;


    // -------------------------------------------------
    // CHECK REQUIRED ELEMENTS
    // -------------------------------------------------

    if (!mailWindow || !mailList) {

        console.warn(
            "Mail: required elements not found."
        );

        return;
    }


    // -------------------------------------------------
    // GET EMAIL DATA
    // -------------------------------------------------

    function getEmailData() {

        if (
            typeof EMAILS !== "undefined" &&
            Array.isArray(EMAILS)
        ) {
            return EMAILS;
        }

        if (
            typeof emails !== "undefined" &&
            Array.isArray(emails)
        ) {
            return emails;
        }

        if (
            typeof emailData !== "undefined" &&
            Array.isArray(emailData)
        ) {
            return emailData;
        }

        console.warn(
            "Mail: no email data found."
        );

        return [];
    }


    // -------------------------------------------------
    // OPEN MAIL
    // -------------------------------------------------

    function openMail() {

        if (
            typeof WindowManager !== "undefined" &&
            typeof WindowManager.open === "function"
        ) {

            WindowManager.open(
                "mailWindow"
            );

        } else {

            mailWindow.style.display = "block";
        }

        renderInbox();

        hideViewer();

        playMailSound();
    }


    // -------------------------------------------------
    // CLOSE MAIL
    // -------------------------------------------------

    function closeMail() {

        if (
            typeof WindowManager !== "undefined" &&
            typeof WindowManager.close === "function"
        ) {

            WindowManager.close(
                "mailWindow"
            );

        } else {

            mailWindow.style.display = "none";
        }

        currentEmail = null;
    }


    // -------------------------------------------------
    // PLAY MAIL SOUND
    // -------------------------------------------------

    function playMailSound() {

        if (
            typeof playSound === "function"
        ) {

            playSound("mail");
        }
    }


    // -------------------------------------------------
    // NORMALIZE EMAIL
    // -------------------------------------------------

    function normalizeEmail(email) {

        if (!email) {
            return null;
        }

        return {

            id:
                email.id ||
                email.emailId ||
                email.name,

            sender:
                email.sender ||
                email.from ||
                "Unknown Sender",

            subject:
                email.subject ||
                email.title ||
                "(No Subject)",

            date:
                email.date ||
                email.time ||
                "",

            body:
                email.body ||
                email.message ||
                "",

            read:
                Boolean(email.read),

            important:
                Boolean(email.important),

            attachment:
                email.attachment ||
                null

        };
    }


    // -------------------------------------------------
    // RENDER INBOX
    // -------------------------------------------------

    function renderInbox() {

        mailList.innerHTML = "";

        const emails =
            getEmailData();

        if (emails.length === 0) {

            renderEmptyInbox();

            return;
        }

        emails.forEach(
            function (rawEmail, index) {

                const email =
                    normalizeEmail(rawEmail);

                if (!email) {
                    return;
                }

                const element =
                    createEmailElement(
                        email,
                        index
                    );

                mailList.appendChild(
                    element
                );
            }
        );
    }


    // -------------------------------------------------
    // EMPTY INBOX
    // -------------------------------------------------

    function renderEmptyInbox() {

        const empty =
            document.createElement("div");

        empty.className =
            "mail-empty";

        empty.textContent =
            "No messages.";

        mailList.appendChild(
            empty
        );
    }


    // -------------------------------------------------
    // CREATE EMAIL ELEMENT
    // -------------------------------------------------

    function createEmailElement(
        email,
        index
    ) {

        const element =
            document.createElement("div");

        element.className =
            "email";


        // ---------------------------------------------
        // UNREAD STATE
        // ---------------------------------------------

        if (!email.read) {

            element.classList.add(
                "unread"
            );
        }


        // ---------------------------------------------
        // IMPORTANT STATE
        // ---------------------------------------------

        if (email.important) {

            element.classList.add(
                "important"
            );
        }


        // ---------------------------------------------
        // SENDER
        // ---------------------------------------------

        const sender =
            document.createElement("strong");

        sender.textContent =
            email.sender;


        // ---------------------------------------------
        // SUBJECT
        // ---------------------------------------------

        const subject =
            document.createElement("span");

        subject.textContent =
            email.subject;


        // ---------------------------------------------
        // DATE
        // ---------------------------------------------

        const date =
            document.createElement("span");

        date.className =
            "email-date";

        date.textContent =
            email.date;


        // ---------------------------------------------
        // APPEND
        // ---------------------------------------------

        element.appendChild(
            sender
        );

        element.appendChild(
            subject
        );

        element.appendChild(
            date
        );


        // ---------------------------------------------
        // CLICK
        // ---------------------------------------------

        element.addEventListener(
            "click",
            function () {

                openEmail(
                    email,
                    index
                );

            }
        );


        return element;
    }


    // -------------------------------------------------
    // OPEN EMAIL
    // -------------------------------------------------

    function openEmail(
        email,
        index
    ) {

        if (!email) {
            return;
        }

        currentEmail =
            email;

        // ---------------------------------------------
        // SOUND
        // ---------------------------------------------

        if (
            typeof playSound === "function"
        ) {

            playSound("open");
        }


        // ---------------------------------------------
        // MARK AS READ
        // ---------------------------------------------

        markAsRead(
            email.id,
            index
        );


        // ---------------------------------------------
        // SHOW VIEWER
        // ---------------------------------------------

        if (mailViewer) {

            mailViewer.style.display =
                "block";
        }


        // ---------------------------------------------
        // HIDE LIST
        // ---------------------------------------------

        mailList.style.display =
            "none";


        // ---------------------------------------------
        // TITLE
        // ---------------------------------------------

        if (mailViewerTitle) {

            mailViewerTitle.textContent =
                email.subject;
        }


        // ---------------------------------------------
        // FROM
        // ---------------------------------------------

        if (mailViewerFrom) {

            mailViewerFrom.textContent =
                `From: ${email.sender}`;
        }


        // ---------------------------------------------
        // DATE
        // ---------------------------------------------

        if (mailViewerDate) {

            mailViewerDate.textContent =
                email.date;
        }


        // ---------------------------------------------
        // BODY
        // ---------------------------------------------

        if (mailViewerBody) {

            mailViewerBody.textContent =
                email.body;
        }


        // ---------------------------------------------
        // ATTACHMENT
        // ---------------------------------------------

        renderAttachment(
            email
        );
    }


    // -------------------------------------------------
    // MARK EMAIL AS READ
    // -------------------------------------------------

    function markAsRead(
        emailId,
        index
    ) {

        const emails =
            getEmailData();

        if (!emails.length) {
            return;
        }


        let target =
            null;


        // ---------------------------------------------
        // FIND BY ID
        // ---------------------------------------------

        if (emailId) {

            target =
                emails.find(
                    function (email) {

                        return (
                            email &&
                            (
                                email.id ===
                                emailId
                            )
                        );

                    }
                );
        }


        // ---------------------------------------------
        // FALLBACK TO INDEX
        // ---------------------------------------------

        if (!target) {

            target =
                emails[index];
        }


        if (target) {

            target.read =
                true;
        }


        // Re-render after changing
        // the unread state.

        renderInbox();
    }


    // -------------------------------------------------
    // ATTACHMENT
    // -------------------------------------------------

    function renderAttachment(
        email
    ) {

        if (!mailViewerBody) {
            return;
        }


        // Remove previous attachment.

        const oldAttachment =
            mailViewerBody.parentElement
                ?.querySelector(
                    ".mail-attachment"
                );

        if (oldAttachment) {

            oldAttachment.remove();
        }


        if (!email.attachment) {
            return;
        }


        const attachment =
            document.createElement("div");

        attachment.className =
            "mail-attachment";


        const label =
            document.createElement("strong");

        label.textContent =
            "Attachment: ";


        const file =
            document.createElement("span");

        if (
            typeof email.attachment ===
            "string"
        ) {

            file.textContent =
                email.attachment;

        } else {

            file.textContent =
                email.attachment.name ||
                "Unknown file";
        }


        attachment.appendChild(
            label
        );

        attachment.appendChild(
            file
        );


        if (
            mailViewerBody.parentElement
        ) {

            mailViewerBody.parentElement
                .appendChild(
                    attachment
                );
        }
    }


    // -------------------------------------------------
    // HIDE VIEWER
    // -------------------------------------------------

    function hideViewer() {

        if (mailViewer) {

            mailViewer.style.display =
                "none";
        }

        mailList.style.display =
            "block";

        currentEmail =
            null;
    }


    // -------------------------------------------------
    // BACK TO INBOX
    // -------------------------------------------------

    function backToInbox() {

        if (
            typeof playSound === "function"
        ) {

            playSound("click");
        }

        hideViewer();
    }


    // -------------------------------------------------
    // BUTTON EVENTS
    // -------------------------------------------------

    if (mailBackButton) {

        mailBackButton.addEventListener(
            "click",
            backToInbox
        );
    }


    if (mailCloseButton) {

        mailCloseButton.addEventListener(
            "click",
            closeMail
        );
    }


    // -------------------------------------------------
    // GLOBAL API
    // -------------------------------------------------

    window.Mail = {

        open:
            openMail,

        close:
            closeMail,

        refresh:
            renderInbox,

        openEmail:
            openEmail,

        back:
            backToInbox,

        getCurrentEmail:
            function () {

                return currentEmail;
            }

    };


    // -------------------------------------------------
    // LEGACY GLOBAL
    // -------------------------------------------------

    window.openMail =
        openMail;


})();