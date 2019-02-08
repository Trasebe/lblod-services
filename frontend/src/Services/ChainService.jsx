import Connection, { setAuthToken } from "../__helpers__/Connection";

export default class ChainService {
  // "http://localhost:3000"
  constructor(baseUrl = "http://localhost:80") {
    this.connection = new Connection(baseUrl);
  }

  setAuthToken = token => {
    setAuthToken(token);
  };

  setup = amount =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`blockchain/setupByNumber`, { amount })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  getDecisionByStatus = status =>
    new Promise((resolve, reject) => {
      this.connection
        .get(`blockchain/getByStatus/${status}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  createResource = (id, type, person, version) =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`blockchain/setup`, { id, type, person, version })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  reset = () =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`blockchain/reset`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  getAll = () =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`decisionservice/decision/getAll`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  getErrors = () =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`blockchain/getErrors`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  queryHistory = id =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`decisionservice/decision/queryHistory`, { id })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  queryHistoryByVersion = (id, version) =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`decisionservice/decision/queryHistoryByVersion`, { id, version })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  validateAll = () =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`blockchain/validateAll`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  /*
  ========================
    User management
  ========================
  */

  register = user =>
    new Promise((resolve, reject) => {
      this.connection
        .post("/auth/register", user)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  login = user =>
    new Promise((resolve, reject) => {
      this.connection
        .post("/auth/login", user)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
}
