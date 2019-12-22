# base image
FROM node:8.17.0

# set working directory
RUN mkdir /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

ARG SERVICE_URL
ENV SERVICE_URL $SERVICE_URL

# install and cache app dependencies
RUN npm install -g yarn
RUN yarn

# start app
CMD ["yarn", "start"]