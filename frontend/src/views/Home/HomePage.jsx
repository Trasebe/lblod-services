import React, { Component } from "react";
import { notification } from "antd";

import ChainService from "../../Services/ChainService";
import DataDisplay from "../../components/DataDisplay/DataDisplay";
import DataDisplayErrors from "../../components/DataDisplay/DataDisplay.errors";

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      decisions: null,
      publishingDecisions: null,
      publishedDecisions: null,
      failedDecisions: null,
      retryDecisions: null,
      errors: null
    };

    this.chainService = new ChainService();
  }

  async componentDidMount() {
    await this.getAllDecisions();
  }

  getAllDecisions = async () => {
    const decisions = await this.chainService
      .getDecisionByStatus("unpublished")
      .catch(() => ({ result: [] }));

    const retryDecisions = await this.chainService
      .getDecisionByStatus("waiting_for_retry")
      .catch(() => ({ result: [] }));

    const errors = await this.chainService
      .getErrors()
      .catch(() => ({ result: [] }));

    const publishingDecisions = await this.chainService
      .getDecisionByStatus("publishing")
      .catch(() => ({ result: [] }));

    const publishedDecisions = await this.chainService
      .getDecisionByStatus("published")
      .catch(() => ({ result: [] }));

    const failedDecisions = await this.chainService
      .getDecisionByStatus("publication_failed")
      .catch(() => ({ result: [] }));

    this.setState({
      decisions: decisions.result,
      publishedDecisions: publishedDecisions.result,
      publishingDecisions: publishingDecisions.result,
      failedDecisions: failedDecisions.result,
      retryDecisions: retryDecisions.result,
      errors: errors.result
    });
  };

  setup = async () => {
    await this.chainService.setup(100);
    await this.getAllDecisions();
  };

  reset = async () => {
    await this.chainService.reset();
    await this.getAllDecisions();
  };

  notify = async () => {
    await this.chainService.notify();
    this.getAllDecisions();
  };

  openNotification = (title, message) => {
    const args = {
      message: title,
      description: message,
      duration: 5
    };
    notification.open(args);
  };

  render() {
    const {
      decisions,
      publishingDecisions,
      publishedDecisions,
      failedDecisions,
      retryDecisions,
      errors
    } = this.state;

    return (
      <div>
        <div style={{ width: "100%", textAlign: "right" }}>
          <button
            style={{ marginRight: 10 }}
            type="button"
            onClick={() => this.reset()}
          >
            Reset
          </button>
          <button type="button" onClick={() => this.setup()}>
            Setup
          </button>
        </div>
        <DataDisplay
          asset={publishedDecisions}
          title="published/signed resources"
        />
        <br />
        <br />
        <br />

        <DataDisplay asset={retryDecisions} title="Waiting for retry" />
        <br />
        <br />
        <br />

        <DataDisplayErrors asset={errors} title="Errors" />
        <br />
        <br />
        <br />

        <DataDisplay asset={failedDecisions} title="failed resources" />
        <br />
        <br />
        <br />

        <DataDisplay asset={decisions} title="unpublished resources" />
        <br />
        <br />
        <br />

        <DataDisplay asset={publishingDecisions} title="publishing resources" />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default HomePage;
