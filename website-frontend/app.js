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
// TODO: noticed that the cookie is only set for /intro... might want to set
// it for every page in case users don't start on /intro!!
var wssUrl = 'ws://localhost:5000'; // todo: refactor variable name to 'wsUrl'


/////////////
// Routing //
/////////////
app.get('/', (req, res) => res.sendFile(path.resolve('./public/zhorai-intro.html')));

// app.get('/intro', (req, res) => res.sendFile(path.resolve('./public/zhorai-intro.html')));
app.get('/intro', function (req, res) {
    res.cookie('wssUrl', wssUrl);
    res.sendFile(path.resolve('./public/zhorai-intro.html'));
});
app.get('/activity-1', (req, res) => res.sendFile(path.resolve('./public/activity-1.html')));
app.get('/activity-2', (req, res) => res.sendFile(path.resolve('./public/activity-2.html')));
app.get('/activity-3', (req, res) => res.sendFile(path.resolve('./public/activity-3.html')));
app.get('/activity-4', (req, res) => res.sendFile(path.resolve('./public/activity-4.html')));
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
// let checkUserStudy = (stage, part) => {
//     if (part !== 'voice-text' && part !== 'voice')
//         return false;

//     if (!['practice', 'novice', 'advanced'].includes(stage))
//         return false;

//     return true;
// }


/////////////////////////////////////////
// todo: put the on connection stuff here
/////////////////////////////////////////
// streams = {};
// writers = {};

// io.on('connection', (client) => {
//     let sessionId = client.id;
//     let sid;
//     let stage;
//     let part;

//     let startStream = () => {
//         streams[sessionId] = speechClient.streamingRecognize(request)
//             .on('error', (err) => {
//                 console.log(`[${sid}] Error occured so restarting stream.`);
//                 console.log(err);
//                 io.to(`${sessionId}`).emit('streamError', err);
//             })
//             .on('data', (data) => {
//                 if (data.results[0] && data.results[0].alternatives[0]) {
//                     let transcript = data.results[0].alternatives[0].transcript;
//                     io.to(`${sessionId}`).emit('clientUtter', transcript);
//                 } else {
//                     console.log(`[${sid}] Reached transcription time limit, press Ctrl+C`);
//                 }
//             });
//     }

//     let endStream = () => {
//         if (sessionId in writers) {
//             writers[sessionId].end();
//             delete writers[sessionId];
//         }
//         if (sessionId in streams) {
//             streams[sessionId].end();
//             delete streams[sessionId];
//         }
//     }

//     client.on('join', (data) => {
//         if (data) {
//             sid = data.sid;
//             stage = data.stage;
//             part = data.part;
//             console.log(`[${sid}][${stage},${part}] Client connected to server.`);
//             if (checkUserStudy(stage, part)) {
//                 let dir = `audio/${stage}/${part.replace('-', '_')}/${sid}`;
//                 fs.mkdirSync(dir, { recursive: true });
//             }
//             io.to(`${sessionId}`).emit('joined', sid);
//         } else {
//             console.log('Client connected without an SID.');
//         }
//     });

//     client.on('disconnect', () => {
//         console.log(`[${sid}][${stage},${part}] Client disconnected.`);
//     });

//     client.on('startStream', (data) => {
//         console.log(`[${data.sid}][${data.stage},${data.part}] Starting stream.`);
//         if ('sid' in data && 'part' in data && 'stage' in data) {
//             if (checkUserStudy(data.stage, data.part)) {
//                 let audioName = `audio/${data.stage}/${data.part.replace('-', '_')}/${data.sid}/${Date.now()}.wav`;
//                 writers[sessionId] = new wav.FileWriter(audioName, {
//                     channels: 1,
//                     sampleRate: 16000,
//                     bitDepth: 16,
//                 });
//             }
//         }

//         startStream();
//     });

//     client.on('endStream', () => {
//         console.log(`[${sid}][${stage},${part}] Ending stream.`);
//         endStream();
//     });

//     client.on('audio', (data) => {
//         if (!(sessionId in streams))
//             console.log(`[${sid}][${stage},${part}] Stream is null.`)
//         else if (!streams[sessionId].writable)
//             console.log(`[${sid}][${stage},${part}] Stream became unwritable.`);
//         else {
//             streams[sessionId].write(data);
//         }

//         if (sessionId in writers)
//             writers[sessionId].write(data);
//     });
// });

httpServer.listen(port, host, () => {
    console.log(`HTTP server started at http://${host}:${port}/.`);
});
