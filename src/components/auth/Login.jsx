import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../utils/constants";
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

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [firstFocus, setFirstFocus] = React.useState(false);
  const [typeInput, setTypeInput] = React.useState("pw");
  const [loggedIn, setLoggedIn] = React.useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);
      handleLogin(data);
      // go to home page
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  function pwToggle() {
    if (typeInput === "text") {
      setTypeInput("pw");
    } else {
      setTypeInput("text");
    }
  }

  return (
    <>
      <ExamplesNavbar />

      {/* <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form> */}

      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + header2 + ")",
          }}
        ></div>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" md="6" xl="4">
              <Card className="card-login card-plain">
                <Form
                  action=""
                  className="form"
                  method=""
                  onSubmit={handleSubmit}
                >
                  <CardHeader className="text-center">
                    <h2>Masuk</h2>
                    <h6 className="text-capitalize font-weight-normal">
                      Masuk Untuk Belajar Bahasa Arab Online Gratis!
                    </h6>
                  </CardHeader>
                  <CardBody>
                    <InputGroup
                      className={
                        "no-border input-md" +
                        (firstFocus ? " input-group-focus" : "")
                      }
                    >
                      {/* <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons users_circle-08"></i>
                        </InputGroupText>
                      </InputGroupAddon> */}
                      <Input
                        placeholder="Email"
                        type="email"
                        onInput={(e) => setEmail(e.target.value)}
                        onFocus={() => setFirstFocus(true)}
                        onBlur={() => setFirstFocus(false)}
                        autoFocus
                      ></Input>
                    </InputGroup>
                    <InputGroup className={"no-border input-md"}>
                      {/* <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons ui-1_lock-circle-open"></i>
                        </InputGroupText>
                      </InputGroupAddon> */}
                      <Input
                        placeholder="Password"
                        type={typeInput === "text" ? "text" : "password"}
                        onInput={(e) => setPassword(e.target.value)}
                        // onFocus={() => setLastFocus(true)}
                        // onBlur={() => setLastFocus(false)}
                        required
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
                  </CardBody>
                  <CardFooter className="text-center">
                    {loggedIn === "logging in" ? (
                      <Spinner></Spinner>
                    ) : (
                      <Button
                        block
                        className="btn-round"
                        color="info"
                        // onClick={(e) => e.preventDefault()}
                        size="md"
                      >
                        Masuk
                      </Button>
                    )}
                    <p>
                      Belum punya akun? <Link to="/register">Daftar</Link>
                    </p>
                    {/* <p>
                      <a className="link" href="/forgot-password">
                        Lupa Password ?
                      </a>
                    </p> */}
                    {/* <div className="pull-left"></div>
                    <div className="pull-right">
                      <h6>
                        <a
                          className="link"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          Need Help?
                        </a>
                      </h6>
                    </div> */}
                  </CardFooter>
                </Form>
              </Card>
            </Col>
          </Container>
          {/* <TransparentFooter /> */}
        </div>
      </div>
    </>
  );
};

export default Login;
