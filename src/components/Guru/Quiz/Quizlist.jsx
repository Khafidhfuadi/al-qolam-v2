import React, { useState } from "react";
import { Container, Form, FormGroup, Label, Spinner, Button } from "reactstrap";
import IndexNavbar from "../../Nav/IndexNavbar";
import { API_URL } from "../../../utils/constants";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BulletList } from "react-content-loader";
import DetailHeader from "../../Headers/DetailHeader";
import swal from "sweetalert";
import BackButton from "../../../utils/BackComponent";
import { useForm } from "react-hook-form";
// import { useAlert } from "react-alert";
import ReactHtmlParser from "html-react-parser";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const MyBulletListLoader = () => <BulletList />;

const QuizList = ({ user }) => {
  // const alert = useAlert();
  let { id } = useParams();
  let [quizL, setQuizList] = React.useState([]);
  const [load, setLoad] = useState(true);
  const [loadSub, setLoadSub] = useState(false);
  const [change, setChange] = useState("list");
  const [singleQ, setSingleQ] = useState([]);
  const [listNum, setListNum] = useState(0);
  const [indexes, setIndexes] = React.useState([]);

  const idUser = user.id;

  async function fetchData() {
    axios
      .get(`${API_URL}/quiz?cari=${id}`)
      .then((response) => {
        setLoad(false);
        setQuizList(response.data.data);
        console.log(response.data.data);
      })
      .catch((response) => {
        console.log("errorQ", response);
      });
  }

  function editData(idEdit) {
    console.log("idEdit", idEdit);
    axios
      .get(`${API_URL}/quiz/${idEdit}`)
      .then((response) => {
        setLoad(false);
        setSingleQ(response.data);
        setIndexes(JSON.parse(response.data.answer_options).list);
        console.log("data single", singleQ);
      })
      .catch((response) => {
        console.log("errorQ", response);
      });
  }

  React.useEffect(() => {
    setLoad(true);
    fetchData();

    // eslint-disable-next-line
  }, [id]);

  const [idEdit, setIdEdit] = React.useState(0);
  const { register, handleSubmit } = useForm();

  const [questionQ, setQuestionQ] = React.useState("");
  if (questionQ === "") {
    if (singleQ?.question_text !== undefined) {
      setQuestionQ(singleQ?.question_text);
    }
  }

  const onSubmit = (data) => {
    setLoadSub(true);

    let jsonAns = JSON.stringify(data);

    // console.log("indexes", indexes);
    // console.log("jhs", data);

    if (indexes.length < 2) {
      setLoadSub(false);

      // alert.error(<div className="notif">Isi Opsi Jawaban Minimal 2</div>);
      return false;
    } else if (
      data.list[0]?.answerText === "" ||
      data.list[1]?.answerText === "" ||
      data.list[2]?.answerText === ""
    ) {
      setLoadSub(false);

      // alert.error(<div className="notif">Isi Bagian Yang Kosong!</div>);
      return false;
    } else if (
      data.list[0]?.isCorrect === "" ||
      data.list[1]?.isCorrect === "" ||
      data.list[2]?.isCorrect === ""
    ) {
      setLoadSub(false);

      // alert.error(
      //   <div className="notif">Pilih Jawaban Yang Benar dan salah!</div>
      // );
      return false;
    }

    axios({
      method: "put",
      url: `${API_URL}/quiz/${idEdit}`,
      data: {
        user_id: singleQ?.user_id,
        chapter_id: singleQ?.chapter_id,
        question_text: questionQ,
        answer_options: jsonAns,
      },
    })
      .then(function (response) {
        setLoadSub(false);
        // alert.success(
        //   <div className="notif">Berhasil mengedit Soal Quiz!</div>
        // );
        //handle success
        // unset
        setSingleQ([]);
        setIndexes([]);
        setChange("list");
        fetchData();

        console.log(response);
      })
      .catch(function (error) {
        setLoad(false);
        setSingleQ([]);
        setIndexes([]);
        setChange("list");
        // alert.error(<div className="notif">Gagal mengedit Soal Quiz</div>);
        console.log(error.response);
      });
  };

  async function deleteQ(id) {
    // e.preventDefault();
    swal({
      title: "Menghapus Soal",
      text: "Apakah Kamu Yakin Untuk Menghapus Soal Ini?",
      icon: "warning",
      buttons: true,

      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${API_URL}/quiz/${id}`, {})
          .then((res) => {
            swal({
              title: "Berhasil!",
              text: "Soal Ujian Terhapus!",
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
              text: "Gagal Menghapus Soal Ujian, Silahkan Coba Lagi",
              icon: "error",
              timer: 2000,
              button: false,
            });
          });
      }
    });
  }
  return (
    <div>
      <IndexNavbar />
      <div className="wrapper allButFooter">
        <DetailHeader
          header={
            load === false
              ? quizL[0]?.Chapter.name === undefined
                ? "Daftar Soal Ujian"
                : "Daftar Soal Ujian " + quizL[0]?.Chapter.name
              : undefined
          }
          subHeader={
            quizL?.length === 0
              ? "Soal Tidak Tersedia Di Kelas Ini"
              : quizL?.length + " Soal Tersedia Di Kelas Ini"
          }
          img={require("../../../assets/img/quizlist.jpg")}
        />
        <Container className="mt-4">
          <BackButton />
          <Link className="ml-2" to={`/create-question/${id}`}>
            <Button color="info" className="float-right">
              <i className="now-ui-icons ui-1_simple-add"></i> Buat Soal
            </Button>
          </Link>
          <Link className="ml-2" to={`/quiz/${id}`}>
            <Button color="info" className="float-right">
              Mulai Ujian
            </Button>
          </Link>
          {load === false ? (
            quizL?.length === 0 ? (
              <div className="container">
                <p className=" font-weight-bold text-dark">
                  Pengajar Belum Membuat Soal Apapun Untuk Saat Ini.
                </p>
                <div
                  className={
                    idUser === quizL[0]?.user_id
                      ? "d-flex justify-content-between"
                      : "d-flex justify-content-end"
                  }
                >
                  <img
                    width="250rem"
                    alt="..."
                    src={require("../../../assets/img/books.png")}
                  ></img>
                </div>
              </div>
            ) : change === "list" ? (
              quizL?.map((list, index) => {
                return (
                  <div className="card rounded" key={index}>
                    <div className="card-body">
                      <div className="row">
                        <div className="col d-inline">
                          <h4 className="font-weight-bold">
                            Soal Ke - {index + 1} <hr />
                          </h4>
                          {list?.user_id === idUser ? (
                            <div className="float-end">
                              <Button
                                onClick={() => {
                                  editData(list?.id);
                                  setIdEdit(list?.id);
                                  setListNum(index);
                                  setChange("editForm");
                                }}
                                color="primary"
                                className="float-right"
                              >
                                Edit Soal Ini
                              </Button>
                              <Button
                                onClick={() => deleteQ(list.id)}
                                color="danger"
                                className="float-right"
                              >
                                Hapus Soal Ini
                              </Button>
                            </div>
                          ) : (
                            <></>
                          )}
                          <h5 className="font-weight-bold">Soal Quiz : </h5>
                          <span>{ReactHtmlParser(list?.question_text)}</span>
                          <h5 className="font-weight-bold">Opsi Jawaban : </h5>

                          <ul>
                            {JSON.parse(list?.answer_options).list?.map(
                              (data, index) => {
                                return (
                                  <li key={index}>
                                    {data?.answerText}
                                    <span>
                                      {data?.isCorrect === "true"
                                        ? " ✔️"
                                        : " ❌"}
                                    </span>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <>
                <div className="card rounded">
                  <div className="card-body">
                    <div className="row">
                      <div className="col d-inline">
                        <h4 className="font-weight-bold">
                          Edit Soal Ke - {listNum + 1}
                        </h4>
                        {singleQ?.question_text === undefined ? (
                          <h4 className="text-secondary">Memuat...</h4>
                        ) : (
                          <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup className="font-weight-bold">
                              <Label>Soal Quiz</Label>
                              <CKEditor
                                required
                                className="font-weight-bold"
                                editor={ClassicEditor}
                                data={singleQ?.question_text}
                                defaultValue={singleQ?.question_text}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  setQuestionQ(data);
                                }}
                              />
                            </FormGroup>

                            <label className="font-weight-bold">
                              Opsi Jawaban :{" "}
                            </label>
                            <br />
                            {indexes.map((data, index) => {
                              const fieldName = `list[${index}]`;
                              return (
                                <fieldset name={fieldName} key={index}>
                                  <FormGroup>
                                    {" "}
                                    <label
                                      className={
                                        fieldName === "list[0]"
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {fieldName === "list[0]"
                                        ? "Isi Jawaban Benar"
                                        : "Isi Jawaban Salah"}
                                    </label>
                                    <input
                                      type="text"
                                      defaultValue={data.answerText}
                                      className="form-control"
                                      {...register(`${fieldName}.answerText`, {
                                        required: true,
                                      })}
                                    />
                                  </FormGroup>
                                  <input
                                    hidden
                                    defaultValue={data.isCorrect}
                                    {...register(`${fieldName}.isCorrect`, {
                                      required: true,
                                    })}
                                  />
                                </fieldset>
                              );
                            })}
                            <Button
                              onClick={() => {
                                setSingleQ([]);
                                setIndexes([]);
                                setChange("list");
                              }}
                              color="secondary"
                              className="float-left"
                            >
                              Batal Edit
                            </Button>
                            {loadSub === true ? (
                              <Spinner className="float-right"></Spinner>
                            ) : (
                              <button
                                type="submit"
                                className="btn btn-success float-right"
                              >
                                Submit
                              </button>
                            )}
                          </Form>
                        )}
                        {singleQ?.question_text === undefined ? (
                          <Button
                            onClick={() => {
                              setSingleQ([]);
                              setIndexes([]);
                              setChange("list");
                            }}
                            color="danger"
                            className="float-left"
                          >
                            Batal Edit
                          </Button>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          ) : (
            <MyBulletListLoader />
          )}
        </Container>
      </div>
    </div>
  );
};

export default QuizList;
