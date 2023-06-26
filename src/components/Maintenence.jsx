import React from "react";
import { Container } from "reactstrap";
import IndexHeader from "./Headers/IndexHeader";
// import KelasList from "./KelasList";
// import ProgressBar from "./Progress";
// import { withAuthUser } from "./auth/RouteAccess";
import header2 from "../assets/img/header2.jpg";
//alqolam logo
import logo from "../assets/img/brand-logo.png";

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
                Website ini masih dalam tahap perbaikan dan pemeliharaan. Doakan
                yang terbaik ya 🙏
              </h5>
              <p>~ Al-Qolam ~</p>
            </div>

            {/* <h6 className="category category-absolute">
            <lord-icon trigger="loop" src="/scroll-down.json"></lord-icon>
            <br />
          </h6> */}
          </Container>
        </div>
        <div className="main">
          <div className="section">
            <Container>
              <blockquote className="blockquote text-center text-info border-0">
                <p id="arab">
                  اُطْلُبِ العِلْمَ مِنَ الـمَهْدِ إِلَى اللَّحْدِ
                </p>
                <i id="latin">
                  Tuntutlah ilmu dari sejak di buaian sampai liang lahat.
                </i>
                <p id="arti">uthlubil-‘ilma manal-mahdi ilal-lahdi</p>
              </blockquote>
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
