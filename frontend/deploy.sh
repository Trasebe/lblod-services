#! /bin/sh

DOCKER_ID_USER="trase"

docker build -t $DOCKER_ID_USER/frontend:0.2.4 .
docker push $DOCKER_ID_USER/frontend:0.2.4