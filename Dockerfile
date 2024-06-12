FROM node:20.14.0-alpine3.20

RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev

RUN apk add --no-cache fontconfig

COPY fonts/arial.ttf /usr/share/fonts/ 
COPY fonts/times.ttf /usr/share/fonts/
COPY fonts/home.ttf /usr/share/fonts/

RUN fc-cache -f -v

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY ./prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
