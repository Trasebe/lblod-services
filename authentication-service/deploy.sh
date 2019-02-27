#! /bin/sh

# DOCKER_ID_USER="trase"

# rm -rf .hfc-key-store
# docker build -t $DOCKER_ID_USER/authentication-service:0.2.1 .
# docker tag $DOCKER_ID_USER/authentication-service $DOCKER_ID_USER/authentication-service:0.1.0
# docker push $DOCKER_ID_USER/authentication-service:0.1.0

DOCKER_ID_USER="trase"

rm -rf .hfc-key-store
docker build -t $DOCKER_ID_USER/authentication-service:0.2.2 .
docker push $DOCKER_ID_USER/authentication-service:0.2.2