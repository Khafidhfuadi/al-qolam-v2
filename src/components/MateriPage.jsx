import React, { useState } from "react";
import { Button } from "reactstrap";
import axios from "axios";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import loader from "../components/loader/loaderMateri";
import parse from "html-react-parser";

import swal from "sweetalert";
import NavbarBrand from "reactstrap/lib/NavbarBrand";
import { fetchDetailPel, fetchProgress } from "../utils/constants";
import logo from "../assets/img/brand-logo.png";
import BackButton from "../utils/BackComponent";
import { API_URL } from "../utils/constants";

function MateriPage({ user, handleLogout, ...props }) {
  const { role, name } = user;
  const userId = user.id;

  let { id, chapindex, subindex } = useParams();
  const location = useLocation();
  const index = location.state?.index;

  const navigate = useNavigate();

  let [detailLesson, setDetailLesson] = React.useState([]);
  let [progress, setProgress] = React.useState([]);
  const [currentChapter, setCurrentCha] = useState(chapindex);
  const [currentSubject, setCurrentSub] = useState(subindex);

  // const user = localStorage.getItem("token");
  // const userJson = JSON.parse(user);
  // const role = userJson?.user?.role;
  // const  = userJson?.token?.token;
  // const id = userJson?.user?.id;

  React.useEffect(() => {
    console.log("state", index);
    console.log("props", props);
    fetchDetailPel(setDetailLesson, id);

    // if (role === "user") {
    //   fetchProgress(setProgress, id, userId);
    // }

    // eslint-disable-next-line
  }, [id]);

  const goNextChap = () => {
    // console.log(filter);
    if (role === "user") {
      let update = progress[0].read_chapter + 1;
      let length = detailLesson?.chapter?.length;

      if (update <= length) {
        axios({
          method: "put",
          url: `${API_URL}progress/${progress[0].id_progress}`,
          data: {
            user_id: userId,
            lesson_id: userId,
            read_chapter: update,
            length_chapter: length,
          },
          headers: {
            ContentType: "multipart/form-data",
            Accept: "application/json",
          },
        })
          .then(function () {
            fetchProgress(setProgress, id, userId);
          })
          .catch(function (error) {
            console.log("bb", error.response);
          });
      }

      const nextQuestion = currentChapter + 1;
      setCurrentCha(nextQuestion);
      window.scrollTo(0, 0);

      // console.log("length", detailLesson?.chapter?.length);
      // console.log("update", update);
    } else {
      const nextQuestion = currentChapter + 1;
      setCurrentCha(nextQuestion);
      window.scrollTo(0, 0);
    }
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
          pathname: `/quiz/${id}`,
        });
      }
    });
  }

  return (
    <>
      {detailLesson?.chapter ? (
        <div className="bungkus">
          <div className="konten">
            <div className="konten-bungkus">
              <h1 className="text-capitalize">
                {detailLesson?.chapter[currentChapter]?.name} |{" "}
                {parse(
                  detailLesson?.chapter[currentChapter]?.subject[currentSubject]
                    ?.name
                )}
              </h1>
              <div className="line "></div>
              <b className="text-konten font-weight-normal">
                {parse(
                  detailLesson?.chapter[currentChapter]?.subject[currentSubject]
                    ?.subject_content
                )}
              </b>
              <div className="line "></div>
              <div>
                <BackButton />

                {currentChapter === 0 ? (
                  <></>
                ) : (
                  <Button
                    color="primary"
                    onClick={previousChap}
                    className={currentSubject == 0 ? "disabled" : ""}
                  >
                    <i className="now-ui-icons arrows-1_minimal-left"></i>{" "}
                    Materi Sebelumnya
                  </Button>
                )}

                {currentChapter === detailLesson?.chapter?.length - 1 ? (
                  detailLesson?.quiz?.length === 0 ? (
                    <Button color="danger" disabled className="not-allowed">
                      Ujian Belum Tersedia{" "}
                      <i className="now-ui-icons arrows-1_minimal-right"></i>
                    </Button>
                  ) : (
                    <Button color="info" onClick={startExam}>
                      Mulai Ujian{" "}
                      <i className="now-ui-icons arrows-1_minimal-right"></i>
                    </Button>
                  )
                ) : (
                  <Button color="info" onClick={goNextChap}>
                    Lanjut Materi{" "}
                    <i className="now-ui-icons arrows-1_minimal-right"></i>
                  </Button>
                )}
              </div>
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
