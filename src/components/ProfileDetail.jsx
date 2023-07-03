import React, { useState } from "react";

// reactstrap components
import { Container, Label, Input, Spinner, FormGroup, Form } from "reactstrap";

// core components
import ProfilePageHeader from "../components/Headers/ProfilePageHeader";
import IndexNavbar from "../components/Nav/IndexNavbar";
// import TransparentFooter from "components/Footers/TransparentFooter";
import axios from "axios";
import { API_URL } from "../utils/constants";
// import { useAlert } from "react-alert";
import { ChangePassForm } from "../components/auth/ChangePassForm";
import BackButton from "../utils/BackComponent";
// import { loadAnimation } from "lottie-web";
// import { defineLordIconElement } from "lord-icon-element";
import ProgressBar from "./Murid/Progress";
import CertifList from "./Murid/CertifList";
import { fetchDataUser } from "../utils/constants";
import { ChangeProfile } from "./auth/ChangeProfile";

// defineLordIconElement(loadAnimation);

function ProfileDetail({ user, handleLogout, handleSetUser }) {
  const { role, name, id } = user;
  console.log("user", role);
  // const alert = useAlert();

  const [typeList, setTypeList] = React.useState("editProfile");
  const [load, setLoad] = useState(false);
  const [nama, setNama] = useState(name);
  const [nameOnHeader, setNameH] = useState();
  const [email, setEmail] = useState(user.email);
  const [confDel, setconfDel] = useState("");

  React.useEffect(() => {
    fetchDataUser(setLoad, setNameH, id);

    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    console.log("nama", nama);
    console.log("role", role);

    axios({
      method: "PUT",
      url: `${API_URL}/user/${id}`,
      data: {
        name: nama,
        role: role,
      },
    })
      .then(function (response) {
        setLoad(false);
        // set user data and token to local storage
        // to json
        //log message
        console.log(response.data.message);
        handleSetUser(response.data.user);
        const token = JSON.stringify(response.data.token);

        localStorage.setItem("token", token);
      })
      .then(() => {
        fetchDataUser(setLoad, setNameH, id);
        console.log("berhasil");
      })
      .catch(function (error) {
        setLoad(false);
        // alert.error(
        //   <div className="notif">Gagal mengedit Profil Silahkan Coba Lagi</div>
        // );
        console.log(error);
      });

    e.preventDefault();
  };

  const handleDeleteItSelf = async (e) => {
    e.preventDefault();

    if (
      RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(confDel) === false
    ) {
      // alert.error(<div className="notif">Isi Email Yang Valid</div>);
      return false;
    }

    if (confDel !== email) {
      // alert.error(
      //   <div className="notif">Email Tidak cocok dengan email anda</div>
      // );
      return false;
    }

    if (confDel === "") {
      // alert.error(<div className="notif">Isi Email Terlebih Dahulu</div>);
      return false;
    }

    setLoad(true);

    axios({
      method: "delete",
      url: `${API_URL}user/${id}`,
    })
      .then(function (response) {
        setLoad(false);
        localStorage.removeItem("token");
        window.location.href = "/";
        // alert.success(<div className="notif">Berhasil Menghapus Profil!</div>);
      })
      .catch(function (error) {
        setLoad(false);
        // alert.error(
        //   <div className="notif">Gagal Menghapus Profil Silahkan Coba Lagi</div>
        // );
        console.log(error);
      });
  };

  return (
    <>
      <IndexNavbar handleLogout={handleLogout} />
      <div className="wrapper">
        <ProfilePageHeader name={nameOnHeader} roleUser={role} />
        <div className="section">
          <Container>
            <BackButton />
            <button
              type="button"
              className={`ml-2 btn ${
                typeList === "editProfile" ? "btn-info" : "btn-outline-info"
              }`}
              onClick={(e) => setTypeList("editProfile")}
            >
              <i className="now-ui-icons ow-ui-icons travel_info"></i> Edit
              Profil
            </button>
            <button
              type="button"
              className={`btn ml-2 ${
                typeList === "changePass" ? "btn-info" : "btn-outline-info"
              }`}
              onClick={(e) => setTypeList("changePass")}
            >
              <i className="now-ui-icons ow-ui-icons travel_info"></i> Ubah
              Password
            </button>
            <button
              type="button"
              className={`btn ml-2 ${
                typeList === "deleteItSelf"
                  ? "btn-danger"
                  : "btn-outline-danger"
              }`}
              onClick={(e) => setTypeList("deleteItSelf")}
              data-toggle="modal"
              data-target="#exampleModalCenter"
            >
              Hapus Akun Saya
            </button>

            <br />
            {(() => {
              // eslint-disable-next-line
              switch (typeList) {
                case "editProfile":
                  return ChangeProfile(
                    handleSubmit,
                    setNama,
                    load,
                    nameOnHeader,
                    user.email
                  );
                case "changePass":
                  return <ChangePassForm />;
              }
            })()}
            <hr />
          </Container>
          {role === "murid" ? (
            <>
              {/* <ProgressBar /> */}
              <CertifList user={user} />
            </>
          ) : (
            <span></span>
          )}
        </div>
        {/* <TransparentFooter /> */}
      </div>

      {/* modal */}
      <div
        class="modal fade"
        id="exampleModalCenter"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <Form onSubmit={handleDeleteItSelf}>
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-danger" id="exampleModalLongTitle">
                  Menghapus Akun
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <p className="font-weight-normal">
                  Menghapus akun dapat mengakibatkan terhapusnya{" "}
                  {role === "teacher" ? (
                    <>
                      seluruh data yang ada di akun ini, termasuk Kelas, Materi
                      dan Quiz yang Anda buat{" "}
                    </>
                  ) : (
                    <>Sertifikat</>
                  )}
                  . Jika anda ingin menghapus akun ini, silahkan ketik email
                  anda untuk konfirmasi.{" "}
                </p>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    placeholder="Email"
                    type="email"
                    onInput={(e) => setconfDel(e.target.value)}
                  ></Input>
                </FormGroup>
                {RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
                  confDel
                ) === false ? (
                  <span className="text-danger">Masukkan Email Yang Valid</span>
                ) : confDel !== user.email ? (
                  <span className="text-danger">
                    Email tidak cocok dengan email anda
                  </span>
                ) : (
                  <></>
                )}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">
                  Batalkan
                </button>
                {load === true ? (
                  <Spinner></Spinner>
                ) : (
                  <button type="submit" class="btn btn-danger">
                    Hapus Akun
                  </button>
                )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}

export default ProfileDetail;
