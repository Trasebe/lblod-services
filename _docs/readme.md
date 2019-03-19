## Decision Service

### publish

endpoint: POST `/decision/publish`
body:

```
    id: string,
    content: string,
    oit: {
      identifier: string
      roles: [string]
      secret: string
      fullIdentifier: string
    },
    resourceId: string
    subject: string
    timestamp: string
```

### sign - Authenticate

endpoint: POST `/decision/sign`
body:

```
    id: string,
    content: string,
    oit: {
      identifier: string
      roles: [string]
      secret: string
      fullIdentifier: string
    },
    resourceId: string
    subject: string
    timestamp: string
```

### sign - Burn

endpoint: POST `/decision/sign?burn=true`
body:

```
    id: string,
    content: string,
    oit: {
      identifier: string
      roles: [string]
      secret: string
      fullIdentifier: string
    },
    resourceId: string
    subject: string
    timestamp: string
```

### Validate

endpoint: POST `/validate`
body:

```
    content: { value: string },
    resourceUri: {
      value: string
    }
```

### queryById

endpoint: POST `/queryById`
body:

```
    id: string
```

### queryHistory

endpoint: POST `/queryHistory`
body:

```
    id: string
```
