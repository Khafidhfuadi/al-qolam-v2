import axios from "axios";

export const API_URL = "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (email, name, password) => {
  try {
    const response = await api.post("/auth/register", {
      role: "murid",
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// fetch data list pelajaran
export function fetchDataPelList(setLesson, setLoad, userId) {
  api
    .get(`/lessons?cari=${userId}`)
    .then((response) => {
      setLesson(response.data);
      console.log("lesson", response.data);
      setLoad(false);
    })
    .catch((error) => {
      setLoad(false);
      let message = error.response;
      return message;
    });
}

// fetch data pelajaran
export function fetchDetailPel(setDetailLesson, idLesson) {
  api
    .get(`/lessons/${idLesson}`)
    .then((response) => {
      setDetailLesson(response.data);
      console.log("detail lesson", response.data);
    })
    .catch((error) => {
      let message = error;
      console.log(message);
    });
}

// fetch progress
export function fetchProgress(setProgress, lesson_id, userId) {
  api
    .get(`/progress?user_id=${userId}&lesson_id=${lesson_id}`)
    .then((response) => {
      setProgress(response.data);
      console.log("progress", response.data);
    })
    .catch((error) => {
      let message = error;
      console.log("ss", message);
    });
}

export function fetchProgressList(setProgress, userId) {
  axios
    .get(`${API_URL}/progress?user_id=${userId}`)
    .then((response) => {
      setProgress(response.data.data);
      console.log("progress", response.data.data);
    })
    .catch((error) => {
      let message = error;
      console.log("ss", message);
    });
}

// fetch data user
export function fetchDataUser(setLoad, setNameH, userId) {
  axios
    .get(`${API_URL}/user/${userId}`)
    .then((response) => {
      setLoad(false);
      setNameH(response.data.success.name);
    })
    .catch((error) => {
      let message = error.response;
      console.log(message);
    });
}

export function fetchDataCertifList(setCertifList, setLoad, userId) {
  axios
    .get(`${API_URL}/certificate?user_id=${userId}`)
    .then((response) => {
      setCertifList(response.data);
      setLoad(false);
      console.log("certif", response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function countLesson(setLesson, setLoad, userId) {
  axios
    .get(`${API_URL}/lessons?cari=${userId}&role=teacher`)
    .then((response) => {
      setLesson(response.data);
      console.log("lesson", response.data);
      setLoad(false);
    })
    .catch((error) => {
      setLoad(false);
      let message = error.response;
      return message;
    });
}

// fetch quiz score
export function fetchQuizScore(setQuizScore, chapterId, userId) {
  axios
    .get(`${API_URL}/quiz-score?user_id=${userId}&chapter_id=${chapterId}`)
    .then((response) => {
      setQuizScore(response.data);
      console.log("quiz score", response.data);
    })
    .catch((error) => {
      let message = error;
      console.log("error quiz score", message);
    });
}

// fetch data quiz

export function fetchDataQuiz(
  setQuestions,
  secondsToHms,
  setRandomArr,
  id,
  setLoad,
  access_token
) {
  axios
    .get(`${API_URL}/quiz?cari=${id}`, {})
    .then((response) => {
      setLoad(false);
      setQuestions(response.data.data.sort(() => Math.random() - 0.5));
      secondsToHms(response.data.data.length * 60);
      setRandomArr(
        JSON.parse(response.data.data[0].answer_options).list.sort(
          () => Math.random() - 0.5
        )
      );
    })
    .catch((response) => {
      console.log("errorQ", response);
    });
}

export function fetchDataSingleCertif(
  setCertif,
  setCreatedAt,
  setPredikat,
  setLoad,
  lesson_id,
  userId,
  access_token
) {
  axios
    .get(`${API_URL}/certificates?lesson_id=${lesson_id}&user_id=${userId}`, {})
    .then((response) => {
      setCertif(response.data.data);
      setCreatedAt(response.data.created);
      setPredikat(response.data.predikat);
      console.log("certif", response.data);
      setLoad(false);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function isQuizDone(setQuizDone, setLoad, chapter_id, userId) {
  axios
    .get(`${API_URL}/quizscore?chapter_id=${chapter_id}&user_id=${userId}`, {})
    .then((response) => {
      setQuizDone(response.data.data);
      console.log("quiz done", response.data.data);
      setLoad(false);
    })
    .catch((error) => {
      console.log(error);
    });
}

// isExamDone
export function isExamDone(setExamDone, setLoad, lesson_id, userId) {
  axios
    .get(`${API_URL}/examscore?lesson_id=${lesson_id}&user_id=${userId}`, {})
    .then((response) => {
      setExamDone(response.data.data);
      console.log("exam done", response.data.data);
      setLoad(false);
    })
    .catch((error) => {
      console.log(error);
    });
}

//update exam score
export function updateExamScore(id, score) {
  axios({
    method: "put",
    url: `${API_URL}/examscore/${id}`,
    data: {
      score: score,
    },
  })
    .then(function (response) {
      //handle success
      console.log(response);
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

// updateQuizScore
export function updateQuizScore(id, score) {
  axios({
    method: "put",
    url: `${API_URL}/quizscore/${id}`,
    data: {
      score: score,
    },
  })
    .then(function (response) {
      //handle success
      console.log(response);
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

// createQuizScore
export function createQuizScore(userId, chapterId, score) {
  axios({
    method: "post",
    url: `${API_URL}/quizscore`,
    data: {
      user_id: userId,
      chapter_id: chapterId,
      score: score,
    },
  })
    .then(function (response) {
      //handle success
      console.log(response);
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

export function createUserCertif(lessonId, userId, nilaiUjian) {
  axios({
    method: "post",
    url: `${API_URL}/certificates`,
    data: {
      lesson_id: lessonId,
      user_id: userId,
      nilai_ujian: nilaiUjian,
    },
    headers: {
      ContentType: "multipart/form-data",
      Accept: "application/json",
    },
  })
    .then(function (response) {
      //handle success
      console.log(response);
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

export function updateUserCertif(lessonId, userId, nilaiUjian, idCertif) {
  axios({
    method: "put",
    url: `${API_URL}/certificates/${idCertif}`,
    data: {
      lesson_id: lessonId,
      user_id: userId,
      nilai_ujian: nilaiUjian,
    },
    headers: {
      ContentType: "multipart/form-data",
      Accept: "application/json",
    },
  })
    .then(function (response) {
      //handle success
      console.log(response);
    })
    .catch(function (error) {
      console.log(error.response);
    });
}

export function fetchDataExam(
  setQuestions,
  secondsToHms,
  setRandomArr,
  id,
  setLoad,
  access_token
) {
  axios
    .get(`${API_URL}/exam?cari=${id}`, {})
    .then((response) => {
      setLoad(false);
      setQuestions(response.data.data.sort(() => Math.random() - 0.5));
      secondsToHms(response.data.data.length * 60);
      setRandomArr(
        JSON.parse(response.data.data[0].answer_options).list.sort(
          () => Math.random() - 0.5
        )
      );
    })
    .catch((response) => {
      console.log("errorQ", response);
    });
}
