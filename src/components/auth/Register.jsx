import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/constants";
import ExamplesNavbar from "../Nav/ExampleNavbar";
import header2 from "../../assets/img/header2.jpg";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  Input,
  InputGroup,
  Container,
  Col,
  Spinner,
} from "reactstrap";

const Register = ({ handleLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("qkjs@ksk.msk");
  const [password, setPassword] = useState(6);
  const [confPass, setConfPass] = useState(6);
  const [loggedIn, setLoggedIn] = useState(false);
  const [typeInput, setTypeInput] = useState("pw");
  const [typeInputC, setTypeInputC] = useState("pw");
  // const alert = useAlert();
  const navigate = useNavigate();

  const required = (value) => {
    if (!value.toString().trim().length) {
      // We can return string or jsx as the 'error' prop for the validated Component
      return "require";
    }
  };

  let bodyFormData = new FormData();
  bodyFormData.set("name", name);
  bodyFormData.set("email", email);
  bodyFormData.set("password", password);
  bodyFormData.set("role", "user");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === "qkjs@ksk.msk") {
      return false;
    }
    if (
      RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email) === false
    ) {
      return false;
    }
    if (password === 6 || confPass === 6) {
      return false;
    }
    if (password !== confPass) {
      return false;
    }
    if (password.length < 6) {
      return false;
    }
    setLoggedIn(true);

    try {
      const data = await register(email, name, password);
      // handleLogin(data);
      // go to home page
      navigate("/login");
    } catch (error) {
      console.error(error);
    }

    // axios({
    //   method: "post",
    //   url: `${API_URL}register`,
    //   data: bodyFormData,
    //   config: { headers: { "Content-Type": "multipart/form-data" } },
    // })
    //   .then(function (response) {
    //     setLoggedIn(false);
    //     alert.success(
    //       <div className="notif">Registrasi Berhasil, silahkan Login</div>
    //     );
    //   })
    //   .then(() => {
    //     document.getElementById("signUpForm").reset();
    //     setName("");
    //     setEmail("qkjs@ksk.msk");
    //   })
    //   .catch(function (error) {
    //     setLoggedIn(false);
    //     console.log(error);
    //     alert.error(<div className="notif">{error.response.data.message}</div>);
    //   });
  };

  React.useEffect(() => {
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("login-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);

  function pwToggle() {
    if (typeInput === "text") {
      setTypeInput("pw");
    } else {
      setTypeInput("text");
    }
  }

  function pwToggleC() {
    if (typeInputC === "text") {
      setTypeInputC("pw");
    } else {
      setTypeInputC("text");
    }
  }

  return (
    <>
      <ExamplesNavbar />

      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + header2 + ")",
          }}
        ></div>
        <div className="row mt-5">
          <Container className="mt-5">
            <Col className="ms-auto me-auto" md="6" xl="4">
              <Card className="card-login card-plain">
                <Form className="form" onSubmit={handleSubmit} id="signUpForm">
                  <CardHeader className="text-center">
                    <h2>Daftar Akun</h2>
                    <h6 className="text-lowercase font-weight-normal">
                      daftar akunmu sekarang juga!
                    </h6>
                  </CardHeader>
                  <CardBody>
                    <InputGroup className={"no-border input-md"}>
                      {/* <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"></i>
                        </InputGroupText>
                      </InputGroupAddon> */}
                      <Input
                        validations={[required]}
                        placeholder="Nama"
                        type="text"
                        onInput={(e) => setName(e.target.value)}
                        autoFocus
                        required
                      ></Input>
                    </InputGroup>
                    <InputGroup className={"no-border input-md"}>
                      <Input
                        validations={[required]}
                        placeholder="Email"
                        type="email"
                        onInput={(e) => setEmail(e.target.value)}
                        autoFocus
                      ></Input>
                    </InputGroup>
                    <InputGroup className={"no-border input-md"}>
                      <Input
                        validations={[required]}
                        placeholder="Password"
                        type={typeInput === "text" ? "text" : "password"}
                        onInput={(e) => setPassword(e.target.value)}
                        autoFocus
                      ></Input>
                      {/* eslint-disable-next-line */}
                      <a className="link aButton mt-2 ml-2" onClick={pwToggle}>
                        <img
                          width="20rem"
                          src={
                            typeInput === "pw"
                              ? "./invisible-white.png"
                              : "./visible-white.png"
                          }
                          alt="..."
                        />
                      </a>
                    </InputGroup>
                    <InputGroup className={"no-border input-md"}>
                      <Input
                        placeholder="Konfirmasi Password"
                        type={typeInputC === "text" ? "text" : "password"}
                        onInput={(e) => setConfPass(e.target.value)}
                        autoFocus
                        required
                      ></Input>
                      {/* eslint-disable-next-line */}
                      <a className="link aButton mt-2 ml-2" onClick={pwToggleC}>
                        <img
                          width="20rem"
                          src={
                            typeInputC === "pw"
                              ? "./invisible-white.png"
                              : "./visible-white.png"
                          }
                          alt="..."
                        />
                      </a>
                    </InputGroup>
                    {RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
                      email
                    ) === false ? (
                      <h6 className="text-lowercase text-danger font-weight-normal">
                        Masukkan email yang valid
                      </h6>
                    ) : password?.length < 6 ? (
                      <h6 className="text-lowercase text-danger font-weight-normal">
                        Password harus lebih dari 6 karakter
                      </h6>
                    ) : password !== confPass ? (
                      <h6 className="text-lowercase text-danger font-weight-normal">
                        Password dan Konfirmasi Password Tidak Cocok
                      </h6>
                    ) : (
                      ""
                    )}
                  </CardBody>
                  <CardFooter className="text-center">
                    {loggedIn === true ? (
                      <Spinner></Spinner>
                    ) : (
                      <Button
                        block
                        type="submit"
                        className="btn-round"
                        color="info"
                        // onClick={(e) => e.preventDefault()}
                        size="md"
                      >
                        Daftar
                      </Button>
                    )}
                    <div>
                      Sudah Punya Akun? <Link to="/login">Login</Link>
                      {/* <a
                        className="link aButton"
                        onClick={navigate("/login")}
                      ></a> */}
                    </div>
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Register;
