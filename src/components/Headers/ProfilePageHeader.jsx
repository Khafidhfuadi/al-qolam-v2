import React from "react";

// reactstrap components
import { Container } from "reactstrap";
import { useState } from "react";
import profileimg from "../../assets/img/muslim.png";
import { fetchDataCertifList } from "../../utils/constants";
import header2 from "../../assets/img/header2.jpg";
import { countLesson } from "../../utils/constants";
// core components

function ProfilePageHeader(props) {
  let pageHeader = React.createRef();

  const [certif, setCertif] = useState();
  const [clesson, setCLesson] = useState();
  const [load, setLoad] = useState(false);

  React.useEffect(() => {
    setLoad(true);
    const user = JSON.parse(localStorage.getItem("user"));

    // fetchData();
    fetchDataCertifList(setCertif, setLoad, user.id);
    countLesson(setCLesson, setLoad, user.id);
    // fetchDataM();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        className="page-header clear-filter page-header-small"
        filter-color="blue"
      >
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + header2 + ")",
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div className="photo-container">
            <img alt="profile" src={profileimg} />
          </div>
          <h3 className="title text-capitalize">
            {props.name === undefined ? (
              <p className="text-secondary">memuat...</p>
            ) : (
              props.name
            )}
          </h3>
          {props.roleUser === "teacher" ? (
            <p className="category">Pengajar</p>
          ) : (
            <p className="category">
              {props.roleUser === "user" ? (
                <>Murid</>
              ) : props.roleUser === "teacher" ? (
                <>Pengajar</>
              ) : (
                props.roleUser
              )}
            </p>
          )}
          {props.roleUser === "user" ? (
            <div className="content">
              <div className="social-description">
                <h2>{certif?.length}</h2>
                <p>Sertifikat</p>
              </div>
            </div>
          ) : props.roleUser === "teacher" ? (
            <div className="content">
              <div className="social-description">
                {load === false ? (
                  clesson === 0 ? (
                    <p>-</p>
                  ) : (
                    <h2>{clesson}</h2>
                  )
                ) : (
                  <p className="text-secondary">memuat...</p>
                )}
                <p>Kelas</p>
              </div>
            </div>
          ) : (
            <div className="content"></div>
          )}
        </Container>
      </div>
    </>
  );
}

export default ProfilePageHeader;
