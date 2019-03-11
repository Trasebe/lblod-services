import chai, { expect, should } from "chai";
import chaiHttp from "chai-http";

// import server from "../../app";
const server = "http://localhost:4000";
should();
chai.use(chaiHttp);

describe("Decision", () => {
  it("healtcheck should pass", done => {
    chai
      .request(server)
      .get(`/health-check`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal({
          msg: "LBLOD Blockchain decision service up and running!"
        });
        done();
      });
  });

  it("publish", done => {
    const requestObject = {
      id: "1234",
      content: "randomContent",
      oit: {
        identifier: "1234",
        roles: ["1234"],
        secret: "1234",
        fullIdentifier: "1234"
      },
      resourceId: "1234",
      subject: "1234",
      timestamp: "1234"
    };

    chai
      .request(server)
      .post(`/decision/publish`)
      .send(requestObject)
      .end((err, res) => {
        res.should.have.status(200);
        // res.body.should.not.have.property("error");
        // res.body.should.not.have.property("encryptedCert");
        // res.body.should.not.have.property("encryptedKey");
        // res.body.should.be.a("object").to.have.property("encryptionKey");
        done();
      });
  });
});
