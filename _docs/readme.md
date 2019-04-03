# Decision Service

# publish

endpoint: POST `/decision/publish`

##### Request body:

```json
{
  "id": "string",
  "content": "string",
  "oit": {
    "identifier": "string",
    "roles": ["string"],
    "secret": "string",
    "fullIdentifier": "string"
  },
  "resourceId": "string",
  "subject": "string",
  "timestamp": "string"
}
```

##### Reponse body:

```json
{
  "statusCode": "number",
  "tx": "string"
}
```

# Sign (Authenticate)

endpoint: POST `/decision/sign`

##### Request body:

```json
{
  "id": "string",
  "content": "string",
  "oit": {
    "identifier": "string",
    "roles": ["string"],
    "secret": "string",
    "fullIdentifier": "string"
  },
  "resourceId": "string",
  "subject": "string",
  "timestamp": "string"
}
```

##### Reponse body:

```json
{
  "statusCode": "number",
  "tx": "string"
}
```

# Sign (Burn)

endpoint: POST `/decision/sign?burn=true`

##### Request body:

```json
{
  "id": "string",
  "content": "string",
  "oit": {
    "identifier": "string",
    "roles": ["string"],
    "secret": "string",
    "fullIdentifier": "string"
  },
  "resourceId": "string",
  "subject": "string",
  "timestamp": "string"
}
```

##### Reponse body:

```json
{
  "statusCode": "number",
  "tx": "string"
}
```

# Validate

endpoint: POST `/validate`

##### Request body:

```json
{
  "content": { "value": "string" },
  "resourceUri": {
    "value": "string"
  }
}
```

##### Reponse body:

```json
{
  "id": "string",
  "hash": "string",
  "result": "bool",
  "blockchainHash": "string"
}
```

# queryById

endpoint: POST `/queryById`

##### Request body:

```json
{
  "id": "string"
}
```

##### Response body:

```json
{
  "id": "string",
  "hash": "string",
  "timestamp": "string",
  "limitedSigners": "number",
  "subject": "string",
  "version": "number",
  "publishStatus": "string",
  "signStatus": "string",
  "authSignatures": "array<object>",
  "burnSignatures": "array<object>",
  "docType": "string",
  "publisher": "object"
}
```

# queryHistory

endpoint: POST `/queryHistory`

##### Request body:

```json
{
  "id": "string"
}
```

#### Response body:

```json
[
  {
    "id": "string",
    "hash": "string",
    "timestamp": "string",
    "limitedSigners": "number",
    "subject": "string",
    "version": "number",
    "publishStatus": "string",
    "signStatus": "string",
    "authSignatures": "array<object>",
    "burnSignatures": "array<object>",
    "docType": "string",
    "publisher": "object"
  }
]
```

---

## Event Broker

---

# notify

endpoint: POST `/notify`

#### Request body:

```json
{}
```

#### Response body:

```json
{
  "status": "number"
}
```

# Get Resource(s) By Status

endpoint: GET `/getByStatus/:status`

options:

- unpublished
- publishing
- published
- publication_failed
- waiting_for_retry

##### Response body:

```json
[
  {
    "id": "string",
    "content": "string",
    "signatory": "string",
    "resourceId": "string",
    "timestamp": "string",
    "resourceType": "string",
    "hash": "string",
    "hasError": "string",
    "type": "string"
  }
]
```
