// =====================================================
// PROJECT UNTITLED
// SYSTEM — SOUND MANAGER
// =====================================================

(function () {

    "use strict";


    // =================================================
    // SOUND DEFINITIONS
    // =================================================

    const sounds = {

        boot:
            "assets/sounds/boot.wav",

        click:
            "assets/sounds/click.wav",

        close:
            "assets/sounds/close.wav",

        delete:
            "assets/sounds/delete.wav",

        error:
            "assets/sounds/error.wav",

        file:
            "assets/sounds/file.wav",

        mail:
            "assets/sounds/mail.wav",

        maximize:
            "assets/sounds/maximize.wav",

        minimize:
            "assets/sounds/minimize.wav",

        navigate:
            "assets/sounds/navigate.wav",

        newFile:
            "assets/sounds/new.wav",

        notification:
            "assets/sounds/notification.wav",

        open:
            "assets/sounds/open.wav",

        save:
            "assets/sounds/save.wav",

        search:
            "assets/sounds/search.wav",

        shutdown:
            "assets/sounds/shutdown.wav",

        success:
            "assets/sounds/success.wav",

        warning:
            "assets/sounds/warning.wav"

    };


    // =================================================
    // STATE
    // =================================================

    const audioCache = {};

    let initialized = false;

    let enabled = true;

    let masterVolume = 0.6;


    // =================================================
    // PRELOAD SOUNDS
    // =================================================

    function preload() {

        Object.entries(sounds).forEach(
            function ([name, path]) {

                const audio =
                    new Audio(path);

                audio.preload =
                    "auto";

                audio.volume =
                    masterVolume;

                audioCache[name] =
                    audio;

            }
        );

    }


    // =================================================
    // PLAY SOUND
    // =================================================

    function play(name) {

        if (!enabled) {
            return;
        }


        if (!audioCache[name]) {

            console.warn(
                `Sound "${name}" does not exist.`
            );

            return;
        }


        try {

            const sound =
                audioCache[name].cloneNode(
                    true
                );


            sound.volume =
                masterVolume;


            const playPromise =
                sound.play();


            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(
                    function () {
                        // Browser audio policy may
                        // block playback before interaction.
                    }
                );

            }

        } catch (error) {

            console.warn(
                `Could not play sound "${name}".`,
                error
            );

        }

    }


    // =================================================
    // VOLUME
    // =================================================

    function setVolume(volume) {

        const numericVolume =
            Number(volume);


        if (
            Number.isNaN(numericVolume)
        ) {

            return;

        }


        masterVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    numericVolume
                )
            );


        Object.values(
            audioCache
        ).forEach(
            function (audio) {

                audio.volume =
                    masterVolume;

            }
        );

    }


    function getVolume() {

        return masterVolume;

    }


    // =================================================
    // ENABLE / DISABLE
    // =================================================

    function enable() {

        enabled = true;

    }


    function disable() {

        enabled = false;

    }


    function isEnabled() {

        return enabled;

    }


    // =================================================
    // COMMON SOUNDS
    // =================================================

    function click() {

        play("click");

    }


    function open() {

        play("open");

    }


    function close() {

        play("close");

    }


    function navigate() {

        play("navigate");

    }


    function error() {

        play("error");

    }


    function warning() {

        play("warning");

    }


    function success() {

        play("success");

    }


    function notification() {

        play("notification");

    }


    function file() {

        play("file");

    }


    function mail() {

        play("mail");

    }


    function search() {

        play("search");

    }


    function save() {

        play("save");

    }


    function remove() {

        play("delete");

    }


    function create() {

        play("newFile");

    }


    function minimize() {

        play("minimize");

    }


    function maximize() {

        play("maximize");

    }


    function boot() {

        play("boot");

    }


    function shutdown() {

        play("shutdown");

    }


    // =================================================
    // INITIALIZE
    // =================================================

    function init() {

        if (initialized) {
            return;
        }


        preload();


        initialized = true;


        console.log(
            "Sound system initialized."
        );

    }


    // =================================================
    // PUBLIC SOUND API
    // =================================================

    const SoundSystem = {

        init,

        play,

        click,

        open,

        close,

        navigate,

        error,

        warning,

        success,

        notification,

        file,

        mail,

        search,

        save,

        remove,

        create,

        minimize,

        maximize,

        boot,

        shutdown,

        setVolume,

        getVolume,

        enable,

        disable,

        isEnabled,

        isInitialized:
            function () {

                return initialized;

            }

    };


    // =================================================
    // GLOBAL SOUND SYSTEM
    // =================================================

    window.SoundSystem =
        SoundSystem;


    // =================================================
    // MAIN.JS COMPATIBILITY
    // =================================================

    window.initializeSound =
        function () {

            SoundSystem.init();

        };


    // =================================================
    // LEGACY / SIMPLE SOUND API
    // =================================================

    window.playSound =
        function (name) {

            SoundSystem.play(name);

        };


})();
