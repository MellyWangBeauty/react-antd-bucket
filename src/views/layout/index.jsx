import React from "react";
import { connect } from "react-redux";
import Content from "./Content";
import Header from "./Header";
import RightPanel from "./RightPanel";
import Sider from "./Sider";
// eslint-disable-next-line no-unused-vars
import TagsView from "./TagsView";
import { Layout } from "antd";
const Main = (props) => {
   // eslint-disable-next-line no-unused-vars
  const { tagsView } = props;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider />
      <Layout>
        <Header />
        {/* {tagsView ? <TagsView /> : null} */}
        <Content />
        <RightPanel />
      </Layout>
    </Layout>
  );
};
export default connect((state) => state.settings)(Main);
