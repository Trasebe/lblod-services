import chai, { expect, should } from "chai";
import chaiHttp from "chai-http";

// import server from "../../app";
const server = "http://localhost:4000";
should();
chai.use(chaiHttp);

describe("Decision", () => {
  let id;
  let savedId;

  beforeEach(done => {
    id = Math.random();
    done();
  });

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

  it("should publish", done => {
    savedId = id.toString(); // id to validate
    const requestObject = {
      id: id.toString(),
      content: "randomContent",
      oit: {
        identifier: id.toString(),
        roles: [
          "GelinktNotuleren-schrijver",
          "GelinktNotuleren-ondertekenaar",
          "GelinktNotuleren-publiceerder"
        ],
        secret: id.toString(),
        fullIdentifier: id.toString()
      },
      resourceId: id.toString(),
      subject: "1234567",
      timestamp: "1234567"
    };

    chai
      .request(server)
      .post(`/decision/publish`)
      .send(requestObject)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object").to.have.property("result");
        res.body.result.should.be.a("object").to.have.property("statusCode");
        res.body.result.should.be.a("object").to.have.property("tx");
        expect(res.body.result.statusCode).to.equal("VALID");
        done();
      });
  });

  it("should sign", done => {
    const requestObject = {
      id: id.toString(),
      content: "randomContent",
      oit: {
        identifier: id.toString(),
        roles: [
          "GelinktNotuleren-schrijver",
          "GelinktNotuleren-ondertekenaar",
          "GelinktNotuleren-publiceerder"
        ],
        secret: id.toString(),
        fullIdentifier: id.toString()
      },
      resourceId: id.toString(),
      subject: "1234567",
      timestamp: "1234567"
    };

    chai
      .request(server)
      .post(`/decision/sign`)
      .send(requestObject)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object").to.have.property("result");
        res.body.result.should.be.a("object").to.have.property("statusCode");
        res.body.result.should.be.a("object").to.have.property("tx");
        expect(res.body.result.statusCode).to.equal("VALID");
        done();
      });
  });

  it("should publishes and signs with different IDs", done => {
    const requestObject = {
      id: id.toString(),
      content: "randomContent",
      oit: {
        identifier: id.toString(),
        roles: [
          "GelinktNotuleren-schrijver",
          "GelinktNotuleren-ondertekenaar",
          "GelinktNotuleren-publiceerder"
        ],
        secret: id.toString(),
        fullIdentifier: id.toString()
      },
      resourceId: id.toString(),
      subject: "1234567",
      timestamp: "1234567"
    };

    id = Math.random();
    const requestObject2 = {
      id: id.toString(),
      content: "randomContent",
      oit: {
        identifier: id.toString(),
        roles: [
          "GelinktNotuleren-schrijver",
          "GelinktNotuleren-ondertekenaar",
          "GelinktNotuleren-publiceerder"
        ],
        secret: id.toString(),
        fullIdentifier: id.toString()
      },
      resourceId: id.toString(),
      subject: "1234567",
      timestamp: "1234567"
    };

    chai
      .request(server)
      .post(`/decision/publish`)
      .send(requestObject)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object").to.have.property("result");
        res.body.result.should.be.a("object").to.have.property("statusCode");
        res.body.result.should.be.a("object").to.have.property("tx");
        expect(res.body.result.statusCode).to.equal("VALID");
        chai
          .request(server)
          .post(`/decision/sign`)
          .send(requestObject2)
          .end((err2, res2) => {
            res2.should.have.status(200);
            res2.body.should.be.a("object").to.have.property("result");
            res2.body.result.should.be
              .a("object")
              .to.have.property("statusCode");
            res2.body.result.should.be.a("object").to.have.property("tx");
            expect(res2.body.result.statusCode).to.equal("VALID");
            done();
          });
      });
  });

  it("should publishes and signs with same IDs", done => {
    const requestObject = {
      id: id.toString(),
      content: "randomContent",
      oit: {
        identifier: id.toString(),
        roles: [
          "GelinktNotuleren-schrijver",
          "GelinktNotuleren-ondertekenaar",
          "GelinktNotuleren-publiceerder"
        ],
        secret: id.toString(),
        fullIdentifier: id.toString()
      },
      resourceId: id.toString(),
      subject: "1234567",
      timestamp: "1234567"
    };

    chai
      .request(server)
      .post(`/decision/publish`)
      .send(requestObject)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object").to.have.property("result");
        res.body.result.should.be.a("object").to.have.property("statusCode");
        res.body.result.should.be.a("object").to.have.property("tx");
        expect(res.body.result.statusCode).to.equal("VALID");
        chai
          .request(server)
          .post(`/decision/sign`)
          .send(requestObject)
          .end((err2, res2) => {
            res2.should.have.status(200);
            res2.body.should.be.a("object").to.have.property("result");
            res2.body.result.should.be
              .a("object")
              .to.have.property("statusCode");
            res2.body.result.should.be.a("object").to.have.property("tx");
            expect(res2.body.result.statusCode).to.equal("VALID");
            done();
          });
      });
  });

  it("should validate an object", done => {
    const requestObject = {
      type: {
        type: "uri",
        value: "http://mu.semte.ch/vocabularies/ext/signing/PublishedResource"
      },
      content: { type: "literal", value: "<div> rdfa stuff</div>" },
      signatory: {
        type: "uri",
        value:
          "http://data.lblod.info/id/persoon/0.7217419497796184a0cc2f6-8b4e-49ed-9fe4-044af9bf1b89"
      },
      acmIdmSecret: { type: "literal", value: "helloworldsecretbehere" },
      timestamp: {
        type: "typed-literal",
        datatype: "http://www.w3.org/2001/XMLSchema#dateTime",
        value: "2019-01-02T19:00:00.299Z"
      },
      resourceUri: {
        type: "uri",
        value: `http://lblod.info/prepublished-agendas/${savedId}`
      },
      s: {
        type: "uri",
        value:
          "http://lblod.info/signed-resources/c4f4060a-fb63-4058-bb6c-beb919a04948"
      },
      roles: {
        type: "literal",
        value:
          "GelinktNotuleren-lezer,GelinktNotuleren-ondertekenaar,GelinktNotuleren-publiceerder,GelinktNotuleren-schrijver,GelinktNotuleren-sjablonen_valideerder"
      }
    };

    chai
      .request(server)
      .post(`/decision/validate`)
      .send(requestObject)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object").to.have.property("id");
        res.body.should.be.a("object").to.have.property("hash");
        res.body.should.be.a("object").to.have.property("result");
        done();
      });
  });
});
