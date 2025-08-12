const fetch = require("node-fetch");

const ML_BASE_URL = "https://yinizai.onrender.com";

// Check ML service health
exports.checkHealth = async () => {
  try {
    const response = await fetch(`${ML_BASE_URL}/health`);
    if (response.ok) {
      const health = await response.json();
      return {
        status: health.status || "healthy",
        healthy: true,
      };
    }
    return {
      status: "unhealthy",
      healthy: false,
    };
  } catch (error) {
    console.error("ML service health check failed:", error);
    return {
      status: "offline",
      healthy: false,
    };
  }
};

// Analyze question difficulty before saving
exports.analyzeQuestion = async (questionData) => {
  try {
    // Transform the question data to match ML service expected format
    const mlRequest = {
      question_text: questionData.question || questionData.question_text,
      question_type: questionData.question_type || "multiple_choice",
      subject: questionData.subject || "General",
      correct_answer: questionData.correct_answer,
    };

    const response = await fetch(`${ML_BASE_URL}/analyze/question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mlRequest),
    });

    if (response.ok) {
      const result = await response.json();

      // Transform the response back to our expected format
      return {
        difficulty_prediction: {
          predicted_difficulty: result.difficulty_prediction?.predicted_difficulty,
          confidence: result.difficulty_prediction?.confidence,
          probabilities: result.difficulty_prediction?.probabilities,
        },
        features_extracted: result.features_extracted,
        analysis_timestamp: result.analysis_timestamp,
        // Also include the simple format for backward compatibility
        predicted_difficulty: result.difficulty_prediction?.predicted_difficulty,
        confidence: result.difficulty_prediction?.confidence,
        probabilities: result.difficulty_prediction?.probabilities,
        features: result.features_extracted,
        timestamp: result.analysis_timestamp,
      };
    }

    console.error("ML analyzeQuestion failed with status:", response.status);

    // Try to get error details
    try {
      const errorData = await response.json();
      console.error("ML analyzeQuestion error details:", errorData);
    } catch (e) {
      console.error("Could not parse error response");
    }

    return null;
  } catch (error) {
    console.error("ML analyzeQuestion error:", error);
    return null;
  }
};

// Analyze student answer for scoring and comprehension
exports.analyzeAnswer = async (answerData) => {
  try {
    // Transform the answer data to match ML service expected format
    const mlRequest = {
      question_text: answerData.question_text || answerData.question,
      answer_text: answerData.answer_text || answerData.student_answer,
      question_type: answerData.question_type || "multiple_choice",
      correct_answer: answerData.correct_answer,
      time_taken: answerData.time_taken || answerData.time_spent,
    };

    const response = await fetch(`${ML_BASE_URL}/analyze/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mlRequest),
    });

    if (response.ok) {
      const result = await response.json();

      // Transform the response back to our expected format
      return {
        predicted_score: result.score_prediction?.predicted_score,
        confidence_interval: result.score_prediction?.confidence_interval,
        comprehension_cluster:
          result.comprehension_analysis?.comprehension_cluster,
        cluster_confidence: result.comprehension_analysis?.cluster_confidence,
        issues_identified: result.comprehension_analysis?.issues_identified,
        recommendations: result.comprehension_analysis?.recommendations,
        features: result.features_extracted,
        timestamp: result.analysis_timestamp,
      };
    }

    console.error("ML analyzeAnswer failed with status:", response.status);

    // Try to get error details
    try {
      const errorData = await response.json();
      console.error("ML analyzeAnswer error details:", errorData);
    } catch (e) {
      console.error("Could not parse error response");
    }

    return null;
  } catch (error) {
    console.error("ML analyzeAnswer error:", error);
    return null;
  }
};

// Get question performance analytics
exports.getQuestionPerformance = async (questionId) => {
  try {
    const response = await fetch(
      `${ML_BASE_URL}/analyze/question/${questionId}/performance`
    );
    if (response.ok) {
      return await response.json();
    }
    console.error(
      "ML getQuestionPerformance failed with status:",
      response.status
    );
    return null;
  } catch (error) {
    console.error("ML getQuestionPerformance error:", error);
    return null;
  }
};

// Batch analyze multiple questions
exports.batchAnalyzeQuestions = async (questions) => {
  try {
    // Transform questions to match ML service expected format
    const mlQuestions = questions.map((q) => ({
      question_text: q.question || q.question_text,
      question_type: q.question_type || "multiple_choice",
      subject: q.subject || "General",
      correct_answer: q.correct_answer,
    }));

    const response = await fetch(`${ML_BASE_URL}/batch/analyze/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions: mlQuestions }),
    });

    if (response.ok) {
      const result = await response.json();

      // Transform each result back to our expected format
      const transformedResults =
        result.results?.map((r) => ({
          question_id: r.question_id,
          predicted_difficulty: r.difficulty_prediction?.predicted_difficulty,
          confidence: r.difficulty_prediction?.confidence,
          probabilities: r.difficulty_prediction?.probabilities,
          features: r.features_extracted,
          timestamp: r.analysis_timestamp,
        })) || [];

      return {
        total_questions: result.total_questions,
        processed_questions: result.processed_questions,
        failed_questions: result.failed_questions,
        results: transformedResults,
        processing_time: result.processing_time,
      };
    }

    console.error(
      "ML batchAnalyzeQuestions failed with status:",
      response.status
    );
    return null;
  } catch (error) {
    console.error("ML batchAnalyzeQuestions error:", error);
    return null;
  }
};

// Get analytics for a subject
exports.getSubjectAnalytics = async (subject) => {
  try {
    const response = await fetch(`${ML_BASE_URL}/analytics/subject/${subject}`);
    if (response.ok) {
      return await response.json();
    }
    console.error(
      "ML getSubjectAnalytics failed with status:",
      response.status
    );
    return null;
  } catch (error) {
    console.error("ML getSubjectAnalytics error:", error);
    return null;
  }
};

// Train ML models with new data
exports.trainModels = async (modelType = "difficulty") => {
  try {
    const response = await fetch(`${ML_BASE_URL}/train/${modelType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model_type: modelType,
        min_samples: 50,
        retrain: false,
      }),
    });

    if (response.ok) {
      return await response.json();
    }

    console.error("ML trainModels failed with status:", response.status);

    // Try to get error details
    try {
      const errorData = await response.json();
      console.error("ML trainModels error details:", errorData);
    } catch (e) {
      console.error("Could not parse error response");
    }

    return null;
  } catch (error) {
    console.error("ML trainModels error:", error);
    return null;
  }
};
