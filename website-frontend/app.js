const path = require('path');
const express = require('express');
const app = express();
const host = '0.0.0.0';
const port = 8080;
const httpServer = require('http').Server(app);
// const wav = require('wav'); // todo -- for saving wav files

// provide all the resources in the 'public' directory
app.use(express.static('public'));


/////////////////////////////////////////////////////////////////////
// Set variables to be accessible on static html pages via cookies //
/////////////////////////////////////////////////////////////////////
// TODO(eventually): Cookies are slightly hack-y. Would recommend switching
// to a rendering approach (e.g., using ejs to render & send variables)
// instead. https://stackoverflow.com/a/41641782/8162699 (but for now we're
// using them for serving the ws variable so that each page has it)
var wssUrl = '';
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    wssUrl = "wss://zhorai.csail.mit.edu/ws/";
} else {
    // development mode
    wssUrl = 'ws://localhost:5000';
}

/////////////
// Routing //
/////////////
app.get('/', (req, res) => res.sendFile(path.resolve('./public/zhorai-intro.html')));

// app.get('/intro', (req, res) => res.sendFile(path.resolve('./public/zhorai-intro.html')));
app.get('/intro', function (req, res) {
    res.cookie('wssUrl', wssUrl);
    res.sendFile(path.resolve('./public/zhorai-intro.html'));
});
app.get('/activity-1', function (req, res) {
    res.cookie('wssUrl', wssUrl);
    res.sendFile(path.resolve('./public/activity-1.html'));
});
app.get('/activity-2', function (req, res) {
    res.cookie('wssUrl', wssUrl);
    res.sendFile(path.resolve('./public/activity-2.html'));
});
app.get('/activity-3', function (req, res) {
    res.cookie('wssUrl', wssUrl);
    res.sendFile(path.resolve('./public/activity-3.html'));
});
app.get('/activity-4', function (req, res) {
    res.cookie('wssUrl', wssUrl);
    res.sendFile(path.resolve('./public/activity-4.html'));
});
app.get('/resources', (req, res) => res.sendFile(path.resolve('./public/teacher.html')));
app.get('/teacher', (req, res) => res.sendFile(path.resolve('./public/teacher.html')));

app.get('/teacher-guide', (req, res) => {
    res.redirect('https://docs.google.com/document/d/1yjJzqgWv-qZqbcN6ZvkC-40_j9S8JYZrW4nLNgoyyqI/edit?usp=sharing');
});
app.get('/student-worksheet', (req, res) => {
    res.redirect('https://docs.google.com/document/d/1ycv8Vm_H52Ph-5JBdxayFUotsLOcHlnagNpNfQCvogQ/edit?usp=sharing');
});


//////////////////////////////////////////////////////////
// todo: add all the requirements here instead of per-page
//////////////////////////////////////////////////////////
// e.g., from convo:
// const speech = require('@google-cloud/speech');
// const speechClient = new speech.SpeechClient();
// const encoding = 'LINEAR16';
// const sampleRateHertz = 16000;
// const languageCode = 'en-US';
// const request = {
//     'config': {
//         'encoding': encoding,
//         'sampleRateHertz': sampleRateHertz,
//         'languageCode': languageCode,
//         'speechContexts' : [
//             {'phrases': ['done', 'close loop', 'while', 'create a', 'called', 'step', 'say'], 'boost': 15 },
//             {'phrases': ['create a procedure', 'create a variable', 'make a variable', 'get user input', 'save it as']},
//             {'phrases': ['is greater than', 'is less than', 'is equal to', 'is greater than or equal to']},
//             {'phrases': ['pet', 'horse', 'cat', 'dog', 'cricket', 'bird', 'cow'], 'boost': 10},
//             {'phrases': [
//                 'get user input and save it as pet',
//                 'if the value of pet',
//                 'run pet sounds',
//                 'add one to',
//                 'subtract one from',
//                 'hello world'
//             ]},
//             {'phrases': ['add step', 'change step', 'remove step']}
//         ],
//         'model': 'command_and_search'
//     },
//     'interimResults': false
// };

/////////////////////////////////////////
// todo: add general util functions here:
/////////////////////////////////////////
// e.g., from convo:
// let checkUserStudy = (stage, part) => {
//     if (part !== 'voice-text' && part !== 'voice')
//         return false;

//     if (!['practice', 'novice', 'advanced'].includes(stage))
//         return false;

//     return true;
// }

httpServer.listen(port, host, () => {
    console.log(`HTTP server started at http://${host}:${port}/.`);
});
