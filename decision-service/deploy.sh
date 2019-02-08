#! /bin/sh

DOCKER_ID_USER="trase"

rm -rf .hfc-key-store
docker build -t $DOCKER_ID_USER/decision-service:0.1.1 .
docker push $DOCKER_ID_USER/decision-service:0.1.1