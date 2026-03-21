FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install -g nodemon

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start:dev"]
