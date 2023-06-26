import React from "react";
import { Container } from "reactstrap";
import IndexHeader from "./Headers/IndexHeader";
// import KelasList from "./KelasList";
// import ProgressBar from "./Progress";
// import { withAuthUser } from "./auth/RouteAccess";
import header2 from "../assets/img/header2.jpg";
//alqolam logo
import logo from "../assets/img/brand-logo.png";
// preview image
import preview from "../assets/img/preview.png";

const Maintenence = ({ user }) => {
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

  React.useEffect(() => {
    document.body.classList.add("index-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("index-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
  return (
    <>
      <div className="wrapper">
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
                <img
                  width="50rem"
                  alt="..."
                  className="rounded mr-1"
                  src={logo}
                ></img>{" "}
                Afwan! - عفوًا
              </h1>
              <h4>Mohon maaf karena kamu belum dapat belajar dengan kami</h4>
              <h5>
                Website ini masih dalam tahap peningkatan fitur dan performa.
                Doakan yang terbaik ya 🙏
              </h5>
              <p>~ Al-Qolam 2.0 ~</p>
            </div>
          </Container>
        </div>
        <div className="main">
          <div className="section">
            <Container>
              <h3 className="title text-center">
                Sedikit Cuplikan Al-Qolam 2.0
              </h3>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <img
                        width="100%"
                        alt="..."
                        className="rounded mr-1"
                        src={preview}
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
          {/* <ProgressBar user={user} /> */}
          {/* <KelasList user={user} /> */}
        </div>
      </div>
    </>
  );
};

export default Maintenence;
