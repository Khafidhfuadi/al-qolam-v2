import React from "react";
import { Link } from "react-router-dom";
import Button from "reactstrap/lib/Button";
import "./notFound.css";

const NotFound = () => {
  return (
    <React.Fragment>
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <img
              alt="..."
              className="rounded"
              src={require("../../assets/img/pnf.png")}
            ></img>
            <h1>Duhh!</h1>
            <h2>404 - Halamannya ga ketemu nih</h2>
          </div>
          <img
            width="50rem"
            alt="..."
            className="rounded"
            src={require("../../assets/img/brand-logo.png")}
          ></img>
          <Link to="/" className="notFoundLink">
            <Button color="primary">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NotFound;
