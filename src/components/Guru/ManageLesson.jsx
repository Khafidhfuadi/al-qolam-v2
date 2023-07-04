import React, { useState } from "react";

import {
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Button,
  ButtonGroup,
  Spinner,
} from "reactstrap";

import { API_URL } from "../../utils/constants";
import BootstrapCardDataTable from "../loader/loaderTable";
import axios from "axios";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";

// import { useAlert } from "react-alert";

import books from "../../assets/img/books.png";
import Switch from "react-bootstrap-switch";
// import { roleUser } from "utils/constants";

// import { userName } from "utils/constants";

const ManageLesson = ({ user }) => {
  const [load, setLoad] = useState(true);
  let [listTable, setListTable] = React.useState([]);
  let [typeList, setTypeList] = React.useState("MyClass");
  const { SearchBar } = Search;

  // const { roleUser, access_token, userId, userName } = props;
  // const user = localStorage.getItem("token");
  // const userJson = JSON.parse(user);
  // const roleUser = userJson?.user?.role;
  // const userName = userJson?.user?.name;
  // const access_token = userJson?.token?.token;
  // const userId = userJson?.user?.id;

  const roleUser = user?.role;
  const userName = user?.name;
  const userId = user?.id;

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total py-2 px-2">
      Menampilkan {from} hingga {to} dari {size} Hasil
    </span>
  );

  const options = {
    paginationSize: 4,
    pageStartIndex: 1,
    firstPageText: "First",
    prePageText: "Back",
    nextPageText: "Next",
    lastPageText: "Last",
    nextPageTitle: "First page",
    prePageTitle: "Pre page",
    firstPageTitle: "Next page",
    lastPageTitle: "Last page",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "5",
        value: 5,
      },
      {
        text: "10",
        value: 10,
      },
      {
        text: "25",
        value: 25,
      },
      {
        text: "Semua",
        value: listTable.length,
      },
    ],
  };

  async function fetchData() {
    axios
      .get(`${API_URL}/lessons?role=${roleUser}`, {})
      .then((response) => {
        setLoad(false);
        setListTable(response.data);
      })
      .catch((error) => {
        let message = error.response;
        console.log(message);
      });
  }

  let myClass = listTable?.filter(function (e) {
    // eslint-disable-next-line
    return e.user_id == userId;
  });

  async function deleteLesson(id) {
    // e.preventDefault();
    swal({
      title: "Menghapus Kelas",
      text: "Apakah Kamu Yakin Untuk Menghapus Kelas?",
      icon: "warning",
      buttons: true,

      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${API_URL}/lessons/${id}`, {})
          .then((res) => {
            swal({
              title: "Berhasil!",
              text: "Kelas Terhapus!",
              icon: "success",
              timer: 2000,
              button: false,
            }).then(() => {
              fetchData();
            });
          })
          .catch(() => {
            swal({
              title: "Gagal!",
              text: "Gagal Menghapus Kelas, Silahkan Coba Lagi",
              icon: "error",
              timer: 2000,
              button: false,
            });
          });
      }
    });
  }

  // let valS = true;

  function allDataEmpty() {
    return (
      <div className="container text-left">
        <p className=" font-weight-bold text-dark">
          {roleUser === "admin" ? (
            <>Belum Ada Yang Membuat Pelajaran</>
          ) : (
            <>
              Belum Ada Yang Membuat Pelajaran, Buat Pelajaran Pertamamu! <br />{" "}
              - Al-Qolam
            </>
          )}
        </p>
        <img
          width="250rem"
          alt="..."
          className="rounded float-right"
          src={books}
        ></img>
      </div>
    );
  }

  function myDataEmpty() {
    return (
      <div className="container text-left">
        <p className=" font-weight-bold text-dark">
          Kamu Belum Membuat Pelajaran apapun, Buat Pelajaran Pertamamu! <br />{" "}
          - Al-Qolam
        </p>
        <img
          width="250rem"
          alt="..."
          className="rounded float-right"
          src={books}
        ></img>
      </div>
    );
  }

  const defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ];

  function createdFormatter(cell, row) {
    console.log("user_id", row.user_id);
    if (row.user_id === userId) {
      return <span className="font-weight-bold">Saya</span>;
    }

    return <span>{cell}</span>;
  }

  function tingkatFormatter(cell, row) {
    if (row.tingkatan) {
      return (
        <span
          className={` badge mt-2 ${
            cell === "mudah"
              ? "badge-success"
              : cell === "menengah"
              ? "badge-warning"
              : "badge-danger"
          }`}
        >
          {cell}
        </span>
      );
    }

    return <span>{cell}</span>;
  }

  function statusFormatter(cell, row) {
    let valuechange = cell;
    console.log(valuechange);

    async function changeStatus(id) {
      if (valuechange === 1) {
        valuechange = 2;
      } else {
        valuechange = 1;
      }
      // e.preventDefault();
      console.log(valuechange, id);
      swal({
        title: "Mengubah Status Kelas",
        text: "Apakah Kamu Yakin Untuk Mengubah Status Kelas?",
        icon: "warning",
        buttons: true,

        dangerMode: true,
      }).then((change) => {
        if (change) {
          axios({
            method: "put",
            url: `${API_URL}/lessons/${id}`,
            data: {
              pelajaran: row.pelajaran,
              tingkatan: row.tingkatan,
              deskripsi: row.deskripsi,
              guru: row.guru,
              is_active: valuechange,
            },
          })
            .then(() => {
              valuechange = cell;
              // alert.success(
              //   <div className="notif">Berhasil mengubah status Kelas</div>
              // );
              fetchData();
            })
            .catch(function (error) {
              // alert.error(
              //   <div className="notif">
              //     Gagal mengubah status Kelas Silahkan Coba Lagi
              //   </div>
              // );
              console.log(error.response);
              fetchData();
            });
        }
      });
    }
    return (
      <Switch
        value={valuechange === 1 ? true : false}
        onColor="success"
        offColor="DANGER"
        readonly={userId === row.user_id ? false : true}
        defaultValue={valuechange === 1 ? true : false}
        name="isActive"
        onChange={() => changeStatus(row.id)}
      />
    );
    // return <span>{cell}</span>;
  }

  function onTop() {
    window.scrollTo(0, 0);
  }

  // function quizFormatter(cell, row) {
  //   if (row.chapter.quiz.length === 0) {
  //     return <span>-</span>;
  //   }

  //   return <span>{cell}</span>;
  // }

  function chapterFormatter(cell, row) {
    if (row.chapter.length === 0) {
      return <span>-</span>;
    }

    return <span>{cell}</span>;
  }

  const columns = [
    {
      dataField: "nama_pelajaran",
      text: "Nama Kelas",
      sort: true,
    },

    {
      dataField: "guru",
      text: "Dibuat Oleh",
      sort: true,
      align: "center",
      headerAlign: "center",
      formatter: createdFormatter,
    },
    {
      dataField: "chapter.length",
      text: "Jumlah Materi",
      sort: true,
      align: "center",
      headerAlign: "center",
      formatter: chapterFormatter,
    },
    // {
    //   dataField: "quiz.length",
    //   text: "Jumlah Soal",
    //   sort: true,
    //   align: "center",
    //   headerAlign: "center",
    //   formatter: chapterFormatter,
    // },
    {
      dataField: "tingkatan",
      text: "Tingkat Kesulitan",
      sort: true,
      headerStyle: () => {
        return { width: "17%" };
      },
      align: "center",
      headerAlign: "center",
      formatter: tingkatFormatter,
    },
    // {
    //   dataField: "is_active",
    //   text: "Status",
    //   sort: true,
    //   headerStyle: () => {
    //     return { width: "10%" };
    //   },
    //   align: "center",
    //   headerAlign: "center",
    //   formatter: statusFormatter,
    // },
    {
      dataField: "link",
      text: "Aksi",
      align: "center",
      headerAlign: "center",
      headerStyle: () => {
        return { width: "30%" };
      },
      formatter: (rowContent, row) => {
        return (
          <>
            <div className="td-actions text-center">
              <Link to={`/detail-kelas/${row.id}`} onClick={onTop}>
                <button
                  type="button"
                  rel="tooltip"
                  className="btn btn-info btn-xs"
                >
                  <i className="now-ui-icons travel_info"></i> Detail Kelas
                </button>
              </Link>
              {/* {row.user_id === userId || roleUser === "admin" ? (
                <Link to={`/create-chapter/${row.id}`}>
                  <button
                    type="button"
                    rel="tooltip"
                    className="btn btn-success"
                  >
                    <i className="now-ui-icons  ui-1_simple-add"></i> Buat
                    Materi
                  </button>
                </Link>
              ) : (
                <></>
              )} */}
              {row.user_id === userId || roleUser === "admin" ? (
                <>
                  <button
                    type="button"
                    rel="tooltip"
                    className="ms-2 btn btn-danger"
                    onClick={() => deleteLesson(row.id)}
                  >
                    <i className="now-ui-icons ui-1_simple-remove"></i> Hapus
                    Kelas
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </>
        );
      },
    },
  ];

  const [pelajaran, setPelajaran] = useState("");
  const [kesulitan, setKesulitan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [detailL, setDetailL] = useState([]);
  const [loadSub, setLoadSub] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [idEdit, setIdEdit] = useState(0);
  // const alert = useAlert();

  function detailEdit(detailId) {
    axios
      .get(`${API_URL}/lessons/${detailId}`, {})
      .then((response) => {
        setLoad(false);
        setDetailL(response.data);
        setPelajaran(response.data.pelajaran);
        setKesulitan(response.data.tingkatan);
        setDeskripsi(response.data.deskripsi);
        setIsActive(response.data.is_active);
        console.log("success");
      })
      .catch((error) => {
        let message = error.response;
        console.log(message);
      });
  }

  const rowEvents = {
    onClick: (e, row) => {
      setDetailL("");
      setPelajaran("");
      setKesulitan("");
      setDeskripsi("");
      setIdEdit(0);
      setIdEdit(row.id);
      detailEdit(row.id);
    },
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setLoad(true);

    axios({
      method: "put",
      url: `${API_URL}/lessons/${idEdit}`,
      data: {
        pelajaran: pelajaran,
        tingkatan: kesulitan,
        deskripsi: deskripsi,
        guru: userName,
        is_active: isActive,
      },
    })
      .then(function (response) {
        setLoadSub(false);
        // alert.success(<div className="notif">Berhasil mengedit Kelas!</div>);
        //handle success
        console.log(response);
      })
      .then(() => {
        fetchData();
      })
      .catch(function (error) {
        setLoadSub(false);
        // alert.error(
        //   <div className="notif">Gagal mengedit Kelas Silahkan Coba Lagi</div>
        // );
        console.log(error.response);
        fetchData();
      });

    e.preventDefault();
  };

  const expandRow = {
    onlyOneExpanding: true,
    renderer: (row) =>
      row.user_id === userId ? (
        <div className="container mt-2">
          <h2>
            Edit Kelas{" "}
            {detailL?.pelajaran === undefined ? (
              <span className="text-secondary">Memuat...</span>
            ) : (
              detailL.pelajaran
            )}
          </h2>
          <hr />
          <Form className="form" onSubmit={handleSubmitEdit}>
            <Row>
              <Col lg="5" sm="10">
                <FormGroup>
                  <Label>Nama Kelas</Label>
                  <Input
                    defaultValue={detailL?.pelajaran}
                    placeholder="Nama Kelas"
                    type="text"
                    name="namaKelas"
                    disabled={detailL?.pelajaran === undefined ? true : false}
                    onInput={(e) => setPelajaran(e.target.value)}
                  ></Input>
                </FormGroup>
              </Col>
              <Label>Tingkat Kesulitan : </Label>
              <Row className="mt-4">
                <FormGroup check className="form-check-radio ">
                  <Label check>
                    <Input
                      defaultValue={detailL?.kesulitan}
                      type="radio"
                      label="mudah"
                      checked={kesulitan === "mudah"}
                      onClick={() => setKesulitan("mudah")}
                    ></Input>
                    <span className="form-check-sign "></span>
                    Mudah
                  </Label>
                </FormGroup>
                <FormGroup check className="form-check-radio ml-2">
                  <Label check>
                    <Input
                      defaultChecked
                      defaultValue={detailL?.kesulitan}
                      type="radio"
                      label="menengah"
                      checked={kesulitan === "menengah"}
                      onClick={() => setKesulitan("menengah")}
                    ></Input>
                    <span className="form-check-sign"></span>
                    Menengah
                  </Label>
                </FormGroup>
                <FormGroup check className="form-check-radio ml-2">
                  <Label check>
                    <Input
                      defaultChecked
                      defaultValue={detailL?.kesulitan}
                      name="level"
                      type="radio"
                      label="sulit"
                      checked={kesulitan === "sulit"}
                      onClick={() => setKesulitan("sulit")}
                    ></Input>
                    <span className="form-check-sign"></span>
                    Sulit
                  </Label>
                </FormGroup>
              </Row>
            </Row>
            <Col>
              <FormGroup>
                <Label>Deskripsi Kelas</Label>
                <textarea
                  defaultValue={detailL?.deskripsi}
                  name="deskripsi"
                  disabled={detailL?.pelajaran === undefined ? true : false}
                  onInput={(e) => setDeskripsi(e.target.value)}
                  className="form-control"
                  rows="5"
                ></textarea>
              </FormGroup>
            </Col>
            <div>
              {loadSub === true ? (
                <div className="float-right">
                  <Spinner></Spinner>
                </div>
              ) : (
                <Button
                  className="btn-round float-right"
                  color="info"
                  size="md"
                  disabled={detailL?.pelajaran === undefined ? true : false}
                >
                  Submit
                </Button>
              )}
            </div>
          </Form>
        </div>
      ) : (
        <span className="text-danger">Hanya Bisa Mengedit Kelas Anda</span>
      ),
  };

  React.useEffect(() => {
    setLoad(true);
    if (roleUser === "admin") {
      setTypeList("AllClass");
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="section section-tabs" id={"section1"}>
        <Container fluid="sm" className="m-5">
          <ToolkitProvider
            bootstrap4
            keyField="id"
            data={typeList === "MyClass" ? myClass : listTable}
            columns={columns}
            defaultSorted={defaultSorted}
            search
          >
            {(props) => (
              <div>
                <Row>
                  <Col>
                    {(() => {
                      // eslint-disable-next-line
                      switch (typeList) {
                        case "AllClass":
                          return <h2>Daftar Kelas</h2>;
                        case "MyClass":
                          return <h2>Daftar Kelas Saya</h2>;
                      }
                    })()}
                    {roleUser === "admin" ? (
                      <></>
                    ) : (
                      <ButtonGroup>
                        <button
                          title="Daftar Kelas Saya"
                          type="button"
                          className={`btn ${
                            typeList === "AllClass"
                              ? "btn-outline-info"
                              : "btn-info"
                          }`}
                          onClick={(e) => setTypeList("MyClass")}
                        >
                          <img
                            width="25rem"
                            src={
                              typeList === "MyClass"
                                ? "./my-list-active.png"
                                : "./my-list.png"
                            }
                            alt="..."
                          />
                        </button>
                        <button
                          title="Daftar Semua Kelas"
                          type="button"
                          className={`btn ${
                            typeList === "AllClass"
                              ? "btn-info"
                              : "btn-outline-info"
                          }`}
                          onClick={(e) => setTypeList("AllClass")}
                        >
                          <img
                            width="25rem"
                            src={
                              typeList === "AllClass"
                                ? "./group-list-active.png"
                                : "./group-list.png"
                            }
                            alt="..."
                          />
                        </button>
                      </ButtonGroup>
                    )}

                    <span className="ml-2">Cari : </span>
                    <SearchBar
                      {...props.searchProps}
                      className="bg-white"
                      placeholder="Search .."
                    />
                    <span className="ml-2 font-weight-bold">
                      Klik Tabel 2x Untuk Mengedit Kelas
                    </span>
                    {roleUser === "admin" ? (
                      <></>
                    ) : (
                      <>
                        <Link to="/create-lesson">
                          <Button color="info" className="float-right">
                            <i className="now-ui-icons ui-1_simple-add"></i>{" "}
                            Buat Kelas
                          </Button>
                        </Link>
                      </>
                    )}
                  </Col>
                </Row>

                {load === false ? (
                  <BootstrapTable
                    hover
                    bordered={false}
                    expandRow={expandRow}
                    rowEvents={rowEvents}
                    {...props.baseProps}
                    pagination={paginationFactory(options)}
                    noDataIndication={
                      typeList === "MyClass" ? myDataEmpty : allDataEmpty
                    }
                    wrapperClasses="table-responsive"
                  />
                ) : (
                  <BootstrapCardDataTable />
                )}
              </div>
            )}
          </ToolkitProvider>
        </Container>
      </div>
    </>
  );
};

export default ManageLesson;
