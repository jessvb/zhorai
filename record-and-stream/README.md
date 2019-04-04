# Setup
To set up the recording and stream the recorded data to the server, you first have to start the server, which will be run locally on port 9001 (i.e., http://localhost:9001/).

## Step 1: Start the server
* Open up a terminal and cd into the `server` directory 
* If this is your first time running the server, run `npm install` to install the necessary packages ([more information on npm](https://www.npmjs.com/get-npm))
* Once the required packages are installed, start the server in the command line by running `node index.js`
* To test that the server is running, you can go to [http://localhost:9001/](http://localhost:9001/) in your browser, and you should see the words `Not implemented` (since we haven't implemented any HTML for the server side of things)

## Step 2: Start the client
* In the `client` directory, open `index.html` in a browser
* You should see a "Record" button
* Click record and allow the browser to use your microphone
* In the terminal where you ran `node index.js`, you should see "Connected! streaming..."
* The server is now writing to a file called `demo.wav`, which you should see in the server directory
* Try making some noise and playing the `demo.wav` file
* It should play back your recording!

## Final notes
If you open up the console while on the `index.html` webpage, you should see something along the lines of `int 16: [object ArrayBuffer]` with a number rapidly increasing on the left (since this string is being outputted many times a second). The client is streaming 16-bit integers to the server, which takes the integers and converts them to `.wav` format. Try clicking the record button once more. This calls the `streamOrStopAudio()` function again, which ideally would stop the streaming (and the number in the console would stop increasing). This functionality isn't yet implemented (although you can see a code stub, `todo stop streaming`, where it may be implemented in the future).
