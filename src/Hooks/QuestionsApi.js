import axios from "axios";
import { convertIscToUtc, convertUtcToIst } from "../Utils/timeUtils";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchQuestionsBySubject = async (token, subjectId, classesId) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response1 = await axios.request(
      `${BASE_URL}/question/all?page=1&limit=10&subjectFilter=${subjectId}&classesFilter=${classesId}`,
      config
    );

    const response2 = await axios.request(
      `${BASE_URL}/sub-topic/all?page=1&limit=10`,
      config
    );

    const Questions = response1?.data?.data?.question_data || [];
    const subTopics = response2?.data?.data?.sub_topic_data || [];

    const convertedQuestions = Questions.map((question) => {
      const convertedQuestion = { ...question };
      if (question.createdAt) {
        convertedQuestion.createdAt = convertUtcToIst(question.createdAt);
      }
      if (question.updatedAt) {
        convertedQuestion.updatedAt = convertUtcToIst(question.updatedAt);
      }
      if (question.startDate) {
        convertedQuestion.startDate = convertUtcToIst(question.startDate);
      }
      if (question.endDate) {
        convertedQuestion.endDate = convertUtcToIst(question.endDate);
      }

      return convertedQuestion;
    });
    console.log("Converted Questions:", convertedQuestions);

    const convertedSubTopics = subTopics.map((subTopic) => {
      const convertedSubTopic = { ...subTopic };
      if (subTopic.createdAt) {
        convertedSubTopic.createdAt = convertUtcToIst(subTopic.createdAt);
      }
      if (subTopic.updatedAt) {
        convertedSubTopic.updatedAt = convertUtcToIst(subTopic.updatedAt);
      }

      return convertedSubTopic;
    });
    console.log("Converted SubTopics:", convertedSubTopics);

    return {
      Questions: convertedQuestions,
      subTopics: convertedSubTopics,
    };
  } catch (err) {
    console.error("Error fetching data:", err);
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching data"
    );
  }
};

export const getQuestionData = async (token, questionId) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.request(
      `${BASE_URL}/question/${questionId}`,
      config
    );

    if (response.status === 200) {
      const questionData = response.data.data;
      if (questionData) {
        if (questionData.createdAt) {
          questionData.createdAt = convertUtcToIst(questionData.createdAt);
        }
        if (questionData.updatedAt) {
          questionData.updatedAt = convertUtcToIst(questionData.updatedAt);
        }
      }
      console.log("Converted Question Data:", questionData);

      return questionData;
    } else {
      throw new Error("Failed to fetch question data");
    }
  } catch (error) {
    console.error("Error fetching question data:", error);
    throw error;
  }
};

export const deleteExistQuestion = async (token, itemToDelete) => {
  try {
    const config = {
      method: "delete",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.delete(
      `${BASE_URL}/question/delete/${itemToDelete}`,
      config
    );

    if (response.status === 200) {
      toast.success(response.data.message);
      return {
        success: true,
        message: response.data.message,
        data: response.data,
      };
    } else {
      toast.error(response.data.message);
      throw new Error("Failed to delete question");
    }
  } catch (err) {
    console.error("Error deleting question:", err);
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "An error occurred while deleting the question"
    );
  }
};

export const addNewQuestion = async (addQuestion, token) => {
  try {
    if (addQuestion.createdAt) {
      addQuestion.createdAt = convertIscToUtc(addQuestion.createdAt);
    }
    if (addQuestion.updatedAt) {
      addQuestion.updatedAt = convertIscToUtc(addQuestion.updatedAt);
    }
    if (addQuestion.startDate) {
      addQuestion.startDate = convertIscToUtc(addQuestion.startDate);
    }
    if (addQuestion.endDate) {
      addQuestion.endDate = convertIscToUtc(addQuestion.endDate);
    }

    const data = JSON.stringify(addQuestion);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/question/add`,
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    if (response.status === 200) {
      toast.success(response.data.message);
      return {
        success: true,
        message: response.data.message || "Question add successfully!",
        data: response.data.data,
      };
    } else {
      toast.error(response.data.message);
      throw new Error("Failed to add question");
    }
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

export const editQuestionAPI = async (editQuestion, token) => {
  try {
    if (editQuestion.createdAt) {
      editQuestion.createdAt = convertIscToUtc(editQuestion.createdAt);
    }
    if (editQuestion.updatedAt) {
      editQuestion.updatedAt = convertIscToUtc(editQuestion.updatedAt);
    }

    const data = JSON.stringify(editQuestion);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/question/edit`,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    const response = await axios.request(config);

    if (response.status === 200) {
      toast.success(response.data.message);
      return {
        success: true,
        message: response.data.message || "Question edit successfully!",
        data: response.data.data,
      };
    } else {
      toast.error(response.data.message);

      throw new Error("Failed to edit question");
    }
  } catch (error) {
    console.error("Error editing question:", error);
    throw error;
  }
};
