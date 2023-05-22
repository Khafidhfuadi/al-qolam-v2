import React from "react";
import { Container } from "reactstrap";

import header2 from "../../assets/img/header2.jpg";

function IndexHeader({ user }) {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + header2 + ")",
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div className="content-center brand text-start">
            <h1>
              Selamat Datang{" "}
              <span className="text-capitalize">{user?.name}</span>!
            </h1>
            {user?.role === "user" ? (
              <h2>كيف حالك؟</h2>
            ) : user?.role === "teacher" ? (
              <h4>Anda Masuk Sebagai Pengajar</h4>
            ) : (
              <h4 className="text-capitalize">
                Anda Masuk Sebagai {user?.role}
              </h4>
            )}
          </div>

          {/* <h6 className="category category-absolute">
            <lord-icon trigger="loop" src="/scroll-down.json"></lord-icon>
            <br />
          </h6> */}
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;
