import React from "react";
import { Button, Container, Row, Col, Card } from "reactstrap";

import sertif from "../../assets/img/cert-icon.png";
import { Link } from "react-router-dom";
import { fetchDataCertifList } from "../../utils/constants";
import exam from "../../assets/img/exam.png";

function CertifList({ user }) {
  let { role, name, id } = user;
  const [certifList, setCertifList] = React.useState([]);
  const [load, setLoad] = React.useState(false);

  // const user = localStorage.getItem("user");

  React.useEffect(() => {
    setLoad(true);
    fetchDataCertifList(setCertifList, setLoad, id);
  }, []);

  return (
    <>
      <div className="section section-tabs text-capitalize">
        <Container>
          <h2 className="mt-4">Sertifikat</h2>
          <div className="row">
            {load === false ? (
              certifList?.data?.length > 0 ? (
                certifList?.data?.map((certif, index) => {
                  return (
                    <div className="card">
                      <div className="row  align-items-center">
                        {/* <div className="col-auto col-md-auto">
                          <img width="30%" alt="..." src={sertif}></img>
                        </div> */}
                        <img width="30%" alt="..." src={sertif}></img>

                        <div className="col-auto col-md-auto">
                          <h5>{certif.Lesson.nama_pelajaran}</h5>
                          <div className="date">
                            Lulus : {certifList.created}
                          </div>
                          <Link to={`export/${certif.lesson_id}`}>
                            <Button size="sm" color="info">
                              Export
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
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
          </div>
        </Container>
      </div>
    </>
  );
}

export default CertifList;
