import DetailHeader from "../../Headers/DetailHeader";
import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

// reactstrap components
import {
  Label,
  FormGroup,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Spinner from "reactstrap/lib/Spinner";
import { API_URL } from "../../../utils/constants";
// import { useAlert } from "react-alert";
// import TransparentFooter from "components/Footers/TransparentFooter";
import BackButton from "../../../utils/BackComponent";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useParams } from "react-router-dom";
import ExamplesNavbar from "../../Nav/ExampleNavbar";

export default function CreateQuiz({ user }) {
  // const alert = useAlert();
  // const { token, userId } = props;
  let { chapterId } = useParams();

  const [valButton, setValB] = useState("Pilih Kelas");
  const [chapterName, setChapterName] = useState([]);
  // const [pelajaran, setPel] = useState("");
  // const [lessonId, setLessonId] = useState("");
  const [questionQ, setQuestionQ] = useState("");

  // const [listQuiz, setListQuiz] = useState();
  const [load, setLoad] = useState(false);
  const [loadSub, setLoadSub] = useState(false);

  async function fetchChapterName() {
    axios
      .get(`${API_URL}/chapter/${chapterId}`)
      .then((response) => {
        setChapterName(response.data.name);
        console.log("chapter name", response.data.name);
        setIndexes([
          { answerText: "", isCorrect: "true" },
          { answerText: "", isCorrect: "false" },
          { answerText: "", isCorrect: "false" },
        ]);
        setLoad(false);
      })
      .catch((error) => {
        let message = error.response;
        console.log(message);
      });
  }

  React.useEffect(() => {
    setLoad(true);
    fetchChapterName();
    // eslint-disable-next-line
  }, []);

  const [indexes, setIndexes] = React.useState([]);
  const { register, handleSubmit } = useForm();

  // console.log("handleSubmit", handleSubmit);
  console.log("index", indexes);

  const onSubmit = (data) => {
    setLoadSub(true);
    console.log("data", data);

    let jsonAns = JSON.stringify(data);

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
    }

    axios({
      method: "post",
      url: `${API_URL}/quiz`,
      data: {
        user_id: user.id,
        chapter_id: chapterId,
        question_text: questionQ,
        answer_options: jsonAns,
      },
    })
      .then(function (response) {
        setLoadSub(false);
        // alert.success(<div className="notif">Berhasil membuat Soal Quiz!</div>);
        //handle success
        fetchChapterName();
      })
      .then(() => {
        document.getElementById("idForm").reset();
      })
      .catch(function (error) {
        setLoadSub(false);

        // alert.error(<div className="notif">Gagal membuat Soal Quiz</div>);
        console.log(error.response);
      });
  };

  return (
    <>
      {/* <DetailHeader
        header={`Buat Quiz ${chapterName}`}
        subHeader="Buat Quiz sekarang!"
        img={require("../../../assets/img/my-babex.jpg")}
      /> */}
      {/* <ExamplesNavbar /> */}
      <div className="section ">
        <Container>
          <br />
          <div className="mt-2">
            <BackButton />
            <h2>
              Buat Soal untuk Quiz <b> {chapterName}</b>
            </h2>
            <hr />
            <form
              className="form"
              onSubmit={handleSubmit(onSubmit)}
              id="idForm"
            >
              <Row>
                <Col lg="7" sm="10">
                  <FormGroup className="font-weight-bold">
                    <Label>Soal Quiz</Label>
                    <CKEditor
                      required
                      className="font-weight-bold"
                      editor={ClassicEditor}
                      data={questionQ}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setQuestionQ(data);
                      }}
                    />
                  </FormGroup>
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

                  {loadSub === true ? (
                    <div>
                      <Spinner className="float-right"></Spinner>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-info btn-round float-right"
                    >
                      Submit
                    </button>
                  )}
                </Col>
              </Row>
            </form>
          </div>
        </Container>
      </div>
    </>
  );
}
