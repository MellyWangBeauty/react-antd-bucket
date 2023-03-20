import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Collapse, Button,} from "antd";

const { Column } = Table;
const { Panel } = Collapse;


class Index extends Component {
  render() {
    return (
      <div className="app-container">
        hello 
      </div>
    );
  }
}

export default connect((state) => state.monitor)(Index);
