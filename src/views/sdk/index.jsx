import React, { useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import SDKMD from "./SDK文档.md";
import { Card } from "antd";
import "github-markdown-css";

const PageComponent = () => {
  let [content, setContent] = useState({ md: "" });

  useEffect(() => {
    fetch(SDKMD)
      .then((res) => res.text())
      .then((md) => {
        setContent({ md });
      });
  }, []);

  return (
    <div className="app-container">
      <Card style={{ marginTop: 10 + "px" }}>
        <Markdown children={content.md} className="markdown-body" />
      </Card>
    </div>
  );
};

export default PageComponent;
