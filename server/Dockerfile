FROM node:16-alpine as development

RUN npm install -g typescript

WORKDIR /usr/src/app

COPY package*.json .
COPY tsconfig*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine as production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]