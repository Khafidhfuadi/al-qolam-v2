import React, { useState } from "react";
import { Button, Container, Col, Row, Card } from "reactstrap";
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
import header2 from "../../assets/img/header2.jpg";
import authorIcon from "../../assets/img/author.png";
import quizIcon from "../../assets/img/quiz.png";
import certifTest from "../../assets/img/certif-test.png";
import chapterIcon from "../../assets/img/chapter.png";
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
              backgroundImage: "url(" + header2 + ")",
            }}
            ref={pageHeader}
          ></div>
          <div className="content-center">
            <Container>
              {load === false ? (
                <div className="media">
                  <div className="media-body text-start ">
                    <h1 className="title">{pelajaran}</h1>
                    <div style={{ fontSize: "0.9rem" }}>
                      {detailLesson.deskripsi}
                    </div>
                    <hr />
                    <div>
                      <img src={chapterIcon} width={30} className="me-2" />
                      {detailLesson?.chapter?.length} Materi
                      <img src={quizIcon} width={30} className="ms-3 me-2" />
                      {detailLesson?.quiz?.length} Kuis
                      <img
                        src={certifTest}
                        width={30}
                        alt=""
                        className="ms-3 me-2"
                      />{" "}
                      Ujian
                      {detailLesson?.quiz?.length === 0 ? (
                        <> Tidak Tersedia</>
                      ) : (
                        <> Tersedia</>
                      )}{" "}
                      <img src={authorIcon} width={30} className="ms-3 me-2" />
                      {detailLesson.guru}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </Container>
          </div>
        </div>
        <Container className="mt-4">
          <BackButton />

          <h4>Materi Yang Tersedia - المواد المتاحة</h4>
          {load === false ? (
            detailLesson?.chapter?.length === 0 ? (
              <div className="container">
                <p className="fw-normal text-dark">
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
              <div class="accordion" id="accordionExample">
                <div class="accordion-item mb-5">
                  <h2 class="accordion-header" id="headingOne">
                    <button
                      class="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      <h5>
                        <strong>Bab 1</strong>
                      </h5>

                      <p className="fs-6 fw-normal">
                        Memperkenalkan sejarah Kotlin, mengapa harus mempelajari
                        Kotlin, karakteristik Kotlin, dan bagaimana Kotlin
                        berperan dalam pengembangan aplikasi. Akan dibahas juga
                        tentang ekosistem Kotlin.
                      </p>

                      <div className="badge bg-info text-wrap">3 Materi</div>
                      <div className="badge bg-info text-wrap">1 Kuis</div>
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    class="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div class="accordion-body">
                      {load === false ? (
                        detailLesson?.chapter?.map((list, index) => {
                          return (
                            <div class="card mt-2">
                              <div class="card-body d-flex justify-content-between align-items-center">
                                {list?.judul_bab}
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
                          );
                        })
                      ) : (
                        <MyBulletListLoader />
                      )}
                      {load === false ? (
                        detailLesson?.quiz?.length !== 0 ? (
                          <div class="card mt-2 ">
                            <div class="card-body d-flex justify-content-between align-items-center">
                              Kuis Bab 1
                              <Button color="danger" disabled={true}>
                                Materi Terkunci
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
