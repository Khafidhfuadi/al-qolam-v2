import React, { useState } from "react";
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Button,
  Spinner,
} from "reactstrap";
import axios from "axios";
import { API_URL } from "../../utils/constants";
// import { useAlert } from "react-alert";

export function ChangePassForm() {
  const [newPass, setNewPass] = useState(6);
  const [oldPass, setOldPass] = useState(6);
  const [confPass, setConfPass] = useState(6);
  const [load, setLoad] = useState(false);
  // const alert = useAlert();
  const [typeInput, setTypeInput] = useState("pw");

  const handleS = async (e) => {
    e.preventDefault();

    if (newPass.length < 6) {
      return false;
    } else if (confPass !== newPass) {
      return false;
    }
    setLoad(true);
    const user = localStorage.getItem("user");

    axios({
      method: "post",
      url: `${API_URL}change-password`,
      data: {
        user_id: user.id,
        old_password: oldPass,
        new_password: newPass,
        confirm_password: confPass,
      },
    })
      .then(function (response) {
        setLoad(false);
        // alert.success(<div className="notif">Berhasil Mengubah Password!</div>);

        //handle success
        console.log(response);
      })
      .catch(function (error) {
        setLoad(false);
        // alert.error(<div className="notif">{error.response.data.message}</div>);
      });

    e.preventDefault();
  };

  function pwToggle() {
    if (typeInput === "text") {
      setTypeInput("pw");
    } else {
      setTypeInput("text");
    }
  }
  return (
    <div clasName="mt-2">
      <h2>Ubah Password</h2>
      <hr />
      <Form className="form" onSubmit={handleS}>
        <Row>
          <Col lg="5" sm="10">
            <FormGroup>
              <Label>Password Lama</Label>
              <Input
                placeholder="Konfirmasi Password"
                type={typeInput === "text" ? "text" : "password"}
                onInput={(e) => setOldPass(e.target.value)}
                required
              ></Input>
            </FormGroup>
          </Col>
          <Col lg="5" sm="10">
            <FormGroup>
              <Label>Password Baru</Label>
              <Input
                placeholder="Password"
                type={typeInput === "text" ? "text" : "password"}
                onInput={(e) => setNewPass(e.target.value)}
                required
              ></Input>
            </FormGroup>
          </Col>
          <Col lg="5" sm="10">
            <FormGroup>
              <Label>Konfirmasi Password Baru</Label>
              <Input
                placeholder="Konfirmasi Password"
                type={typeInput === "text" ? "text" : "password"}
                onInput={(e) => setConfPass(e.target.value)}
                required
              ></Input>
            </FormGroup>
            {newPass?.length < 6 ? (
              <h6 className="text-lowercase text-danger font-weight-normal">
                Password Baru harus lebih dari 6 karakter
              </h6>
            ) : oldPass !== confPass ? (
              <h6 className="text-lowercase text-danger font-weight-normal">
                Password dan Konfirmasi Password Tidak Cocok
              </h6>
            ) : (
              ""
            )}
          </Col>
          <Col>
            <Button
              color="success"
              onClick={pwToggle}
              className="mt-4  btn-round"
            >
              {typeInput === "pw"
                ? "Tampilkan Password"
                : "Sembunyikan Password"}
            </Button>
          </Col>
        </Row>

        <div>
          {load === true ? (
            <div className="text-right">
              <Spinner></Spinner>
            </div>
          ) : (
            <div className="text-right">
              <Button className="btn-round" color="info" size="md">
                Submit
              </Button>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}
