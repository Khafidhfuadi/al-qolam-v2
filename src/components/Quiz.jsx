import React, { useState } from "react";
import {
  Button,
  Container,
  Row,
  CardTitle,
  Col,
  Card,
  CardBody,
} from "reactstrap";

import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";

import DotLoad from "../components/loader/dotLoader";
import ReactHtmlParser from "html-react-parser";
import books from "../assets/img/books.png";
import logo from "../assets/img/brand-logo.png";
import tryagain from "../assets/img/try-again.jpg";
import suc3 from "../assets/img/suc3.png";
import {
  fetchDataQuiz,
  createUserCertif,
  fetchDataSingleCertif,
  updateUserCertif,
} from "../utils/constants";

function Quiz({ user }) {
  let { id } = useParams();
  const userId = user.id;
  const roleUser = user.role;
  // const access_token = user.token;

  const [questions, setQuestions] = useState([]);
  const [randomArr, setRandomArr] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showTerm, setShowTerm] = useState(true);
  const [score, setScore] = useState(0);
  const [scoreTotal, setScoreT] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [load, setLoad] = useState();
  const navigate = useNavigate();
  // const { roleUser, access_token, userId } = props;

  const [certif, setCertif] = React.useState([]);
  const [createdAt, setCreatedAt] = React.useState("");
  const [predikat, setPredikat] = React.useState([]);

  const MyBulletListLoader = () => <DotLoad />;

  React.useEffect(() => {
    setLoad(true);
    fetchDataQuiz(setQuestions, secondsToHms, setRandomArr, id, setLoad);
    fetchDataSingleCertif(
      setCertif,
      setCreatedAt,
      setPredikat,
      setLoad,
      id,
      userId
    );

    console.log("questions", questions);

    // eslint-disable-next-line
  }, []);

  const handleAnswerOptionClick = (isCorrect) => {
    let inputScore;
    if (isCorrect === "true") {
      setScore(score + 1);
      let e = ((score + 1) / questions.length) * 100;
      inputScore = e;
      setScoreT(e);
      setAvgScore(Math.floor(scoreTotal));
      // console.log("st", scoreTotal);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setRandomArr(
        JSON.parse(questions[currentQuestion + 1].answer_options).list.sort(
          () => Math.random() - 0.5
        )
      );
    } else {
      setShowScore(true);
      if (inputScore >= 70 && roleUser === "murid") {
        if (certif.length > 0) {
          console.log("update", scoreTotal);
          updateUserCertif(
            id,
            userId,
            inputScore,

            certif[0].cf_id
          );
        } else {
          console.log("create");
          createUserCertif(id, userId, inputScore);
        }
      }
    }
  };

  function confirmCancel() {
    // e.preventDefault();
    swal({
      title: "Batalkan Quiz",
      text: "Apakah Kamu Yakin Untuk Membatalkan Quiz?",
      icon: "warning",
      buttons: true,

      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        navigate(-1);
      }
    });
  }

  function confirmQuiz() {
    swal({
      title: "Mulai Quiz",
      text: "Apakah Kamu Yakin Untuk Memulai Quiz?",
      icon: "warning",
      buttons: true,

      dangerMode: true,
    }).then((response) => {
      if (response) {
        setShowTerm(false);
      }
    });
  }

  const reloadPage = () => {
    window.location.reload();
  };

  function secondsToHms(d) {
    d = Number(d);
    // var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    // var hDisplay = h > 0 ? h : 0;
    var mDisplay = m > 0 ? m : 0;
    var sDisplay = s > 0 ? s : 0;
    // return hDisplay + mDisplay + sDisplay;
    setMinutes(mDisplay);
    setSeconds(sDisplay);
  }

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(2);

  React.useEffect(() => {
    if (showTerm === false) {
      setAvgScore(Math.floor(scoreTotal));

      let myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            setMinutes(minutes - 1);
            clearInterval(myInterval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
      return () => {
        clearInterval(myInterval);
      };
    }
  });

  return (
    <div>
      {load === false ? (
        questions?.length === 0 ? (
          <div className="section container text-left">
            <p className=" font-weight-bold text-dark">
              Pengajar Sedang Membuat Quiz Terbaik Untuk Kamu, Tungguin Terus
              Yaa! <br /> - Al-Qolam
            </p>
            <img
              width="250rem"
              alt="..."
              className="rounded float-right"
              src={books}
            ></img>
            <Link to="/bab">
              <Button color="danger">Kembali Ke Kelas</Button>
            </Link>
          </div>
        ) : showScore === true ? (
          <div className="section container">
            <Card>
              <CardBody>
                <CardTitle>
                  <Row>
                    {/* <img width="10rem" alt="..." src={logo}></img> */}
                    <h3 className="mt-4 ml-2">
                      Quiz {questions[currentQuestion]?.Chapter.name}
                    </h3>
                  </Row>
                </CardTitle>
                <Row>
                  <Col>
                    <img
                      width={avgScore < 70 ? "400rem" : "310rem"}
                      alt="..."
                      className="rounded float-right"
                      src={avgScore < 70 ? tryagain : suc3}
                    ></img>
                  </Col>
                  <Col className="mt-5">
                    {avgScore < 70 ? (
                      <h3>Semangat, Ayo Coba Lagi!</h3>
                    ) : (
                      <h3>Selamat, Kamu Lolos!</h3>
                    )}
                    <h5>
                      <b>Nilai {avgScore}</b> | Kamu Benar {score} dari{" "}
                      {questions.length} Soal
                    </h5>
                    {avgScore < 70 ? (
                      <span className="text-info">
                        *Kamu Harus Memiliki Nilai Setidaknya 70 Untuk
                        Melanjutkan Ke Materi Selanjutnya <br />
                      </span>
                    ) : (
                      <span className="text-info">
                        *Kamu Bisa Melanjutkan Ke Materi Selanjutnya! <br />
                      </span>
                    )}
                    {roleUser === "murid" ? (
                      <>
                        <Link to={`detail-bab/${id}`}>
                          <Button color="info">Kembali Ke Materi</Button>
                        </Link>
                        {avgScore < 70 ? (
                          <Button color="info" onClick={reloadPage}>
                            Coba Lagi
                          </Button>
                        ) : (
                          <Link to="/profile-page">
                            <Button color="info">Profil Saya</Button>
                          </Link>
                        )}
                      </>
                    ) : (
                      <Link to="/">
                        <Button color="info">Kembali Ke Halaman Utama</Button>
                      </Link>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </div>
        ) : (
          <>
            <div className="section text-left">
              <Container>
                <Row>
                  <Col>
                    <h5 className="mt-4 text-capitalize">
                      {showTerm === true ? (
                        `Pendahuluan | Quiz ${questions[currentQuestion]?.Chapter?.name} | ${questions?.length} Soal`
                      ) : (
                        <>
                          Quiz {questions[currentQuestion]?.Chapter?.name} |
                          Soal Ke {currentQuestion + 1} dari {questions.length}
                        </>
                      )}
                    </h5>
                  </Col>
                  <Col md="3">
                    <Row className="justify-content-end">
                      {minutes < 0 ? (
                        setShowScore(true)
                      ) : (
                        <h1
                          className={`mt-4 ${
                            minutes === 0 && seconds < 30 ? "text-danger" : ""
                          }`}
                        >
                          {" "}
                          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                        </h1>
                      )}
                      {/* <img
                        width="50rem"
                        alt="..."
                        className="rounded mr-1"
                        src={logo}
                      ></img> */}
                    </Row>
                  </Col>
                </Row>
                {showTerm === true ? (
                  <>
                    <Row>
                      <Col md="8">
                        <ul>
                          <li>Awali mengerjakan soal quiz dengan berdoa.</li>
                          <li>Pilih salah satu jawaban yang dianggap benar.</li>
                          <li>
                            Kerjakan quiz dengan cermat dan bacalah pertanyaan
                            dengan teliti.
                          </li>

                          <span className="text-danger">
                            Catatan Penting :{" "}
                          </span>
                          <span className="text-danger">
                            <li>
                              Satu soal diberikan waktu 1 Menit untuk menjawab.
                            </li>
                            <li>
                              Ketika Kamu meng-klik jawaban dari soal, maka
                              otomatis akan lanjut ke soal berikutnya.
                            </li>
                            <li>Kamu tidak bisa kembali ke soal sebelumnya</li>
                            <li>
                              Jika waktu habis, maka langsung dialihkan ke
                              halaman nilai.
                            </li>
                            <li>
                              Jika Nilai dibawah 70 maka peserta dianggap tidak
                              lolos.
                            </li>
                            <li>
                              {" "}
                              Peserta dapat mengulang berkali - kali quiz hingga
                              lolos.
                            </li>
                          </span>
                        </ul>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <div className="question-count">
                      {" "}
                      {/* <Countdown date={Date.now() + 10000} renderer={renderer} onComplete={completeCount}/> */}
                    </div>
                    <div className="question-text fw-bold fs-3">
                      {ReactHtmlParser(
                        questions[currentQuestion]?.question_text
                      )}

                      {/* <span>{questions[currentQuestion]?.answer_options}</span> */}
                    </div>
                    {randomArr.map((data, index) => {
                      return (
                        <Row className="ml-1" key={index}>
                          <Button
                            className="btn-block btn-info"
                            size="lg"
                            onClick={() =>
                              handleAnswerOptionClick(data?.isCorrect)
                            }
                          >
                            {data?.answerText}
                          </Button>
                        </Row>
                      );
                    })}
                  </>
                )}
                <div className="d-flex justify-content-between">
                  <Button color="secondary" onClick={() => confirmCancel()}>
                    <i className="now-ui-icons arrows-1_minimal-left"></i>{" "}
                    Batalkan Quiz
                  </Button>
                  {showTerm === true ? (
                    <Button color="info" onClick={() => confirmQuiz()}>
                      Mulai Quiz{" "}
                      <i className="now-ui-icons arrows-1_minimal-right"></i>
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
              </Container>
            </div>
          </>
        )
      ) : (
        <div className="section container">
          <MyBulletListLoader />
        </div>
      )}
    </div>
  );
}

export default Quiz;
