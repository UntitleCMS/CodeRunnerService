FROM node:18-alpine
LABEL org.opencontainers.image.source = "https://github.com/UntitleCMS/CodeRunnerService"

# terminate after 60 seconds
ENV MAX_EXECUTE_TIME=60
ENV EXECUTION_QUOTA=10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# setup key and ssh
RUN apk upgrade --update-cache --available && \
    apk add openssh-client && \
    rm -rf /var/cache/apk/*

RUN mkdir /sourcecodes
RUN mkdir /keys && \
    chmod 600 /keys

RUN echo 'StrictHostKeyChecking no ' >> /etc/ssh/ssh_config
RUN echo 'Port 2222 ' >> /etc/ssh/ssh_config
RUN echo 'IdentityFile /keys/id_rsa ' >> /etc/ssh/ssh_config

ENV PYTHONUNBUFFERED=1
RUN apk --update --no-cache add gcc make zlib-dev g++ python3

COPY ./package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
