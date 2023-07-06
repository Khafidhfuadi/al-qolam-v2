import DetailHeader from "../../components/Headers/DetailHeader";
import React, { useState } from "react";
import axios from "axios";
// reactstrap components
import {
  Button,
  Label,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import Spinner from "reactstrap/lib/Spinner";
import { API_URL } from "../../utils/constants";
import { useAlert } from "react-alert";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import BackButton from "../../utils/BackComponent";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateSubject({ user }) {
  let { chapterId } = useParams();
  const alert = useAlert();
  // const { token, userId } = props;
  const userId = user.id;

  const navigate = useNavigate();
  const [SubjectTitle, setSubjectTitle] = useState();
  const [subject, setSubject] = useState();
  const [chapterName, setChapterName] = useState("");
  const [listLesson, setListLesson] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  // eslint-disable-next-line
  const [load, setLoad] = useState(false);

  async function fetchData() {
    axios
      .get(`${API_URL}/chapter/${chapterId}`, {})
      .then((response) => {
        setLoad(false);
        // setListLesson(response.data);
        setChapterName(response.data.name);
        console.log(response.data);
      })
      .catch((error) => {
        let message = error;
        console.log("error", message);
      });
  }

  React.useEffect(() => {
    setLoad(true);
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoggedIn(true);

    if (chapterId === "") {
      setLoggedIn(false);
      return alert.error(
        <div className="notif">Pilih Kelas Terlebih Dahulu</div>
      );
    }

    axios({
      method: "post",
      url: `${API_URL}/subject`,
      data: {
        name: SubjectTitle,
        subject_content: subject,
        chapter_id: chapterId,
        user_id: userId,
      },
    })
      .then(function (response) {
        setLoggedIn(false);
        alert.success(<div className="notif">Berhasil membuat Bab!</div>);

        navigate(-1);
        //handle success
      })
      .catch(function (response) {
        setLoggedIn(false);
        alert.error(
          <div className="notif">Gagal membuat Bab Silahkan Coba Lagi</div>
        );
        console.log(response);
      });
  };

  return (
    <>
      <DetailHeader
        header="Buat subject"
        subHeader="buat subject yang anda inginkan sekarang!"
        img={require("../../assets/img/my-babex.jpg")}
      />
      <div className="section ">
        <Container>
          <br />
          <div className="mt-2">
            <BackButton />
            <h2>
              Buat Subject di <b>Bab {chapterName}</b>{" "}
            </h2>
            <hr />
            <form action="post" onSubmit={handleSubmit}>
              <Row>
                <Col lg="5" sm="10">
                  <FormGroup>
                    <Label>Judul Subject</Label>
                    <Input
                      required
                      placeholder="Judul Subject"
                      type="text"
                      onInput={(e) => setSubjectTitle(e.target.value)}
                    ></Input>
                  </FormGroup>
                </Col>
              </Row>
              <Col>
                <FormGroup>
                  <Label>Isi Subject</Label>
                  <CKEditor
                    required
                    editor={ClassicEditor}
                    data={subject}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setSubject(data);
                    }}
                  />
                </FormGroup>
              </Col>

              <div>
                {loggedIn === true ? (
                  <div className="float-right">
                    <Spinner></Spinner>
                  </div>
                ) : (
                  <Button
                    className="btn-round float-right"
                    color="info"
                    // onClick={(e) => e.preventDefault()}
                    size="md"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Container>
      </div>
    </>
  );
}
