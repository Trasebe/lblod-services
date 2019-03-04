import chai, { expect, should } from "chai";
import chaiHttp from "chai-http";

// import server from "../app";
const server = "http://localhost:4000";
should();
chai.use(chaiHttp);

describe("Certificate", () => {
  it("healtcheck should pass", done => {
    chai
      .request(server)
      .get(`/health-check`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal({
          msg: "LBLOD Blockchain authentication service up and running!"
        });
        done();
      });
  });

  it("should create a certificate", done => {
    const requestObject = {
      enrollmentID: "12345",
      role: "test",
      id: "12345",
      seed: "12345-seed-12345"
    };

    chai
      .request(server)
      .post(`/certificate/create`)
      .send(requestObject)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.not.have.property("error");
        res.body.should.be.a("object").to.have.property("encryptedCert");
        res.body.should.be.a("object").to.have.property("encryptedKey");
        res.body.should.be.a("object").to.have.property("encryptionKey");
        done();
      });
  });

  it("should retrieve a key from a seed", done => {
    const requestObject = {
      seed: "1234-seed-1234"
    };

    chai
      .request(server)
      .post(`/certificate/retrieveKey`)
      .send(requestObject)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.not.have.property("error");
        res.body.should.not.have.property("encryptedCert");
        res.body.should.not.have.property("encryptedKey");
        res.body.should.be.a("object").to.have.property("encryptionKey");
        done();
      });
  });
});
