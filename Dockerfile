FROM node:5

ADD . /app
WORKDIR /app

RUN npm install

CMD npm start
