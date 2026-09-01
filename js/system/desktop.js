// =====================================================
// PROJECT UNTITLED
// SYSTEM — DESKTOP
// =====================================================

(function () {

    "use strict";


    // =================================================
    // DESKTOP STATE
    // =================================================

    const Desktop = {

        initialized: false,

        desktop: null,

        iconsConnected: false,


        // =============================================
        // INITIALIZE
        // =============================================

        init: function () {

            if (this.initialized) {
                return;
            }


            // -----------------------------------------
            // FIND DESKTOP
            // -----------------------------------------

            this.desktop =
                document.getElementById("desktop");


            if (!this.desktop) {

                console.error(
                    "Desktop: #desktop element not found."
                );

                return;
            }


            // -----------------------------------------
            // CONNECT ICONS
            // -----------------------------------------

            this.setupIcons();


            this.initialized = true;


            console.log(
                "Desktop initialized."
            );

        },


        // =============================================
        // SHOW DESKTOP
        // =============================================

        show: function () {

            if (!this.desktop) {
                this.init();
            }


            if (!this.desktop) {
                return;
            }


            this.desktop.style.display =
                "block";


            console.log(
                "Desktop shown."
            );

        },


        // =============================================
        // HIDE DESKTOP
        // =============================================

        hide: function () {

            if (!this.desktop) {
                return;
            }


            this.desktop.style.display =
                "none";


            console.log(
                "Desktop hidden."
            );

        },


        // =============================================
        // SETUP DESKTOP ICONS
        // =============================================

        setupIcons: function () {

            // -----------------------------------------
            // PREVENT DUPLICATE EVENT LISTENERS
            // -----------------------------------------

            if (this.iconsConnected) {
                return;
            }


            const icons =
                document.querySelectorAll(
                    ".desktop-icon"
                );


            if (!icons.length) {

                console.warn(
                    "Desktop: No desktop icons found."
                );

                return;
            }


            icons.forEach(
                function (icon) {

                    icon.addEventListener(
                        "dblclick",
                        function () {

                            const app =
                                icon.dataset.app;


                            if (!app) {

                                console.warn(
                                    "Desktop icon has no data-app:",
                                    icon
                                );

                                return;
                            }


                            Desktop.openApp(
                                app
                            );

                        }
                    );

                }
            );


            this.iconsConnected = true;


            console.log(
                `Desktop: ${icons.length} icon(s) connected.`
            );

        },


        // =============================================
        // OPEN APPLICATION
        // =============================================

        openApp: function (appName) {

            if (!appName) {
                return;
            }


            console.log(
                `Desktop: Opening ${appName}`
            );


            // -----------------------------------------
            // FILES / FILE EXPLORER
            // -----------------------------------------

            if (
                appName === "files" ||
                appName === "explorer"
            ) {

                if (
                    typeof Explorer !== "undefined" &&
                    typeof Explorer.open === "function"
                ) {

                    Explorer.open();

                    return;

                }


                console.error(
                    "Desktop: Explorer is not available."
                );

                return;

            }


            // -----------------------------------------
            // BROWSER
            // -----------------------------------------

            if (
                appName === "browser"
            ) {

                if (
                    typeof Browser !== "undefined" &&
                    typeof Browser.open === "function"
                ) {

                    Browser.open();

                    return;

                }


                console.error(
                    "Desktop: Browser is not available."
                );

                return;

            }


            // -----------------------------------------
            // BROWSER HISTORY
            // -----------------------------------------

            if (
                appName === "history"
            ) {

                if (
                    typeof HistoryApp !== "undefined" &&
                    typeof HistoryApp.open === "function"
                ) {

                    HistoryApp.open();

                    return;

                }


                console.error(
                    "Desktop: History app is not available."
                );

                return;

            }


            // -----------------------------------------
            // MAIL
            // -----------------------------------------

            if (
                appName === "mail"
            ) {

                if (
                    typeof Mail !== "undefined" &&
                    typeof Mail.open === "function"
                ) {

                    Mail.open();

                    return;

                }


                console.error(
                    "Desktop: Mail is not available."
                );

                return;

            }


            // -----------------------------------------
            // NOTEPAD
            // -----------------------------------------

            if (
                appName === "notepad"
            ) {

                if (
                    typeof Notepad !== "undefined" &&
                    typeof Notepad.open === "function"
                ) {

                    Notepad.open();

                    return;

                }


                console.error(
                    "Desktop: Notepad is not available."
                );

                return;

            }


            // -----------------------------------------
            // UNKNOWN APPLICATION
            // -----------------------------------------

            console.warn(
                `Desktop: Unknown application "${appName}".`
            );

        }

    };


    // =================================================
    // PUBLIC API
    // =================================================

    window.Desktop =
        Desktop;


    // ================================================
    // MAIN.JS COMPATIBILITY
    // ================================================

    window.initializeDesktop =
        function () {

            Desktop.init();

        };


})();
