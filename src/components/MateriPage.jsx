import React, { useState } from "react";
import { Button } from "reactstrap";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import loader from "../components/loader/loaderMateri";
import parse from "html-react-parser";

import swal from "sweetalert";
import { fetchDetailPel, fetchProgress } from "../utils/constants";

function MateriPage({ user, handleLogout, ...props }) {
  const { role, name } = user;
  const userId = user.id;

  let { id, chapindex, subindex } = useParams();
  const location = useLocation();
  const index = location.state?.index;

  const navigate = useNavigate();

  let [detailLesson, setDetailLesson] = React.useState([]);
  let [progress, setProgress] = React.useState([]);
  let [currentChapter, setCurrentCha] = useState(chapindex);
  let [currentSubject, setCurrentSub] = useState(subindex);

  // const user = localStorage.getItem("token");
  // const userJson = JSON.parse(user);
  // const role = userJson?.user?.role;
  // const  = userJson?.token?.token;
  // const id = userJson?.user?.id;

  React.useEffect(() => {
    window.scrollTo(0, 0);

    console.log("state", index);
    console.log("props", props);
    fetchDetailPel(setDetailLesson, id);

    // if (role === "user") {
    //   fetchProgress(setProgress, id, userId);
    // }

    // eslint-disable-next-line
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  // const goNextChap = () => {
  //   // console.log(filter);
  //   if (role === "user") {
  //     let update = progress[0].read_chapter + 1;
  //     let length = detailLesson?.chapter?.length;

  //     if (update <= length) {
  //       axios({
  //         method: "put",
  //         url: `${API_URL}progress/${progress[0].id_progress}`,
  //         data: {
  //           user_id: userId,
  //           lesson_id: userId,
  //           read_chapter: update,
  //           length_chapter: length,
  //         },
  //         headers: {
  //           ContentType: "multipart/form-data",
  //           Accept: "application/json",
  //         },
  //       })
  //         .then(function () {
  //           fetchProgress(setProgress, id, userId);
  //         })
  //         .catch(function (error) {
  //           console.log("bb", error.response);
  //         });
  //     }

  //     const nextQuestion = currentChapter + 1;
  //     setCurrentCha(nextQuestion);
  //     window.scrollTo(0, 0);

  //     // console.log("length", detailLesson?.chapter?.length);
  //     // console.log("update", update);
  //   } else {
  //     const nextQuestion = currentChapter + 1;
  //     setCurrentCha(nextQuestion);
  //     window.scrollTo(0, 0);
  //   }
  // };

  const nextChap = () => {
    setCurrentSub(++currentSubject);
    window.scrollTo(0, 0);
  };

  const previousChap = () => {
    const prevSub = currentSubject - 1;
    setCurrentSub(prevSub);
    window.scrollTo(0, 0);
  };

  function startExam() {
    swal({
      title: "Lanjut Ke Ujian",
      text: "Apakah Kamu Yakin Untuk Memulai Ujian?",
      icon: "warning",
      buttons: true,

      dangerMode: true,
    }).then((response) => {
      if (response) {
        navigate({
          pathname: `/quiz/${detailLesson.chapter[currentChapter].id}`,
        });
      }
    });
  }

  return (
    <>
      {detailLesson?.chapter ? (
        <div>
          <section
            style={{
              position: "fixed",
              top: 0,
              width: "100%",
              backgroundColor: "#fff",
            }}
            className="p-3"
          >
            <div className="row justify-content-between">
              <div className="col d-flex align-items-center">
                {/* fa times */}
                <a className="fw-bold text-secondary" onClick={goBack} href="#">
                  <i className="fa fa-times"></i>{" "}
                  {detailLesson?.chapter[currentChapter]?.name} |{" "}
                  {parse(
                    detailLesson?.chapter[currentChapter]?.subject[
                      currentSubject
                    ]?.name
                  )}
                </a>
              </div>
              <div className="col">
                {/* logo icon */}
                <img
                  width={64}
                  src={require("../assets/img/brand-logo.png")}
                  alt=""
                  className="float-end"
                />
              </div>
            </div>
          </section>
          <div className="container mt-5">
            <div id="content" className="container">
              <div className="row ">
                <h2 className="fw-bold">
                  {parse(
                    detailLesson?.chapter[currentChapter]?.subject[
                      currentSubject
                    ]?.name
                  )}
                </h2>
                <span>
                  {parse(
                    detailLesson?.chapter[currentChapter]?.subject[
                      currentSubject
                    ]?.subject_content
                  )}
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              borderTop: "2px solid #e5e5e5",
              backgroundColor: "#fff",
            }}
          >
            <div
              className="container p-5 d-flex justify-content-end"
              id="buttons"
            >
              {currentSubject == 0 ? (
                <></>
              ) : (
                <Button
                  color="primary"
                  onClick={previousChap}
                  className={currentSubject == 0 ? "disabled me-2" : "me-2"}
                >
                  <i className="now-ui-icons arrows-1_minimal-left"></i> Materi
                  Sebelumnya
                </Button>
              )}
              {currentSubject ===
              detailLesson?.chapter[currentChapter]?.subject?.length - 1 ? (
                detailLesson?.quiz?.length === 0 ? (
                  <Button color="danger" disabled className="not-allowed">
                    Ujian Belum Tersedia{" "}
                    <i className="now-ui-icons arrows-1_minimal-right"></i>
                  </Button>
                ) : (
                  <Button color="warning" onClick={startExam}>
                    Mulai Ujian{" "}
                    <i className="now-ui-icons arrows-1_minimal-right"></i>
                  </Button>
                )
              ) : (
                <Button onClick={nextChap} color="info">
                  Lanjut Materi{" "}
                  <i className="now-ui-icons arrows-1_minimal-right"></i>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        loader()
      )}
    </>
  );
}

export default MateriPage;
