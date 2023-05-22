import React from "react";
import { Container } from "reactstrap";
import IndexHeader from "../Headers/IndexHeader";
import KelasList from "./KelasList";
import ProgressBar from "./Progress";
import { withAuthUser } from "../auth/RouteAccess";

const MuridDashboard = ({ user }) => {
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
        <IndexHeader user={user} />
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
          <ProgressBar user={user} />
          <KelasList user={user} />
        </div>
        {/* <TransparentFooter /> */}
      </div>
    </>
  );
};

export default withAuthUser(MuridDashboard);
