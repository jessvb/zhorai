/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    // clear any previous memory (e.g., name/place from intro):
    clearMemory('sentences.txt');

    /* --- Button Click Handlers --- */
    record_button.addEventListener("click", recordButtonClick);
    textFileBtn = document.getElementById('textFileBtn');
    textFileBtn.addEventListener('click', function () {
        makeTextFile('sentences.txt');
    });
});