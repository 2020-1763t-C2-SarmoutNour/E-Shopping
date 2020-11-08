FROM node:14

WORKDIR /usr/src/app

COPY ./client/package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run-script", "start_docker_dev" ]