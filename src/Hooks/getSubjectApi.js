import axios from "axios";
import { convertUtcToIst } from "../Utils/timeUtils";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

// export const fetchSubjects = async (token, classesId, signal) => {
//   try {
//     let config = {
//       method: "get",
//       headers: {
//         Authorization: `${token}`,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       signal: signal,
//     };

//     const response1 = await axios.request(
//       `${BASE_URL}/question/subject-wise-question-count`,
//       config
//     );
//     const response2 = await axios.request(
//       `${BASE_URL}/subject/all?page=1&limit=10&classesFilter=${classesId}`,
//       config
//     );

//     if (response1 && response2) {
//       const totalQuestions = response1?.data?.data || [];
//       const subjects = response2?.data?.data?.subject_data || [];

//       return {
//         totalQuestions,
//         subjects,
//       };
//     } else {
//       throw new Error("Failed to fetch data from the APIs");
//     }
//   } catch (err) {
//     console.error("Error fetching subjects:", err);
//     throw new Error(
//       err.response?.data?.message ||
//         err.message ||
//         "An error occurred while fetching subjects"
//     );
//   }
// };

// // fetch data for selected subject
// export const fetchData = async (token, subject, signal) => {
//   try {
//     let config = {
//       method: "get",
//       headers: {
//         Authorization: `${token}`,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       signal: signal,
//     };

//     const response1 = await axios.request(
//       `${BASE_URL}/sub-topic/all?page=1&limit=10`,
//       config
//     );
//     const response2 = await axios.request(
//       `${BASE_URL}/subject/${subject}`,
//       config
//     );
//     if (response1.status === 200 && response2.status === 200) {
//       const subTopic = response1?.data?.data?.sub_topic_data || [];
//       const subjects = response2?.data?.data || [];

//       return {
//         subTopic,
//         subjects,
//       };
//     } else {
//       if (response1.status !== 200) {
//         console.error("Failed to fetch subtopics.");
//       }
//       if (response2.status !== 200) {
//         console.error("Failed to fetch subjects.");
//       }
//     }
//   } catch (error) {
//     console.error("Failed to fetch data.");
//     console.error("Error fetching data:", error);
//   }
// };

export const fetchSubjects = async (token, classesId, signal) => {
  try {
    let config = {
      method: "get",
      headers: {
        Authorization: `${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: signal,
    };

    const response1 = await axios.request(
      `${BASE_URL}/question/subject-wise-question-count`,
      config
    );
    const response2 = await axios.request(
      `${BASE_URL}/subject/all?page=1&limit=10&classesFilter=${classesId}`,
      config
    );

    if (response1 && response2) {
      const totalQuestions = response1?.data?.data || [];
      const subjects = response2?.data?.data?.subject_data || [];

      // Apply `convertUtcToIst` to relevant date fields in `totalQuestions` and `subjects`
      const convertedTotalQuestions = totalQuestions.map((question) => ({
        ...question,
        createdAt: question.createdAt
          ? convertUtcToIst(question.createdAt)
          : null,
        updatedAt: question.updatedAt
          ? convertUtcToIst(question.updatedAt)
          : null,
        // Add other date fields if applicable
      }));

      const convertedSubjects = subjects.map((subject) => ({
        ...subject,
        createdAt: subject.createdAt
          ? convertUtcToIst(subject.createdAt)
          : null,
        updatedAt: subject.updatedAt
          ? convertUtcToIst(subject.updatedAt)
          : null,
        // Add other date fields if applicable
      }));

      return {
        totalQuestions: convertedTotalQuestions,
        subjects: convertedSubjects,
      };
    } else {
      throw new Error("Failed to fetch data from the APIs");
    }
  } catch (err) {
    console.error("Error fetching subjects:", err);
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching subjects"
    );
  }
};

export const fetchData = async (token, subject, signal) => {
  try {
    let config = {
      method: "get",
      headers: {
        Authorization: `${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: signal,
    };

    const response1 = await axios.request(
      `${BASE_URL}/sub-topic/all?page=1&limit=10`,
      config
    );

    const response2 = await axios.request(
      `${BASE_URL}/subject/${subject}`,
      config
    );

    if (response1.status === 200 && response2.status === 200) {
      const subTopic = response1?.data?.data?.sub_topic_data || [];
      const subjects = response2?.data?.data || [];
      // console.log("subjectsApiData", subjects);

      const convertedSubTopics = subTopic.map((topic) => ({
        ...topic,
        createdAt: topic.createdAt ? convertUtcToIst(topic.createdAt) : null,
        updatedAt: topic.updatedAt ? convertUtcToIst(topic.updatedAt) : null,
      }));

      const subjectsResponseData = Array.isArray(subjects)
        ? subjects
        : subjects
        ? [subjects]
        : [];

      // Now, process the subjects (whether it's an array or single object)
      const convertedSubjects = subjectsResponseData.map((subjectData) => ({
        ...subjectData,
        createdAt: subjectData.createdAt
          ? convertUtcToIst(subjectData.createdAt)
          : null,
        updatedAt: subjectData.updatedAt
          ? convertUtcToIst(subjectData.updatedAt)
          : null,
      }));

      return {
        subTopic: convertedSubTopics,
        subjects: convertedSubjects,
      };
    } else {
      if (response1.status !== 200) {
        console.error("Failed to fetch subtopics.");
      }
      if (response2.status !== 200) {
        console.error("Failed to fetch subjects.");
      }
    }
  } catch (error) {
    console.error("Failed to fetch data.");
    console.error("Error fetching data:", error);
  }
};
