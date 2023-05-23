import ProgressLoader from "../../components/loader/progressLoader";
import React from "react";
// reactstrap components
import { Container, Progress } from "reactstrap";
import spirit from "../../assets/img/spirit.png";
import { fetchProgressList } from "../../utils/constants";
// core components

function ProgressBar({ user }) {
  let [progress, setProgress] = React.useState([]);
  let [load, setLoad] = React.useState(true);

  React.useEffect(() => {
    setLoad(true);
    fetchProgressList(setProgress, user.id);
    setLoad(false);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="section section-tabs text-capitalize">
        <Container>
          <h2>Progres Kamu - تقدمك</h2>
          {load === false ? (
            progress?.length !== 0 ? (
              progress.map(function (item, i) {
                let percent = (item.read_chapter / item.length_chapter) * 100;
                console.log("per", progress);
                return (
                  <>
                    <div className="progress-container" key={item.id}>
                      <span className="progress-badge">{item.pelajaran}</span>
                      <Progress
                        max={item.length_chapter}
                        value={item.read_chapter}
                      >
                        <span className="progress-value">
                          {Math.ceil(percent)}%
                        </span>
                      </Progress>
                    </div>
                  </>
                );
              })
            ) : (
              <div>
                <img
                  width="200px"
                  alt="..."
                  className="rounded float-right"
                  src={spirit}
                />
                <p className=" font-weight-bold text-dark">
                  Kamu Belum Memulai Kelas Apapun, Mulai Sekarang! <br /> -
                  Al-Qolam
                </p>
              </div>
            )
          ) : (
            ProgressLoader()
          )}
        </Container>
      </div>
    </>
  );
}

export default ProgressBar;
