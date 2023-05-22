import React from "react";
import ContentLoader from "react-content-loader";

const ProgressLoader = (props) => (
  <ContentLoader
    speed={2}
    width={900}
    height={300}
    viewBox="0 0 900 300"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="3" ry="3" width="112" height="19" />
    <rect x="0" y="25" rx="3" ry="3" width="100%" height="17" />
    <rect x="0" y="55" rx="3" ry="3" width="112" height="19" />
    <rect x="0" y="80" rx="3" ry="3" width="100%" height="17" />
    <rect x="0" y="110" rx="3" ry="3" width="112" height="19" />
    <rect x="0" y="135" rx="3" ry="3" width="100%" height="17" />
  </ContentLoader>
);

export default ProgressLoader;
