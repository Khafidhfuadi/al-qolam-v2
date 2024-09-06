import React, { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { API_URL } from "../../utils/constants";
import { useParams } from "react-router-dom";
// css
import styles from "../../Certif.module.css";
import BackButton from "../../utils/BackComponent";

const CertificateTemplate = ({}) => {
  const { userid, lessonid } = useParams();
  const contentRef = useRef(null);

  const [load, setLoad] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [predikat, setPredikat] = React.useState([]);
  const [createdAt, setCreatedAt] = React.useState([]);

  useEffect(() => {
    // axios get data certificate
    axios
      .get(`${API_URL}/certificate?user_id=${userid}&lesson_id=${lessonid}`)
      .then((response) => {
        setLoad(false);
        setData(response.data.data);
        setPredikat(response.data.predikat);
        setCreatedAt(response.data.created);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const downloadCertificate = () => {
    const content2 = document.getElementById("content2");

    // Create a new Image object and load the background image
    const backgroundImage = new Image();
    backgroundImage.src = require("../../assets/img/certif-bg.jpg");

    // Wait for the background image to load
    backgroundImage.onload = () => {
      // Draw the background image onto the canvas
      const canvas = document.createElement("canvas");
      canvas.width = content2.offsetWidth;
      canvas.height = content2.offsetHeight;
      const context = canvas.getContext("2d");
      context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Draw the content of the certificate onto the canvas
      html2canvas(content2, { canvas }).then((renderedCanvas) => {
        const imgData = renderedCanvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("certificate.pdf");
      });
    };
  };

  return (
    <>
      {" "}
      <div className={`${styles.certContainer} ${styles.printM0}`}>
        <div id="content2" ref={contentRef} className={`${styles.cert}`}>
          <img
            src={require("../../assets/img/certif-bg.jpg")}
            className={`${styles.certBg}`}
            alt=""
          />

          <div className={`${styles.certContent}`}>
            <img
              src="https://i.ibb.co/HGK24sH/brand-logo.png"
              alt=""
              width="70px"
            />
            <h1 className={`${styles.header}`}>Sertifikat Kelulusan</h1>
            <span style={{ fontSize: "35px" }}>Muhamad Khafidh Fuadi</span>
            <br />
            <div className="done">
              <i>telah menyelasaikan</i>
            </div>
            <span style={{ fontSize: "27px" }}>
              <b>Kelas {data[0]?.Lesson.nama_pelajaran}</b>
            </span>

            <br />
            <br />
            <small>
              Berhasil menyelesaikan kelas kursus{" "}
              {data[0]?.Lesson.nama_pelajaran} di Al-Qolam Arabic Course dengan
              predikat :
            </small>
            <br />
            <br />
            <span style={{ fontSize: "25px" }}>{predikat?.arab}</span>
            <br />
            <span style={{ fontSize: "13px" }}>
              <i>({predikat?.latin})</i>
            </span>
            <br />
            <br />

            <div className={`${styles.bottomTxt}`}>
              <span>G-1 DAPE-ARR-SF</span>
              <span>Telah Selesai Pada:{createdAt}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <BackButton />
        <button
          className={`${styles.btn} ${styles.noPrint}`}
          onClick={downloadCertificate}
        >
          Download Certificate
        </button>
      </div>
    </>
  );
};

export default CertificateTemplate;
