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
    /**
     * Adds a new sentence to the session storage and adds a new div 
     * showing that sentence to the user.
     * 
     * @param {*} key : The key where the sentences are stored (e.g., "camel")
     * @param {*} sentence : The sentence to be stored and visualized
     */
    newSentence(key, sentence) {
        // add div
        this._addSentenceDiv(key, this._currIdNum, sentence);

        // add sentence to session
        this._saveSessionSentence(key, this._currIdNum, sentence);

        // keep track of number of sentences for id'ing the sentences
        this._currIdNum++;

    }

    /**
     * Adds all of the current sentences with the key in the session to the DOM. 
     * Note that it first checks to see if there are any sentences on the div, deletes
     * them, and then adds everything in memory.
     * @param {*} key : The key where the sentences are stored (e.g., "camel")
     */
    setDivToSessionSentences(key) {
        // delete all sentences on div:
        this._removeAllSentenceDivs();
        // add all sentences to div (note that _currId gets updated in this method):
        this._addSessionSentencesToDiv(key);
    }

    /**
     * Adds all of the current sentences with the key in the session to the DOM.
     * Note that it updates the _currId to the [maximum value of ids in session +1].
     * @param {*} key : The key where the sentences are stored (e.g., "camel")
     */
    _addSessionSentencesToDiv(key) {
        // sessionData: {sentences: {sent0: "...", sent1: "..."}}
        var sessionData = SentenceManager.getSessionData(key);

        var maxId = 0;
        // Check if we got sentences:
        if (sessionData && JSON.parse(sessionData).sentences) {
            // Then iterate over all the sentence keys and add to div
            var sentences = JSON.parse(sessionData).sentences;
            var ids = Object.keys(sentences);
            sessionData = "";
            for (var i = 0; i < ids.length; i++) {
                var currId = ids[i];
                var idNum = parseInt(currId.replace('sent', ''));
                // add the sentence to the div:
                this._addSentenceDiv(key, idNum, sentences[currId]);

                // update the maxId if necessary
                if (idNum > maxId) {
                    maxId = idNum;
                }
            }
        }

        // Update _currId to the max id in the session +1:
        this._currIdNum = maxId + 1;
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

    _removeAllSentenceDivs() {
        var child = this._sentencesDiv.lastElementChild;
        while (child) {
            this._sentencesDiv.removeChild(child);
            child = this._sentencesDiv.lastElementChild;
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

    /**
     * Returns the sentences at this key as a long string of sentences 
     * with periods in between.
     * @param {*} key : The key where the sentences are stored (e.g., "camel")
     */
    static getSentencesAsString(key) {
        // sessionData: {sentences: {sent0: "...", sent1: "..."}}
        var sessionData = SentenceManager.getSessionData(key)
        var sentenceStr = "";

        // Check if we got sentences:
        if (sessionData && JSON.parse(sessionData).sentences) {
            // Then iterate over all the sentence keys and combine the sentences into a
            // single string:
            var sentences = JSON.parse(sessionData).sentences;
            var keys = Object.keys(sentences);
            sessionData = "";
            for (var i = 0; i < keys.length; i++) {
                var currKey = keys[i];
                sentenceStr += sentences[currKey] + '. ';
            }
        }

        return sentenceStr;
    }
}