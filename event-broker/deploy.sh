#! /bin/sh

DOCKER_ID_USER="trase"

docker build -t $DOCKER_ID_USER/blockchain-event-broker:0.1.2 .
docker push $DOCKER_ID_USER/blockchain-event-broker:0.1.2