FROM node:5

ADD package.json /app/
WORKDIR /app
RUN npm install

ADD dist server www /app/

CMD npm start
