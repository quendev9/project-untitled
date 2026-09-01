// =====================================================
// PROJECT UNTITLED
// APP — NOTEPAD
// =====================================================

(function () {

    "use strict";


    // =================================================
    // ELEMENTS
    // =================================================

    const notepadWindow =
        document.getElementById("notepadWindow");

    const noteList =
        document.getElementById("noteList");

    const noteTitle =
        document.getElementById("noteTitle");

    const notepadText =
        document.getElementById("notepadText");

    const newNoteButton =
        document.getElementById("newNote");

    const saveNoteButton =
        document.getElementById("saveNote");

    const deleteNoteButton =
        document.getElementById("deleteNote");

    const statusDisplay =
        document.getElementById("notepadStatus");


    // =================================================
    // STATE
    // =================================================

    let currentNoteId = null;

    let notes = [];

    let isDirty = false;


    // =================================================
    // SAFETY CHECK
    // =================================================

    if (!notepadWindow) {

        console.warn(
            "Notepad: #notepadWindow was not found."
        );

        return;
    }


    // =================================================
    // LOAD NOTE DATA
    // =================================================

    function loadNoteData() {

        /*
         * notes.js may expose the data under different
         * names depending on the data architecture.
         */

        if (
            typeof NOTES !== "undefined" &&
            Array.isArray(NOTES)
        ) {

            notes = NOTES;

            return;
        }


        if (
            typeof NOTE_DATA !== "undefined" &&
            Array.isArray(NOTE_DATA)
        ) {

            notes = NOTE_DATA;

            return;
        }


        if (
            typeof notesData !== "undefined" &&
            Array.isArray(notesData)
        ) {

            notes = notesData;

            return;
        }


        /*
         * If no external data exists, start with an
         * empty collection.
         */

        notes = [];
    }


    // =================================================
    // HELPERS
    // =================================================

    function play(type) {

        if (
            typeof playSound === "function"
        ) {

            playSound(type);
        }
    }


    function updateStatus(message) {

        if (statusDisplay) {

            statusDisplay.textContent =
                message;
        }
    }


    function markDirty() {

        isDirty = true;

        updateStatus("Modified");
    }


    function markSaved() {

        isDirty = false;

        updateStatus("Saved");
    }


    function generateNoteId() {

        return (
            "note-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 10000
            )
        );
    }


    function getNoteTitle(note) {

        if (!note) {
            return "Untitled";
        }

        return (
            note.title ||
            note.name ||
            "Untitled"
        );
    }


    function getNoteContent(note) {

        if (!note) {
            return "";
        }

        return (
            note.content ??
            note.text ??
            note.body ??
            ""
        );
    }


    // =================================================
    // OPEN NOTEPAD
    // =================================================

    function openNotepad(noteId = null) {

        loadNoteData();

        if (
            typeof WindowManager !== "undefined" &&
            typeof WindowManager.open === "function"
        ) {

            WindowManager.open(
                "notepadWindow"
            );

        } else {

            notepadWindow.style.display =
                "block";
        }


        /*
         * If a note ID was supplied, open that note.
         */

        if (noteId !== null) {

            const foundNote =
                findNote(noteId);

            if (foundNote) {

                selectNote(
                    foundNote.id ||
                    foundNote.name
                );

                return;
            }
        }


        /*
         * Otherwise render the note list and
         * automatically open the first note.
         */

        renderNoteList();


        if (
            notes.length > 0 &&
            !currentNoteId
        ) {

            selectNote(
                notes[0].id ||
                notes[0].name
            );

        } else if (notes.length === 0) {

            clearEditor();
        }
    }


    // =================================================
    // CLOSE NOTEPAD
    // =================================================

    function closeNotepad() {

        if (isDirty) {

            const shouldClose =
                window.confirm(
                    "This note has unsaved changes. Close anyway?"
                );

            if (!shouldClose) {
                return;
            }
        }


        if (
            typeof WindowManager !== "undefined" &&
            typeof WindowManager.close === "function"
        ) {

            WindowManager.close(
                "notepadWindow"
            );

        } else {

            notepadWindow.style.display =
                "none";
        }
    }


    // =================================================
    // FIND NOTE
    // =================================================

    function findNote(noteId) {

        if (!noteId) {
            return null;
        }

        return (
            notes.find(note => {

                if (!note) {
                    return false;
                }

                return (
                    String(note.id) ===
                    String(noteId)
                );
            }) ||

            notes.find(note => {

                if (!note) {
                    return false;
                }

                return (
                    String(note.name) ===
                    String(noteId)
                );
            }) ||

            notes.find(note => {

                if (!note) {
                    return false;
                }

                return (
                    String(note.title) ===
                    String(noteId)
                );
            }) ||

            null
        );
    }


    // =================================================
    // RENDER NOTE LIST
    // =================================================

    function renderNoteList() {

        if (!noteList) {
            return;
        }

        noteList.innerHTML = "";


        if (notes.length === 0) {

            const empty =
                document.createElement("div");

            empty.className =
                "note-item";

            empty.textContent =
                "No notes.";

            empty.style.cursor =
                "default";

            noteList.appendChild(empty);

            return;
        }


        notes.forEach(note => {

            if (!note) {
                return;
            }


            const id =
                note.id ||
                note.name ||
                note.title;


            const item =
                document.createElement("div");

            item.className =
                "note-item";


            if (
                String(id) ===
                String(currentNoteId)
            ) {

                item.classList.add(
                    "active"
                );
            }


            item.textContent =
                getNoteTitle(note);


            item.addEventListener(
                "click",
                function () {

                    selectNote(id);
                }
            );


            noteList.appendChild(item);
        });
    }


    // =================================================
    // SELECT NOTE
    // =================================================

    function selectNote(noteId) {

        const note =
            findNote(noteId);


        if (!note) {

            console.warn(
                "Notepad: note not found:",
                noteId
            );

            return;
        }


        /*
         * If the current note has unsaved changes,
         * ask before switching.
         */

        if (
            isDirty &&
            String(noteId) !==
            String(currentNoteId)
        ) {

            const shouldSwitch =
                window.confirm(
                    "This note has unsaved changes. Switch notes anyway?"
                );

            if (!shouldSwitch) {
                return;
            }
        }


        currentNoteId =
            note.id ||
            note.name ||
            note.title;


        if (noteTitle) {

            noteTitle.value =
                getNoteTitle(note);
        }


        if (notepadText) {

            notepadText.value =
                getNoteContent(note);
        }


        isDirty = false;

        updateStatus("Saved");

        renderNoteList();

        play("open");
    }


    // =================================================
    // CLEAR EDITOR
    // =================================================

    function clearEditor() {

        currentNoteId = null;

        if (noteTitle) {

            noteTitle.value =
                "Untitled";
        }

        if (notepadText) {

            notepadText.value =
                "";
        }

        isDirty = false;

        updateStatus("New note");

        renderNoteList();
    }


    // =================================================
    // NEW NOTE
    // =================================================

    function createNewNote() {

        /*
         * Don't accidentally lose unsaved work.
         */

        if (isDirty) {

            const shouldCreate =
                window.confirm(
                    "This note has unsaved changes. Create a new note anyway?"
                );

            if (!shouldCreate) {
                return;
            }
        }


        const newNote = {

            id: generateNoteId(),

            title: "Untitled",

            content: ""
        };


        notes.push(newNote);


        currentNoteId =
            newNote.id;


        if (noteTitle) {

            noteTitle.value =
                newNote.title;
        }


        if (notepadText) {

            notepadText.value =
                "";
        }


        isDirty = true;

        updateStatus("New note");

        renderNoteList();

        play("new");


        if (notepadText) {

            notepadText.focus();
        }
    }


    // =================================================
    // SAVE NOTE
    // =================================================

    function saveNote() {

        if (!currentNoteId) {

            /*
             * If there isn't a selected note,
             * create one automatically.
             */

            const newNote = {

                id: generateNoteId(),

                title:
                    noteTitle?.value.trim() ||
                    "Untitled",

                content:
                    notepadText?.value ||
                    ""
            };


            notes.push(newNote);

            currentNoteId =
                newNote.id;

        } else {

            const note =
                findNote(currentNoteId);


            if (!note) {

                console.warn(
                    "Notepad: unable to save note."
                );

                return;
            }


            const title =
                noteTitle?.value.trim() ||
                "Untitled";


            const content =
                notepadText?.value ||
                "";


            /*
             * Keep compatibility with different
             * possible note data structures.
             */

            note.title =
                title;

            note.name =
                note.name ||
                title;

            note.content =
                content;

            note.text =
                note.text !== undefined
                    ? content
                    : note.text;

            note.body =
                note.body !== undefined
                    ? content
                    : note.body;
        }


        renderNoteList();

        isDirty = false;

        updateStatus("Saved");

        play("save");
    }


    // =================================================
    // DELETE NOTE
    // =================================================

    function deleteCurrentNote() {

        if (!currentNoteId) {
            return;
        }


        const note =
            findNote(currentNoteId);


        if (!note) {
            return;
        }


        const title =
            getNoteTitle(note);


        const confirmed =
            window.confirm(
                `Delete "${title}"?`
            );


        if (!confirmed) {
            return;
        }


        const index =
            notes.findIndex(
                item => {

                    if (!item) {
                        return false;
                    }

                    return (
                        String(
                            item.id ||
                            item.name ||
                            item.title
                        ) ===
                        String(currentNoteId)
                    );
                }
            );


        if (index !== -1) {

            notes.splice(
                index,
                1
            );
        }


        currentNoteId = null;

        isDirty = false;


        /*
         * Open another note if one exists.
         */

        if (notes.length > 0) {

            const nextNote =
                notes[
                    Math.min(
                        index,
                        notes.length - 1
                    )
                ];


            selectNote(
                nextNote.id ||
                nextNote.name ||
                nextNote.title
            );

        } else {

            clearEditor();
        }


        renderNoteList();

        play("delete");
    }


    // =================================================
    // EDITOR EVENTS
    // =================================================

    if (noteTitle) {

        noteTitle.addEventListener(
            "input",
            markDirty
        );
    }


    if (notepadText) {

        notepadText.addEventListener(
            "input",
            markDirty
        );
    }


    // =================================================
    // BUTTON EVENTS
    // =================================================

    if (newNoteButton) {

        newNoteButton.addEventListener(
            "click",
            createNewNote
        );
    }


    if (saveNoteButton) {

        saveNoteButton.addEventListener(
            "click",
            saveNote
        );
    }


    if (deleteNoteButton) {

        deleteNoteButton.addEventListener(
            "click",
            deleteCurrentNote
        );
    }


    // =================================================
    // KEYBOARD SHORTCUTS
    // =================================================

    document.addEventListener(
        "keydown",
        function (event) {

            /*
             * Ctrl + S
             */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "s"
            ) {

                event.preventDefault();

                saveNote();
            }


            /*
             * Ctrl + N
             */

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "n"
            ) {

                event.preventDefault();

                createNewNote();
            }
        }
    );


    // =================================================
    // WINDOW CLOSE PROTECTION
    // =================================================

    const closeButtons =
        notepadWindow.querySelectorAll(
            ".window-buttons button"
        );


    closeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                function (event) {

                    /*
                     * Only intercept buttons that
                     * actually close the window.
                     *
                     * The window manager handles the
                     * actual close operation.
                     */

                    const action =
                        button.dataset.action ||
                        button.getAttribute(
                            "aria-label"
                        ) ||
                        button.title ||
                        button.textContent.trim();


                    if (
                        action.toLowerCase()
                            .includes("close")
                    ) {

                        if (isDirty) {

                            const shouldClose =
                                window.confirm(
                                    "This note has unsaved changes. Close anyway?"
                                );


                            if (!shouldClose) {

                                event.stopImmediatePropagation();
                                event.preventDefault();
                            }
                        }
                    }
                }
            );
        }
    );


    // =================================================
    // PUBLIC API
    // =================================================

    window.Notepad = {

        open:
            openNotepad,

        close:
            closeNotepad,

        newNote:
            createNewNote,

        save:
            saveNote,

        delete:
            deleteCurrentNote,

        select:
            selectNote,

        refresh:
            function () {

                loadNoteData();

                renderNoteList();
            },

        getCurrentNote:
            function () {

                return findNote(
                    currentNoteId
                );
            },

        isModified:
            function () {

                return isDirty;
            }

    };


    // =================================================
    // LEGACY GLOBAL
    // =================================================

    window.openNotepad =
        openNotepad;


    // =================================================
    // INITIALIZE
    // =================================================

    loadNoteData();

    renderNoteList();

    updateStatus("Ready");


})();