/* -------------- Once the page has loaded -------------- */
document.addEventListener('DOMContentLoaded', function () {
    /* --- Button Click Handlers --- */
    record_button.addEventListener("click", recordButtonClick);
    textFileBtn = document.getElementById('textFileBtn');
    textFileBtn.addEventListener('click', function () {
        makeTextFile('sentences.txt');
    });
});