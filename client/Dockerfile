FROM node:14

WORKDIR /usr/src/app

COPY ./client/package*.json ./

RUN npm install

COPY . .

CMD [ "npm install", "run-script", "start_docker_dev" ]