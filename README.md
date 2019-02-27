# LBLOD

Proof of concept rond Lokale Besluiten als Gelinkte Open Data – centrale vindplaats en mandatendatabank.
Meer info omtrent dit project is te vinden op de Wiki pagina.

### Repo structure

- **authentication-service**: this contains a component that handles the creation/retrieving of the certificates
- **decision-service**: this contains business logic that handels to publishing and signing of decisions
- **event-broker**: this contains notify event broker to be used by the editor
- **frontend**: this contains a small frontend to query decisions

### Getting started

```bash
# Clone repo
git clone https://github.com/Trasebe/lblod-services.git

# Development - Run the full stack
# git clone https://github.com/lblod/app-gelinkt-notuleren.git
# For this you need to have the project 'lblod-app-gelinkt-notuleren' next to this folder and run
docker-compose -f docker-compose.yml -f docker-compose.demo.yml -f docker-compose.blockchain.dev.yml up
```
