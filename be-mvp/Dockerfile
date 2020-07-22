FROM node:12-alpine
COPY ./package.json /chat-mvp/be-mvp/package.json
WORKDIR /chat-mvp/be-mvp/
RUN npm install

COPY . /chat-mvp/be-mvp/

EXPOSE 3333
CMD node server.js