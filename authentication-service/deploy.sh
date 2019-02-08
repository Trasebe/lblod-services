#! /bin/sh

DOCKER_ID_USER="trase"

rm -rf .hfc-key-store
docker build -t $DOCKER_ID_USER/authentication-service:0.1.0 .
docker tag $DOCKER_ID_USER/authentication-service $DOCKER_ID_USER/authentication-service:0.1.0
docker push $DOCKER_ID_USER/authentication-service:0.1.0