FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
ENV PATH /usr/src/app/node_modules/.bin/:$PATH

COPY . .

CMD ["node", "src/"]