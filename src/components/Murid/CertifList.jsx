import React from "react";
import { Button, Container, Row, Col, Card } from "reactstrap";

import sertif from "../../assets/img/cert-icon.png";
import { Link } from "react-router-dom";
import { fetchDataCertifList } from "../../utils/constants";
import exam from "../../assets/img/exam.png";

function CertifList() {
  const [certifList, setCertifList] = React.useState([]);
  const [load, setLoad] = React.useState(false);

  const user = localStorage.getItem("user");

  React.useEffect(() => {
    setLoad(true);
    fetchDataCertifList(setCertifList, setLoad, user.id);
  }, []);

  return (
    <>
      <div className="section section-tabs text-capitalize">
        <Container>
          <h2 className="mt-4">Sertifikat</h2>
          {load === false ? (
            certifList?.length > 0 ? (
              certifList.map((certif, index) => {
                return (
                  <Row>
                    <Col md="6" xl="4">
                      <Card>
                        <div className="media p-2">
                          <img
                            width="30%"
                            alt="..."
                            className="rounded align-self-center mr-3 ml-2"
                            src={sertif}
                          ></img>
                          <div className="media-body mt-2">
                            <h5>{certif.pelajaran}</h5>
                            <div className="date">
                              Lulus : {certif.created_at}
                            </div>
                            <Link to={`export/${certif.lesson_id}`}>
                              <Button size="sm" color="info">
                                Export
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                );
              })
            ) : (
              <>
                <div>
                  <img
                    width="200px"
                    alt="..."
                    className="rounded float-right"
                    src={exam}
                  />
                  <p className=" font-weight-bold text-dark">
                    Kamu Belum Memiliki Sertifikat Apapun, Selesaikan Ujian
                    Sekarang! <br /> - Al-Qolam
                  </p>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
              </>
            )
          ) : (
            <>loading...</>
          )}
        </Container>
      </div>
    </>
  );
}

export default CertifList;
