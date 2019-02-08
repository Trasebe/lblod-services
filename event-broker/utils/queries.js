export const queryAgendas = status => `
PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
PREFIX dct: <http://purl.org/dc/terms/>
SELECT DISTINCT ?s ?content ?signatory ?acmIdmSecret
       ?timestamp ?resourceType ?agendaUri
       (GROUP_CONCAT(DISTINCT ?role; SEPARATOR = ',') as ?roles)
WHERE {
  ?s a sign:PublishedResource;
       sign:text ?content;
       sign:signatory ?signatory;
       sign:signatoryRoles ?role;
       dct:created ?timestamp;
       sign:signatorySecret ?acmIdmSecret;
       ext:publishesAgenda  ?agendaUri;
       sign:status <http://mu.semte.ch/vocabularies/ext/signing/publication-status/${status}>.
?agendaUri a ?resourceType.
}`;

export const insertAgendaQuery = (
  id,
  prePublishedId,
  signatoryId,
  type,
  version
) => `
PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
PREFIX ext: <http://mu.semte.ch/vocabularies/ext/> 
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

INSERT DATA {
GRAPH <http://mu.semte.ch/application> {
<http://data.lblod.info/published-resources/${id}>
      a sign:${type} ;
      sign:text "<div class='agendapunten'></div>" ;
      sign:signatory <http://data.lblod.info/id/persoon/${signatoryId}> ;
      sign:signatoryRoles "GelinktNotuleren-lezer,GelinktNotuleren-ondertekenaar,GelinktNotuleren-publiceerder,GelinktNotuleren-schrijver,GelinktNotuleren-sjablonen_valideerder",
"GelinktNotuleren_schrijver" ;
       dct:publishesAgenda <http://lblod.info/prepublished-agendas/${prePublishedId}> ;
       dct:created "2019-01-02T19:00:00.299Z"^^xsd:dateTime ;
       sign:signatorySecret "b994192c-7d2a-4f93-a8e8-2852b81e5e89" ;
       sign:version "${version}" ;
       sign:status
<http://mu.semte.ch/vocabularies/ext/signing/publication-status/unpublished> .
<http://lblod.info/prepublished-agendas/${prePublishedId}> a publishesAgenda:VersionedAgenda.
}
}`;

export const queryAgendasToSign = status => `
PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
PREFIX dct: <http://purl.org/dc/terms/>
SELECT DISTINCT ?s ?content ?signatory ?acmIdmSecret
       ?timestamp ?resourceType ?agendaUri
       (GROUP_CONCAT(DISTINCT ?role; SEPARATOR = ',') as ?roles)
WHERE {
  ?s a sign:SignedResource;
       sign:text ?content;
       sign:signatory ?signatory;
       sign:signatoryRoles ?role;
       dct:created ?timestamp;
       sign:signatorySecret ?acmIdmSecret;
       ext:signsAgenda ?agendaUri;
       sign:status <http://mu.semte.ch/vocabularies/ext/signing/publication-status/${status}>.
?agendaUri a ?resourceType.
}`;

export const queryPublishResources = status => `PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
PREFIX dct: <http://purl.org/dc/terms/>
SELECT DISTINCT ?s ?content ?signatory ?publishedResource ?acmIdmSecret
       ?timestamp ?resourceType ?version
       (GROUP_CONCAT(DISTINCT ?role; SEPARATOR = ',') as ?roles)
WHERE {
  ?s a sign:PublishedResource;
       sign:text ?content;
       sign:signatory ?signatory;
       sign:signatoryRoles ?role;
       dct:created ?timestamp;
       dct:subject ?publishedResource;
       sign:signatorySecret ?acmIdmSecret;
       sign:version ?version;
       sign:status
<http://mu.semte.ch/vocabularies/ext/signing/publication-status/${status}>.
  ?publishedResource a ?resourceType.
}`;

export const queryPublishResourcesWithError = status => `PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
PREFIX dct: <http://purl.org/dc/terms/>
SELECT DISTINCT ?s ?content ?signatory ?publishedResource ?acmIdmSecret
       ?timestamp ?resourceType ?hasError
       (GROUP_CONCAT(DISTINCT ?role; SEPARATOR = ',') as ?roles)
WHERE {
  ?s a sign:PublishedResource;
       sign:text ?content;
       sign:signatory ?signatory;
       sign:signatoryRoles ?role;
       dct:created ?timestamp;
       dct:subject ?publishedResource;
       sign:signatorySecret ?acmIdmSecret;
       sign:hasError ?hasError;
       sign:status
<http://mu.semte.ch/vocabularies/ext/signing/publication-status/${status}>.
  ?publishedResource a ?resourceType.
}`;

export const querySignResourcesWithError = status => `PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
PREFIX dct: <http://purl.org/dc/terms/>
SELECT DISTINCT ?s ?content ?signatory ?publishedResource ?acmIdmSecret
       ?timestamp ?resourceType ?hasError
       (GROUP_CONCAT(DISTINCT ?role; SEPARATOR = ',') as ?roles)
WHERE {
  ?s a sign:SignedResource;
       sign:text ?content;
       sign:signatory ?signatory;
       sign:signatoryRoles ?role;
       dct:created ?timestamp;
       dct:subject ?publishedResource;
       sign:signatorySecret ?acmIdmSecret;
       sign:hasError ?hasError;
       sign:status
<http://mu.semte.ch/vocabularies/ext/signing/publication-status/${status}>.
  ?publishedResource a ?resourceType.
}`;

export const querySignResources = status => `PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
PREFIX dct: <http://purl.org/dc/terms/>
SELECT DISTINCT ?s ?content ?signatory ?acmIdmSecret
       ?timestamp ?resourceType ?agendaUri
       (GROUP_CONCAT(DISTINCT ?role; SEPARATOR = ',') as ?roles)
WHERE {
  ?s a sign:PublishedResource;
       sign:text ?content;
       sign:signatory ?signatory;
       sign:signatoryRoles ?role;
       dct:created ?timestamp;
       sign:signatorySecret ?acmIdmSecret;
       ext:publishesAgenda  ?agendaUri;
       sign:status <http://mu.semte.ch/vocabularies/ext/signing/publication-status/${status}>.
?agendaUri a ?resourceType.
}`;

export const insertQuery = (id, blockchainId, signatoryId, type, version) => `
PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/> 
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

INSERT DATA {
GRAPH <http://mu.semte.ch/application> {
<http://data.lblod.info/resources/blockchain/${id}>
      a sign:${type} ;
      sign:text "<html><head>...</head><body><h1>Ik ben een besluit</h1></html>" ;
      sign:signatory <http://data.lblod.info/id/persons/${signatoryId}> ;
      sign:signatoryRoles "GelinktNotuleren-lezer,GelinktNotuleren-ondertekenaar,GelinktNotuleren-publiceerder,GelinktNotuleren-schrijver,GelinktNotuleren-sjablonen_valideerder" ;
       dct:subject <http://data.lblod.info/resources/besluiten/${blockchainId}> ;
       dct:created "2019-01-02T19:00:00.299Z"^^xsd:dateTime ;
       sign:signatorySecret "b994192c-7d2a-4f93-a8e8-2852b81e5e89" ;
       sign:version "${version}" ;
       sign:status
<http://mu.semte.ch/vocabularies/ext/signing/publication-status/unpublished> .
  <http://data.lblod.info/resources/besluiten/${blockchainId}> a besluit:Besluit.
}
}`;

export const updateQuery = (
  id,
  status
) => `PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
DELETE {
    GRAPH ?g {
      <${id}> sign:status ?status .
    }
  } INSERT {
    GRAPH ?g {
      <${id}> sign:status <http://mu.semte.ch/vocabularies/ext/signing/publication-status/${status}> .
    }
  } WHERE {
    GRAPH ?g {
      <${id}> sign:status ?status .
    }
  }`;

export const deleteQuery = id => `
PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
DELETE {
    GRAPH ?g {
      <${id}> sign:status ?status .
    } 
} WHERE {
    GRAPH ?g {
      <${id}> sign:status ?status .
    }
  }`;

export const deleteQueryErrors = id => `
PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
DELETE {
    GRAPH ?g {
      <${id}> sign:err ?err .
    } 
} WHERE {
    GRAPH ?g {
      <${id}> sign:err ?err .
    }
  }`;

export const updatePublishedQuery = (id, hash) => `
PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
DELETE {
  GRAPH ?g {
    <${id}> sign:status ?status .
  }
} INSERT {
  GRAPH ?g {
    <${id}> sign:hashValue "${hash}" ;
        sign:status
    <http://mu.semte.ch/vocabularies/ext/signing/publication-status/published> .
  }
} WHERE {
  GRAPH ?g {
    <${id}> sign:status ?status .
  }
}
`;

export const retryQuery = (id, count, errorUuid, error) => `
PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>

DELETE {
  GRAPH ?g {
    <${id}> sign:status ?status .
  }
} INSERT {
  GRAPH ?g {
    <${id}> sign:hasError <http://lblod.info/blockchain/errors/${errorUuid}> ;
      sign:status <http://mu.semte.ch/vocabularies/ext/signing/publication-status/waiting_for_retry>.
    <http://lblod.info/blockchain/errors/${errorUuid}> a sign:BlockchainFailure ;
      sign:err "${error}" ;
      sign:count "${count}" ;
      mu:uuid "${id}" .
  }
} WHERE {
  GRAPH ?g {
    <${id}> sign:status ?status .
  }
}
`;

export const queryErrors = () => `PREFIX sign: <http://mu.semte.ch/vocabularies/ext/signing/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>

SELECT ?s ?err ?count ?uuid 
WHERE {
  ?s a sign:BlockchainFailure;
       sign:err ?err;
       sign:count ?count;
       mu:uuid ?uuid 
.
}`;
