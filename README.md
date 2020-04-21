# Zhorai
An interactive conversational agent for K-12 AI education. See the [EAAI 2020 paper about Zhorai here](https://uploads-ssl.webflow.com/5e388f0cc3c41617d66719d8/5e432a7280e474409a4c2e83_EAAI-LinP.27.pdf). The Zhorai website uses the Bootstrap library to construct the overall site framework, the Web Speech API for speech recognition and synthesis, and the D3 JavaScript library for mindmap and scatter plot visualizations.

## Setup
There are two ways to set up Zhorai:
1. [With Docker](#with-docker) (recommended)
2. [Manually](#manual-setup)

### With Docker
The easiest way to run the whole system is through Docker and Docker Compose.

Install [Docker for Mac](https://docs.docker.com/docker-for-mac/install/) or [Docker for Windows](https://docs.docker.com/docker-for-windows/install/) and Docker Compose should be included. You should be able to run
```bash
docker -v && docker-compose -v
```
and output should be similar to
```bash
Docker version 19.03.2, build 6a30dfc
docker-compose version 1.24.1, build 4667896b
```

Docker Compose automatically runs the `server`  and `web`  services that are defined in `docker-compose.local.yml`.
1. `server`: Semantic parser and website backend that communicates with the parser
2. `web`: Frontend server that allows clients to interface with the backend

Eventually, there will be two YAML files that can be used with `docker-compose`: `docker-compose.yml` (for production with https) and `docker-compose.local.yml` (for local development), but for now, there is only the local development version. For production, complete the manual setup on the main branch instead.
<!-- 
- `docker-compose.yml`: used for production with https
- `docker-compose.local.yml`: used for local development - main difference is no service is needed for a reverse-proxy and CertBot since everything is local 
-->

#### Docker setup
To run the system using `docker-compose`, run in the project root:
```bash
docker-compose -f docker-compose.local.yml up --build
```

To view the Zhorai website, go to [http://localhost:8080](http://localhost:8080).

Once done,<!-- after stopping or pausing the process (e.g., ctrl+c, ctrl+z),--> run the following command to clean up containers created by `docker-compose up`.

```bash
docker-compose -f docker-compose.local.yml down
```
 <!-- --rmi local-->

#### Development/testing within Docker container
To enter into the docker container (e.g., for testing installed libraries), use `docker exec -it` as follows:
```bash
docker container list
# from the output of the above commant, find the relevant container id (associated 
# with the image name, `zhorai_web` or `zhorai_server` for the `web` and `server` 
# services respectively), and use it in the command below instead of <CONTAINER_ID>
docker exec -it <CONTAINER_ID> /bin/bash
```

### Manual setup
Although manual setup is not recommended, it is possible. To do so, you will have to set up the semantic paser and the frontend and backend node servers.

For first-time setup of the semantic parser, follow the [README](https://github.com/jessvb/zhorai/blob/master/semantic-parser/README.md) in the `semantic-parser` directory.

For first-time setup of the backend node server, install the node dependencies:
```bash
cd website-backend/receive-text
npm install
```

For first-time setup of the frontend express server, do the same:
```bash
cd website-frontend
npm install
```

If the semantic parser has previously been set up, you can start it with:
```bash
cd semantic-parser/stanford-corenlp-full-2018-10-05
java -mx6g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer -timeout 5000
```

To start the backend node server:
```bash
cd website-backend/receive-text
npm run devstart
# For production, use 'forever' instead of node so that it continually respawns
# (even if it crashes) by running `npm start` (which runs `forever receiver.js`)
```

Similarly, to start the frontend express server:
```bash
cd website-frontend
npm run devstart
# For production, use 'forever' instead of node so that it continually respawns
# (even if it crashes) by running `npm start` (which runs `forever app.js`)
```

To view the Zhorai website, go to [http://localhost:8080](http://localhost:8080).