import IndexNavbar from "../Nav/IndexNavbar";
import React from "react";

// reactstrap components
import { Container } from "reactstrap";
import bg from "../../assets/img/my-bab.jpg";

// core components

function DetailHeader(props) {
  let pageHeader = React.createRef();
  return (
    <>
      <IndexNavbar />
      <div className="page-header page-header-small">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + bg + ")",
          }}
          ref={pageHeader}
        ></div>
        <div className="content-center">
          <Container>
            {props.header === undefined ? (
              <h1 className="title text-secondary">Memuat...</h1>
            ) : (
              <>
                {" "}
                <h1 className="title">{props.header}</h1>
                <div className="text-center">{props.subHeader}</div>
              </>
            )}
          </Container>
        </div>
      </div>
    </>
  );
}

export default DetailHeader;
