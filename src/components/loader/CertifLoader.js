import React from "react";
import ContentLoader from "react-content-loader";

const CertifLoader = ({ ...rest }) => (
  <ContentLoader height="500" width="1000" viewBox="0 0 265 230" {...rest}>
    <rect x="15" y="50" rx="2" ry="2" width="550" height="450" />
  </ContentLoader>
);

export default CertifLoader;
