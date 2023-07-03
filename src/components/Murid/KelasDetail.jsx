import React, { useState } from "react";
import { Button, Container, Col, Row, Card } from "reactstrap";
import IndexNavbar from "../Nav/IndexNavbar";
import { API_URL, fetchQuizScore } from "../../utils/constants";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BulletList } from "react-content-loader";
import AvatarWithText from "../loader/loaderAvatarWithText";
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
  let [subjectUnlocked, setSubjectUnlocked] = useState(0);
  let [quizScore, setQuizScore] = useState(0);

  const navigate = useNavigate();

  async function checkStart(subjectIndex, chapterIndex) {
    let length = detailLesson?.chapter?.length;
    console.log("index", subjectIndex);

    if (subjectIndex === 0 && progress.length === 0) {
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
                pathname: `/bab-materi/${id}/chapter/${chapterIndex}/subject/${subjectIndex}`,
              });
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    } else {
      navigate({
        pathname: `/bab-materi/${id}/chapter/${chapterIndex}/subject/${subjectIndex}`,
      });
    }
  }

  const lockedSubject = {
    opacity: 0.5,
  };

  React.useEffect(() => {
    setLoad(true);
    fetchDetailPel(setDetailLesson, id);
    fetchProgress(setProgress, id, user.id);
    setLoad(false);

    // eslint-disable-next-line
  }, []);
  const isQuizCompleted = (chapterId) => {
    // Check if the quizScore state is already set
    if (quizScore) {
      return quizScore.data?.length === 1;
    }

    fetchQuizScore(setQuizScore, chapterId, user.id);
    return false; // Return false as the score is not yet fetched
  };

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
    // lihat apakah jumlah chapter_id yang sama dengan chapter_id yang ada di progress
    const chapterCount = progress?.data?.filter(
      (e) => e.chapter_id === chapterId
    ).length;

    console.log("chapterCount", chapterCount);
    console.log("detailLesson.chapter.length", detailLesson.chapter.length);

    // jika jumlah chapter_id yang sama dengan chapter_id yang ada di progress sama dengan jumlah chapter_id yang ada di chapter, maka chapter terbuka
    return chapterCount === detailLesson.chapter.length;
  };

  let pageHeader = React.createRef();
  const pelajaran = detailLesson.nama_pelajaran;

  //filter progress data hanya yang chapter_id sama dengan chapter_id yang ada di berikan
  const progressFilter = (chapterId) => {
    return progress?.data?.filter((e) => e.chapter_id === chapterId);
  };

  return (
    <div>
      <IndexNavbar user={user} handleLogout={handleLogout} />
      <div className="wrapper  text-capitalize">
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
          {user.role === "guru" ? (
            <Link className="ml-2" to={`/create-chapter`}>
              <Button color="success">
                <i className="now-ui-icons ui-1_simple-add"></i> Buat Materi
              </Button>
            </Link>
          ) : (
            <></>
          )}
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
              <div>
                <div className="accordion" id="accordionExample">
                  {detailLesson?.chapter?.map((item, chapterIndex) => {
                    return (
                      <div
                        className={
                          chapterIndex === 0
                            ? "accordion-item mb-5"
                            : "accordion-item mb-5 border-top"
                        }
                        key={chapterIndex}
                      >
                        <h2 className="accordion-header">
                          <button
                            className={
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
                            {/* nama chapter */}
                            <div class="row align-items-center">
                              <div class="col-md-auto">
                                <img
                                  alt="..."
                                  width={42}
                                  className="rounded"
                                  src={
                                    chapterIndex == 0
                                      ? require("../../assets/img/play-button.png")
                                      : require("../../assets/img/padlock.png")
                                  }
                                ></img>
                              </div>
                              <div class="col">
                                <h5>
                                  <strong>{item.name}</strong>
                                </h5>
                                <img
                                  alt="..."
                                  className="rounded float-end"
                                  src={require("../../assets/img/arrow-down.png")}
                                ></img>
                                <p className="fs-6 fw-normal">
                                  {item.deskripsi}
                                </p>
                                <div className="badge bg-info text-wrap">
                                  {item?.subject?.length} Materi
                                </div>
                                <div className="badge bg-info text-wrap">
                                  {item?.quiz?.length} Kuis
                                </div>
                              </div>
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
                          <div className="accordion-body">
                            {item?.subject?.map((list, index) => {
                              return (
                                <div
                                  style={
                                    chapterIndex !== 0 ? lockedSubject : {}
                                  }
                                  className="card mt-2"
                                  key={index + 1}
                                >
                                  <div className="card-body d-flex justify-content-between align-items-center">
                                    {/* nama materi */}
                                    <div>
                                      <img
                                        alt="..."
                                        width={24}
                                        className="rounded me-2"
                                        src={require("../../assets/img/file.png")}
                                      ></img>
                                      <span className="fw-bold">
                                        {list?.name}
                                      </span>
                                    </div>
                                    {isSubjectUnlocked(list?.id) ||
                                    isSubjectUnlocked(
                                      item.subject[index - 1]?.id
                                    ) ||
                                    isQuizCompleted(item?.id) ? (
                                      <Button
                                        onClick={() =>
                                          checkStart(index, chapterIndex)
                                        }
                                        color="info"
                                        disabled={false}
                                      >
                                        Mulai Belajar
                                      </Button>
                                    ) : (
                                      <Button color="danger" disabled={true}>
                                        Materi Terkunci
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {load === false ? (
                              item.quiz.length !== 0 &&
                              progressFilter(item.id).length ===
                                item.subject.length ? (
                                <div className="card mt-2" id={item.id}>
                                  <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                      <img
                                        src={quizIcon}
                                        width={24}
                                        className="rounded me-2"
                                      />
                                      <span className="fw-bold">
                                        Kuis {item.name}
                                      </span>
                                    </div>

                                    <Button color="info" disabled={false}>
                                      Mulai Kuis
                                    </Button>
                                  </div>
                                </div>
                              ) : item.quiz.length === 0 ? (
                                <div className="card mt-2" id={item.id}>
                                  <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                      <img
                                        src={quizIcon}
                                        width={24}
                                        className="rounded me-2"
                                      />
                                      <span className="text-warning">
                                        *Kuis belum dibuat pada materi{" "}
                                        <b>{item.name}</b>
                                      </span>
                                    </div>
                                    {detailLesson?.user_id === user.id ? (
                                      <Button color="info">
                                        Buat Sekarang!
                                      </Button>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="card mt-2" id={item.id}>
                                  <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                      <img
                                        src={quizIcon}
                                        width={24}
                                        className="rounded me-2"
                                      />
                                      <span className="fw-bold">
                                        Kuis {item.name}
                                      </span>
                                    </div>
                                    <Button color="danger" disabled={true}>
                                      Terkunci
                                    </Button>
                                  </div>
                                </div>
                              )
                            ) : (
                              <></>
                            )}
                            <Link className="ml-2" to={`/create-chapter`}>
                              <Button color="success">
                                <i className="now-ui-icons ui-1_simple-add"></i>{" "}
                                Buat Materi {item.name}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={lockedSubject} className="card mt-2 mb-5">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    {/* nama materi */}
                    <div>
                      <img
                        alt="..."
                        width={24}
                        className="rounded me-2"
                        src={certifTest}
                      ></img>
                      <span className="fw-bold">
                        Ujian {detailLesson?.nama_pelajaran}
                      </span>
                    </div>
                    <Button color="danger" disabled={true}>
                      Ujian Terkunci
                    </Button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <MyBulletListLoader />
          )}
        </Container>
      </div>
    </div>
  );
}

export default withAuthUser(KelasDetail);
