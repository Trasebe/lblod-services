## Setup

```
# Navigate to mu-project folder
cd lblod-blockchain/mu-project

# Replace absolute path in docker-compose.yml (line 40-41), ex:
volumes:
    - /Users/<user>/lblod/lblod-blockchain/microservice:/app/

# Navigate to microservice
cd ../microservice

# Install Deps & Rebuild gRPC for docker
npm install --target=8.12.0 --target_platform=linux --target_arch=x64 --target_libc=musl .
npm rebuild --target=8.12.0 --target_platform=linux --target_arch=x64 --target_libc=musl .

# Go to root of project
cd ..

yarn startService
```
