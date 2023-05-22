import React from "react";
import ContentLoader from "react-content-loader";
import Row from "reactstrap/lib/Row";
import Container from "reactstrap/lib/Container";

const ResponsiveArticle = (props) => {
  return (
    <Container>
      <Row>
        <ContentLoader viewBox="0 0 100% 650" height={400} width={"100%"}>
          <rect x="0" y="0" rx="5" ry="5" width="40%" height="20" />
          <rect x="0" y="42" rx="5" ry="5" width="100%" height="200" />
          <rect x="0" y="265" rx="5" ry="5" width="100%" height="10" />
          <rect x="0" y="285" rx="5" ry="5" width="100%" height="10" />
          <rect x="0" y="305" rx="5" ry="5" width="100%" height="10" />
          <rect x="0" y="335" rx="5" ry="5" width="65%" height="10" />
        </ContentLoader>
        <ContentLoader viewBox="0 0 100% 650" height={240} width={"100%"}>
          <rect x="0" y="0" rx="5" ry="5" width="40%" height="20" />
          <rect x="0" y="42" rx="5" ry="5" width="100%" height="200" />
          <rect x="0" y="265" rx="5" ry="5" width="100%" height="10" />
        </ContentLoader>
      </Row>
    </Container>
  );
};

ResponsiveArticle.metadata = {
  name: "Ashiru Olawale", // My name
  github: "walebant", // Github username
  description: "A responsive article loader that fits every screen 🎉", // Little tagline
  filename: "ResponsiveArticle", // filename of your loader
};

export default ResponsiveArticle;
