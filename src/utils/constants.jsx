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
      setCertifList(response.data.data);
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
