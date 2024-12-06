import axios from "axios";
import { convertIscToUtc, convertUtcToIst } from "../Utils/timeUtils"; // Import the time conversion function
import { toast } from "react-toastify";
import { keyframes } from "@emotion/react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchQuestionsBySubject = async (
  token,
  subjectId,
  classesId,
  signal
) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "application/json",
      },
      signal: signal,
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

    // Apply convertUtcToIst to relevant date fields in Questions
    const convertedQuestions = Questions.map((question) => ({
      ...question,
      created_at: question.created_at
        ? convertUtcToIst(question.created_at)
        : null,
      updated_at: question.updated_at
        ? convertUtcToIst(question.updated_at)
        : null,
      start_date: question.start_date
        ? convertUtcToIst(question.start_date)
        : null,
      end_date: question.end_date
        ? convertUtcToIst(question.end_date)
        : null,
      date: question.date
        ? convertUtcToIst(question.date)
        : null,
    }));

    console.log("Converted Questions:", convertedQuestions);

    // Apply convertUtcToIst to relevant date fields in Sub-Topics if needed
    const convertedSubTopics = subTopics.map((subTopic) => ({
      ...subTopic,
      created_at: subTopic.created_at
        ? convertUtcToIst(subTopic.created_at)
        : null,
      updated_at: subTopic.updated_at
        ? convertUtcToIst(subTopic.updated_at)
        : null,
      // Add other date fields if necessary
    }));

    return {
      Questions: convertedQuestions,
      subTopics: convertedSubTopics,
    };
  } catch (err) {
    toast.error("Error fetching data:", err);
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching data"
    );
  }
};

export const getQuestionData = async (token, questionId, signal) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      headers: {
        Authorization: ` ${token}`,
        "Content-Type": "application/json",
      },
      signal: signal,
    };

    const response = await axios.request(
      `${BASE_URL}/question/${questionId}`,
      config
    );

    if (response.status === 200) {
      const questionData = response.data.data;

      // Convert date fields from UTC to IST if they exist
      if (questionData) {
        questionData.created_at = questionData.created_at
          ? convertUtcToIst(questionData.created_at)
          : null;
        questionData.updated_at = questionData.updated_at
          ? convertUtcToIst(questionData.updated_at)
          : null;
        questionData.start_date = questionData.start_date
          ? convertUtcToIst(questionData.start_date)
          : null;
        questionData.end_date = questionData.end_date
          ? convertUtcToIst(questionData.end_date)
          : null;
        questionData.date = questionData.date
          ? convertUtcToIst(questionData.date)
          : null;
      }

      console.log("Converted Question Data:", questionData); // Check the conversion

      return questionData;
    } else {
      throw new Error("Failed to fetch question data");
    }
  } catch (error) {
    console.error("Error fetching question data:", error);
    throw error;
  }
};

export const deleteExistQuestion = async (token, itemToDelete, signal) => {
  try {
    const config = {
      method: "delete",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      signal: signal,
    };

    const response = await axios.delete(
      `${BASE_URL}/question/delete/${itemToDelete}`,
      config
    );

    if (response.data && response.data.updatedAt) {
      // Convert `updatedAt` from IST to UTC
      const utcTime = convertIscToUtc(response.data.updatedAt);
      console.log("Converted UTC time:", utcTime);
      response.data.updatedAt = utcTime;
    }

    return response;
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
    // Convert the date fields in addQuestion object from IST to UTC
    if (addQuestion.created_at) {
      addQuestion.created_at = convertIscToUtc(addQuestion.created_at);
    }
    if (addQuestion.updated_at) {
      addQuestion.updated_at = convertIscToUtc(addQuestion.updated_at);
    }
    if (addQuestion.start_date) {
      addQuestion.start_date = convertIscToUtc(addQuestion.start_date);
    }
    if (addQuestion.end_date) {
      addQuestion.end_date = convertIscToUtc(addQuestion.end_date);
    }
    if (addQuestion.date) {
      addQuestion.date = convertIscToUtc(addQuestion.date);
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
      // If the response contains createdAt field, convert it from IST to UTC
      if (response.data.createdAt) {
        const utcTime = convertIscToUtc(response.data.createdAt); // Convert from IST to UTC
        console.log("Converted UTC time:", utcTime); // Log the converted time
        response.data.createdAt = utcTime;
      }

      return response;
    } else {
      return response;
    }
  } catch (error) {
    console.error("Error adding question:", error); // Log the error for debugging
  }
};

export const editQuestionAPI = async (editQuestion, token) => {
  try {
    // Convert the date fields in editQuestion object from IST to UTC
    if (editQuestion.created_at) {
      editQuestion.created_at = convertIscToUtc(editQuestion.created_at);
    }
    if (editQuestion.updated_at) {
      editQuestion.updated_at = convertIscToUtc(editQuestion.updated_at);
    }
    if (editQuestion.start_date) {
      editQuestion.start_date = convertIscToUtc(editQuestion.start_date);
    }
    if (editQuestion.end_date) {
      editQuestion.end_date = convertIscToUtc(editQuestion.end_date);
    }
    if (editQuestion.date) {
      editQuestion.date = convertIscToUtc(editQuestion.date);
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
      // If the response contains createdAt field, convert it from IST to UTC
      if (response.data.createdAt) {
        const utcTime = convertIscToUtc(response.data.createdAt); // Convert from IST to UTC
        console.log("Converted UTC time:", utcTime); // Log the converted time
        response.data.createdAt = utcTime;
      }

      return response;
    } else {
      throw new Error("Failed to edit question");
    }
  } catch (error) {
    console.error("Error editing question:", error);
    throw error; // Re-throw error for handling in the calling function
  }
};
