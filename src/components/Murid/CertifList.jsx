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
        <div className="container">
          <h2 className="mt-4">Sertifikat</h2>
          <div className="row">{/* 3 card in row */}</div>
          <div className="row">
            {load === false ? (
              certifList?.data?.length > 0 ? (
                certifList?.data?.map((certif, index) => {
                  return (
                    <div className="col-md-auto">
                      <Card>
                        <div className="card-body row">
                          <div className="col-md-auto">
                            <img
                              alt="..."
                              className="img-center img-fluid"
                              src={sertif}
                              width={100}
                            />
                          </div>
                          <div className="col">
                            <h6 className="fw-bold">
                              Sertifikat {certif.Lesson.nama_pelajaran}
                            </h6>
                            <span>Lulus : {certifList.created}</span>
                            <br />

                            <Link
                              to={`/export/${user.id}/${certif.Lesson?.id}`}
                            >
                              <Button size="sm" color="info">
                                Lihat Sertifikat
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
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
        </div>
      </div>
    </>
  );
}

export default CertifList;
