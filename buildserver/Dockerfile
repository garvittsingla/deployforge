FROM ubuntu:focal

RUN apt-get update
RUN apt-get install curl -y
RUN apt-get install git -y

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install nodejs -y


WORKDIR /home/app

COPY main.sh main.sh
COPY script.js script.js
COPY package*.json .

RUN npm install

RUN chmod +x script.js
RUN chmod +x main.sh

ENTRYPOINT ["/home/app/main.sh"]