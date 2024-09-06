import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Label,
  FormGroup,
  Container,
  Row,
  Col,
  Button,
  Spinner,
} from "reactstrap";
import { API_URL } from "../../../utils/constants";
import { useAlert } from "react-alert";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../utils/BackComponent";

export default function CreateQuiz({ user }) {
  const alert = useAlert();
  let { chapterId } = useParams();
  const navigate = useNavigate();

  const [chapterName, setChapterName] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      answers: [
        { answerText: "", isCorrect: "true" },
        { answerText: "", isCorrect: "false" },
        { answerText: "", isCorrect: "false" },
      ],
    },
  ]);

  const [loadSub, setLoadSub] = useState(false);
  const { register, handleSubmit, setValue, getValues } = useForm();

  async function fetchChapterName() {
    axios
      .get(`${API_URL}/chapter/${chapterId}`)
      .then((response) => {
        setChapterName(response.data.name);
      })
      .catch((error) => {
        console.log("Error fetching chapter name:", error.response);
      });
  }

  React.useEffect(() => {
    fetchChapterName();
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        answers: [
          { answerText: "", isCorrect: "true" },
          { answerText: "", isCorrect: "false" },
          { answerText: "", isCorrect: "false" },
        ],
      },
    ]);
  };

  const onSubmit = (data) => {
    console.log("Form data on submit:", data); // Log the entire form data

    setLoadSub(true);

    // Map over questions to structure the data
    const allQuestions = questions.map((q, index) => {
      return {
        question_text: data.questions[index]?.questionText,
        answers: [
          {
            answerText: data.questions[index].answers[0]?.answerText,
            isCorrect: "true",
          },
          {
            answerText: data.questions[index].answers[1]?.answerText,
            isCorrect: "false",
          },
          {
            answerText: data.questions[index].answers[2]?.answerText,
            isCorrect: "false",
          },
        ],
      };
    });

    console.log("All Questions to be submitted:", allQuestions); // Log the structured data

    // Convert the `allQuestions` array to a string
    const stringifiedQuestions = JSON.stringify(allQuestions);
    console.log("Stringified Questions:", stringifiedQuestions); // Log the stringified version

    // Prepare the payload, with the `questions` field as a string
    const requestData = {
      user_id: user.id,
      chapter_id: chapterId,
      questions: stringifiedQuestions, // Now a string, not an object
    };

    console.log("Payload being sent to API:", requestData); // Log the payload

    axios({
      method: "post",
      url: `${API_URL}/quiz`,
      data: requestData, // Send the payload with questions as a string
    })
      .then(function (response) {
        console.log("Success response:", response); // Log successful response
        setLoadSub(false);
        alert.success(<div className="notif">Berhasil membuat Soal Quiz!</div>);
        // goback
        navigate(-1);
      })
      .catch(function (error) {
        console.log("Error submitting quiz:", error.response); // Log error response from server
        setLoadSub(false);
      });
  };

  const handleEditorChange = (data, index) => {
    console.log("Editor change for question", index, ":", data); // Log the CKEditor change
    const values = getValues();
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, questionText: data } : q))
    );
    setValue(`questions[${index}].questionText`, data); // Manually set form value
  };

  return (
    <div className="section">
      <Container>
        <BackButton />
        <h2>
          Buat Soal untuk Quiz <b>{chapterName}</b>
        </h2>
        <hr />
        <form className="form" onSubmit={handleSubmit(onSubmit)} id="idForm">
          <Row>
            <Col lg="7" sm="10">
              {questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                  <FormGroup>
                    <Label>Soal Quiz {questionIndex + 1}</Label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={question.questionText}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        handleEditorChange(data, questionIndex);
                      }}
                    />
                  </FormGroup>

                  {question.answers.map((answer, answerIndex) => {
                    const fieldName = `questions[${questionIndex}].answers[${answerIndex}]`;
                    return (
                      <fieldset name={fieldName} key={answerIndex}>
                        <FormGroup>
                          <Label
                            className={
                              answerIndex === 0 ? "text-success" : "text-danger"
                            }
                          >
                            {answerIndex === 0
                              ? "Isi Jawaban Benar"
                              : `Isi Jawaban Salah ${answerIndex}`}
                          </Label>
                          <input
                            type="text"
                            defaultValue={answer.answerText}
                            className="form-control"
                            {...register(`${fieldName}.answerText`, {
                              required: true,
                            })}
                          />
                        </FormGroup>
                        <input
                          hidden
                          defaultValue={answer.isCorrect}
                          {...register(`${fieldName}.isCorrect`, {
                            required: true,
                          })}
                        />
                      </fieldset>
                    );
                  })}
                </div>
              ))}

              <Button color="primary" type="button" onClick={addQuestion}>
                + Tambah Soal
              </Button>

              {loadSub ? (
                <Spinner className="float-right" />
              ) : (
                <Button type="submit" color="info" className="float-right">
                  Submit
                </Button>
              )}
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  );
}
