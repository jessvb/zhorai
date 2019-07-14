class SentenceManager {
    _sentencesDiv;
    _delIconPath;
    _currIdNum;

    // constants
    _delIconWidth = 30; // 30x30px for the delete icon

    constructor(sentencesDiv, delIconPath) { // document.getElementById("sentencesDiv"); ./img/x_del.svg
        this._sentencesDiv = sentencesDiv;
        this._delIconPath = delIconPath;
        this._currIdNum = 0;
    }

    /* --- public methods for adding/removing div and session info --- */
    newSentence(key, sentence) {
        // add div
        this._addSentenceDiv(key, this._currIdNum, sentence);

        // add sentence to session
        this._saveSessionSentence(key, this._currIdNum, sentence);

        // keep track of number of sentences for id'ing the sentences
        this._currIdNum++;

    }

    // click handler for x_del button:
    _removeSentence(key, idNum) {
        // remove from session
        this._removeSessionSentence(key, idNum);

        // remove div
        this._removeSentenceDiv(idNum);
    }

    /* --- utils for changing sentence divs --- */
    _addSentenceDiv(key, idNum, sentence) {
        // todo: add id to sentence and cancel btn so that the div can later be removed

        // Create new div:
        // e.g., <div id=sent0>A sentence. <img class="delSentence" src="img/x_del.svg" width="30px" height="30px"></div>
        var newDiv = document.createElement('div');
        newDiv.id = "sent" + idNum;
        newDiv.innerText = sentence;

        // create image for the delete icon:
        var delImg = document.createElement('img');
        delImg.src = this._delIconPath;
        delImg.width = this._delIconWidth;
        delImg.height = this._delIconWidth;

        // add click handler to image:
        var context = this;
        delImg.addEventListener("click", function () {
            context._removeSentence(key, idNum);
        });

        // Add delete icon to the div:
        newDiv.appendChild(delImg);

        // Add div to sentences div:
        this._sentencesDiv.appendChild(newDiv);
    }

    _removeSentenceDiv(idNum) {
        var sentenceDiv = document.getElementById("sent" + idNum);
        if (sentenceDiv) {
            sentenceDiv.parentNode.removeChild(sentenceDiv);
        } else {
            console.log("There was no div with id: " + "sent" + idNum + ". " +
                "Div was not removed");
        }
    }

    /* --- utils for saving sentence information --- */
    _saveSessionSentence(key, sentenceIdNum, sentence) {
        console.log('saving data (key: ' + key + '; id: ' + "sent" + sentenceIdNum + '): ' +
            sentence);

        var currSessData = SentenceManager.getSessionData(key);
        var jsonToSave = {};
        if (currSessData && JSON.parse(currSessData).sentences) {
            // there are sentences already at the current key, so append the newest one
            jsonToSave = JSON.parse(currSessData);
            jsonToSave.sentences["sent" + sentenceIdNum] = sentence;
        } else {
            // there's no session data for this key yet, so let's make it!
            jsonToSave = {
                sentences: {}
            };
            jsonToSave.sentences["sent" + sentenceIdNum] = sentence;
        }

        // save the json as a string in the sessionStorage
        SentenceManager.saveSessionData(key, JSON.stringify(jsonToSave));
    }

    _removeSessionSentence(key, idNum) {
        // Get the sentences with that key, remove the sentence with id, and restore
        var sessionData = SentenceManager.getSessionData(key);
        var jsonToSave = {};
        if (sessionData && JSON.parse(sessionData).sentences) {
            console.log("Removing sentence with id: " + "sent" + idNum);
            jsonToSave = JSON.parse(sessionData);
            // check that there's a sentence with the id:
            if (jsonToSave.sentences["sent" + idNum]) {
                delete jsonToSave.sentences["sent" + idNum];
            } else {
                console.log("There was no sentence with id: " + "sent" + idNum + ". " +
                    "Sentence was not removed.")
            }
        } else {
            console.log("There was no session data with key: " + key + ". Sentence" +
                " was not removed.");
        }

        // save the json as a string in the sessionStorage
        SentenceManager.saveSessionData(key, JSON.stringify(jsonToSave));
    }


    /* --- utils for basic session storage --- */
    static saveSessionData(key, value) {
        console.log('saving data (' + key + '): ' + value);
        sessionStorage.setItem(key, value);
    }

    static getSessionData(key) {
        var value = sessionStorage.getItem(key);
        console.log('getting data (' + key + '): ' + value);
        if (!value) {
            console.log('There was no data previously stored. Returning null.');
            value = null;
        }
        return value;
    }

    static removeSessionData(key) {
        sessionStorage.removeItem(key);
    }

    static clearAllSessionData() {
        sessionStorage.clear();
    }
}