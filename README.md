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

Docker Compose automatically runs the `server`  and `web`  services (explained below) that are defined in `docker-compose.local.yml` and `docker-compose.yml`. As described in the following setup sections, use `docker-compose.local.yml` for local development and `docker-compose.yml` for production. Note that Docker Compose additionally runs the `nginx` service for production.
1. `server`: Semantic parser and website backend that communicates with the parser
2. `web`: Frontend server that allows clients to interface with the backend
3. `nginx`: Web server for https (which is only run in production)

As noted above, there are two YAML files that can be used with `docker-compose`:
- `docker-compose.yml`: for production (with https, nginx, etc.)
- `docker-compose.local.yml`: used for local development - main difference is no service is needed for a reverse-proxy and CertBot since everything is local

See [Local Docker setup](#local-docker-setup) or [Docker setup for production](#docker-setup-for-production) depending on your needs.

#### Local Docker setup
To run the system for local development using `docker-compose`, run in the project root:
```bash
docker-compose -f docker-compose.local.yml up --build
```

To view the Zhorai website, go to [http://localhost:8080](http://localhost:8080). Once done, see [Docker take down](#docker-take-down).

#### Docker setup for production
To set up the system for production, nginx and certbot need to be set up. To do so, you can follow the instructions found [in this Medium article](https://medium.com/@pentacent/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71). Example `app.conf` and `init-letsencrypt.sh` files can be found at `zhorai/data/nginx/app.templateconf` and `zhorai/init-letsencrypt.templatesh`.

To run the system for production with `docker-compose`, run in the project root:
```bash
docker-compose -f docker-compose.yml up --build
```

Now you should be able to view your Zhorai website at your domain. To take down the site, see [Docker take down](#docker-take-down).

#### Docker take down
Once done,<!-- after stopping or pausing the process (e.g., ctrl+c, ctrl+z),--> run the following command to clean up containers created by `docker-compose up`.

```bash
docker-compose -f docker-compose.local.yml down
# or for production, change `docker-compose.local.yml` to `docker-compose.yml`
```

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
# or run `npm start` for production
```

Similarly, to start the frontend express server:
```bash
cd website-frontend
npm run devstart
# or run `npm start` for production
```

For local development, to view the Zhorai website, go to [http://localhost:8080](http://localhost:8080). For production, you will additionally have to set up certificates for your domain.
