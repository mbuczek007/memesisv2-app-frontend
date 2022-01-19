FROM node:16.13.2-buster-slim

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm config set unsafe-perm true

RUN npm install

COPY . .

RUN chown -R node /app/node_modules

USER node

CMD ["npm", "start"]