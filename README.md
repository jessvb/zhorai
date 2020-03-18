# Zhorai
An interactive conversational agent for K-12 AI education. See the [EAAI 2020 paper about Zhorai here](https://uploads-ssl.webflow.com/5e388f0cc3c41617d66719d8/5e432a7280e474409a4c2e83_EAAI-LinP.27.pdf).

For first-time set up of the semantic parser, follow the [README](https://github.com/jessvb/zhorai/blob/master/semantic-parser/README.md)

For first-time set up of the node server,
```
cd website-backend/receive-text
npm install
```

If the semantic parser has previously been set up, you can start it with,
```
cd semantic-parser/stanford-corenlp-full-2018-10-05
java -mx6g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -timeout 5000
```

To start the node server,
```
cd website-backend/receive-text
node receiver.js
# or use 'forever' instead of node so that it continually respawns, even if it crashes:
# forever receiver.js
```

The website uses the Bootstrap library to construct the overall site framework. Speech recognition and synthesis was implemented using the Web Speech API’s webkitSpeechRecognition interface. The mindmap and scatter plot visualizations use the D3 JavaScript library.
