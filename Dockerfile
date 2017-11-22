FROM node:6.10.0
ARG NPM_TOKEN
ENV NPM_TOKEN $NPM_TOKEN
ADD . /var/code/
WORKDIR /var/code/
RUN mv .npmrc-example .npmrc
RUN npm install
ENTRYPOINT ["npm", "run", "test"]
