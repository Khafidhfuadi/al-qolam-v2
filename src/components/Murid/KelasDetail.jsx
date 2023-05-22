import React, { useState } from "react";
import { Button, Container, Col, Row } from "reactstrap";
import IndexNavbar from "../Nav/IndexNavbar";
import { API_URL } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BulletList } from "react-content-loader";
import AvatarWithText from "../loader/loaderAvatarWithText";
// import TransparentFooter from "components/Footers/TransparentFooter";
import { withAuthUser } from "../auth/RouteAccess";
import BackButton from "../../utils/BackComponent";

import detailbab from "../../assets/img/bab-detail-bg.png";
import ava from "../../assets/img/muslim.png";
import book2 from "../../assets/img/book2.png";
import swal from "sweetalert";
import { fetchDetailPel, fetchProgress } from "../../utils/constants";

const MyBulletListLoader = () => <BulletList />;

function KelasDetail({ user, handleLogout }) {
  let { id } = useParams();
  let [detailLesson, setDetailLesson] = React.useState([]);
  let [progress, setProgress] = React.useState([]);
  const [load, setLoad] = useState(true);

  const navigate = useNavigate();

  async function checkStart(index) {
    let length = detailLesson?.chapter?.length;

    if (index === 0 && progress.length === 0) {
      swal({
        title: "Memulai Kelas",
        text: "Siap Memulai Kelas Ini?",
        icon: "info",
        buttons: true,
        dangerMode: false,
      }).then((response) => {
        if (response) {
          axios({
            method: "post",
            url: `${API_URL}progress`,
            data: {
              user_id: user.id,
              lesson_id: id,
              read_chapter: 1,
              length_chapter: length,
            },
          })
            .then(function (response) {
              navigate({
                pathname: `/bab-materi/${id}`,
                state: { index },
              });
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    } else {
      navigate({
        pathname: `/bab-materi/${id}`,
        state: { index },
      });
    }
  }

  React.useEffect(() => {
    setLoad(true);
    fetchDetailPel(setDetailLesson, id);
    fetchProgress(setProgress, id, user.id);
    setLoad(false);
    // eslint-disable-next-line
  }, []);

  let pageHeader = React.createRef();
  const pelajaran = detailLesson.pelajaran;

  return (
    <div>
      <IndexNavbar user={user} handleLogout={handleLogout} />
      <div className="wrapper allButFooter text-capitalize">
        <div className="page-header page-header-small">
          <div
            className="page-header-image"
            style={{
              backgroundImage: "url(" + detailbab + ")",
            }}
            ref={pageHeader}
          ></div>
          <div className="content-center">
            <Container>
              {load === false ? (
                <div className="media">
                  <div className="align-self-center mr-4 mt-5 ">
                    <img
                      width="100rem"
                      alt="..."
                      className="rounded-circle align-self-center"
                      src={ava}
                    ></img>
                    <div>{detailLesson.guru}</div>
                  </div>
                  <div className="media-body text-left ">
                    <h1 className="title">{pelajaran}</h1>
                    <div style={{ fontSize: "0.9rem" }}>
                      {detailLesson.deskripsi}
                    </div>
                  </div>
                </div>
              ) : (
                AvatarWithText()
              )}
            </Container>
          </div>
        </div>
        <Container className="mt-4">
          <h4>Materi Yang Tersedia - المواد المتاحة</h4>
          <div>
            <Row>
              <Col>
                <BackButton />
              </Col>
              {load === false ? (
                detailLesson?.chapter?.length === 0 ? (
                  <></>
                ) : (
                  <Col>
                    <div
                      className="myDiv rounded"
                      style={{
                        backgroundColor:
                          detailLesson?.quiz?.length === 0
                            ? "#FF3636"
                            : "#2ba6cb",
                      }}
                    >
                      <div className="bgImage">
                        <h5>
                          <i className="now-ui-icons travel_info"></i> Quiz :{" "}
                          {detailLesson?.quiz?.length === 0 ? (
                            <>Belum Tersedia</>
                          ) : (
                            <>Tersedia</>
                          )}
                        </h5>
                      </div>
                    </div>
                  </Col>
                )
              ) : (
                <></>
              )}
            </Row>
          </div>
          {load === false ? (
            detailLesson?.chapter?.length === 0 ? (
              <div className="container">
                <p className=" font-weight-bold text-dark">
                  Pengajar Sedang Membuat Materi Terbaik Untuk Kamu, Tungguin
                  Terus Yaa! <br /> - Al-Qolam
                </p>
                <div className="d-flex justify-content-end">
                  <img
                    width="250rem"
                    alt="..."
                    className="rounded"
                    src={require("../../assets/img/books.png")}
                  ></img>
                </div>
              </div>
            ) : (
              detailLesson?.chapter?.map((list, index) => {
                return (
                  <div className="card rounded" key={index}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-10 col-xs-10 col-sm-10 d-inline">
                          <div className="row">
                            <div className="col-1 col-md-1 col-xs-1 col-sm-1 mt-1">
                              <img
                                alt="..."
                                className="rounded-circle w-100"
                                src={book2}
                              ></img>
                            </div>
                            <div className="col-11 col-md-11 col-xs-11 col-sm-11 mt-3">
                              {list.judul_bab}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-2 col-xs-2 col-sm-2 px-1 text-right d-inline">
                          {index > progress[0]?.read_chapter ||
                          (index > 0 && progress.length === 0) ? (
                            <Button color="danger" disabled={true}>
                              Materi Terkunci
                            </Button>
                          ) : (
                            <Button
                              onClick={() => checkStart(index)}
                              color="info"
                            >
                              Mulai Belajar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            <MyBulletListLoader />
          )}
        </Container>
      </div>
      {/* <TransparentFooter /> */}
    </div>
  );
}

export default withAuthUser(KelasDetail);
