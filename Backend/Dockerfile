FROM node:alpine

WORKDIR /app/vote_me

COPY package.json .

RUN npm install

COPY . .

RUN npm run generate

EXPOSE 9999

CMD [ "npm", "run", "start" ]