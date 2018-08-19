FROM node:8

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm i npm@latest -g && npm install

# copy all application source directories
COPY *.js ./
COPY *.json ./
COPY public/ public/
COPY routes/ routes/
COPY views/ views/
COPY bin/ bin/

EXPOSE 8080

CMD [ "npm", "start" ]