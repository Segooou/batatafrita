FROM node:18.15.0-alpine3.16

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY ./prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
