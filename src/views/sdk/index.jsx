import React, { useState, useEffect } from "react";
import Markdown from "markdown-to-jsx";
import SDKMD from "./SDK文档.md";
import { Card } from "antd";
import "./index.css";

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
    <Card>
      <div className="post">
        <Markdown children={content.md} />
      </div>
    </Card>
  );
};

export default PageComponent;
