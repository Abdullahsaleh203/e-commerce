FROM node:latest as base

FROM base as development

WORKDIR /app
COPY package.json .
RUN npm install 
COPY . .
EXPOSE 8000
CMD [ "npm", "run", "dev" ]

FROM base as production

WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY . .
EXPOSE 8000
CMD [ "npm", "start" ]
