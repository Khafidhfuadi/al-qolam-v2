import React, { useState, useEffect } from "react";
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
  createQuizScore,
  isQuizDone,
  updateQuizScore,
} from "../utils/constants";

function Quiz({ user }) {
  let { id } = useParams();
  const userId = user.id;
  const roleUser = user.role;

  const [questions, setQuestions] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [randomArr, setRandomArr] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [showTerm, setShowTerm] = useState(true);
  const [score, setScore] = useState(0);
  const [scoreTotal, setScoreT] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [load, setLoad] = useState(true);
  const [isQuiz, setIsQuizDone] = useState([]);
  const [pageVisible, setPageVisible] = useState(true);

  const navigate = useNavigate();

  const MyBulletListLoader = () => <DotLoad />;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!showTerm && !showScore && document.visibilityState === "hidden") {
        swal({
          title: "Kuis Dibatalkan",
          text: "Kamu terindikasi meninggalkan halaman kuis, kuis dibatalkan",
          icon: "error",
          button: "OK",
        }).then(() => {
          navigate(-1);
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [showTerm, showScore, navigate]);

  useEffect(() => {
    setLoad(true);
    fetchDataQuiz(
      (data) => {
        console.log("Raw Questions Data:", data[0]?.questions); // Debugging
        console.log("Type of Questions Data:", typeof data[0]?.questions); // Debugging

        let parsedQuestions = [];
        if (typeof data[0]?.questions === "string") {
          try {
            parsedQuestions = JSON.parse(data[0].questions);
            console.log("Parsed Questions:", parsedQuestions); // Debugging
          } catch (error) {
            console.error("JSON Parsing Error:", error);
          }
        } else if (Array.isArray(data[0]?.questions)) {
          parsedQuestions = data[0]?.questions; // Directly assign if it's already an object
        }

        setChapterName(data[0]?.Chapter?.name || "");
        setQuestions(parsedQuestions);
        if (parsedQuestions.length > 0) {
          const initialAnswers = parsedQuestions[0]?.answers || [];
          setRandomArr(initialAnswers.sort(() => Math.random() - 0.5));
        }
        setLoad(false);
      },
      (seconds) => secondsToHms(seconds),
      setRandomArr,
      id,
      setLoad
    );
    isQuizDone(setIsQuizDone, setLoad, id, userId);
  }, [id, userId]);

  useEffect(() => {
    if (questions.length > 0) {
      console.log("Current Question Data:", questions[currentQuestion]); // Debugging
      const answers = questions[currentQuestion]?.answers || [];
      console.log("Answers:", answers); // Debugging
      setRandomArr(answers.sort(() => Math.random() - 0.5));
    }
  }, [questions, currentQuestion]);

  useEffect(() => {
    console.log("Current Question Data:", questions[currentQuestion]); // Debugging
    console.log("Chapter Name:", chapterName); // Debugging
  }, [questions, currentQuestion]);

  const handleAnswerOptionClick = (isCorrect) => {
    const nextQuestion = currentQuestion + 1;

    if (isCorrect === "true") {
      setScore((prevScore) => {
        const newScore = prevScore + 1;
        const e = (newScore / questions.length) * 100;
        setScoreT(e);
        setAvgScore(Math.floor(newScore));
        return newScore;
      });
    }

    if (nextQuestion < questions.length) {
      const nextQuestionData = questions[nextQuestion];
      setRandomArr(
        nextQuestionData?.answers?.sort(() => Math.random() - 0.5) || []
      );
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  useEffect(() => {
    if (showScore && scoreTotal >= 70 && roleUser === "murid") {
      if (isQuiz.length > 0) {
        if (isQuiz[0].score < scoreTotal) {
          updateQuizScore(isQuiz[0].id, scoreTotal);
        }
      } else {
        createQuizScore(userId, id, scoreTotal);
      }
    }
  }, [showScore, scoreTotal, roleUser, isQuiz, userId, id]);

  function confirmCancel() {
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
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);
    setMinutes(m);
    setSeconds(s);
  }

  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(2);

  const calculateTotalTime = (numQuestions) => {
    return numQuestions; // 1 minute per question
  };

  React.useEffect(() => {
    if (questions.length > 0) {
      const totalMinutes = calculateTotalTime(questions.length);
      setMinutes(totalMinutes);
      setSeconds(0); // Start from 0 seconds
    }
  }, [questions]);

  React.useEffect(() => {
    let myInterval;
    if (showTerm === false && pageVisible) {
      myInterval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              clearInterval(myInterval);
              setShowScore(true);
            } else {
              setMinutes((prevMinutes) => prevMinutes - 1);
              return 59;
            }
          } else {
            return prevSeconds - 1;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(myInterval);
    };
  }, [showTerm, minutes, seconds, pageVisible]);

  return (
    <div>
      {load ? (
        <div className="section container">
          <MyBulletListLoader />
        </div>
      ) : questions.length === 0 ? (
        <div className="section container text-left">
          <p className="font-weight-bold text-dark">
            Pengajar Sedang Membuat Quiz Terbaik Untuk Kamu, Tungguin Terus Yaa!{" "}
            <br /> - Al-Qolam
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
      ) : showScore ? (
        <div className="section container">
          <Card>
            <CardBody>
              <CardTitle>
                <Row>
                  <h3 className="mt-4 ml-2">
                    Quiz {chapterName} | {questions.length} Soal
                  </h3>
                </Row>
              </CardTitle>

              <Row>
                <Col>
                  <img
                    width={scoreTotal < 70 ? "400rem" : "310rem"}
                    alt="..."
                    className="rounded float-right"
                    src={scoreTotal < 70 ? tryagain : suc3}
                  ></img>
                </Col>
                <Col className="mt-5">
                  {scoreTotal < 70 ? (
                    <h3>Semangat, Ayo Coba Lagi!</h3>
                  ) : (
                    <h3>Selamat, Kamu Lolos!</h3>
                  )}
                  <h5>
                    <b>Nilai {scoreTotal}</b> | Kamu Benar {score} dari{" "}
                    {questions.length} Soal
                  </h5>
                  {scoreTotal < 70 ? (
                    <span className="text-info">
                      *Kamu Harus Memiliki Nilai Setidaknya 70 Untuk Melanjutkan
                      Ke Materi Selanjutnya <br />
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
                      {scoreTotal < 70 ? (
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
                    {showTerm ? (
                      `Pendahuluan | Quiz ${chapterName} | ${questions.length} Soal`
                    ) : (
                      <>
                        Quiz {chapterName} | Soal Ke {currentQuestion + 1} dari{" "}
                        {questions.length}
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
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                      </h1>
                    )}
                  </Row>
                </Col>
              </Row>
              {showTerm ? (
                <Row>
                  <Col md="8">
                    <ul>
                      <li>Awali mengerjakan soal quiz dengan berdoa.</li>
                      <li>Pilih salah satu jawaban yang dianggap benar.</li>
                      <li>
                        Kerjakan quiz dengan cermat dan bacalah pertanyaan
                        dengan teliti.
                      </li>
                      <span className="text-danger">Catatan Penting :</span>
                      <span className="text-danger">
                        <li>
                          Satu soal diberikan waktu 1 Menit untuk menjawab.
                        </li>
                        <li>
                          Ketika Kamu meng-klik jawaban dari soal, maka otomatis
                          akan lanjut ke soal berikutnya.
                        </li>
                        <li>Kamu tidak bisa kembali ke soal sebelumnya</li>
                        <li>
                          Jika waktu habis, maka langsung dialihkan ke halaman
                          nilai.
                        </li>
                        <li>
                          Jika Nilai dibawah 70 maka peserta dianggap tidak
                          lolos.
                        </li>
                        <li>
                          Peserta dapat mengulang berkali - kali quiz hingga
                          lolos.
                        </li>
                      </span>
                    </ul>
                  </Col>
                </Row>
              ) : (
                <>
                  <div className="question-text fw-bold fs-3">
                    {ReactHtmlParser(
                      questions[currentQuestion]?.question_text || ""
                    )}
                  </div>
                  {randomArr.map((data, index) => (
                    <Row className="ml-1" key={index}>
                      <Button
                        className="btn-block btn-info"
                        size="lg"
                        onClick={() => handleAnswerOptionClick(data?.isCorrect)}
                      >
                        {data?.answerText}
                      </Button>
                    </Row>
                  ))}
                </>
              )}
              <div className="d-flex justify-content-between">
                <Button color="secondary" onClick={confirmCancel}>
                  <i className="now-ui-icons arrows-1_minimal-left"></i>{" "}
                  Batalkan Quiz
                </Button>
                {showTerm ? (
                  <Button color="info" onClick={confirmQuiz}>
                    Mulai Quiz{" "}
                    <i className="now-ui-icons arrows-1_minimal-right"></i>
                  </Button>
                ) : null}
              </div>
            </Container>
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;
