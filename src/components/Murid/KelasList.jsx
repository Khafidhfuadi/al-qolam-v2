import React, { useState } from "react";

import { fetchDataPelList } from "../../utils/constants";

// reactstrap components
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  CardTitle,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Progress,
} from "reactstrap";
import { Link } from "react-router-dom";
import loaderKelasList from "../loader/loaderKelasList";
// import { withAuthUser } from "../../auth/RouteAccess";
// import { loadAnimation } from "lottie-web";
// import { defineLordIconElement } from "lord-icon-element";
import ava from "../../assets/img/muslim.png";
import books from "../../assets/img/books.png";
import { withAuthUser } from "../auth/RouteAccess";

// defineLordIconElement(loadAnimation);

const KelasList = ({ user }) => {
  const [load, setLoad] = useState(true);
  let [lesson, setLesson] = React.useState([]);
  let [listType, setListType] = React.useState("exist");
  let [valB, setValB] = React.useState("Materi Yang Tersedia");

  // const user = localStorage.getItem("token");
  // const userJson = JSON.parse(user);
  // const access_token = userJson?.token?.token;
  // const userId = userJson?.user?.id;

  let chapOnlyFilter = lesson?.filter(function (e) {
    // eslint-disable-next-line
    return e.chapter_count != 0;
  });

  React.useEffect(() => {
    setLoad(true);
    fetchDataPelList(setLesson, setLoad, user.id);
    // eslint-disable-next-line
  }, []);

  function top() {
    window.scrollTo(0, 0);
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <div>
      <div className="section text-capitalize">
        <Container>
          <Row>
            <Col>
              <h2>Mulai belajar - ابدا بالتعلم</h2>
            </Col>
            <Col>
              <Dropdown
                className="float-right"
                isOpen={dropdownOpen}
                toggle={toggle}
              >
                <DropdownToggle caret color="info">
                  {valB}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    checked={listType === "exist"}
                    onClick={() => {
                      setListType("exist");
                      setValB("Materi Yang Tersedia");
                    }}
                  >
                    Materi Yang Tersedia
                  </DropdownItem>
                  <DropdownItem
                    checked={listType === "AllChap"}
                    onClick={() => {
                      setListType("AllChap");
                      setValB("Semua Pelajaran");
                    }}
                  >
                    Semua Pelajaran
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>

          <Row className="d-flex justify-space-between">
            {load === false ? (
              lesson?.length === 0 ? (
                <div className="container text-left">
                  <p className=" font-weight-bold text-dark">
                    Pengajar Sedang Membuat Kelas Terbaik Untuk Kamu, Tungguin
                    Terus Yaa! <br /> - Al-Qolam
                  </p>
                  <img
                    width="250rem"
                    alt="..."
                    className="rounded float-right"
                    src={books}
                  ></img>
                </div>
              ) : listType === "exist" ? (
                chapOnlyFilter.map((lesson, index) => {
                  return (
                    <Col md="6" xl="4" key={lesson?.id}>
                      <Card>
                        <CardBody className="ml-2">
                          <CardTitle className="pt-0">
                            <span
                              className={` badge float-right mt-2 ${
                                lesson?.tingkatan === "mudah"
                                  ? "badge-success"
                                  : lesson?.tingkatan === "menengah"
                                  ? "badge-warning"
                                  : "badge-danger"
                              }`}
                            >
                              {lesson?.tingkatan}
                            </span>
                            <h3>{lesson?.pelajaran}</h3>
                          </CardTitle>
                          <Row>
                            <Col xs="3">
                              <img
                                width="90%"
                                alt="..."
                                className="rounded-circle "
                                src={ava}
                              ></img>
                            </Col>
                            <Col xs="auto">
                              <div className="pl-0 pr-0 pb-1">
                                <h6 className="card-title text-left card-trainer-name">
                                  {lesson?.guru}
                                </h6>{" "}
                                <h6 className="card-title text-left card-trainer-tipe text-info">
                                  Pengajar
                                </h6>
                              </div>
                            </Col>
                          </Row>
                          <Row className="d-flex justify-content-between">
                            <Col xs="auto" className="mt-3">
                              <i className="now-ui-icons files_single-copy-04 "></i>
                              <span>
                                {" "}
                                :{" "}
                                {lesson?.chapter_count === 0 ? (
                                  <span className="text-danger">
                                    Tidak Ada Materi
                                  </span>
                                ) : (
                                  lesson?.chapter_count + " Materi"
                                )}{" "}
                              </span>
                            </Col>
                            <Col xs="auto">
                              <Link
                                to={`detail-kelas/${lesson?.id}`}
                                onClick={top}
                              >
                                <Button color="info" className="float-right">
                                  Mulai belajar
                                </Button>
                              </Link>
                            </Col>
                          </Row>
                          {lesson?.progress?.length !== 0 ? (
                            lesson?.progress?.map(function (item, i) {
                              let percent =
                                (item.read_chapter / item.length_chapter) * 100;

                              return (
                                <>
                                  <div
                                    className="progress-container"
                                    key={item?.id}
                                  >
                                    <span className="progress-badge">
                                      Progres
                                    </span>

                                    <Progress
                                      max={item.length_chapter}
                                      value={item.read_chapter}
                                    >
                                      <span className="progress-value">
                                        {Math.ceil(percent)}%
                                      </span>
                                    </Progress>
                                  </div>
                                </>
                              );
                            })
                          ) : (
                            <div className="progress-container">
                              <span className="progress-badge">Progres</span>

                              <Progress max={100} value={0}>
                                <span className="progress-value">0%</span>
                              </Progress>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                lesson?.map((lesson, index) => {
                  return (
                    <Col md="6" xl="4" key={lesson?.id}>
                      <Card>
                        <CardBody className="ml-2">
                          <CardTitle className="pt-0">
                            <span
                              className={` badge float-right mt-2 ${
                                lesson?.tingkatan === "mudah"
                                  ? "badge-success"
                                  : lesson?.tingkatan === "menengah"
                                  ? "badge-warning"
                                  : "badge-danger"
                              }`}
                            >
                              {lesson?.tingkatan}
                            </span>
                            <h3>{lesson?.pelajaran}</h3>
                          </CardTitle>
                          <Row>
                            <Col xs="3">
                              <img
                                width="90%"
                                alt="..."
                                className="rounded-circle "
                                src={ava}
                              ></img>
                            </Col>
                            <Col xs="auto">
                              <div className="pl-0 pr-0 pb-1">
                                <h6 className="card-title text-left card-trainer-name">
                                  {lesson?.guru}
                                </h6>{" "}
                                <h6 className="card-title text-left card-trainer-tipe text-info">
                                  Pengajar
                                </h6>
                              </div>
                            </Col>
                          </Row>
                          <Row className="d-flex justify-content-between">
                            <Col xs="auto" className="mt-3">
                              <i className="now-ui-icons files_single-copy-04 "></i>
                              <span>
                                {" "}
                                :{" "}
                                {lesson?.chapter_count === 0 ? (
                                  <span className="text-danger">
                                    Tidak Ada Materi
                                  </span>
                                ) : (
                                  lesson?.chapter_count + " Materi"
                                )}{" "}
                              </span>
                            </Col>
                            <Col xs="auto">
                              <Link
                                to={`detail-kelas/${lesson?.id}`}
                                onClick={top}
                              >
                                <Button color="info" className="float-right">
                                  Mulai belajar
                                </Button>
                              </Link>
                            </Col>
                          </Row>
                          {lesson?.progress?.length !== 0 ? (
                            lesson?.progress?.map(function (item, i) {
                              let percent =
                                (item.read_chapter / item.length_chapter) * 100;

                              return (
                                <>
                                  <div
                                    className="progress-container"
                                    key={item?.id}
                                  >
                                    <span className="progress-badge">
                                      Progres
                                    </span>

                                    <Progress
                                      max={item.length_chapter}
                                      value={item.read_chapter}
                                    >
                                      <span className="progress-value">
                                        {Math.ceil(percent)}%
                                      </span>
                                    </Progress>
                                  </div>
                                </>
                              );
                            })
                          ) : (
                            <div className="progress-container">
                              <span className="progress-badge">Progres</span>

                              <Progress max={100} value={0}>
                                <span className="progress-value">0%</span>
                              </Progress>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </Col>
                  );
                })
              )
            ) : (
              loaderKelasList()
            )}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default KelasList;
