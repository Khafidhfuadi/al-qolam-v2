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
  let [progress, setProgress] = React.useState({ data: [], subjectCount: 3 });
  let [quizCounter, setQuizCounter] = React.useState(1);
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

  React.useEffect(() => {
    console.log("progress state", progress);
  }, [progress]);

  const isSubjectUnlocked = (subjectId) => {
    // Cek apakah subjek sudah terkunci atau terbuka berdasarkan data kemajuan pengguna
    if (!progress || progress.data.length === 0) {
      // Jika userProgress kosong, artinya belum ada kemajuan, maka hanya subjek pertama yang terbuka
      return subjectId === detailLesson.chapter[0].subject[0].id;
    }

    // Cek apakah subjek terkunci berdasarkan data kemajuan pengguna
    return progress?.data?.find((e) => e.subject_id === subjectId);
  };

  const isChapterUnlocked = (chapterId) => {
    const unlockedChapters = progress.data.map((item) => item.chapter_id);
    const chapterIndex = unlockedChapters.indexOf(chapterId);

    if (chapterIndex !== -1) {
      const unlockedChapter = progress.subjectCountPerChapter.find(
        (chapter) => chapter.chapter_id === chapterId
      );

      if (unlockedChapter && unlockedChapter.subjectCount > 0) {
        return true;
      }
    }

    return false;
  };

  let pageHeader = React.createRef();
  const pelajaran = detailLesson.nama_pelajaran;

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
                      {detailLesson?.subjectCount} Materi
                      <img src={quizIcon} width={30} className="ms-3 me-2" />
                      {detailLesson?.quizCount} Kuis
                      <img
                        src={certifTest}
                        width={30}
                        alt=""
                        className="ms-3 me-2"
                      />{" "}
                      Ujian
                      {detailLesson?.exam?.length === 0 ? (
                        <> Tidak Tersedia</>
                      ) : (
                        <> Tersedia</>
                      )}{" "}
                      <img src={authorIcon} width={30} className="ms-3 me-2" />
                      {detailLesson.user?.name}
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

          <h4>Materi Yang Tersedia - اَلْمَوَادَ اَلْمُتَاحَةُ</h4>
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
                {detailLesson?.chapter?.map((item, chapterIndex) => {
                  return (
                    <div
                      class={
                        chapterIndex === 0
                          ? "accordion-item mb-5"
                          : "accordion-item mb-5 border-top"
                      }
                    >
                      <h2 class="accordion-header" id={chapterIndex}>
                        <button
                          class={
                            chapterIndex == 0
                              ? "accordion-button"
                              : "accordion-button collapsed"
                          }
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${chapterIndex}`}
                          aria-expanded={chapterIndex == 0 ? "true" : "false"}
                          aria-controls={`collapse${chapterIndex}`}
                        >
                          <h5>
                            <strong>{item.name}</strong>
                          </h5>

                          <p className="fs-6 fw-normal">{item.deskripsi}</p>

                          <div className="badge bg-info text-wrap">
                            {item?.subject?.length} Materi
                          </div>
                          <div className="badge bg-info text-wrap">
                            {item?.quiz?.length} Kuis
                          </div>
                        </button>
                      </h2>
                      <div
                        id={`collapse${chapterIndex}`}
                        className={
                          chapterIndex == 0
                            ? "accordion-collapse collapse show"
                            : "accordion-collapse collapse"
                        }
                        aria-labelledby={chapterIndex}
                        data-bs-parent="#accordionExample"
                      >
                        <div class="accordion-body">
                          {item?.subject?.map((list, index) => {
                            return (
                              <div class="card mt-2">
                                <div class="card-body d-flex justify-content-between align-items-center">
                                  {list?.name}
                                  {!isSubjectUnlocked(list.id) ? (
                                    <Button color="danger" disabled={true}>
                                      Materi Terkunci
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() => checkStart(index)}
                                      color="info"
                                      disabled={false}
                                    >
                                      Mulai Belajar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {load === false ? (
                            item.quiz.length !== 0 &&
                            isChapterUnlocked(item.id) ? (
                              <div class="card mt-2">
                                <div class="card-body d-flex justify-content-between align-items-center">
                                  Kuis {item.nama_pelajaran}
                                  <Button color="info" disabled={false}>
                                    Mulai
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div class="card mt-2">
                                <div class="card-body d-flex justify-content-between align-items-center">
                                  Kuis {item.nama_pelajaran}
                                  <Button color="danger" disabled={true}>
                                    Terkunci
                                  </Button>
                                </div>
                              </div>
                            )
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
