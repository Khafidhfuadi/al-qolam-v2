import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "reactstrap";

const BackButton = () => {
  const navigate = useNavigate();
  const goBackH = () => {
    navigate(-1);
  };
  return (
    <Button color="secondary" onClick={goBackH}>
      <i className="now-ui-icons arrows-1_minimal-left"></i> Kembali
    </Button>
  );
};

export default BackButton;
