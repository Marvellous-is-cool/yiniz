document.addEventListener("DOMContentLoaded", function () {
  const questionContainers = document.querySelectorAll(".question-container");
  const optionButtons = document.querySelectorAll(".btn-primary");
  const submitButton = document.querySelector(".submitBtn"); // Get the submit button

  // Initialize an array to store selected options for each question
  const selectedOptions = new Array(questionContainers.length).fill(null);
  const answerTimestamps = new Array(questionContainers.length).fill(null);
  const questionStartTimes = new Array(questionContainers.length).fill(null);

  // Track when each question is first viewed
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const questionIndex = Array.from(questionContainers).indexOf(
          entry.target
        );
        if (questionStartTimes[questionIndex] === null) {
          questionStartTimes[questionIndex] = new Date();
        }
      }
    });
  });

  questionContainers.forEach((container) => {
    observer.observe(container);
  });

  function selectOption(optionElement) {
    const questionContainer = optionElement.closest(".question-container");
    const options = questionContainer.querySelectorAll(".btn-primary");
    options.forEach((option) => option.classList.remove("active"));
    optionElement.classList.add("active");

    // Get the index of the question container
    const questionIndex =
      Array.from(questionContainers).indexOf(questionContainer);

    // Store the selected option for this question
    const selectedOption = optionElement.querySelector("i");
    const selectedOptionText = selectedOption ? selectedOption.textContent : ""; // Check if selectedOption is null
    selectedOptions[questionIndex] = selectedOptionText;
    answerTimestamps[questionIndex] = new Date();

    // Update the selected option display
    const selectedOptionP = questionContainer.querySelector(".selected-option");
    const selectedOptionDisplay =
      questionContainer.querySelector(".selected-option b");
    selectedOptionDisplay.textContent = selectedOptions[questionIndex];
    selectedOptionP.classList.remove("d-none");
    selectedOptionP.style.opacity = "0"; // Initially hide the selected option text
    selectedOptionP.style.transition = "opacity 0.5s"; // Add transition effect
    setTimeout(() => {
      selectedOptionP.style.opacity = "1"; // Fade in the selected option text
    }, 50); // Delay to ensure the hiding effect is applied first

    // Check if all questions have been answered
    const allQuestionsAnswered = selectedOptions.every(
      (option) => option !== null
    );
    if (allQuestionsAnswered) {
      // Enable the submit button
      submitButton.removeAttribute("disabled");
      // Disable all next buttons
      nextButtons.forEach((button) => {
        button.setAttribute("disabled", "true");
      });
    }
  }

  optionButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const clickedElement = event.currentTarget;
      selectOption(clickedElement);
    });
  });

  const nextButtons = document.querySelectorAll(".header-buttons .next-btn");
  const backButtons = document.querySelectorAll(".header-buttons .back-btn");

  let currentQuestionIndex = 0;

  function scrollToTop() {
    var startPosition = window.pageYOffset;
    var distance = -startPosition;
    var duration = 1000; // Duration of the scroll animation in milliseconds
    var start = null;

    window.requestAnimationFrame(step);

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;
      window.scrollTo(
        0,
        easeInOutCubic(progress, startPosition, distance, duration)
      );
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }

    function easeInOutCubic(t, b, c, d) {
      // cubic easing in/out - acceleration until halfway, then deceleration
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    }
  }

  // Example usage:
  // scrollToTop();

  function showQuestions(startIndex) {
    for (let i = 0; i < questionContainers.length; i++) {
      if (i >= startIndex && i < startIndex + 5) {
        questionContainers[i].classList.remove("d-none");
      } else {
        questionContainers[i].classList.add("d-none");
      }
    }
  }

  showQuestions(currentQuestionIndex);

  nextButtons.forEach((nextButton) => {
    nextButton.addEventListener("click", function () {
      if (currentQuestionIndex < questionContainers.length - 5) {
        currentQuestionIndex += 5;
        showQuestions(currentQuestionIndex);
        scrollToTop();
      }
    });
  });

  backButtons.forEach((backButton) => {
    backButton.addEventListener("click", function () {
      if (currentQuestionIndex >= 5) {
        currentQuestionIndex -= 5;
        showQuestions(currentQuestionIndex);
        scrollToTop();
      }
    });
  });

  // Calculate the user's score and prepare detailed answer data
  function calculateScore() {
    let score = 0;
    const detailedAnswers = [];

    for (let i = 0; i < selectedOptions.length; i++) {
      const selectedOption = selectedOptions[i];
      const correctAnswer = questions[i].correct_answer;
      const isCorrect = selectedOption === correctAnswer;

      if (isCorrect) {
        score++;
      }

      // Calculate time spent on this question
      let timeSpent = 0;
      if (questionStartTimes[i] && answerTimestamps[i]) {
        timeSpent = Math.round(
          (answerTimestamps[i] - questionStartTimes[i]) / 1000
        );
      }

      // Prepare detailed answer data for ML analysis
      detailedAnswers.push({
        questionId: questions[i].id,
        questionText: questions[i].question,
        questionType: "multiple_choice",
        userAnswer: selectedOption,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        timeSpent: timeSpent,
        options: {
          a: questions[i].option_a,
          b: questions[i].option_b,
          c: questions[i].option_c,
          d: questions[i].option_d,
        },
      });
    }

    return { score, detailedAnswers };
  }

  // Submit button click event with ML integration
  submitButton.addEventListener("click", function () {
    // Calculate the user's score and get detailed answers
    const result = calculateScore();
    const userScore = result.score;
    const detailedAnswers = result.detailedAnswers;

    // Prepare data for ML analysis
    const submissionData = {
      username: username, // Make sure username is available in the global scope
      score: userScore,
      answers: detailedAnswers,
      totalQuestions: questions.length,
      submissionTime: new Date().toISOString(),
    };

    // Send data to server for ML analysis and score update
    fetch("/edu/test/update-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    })
      .then((response) => {
        if (response.ok) {
          // Show success message with ML insights
          alert(
            `Test completed! Score: ${userScore}/${questions.length}\n\n🤖 Your answers are being analyzed by AI for personalized feedback.`
          );

          // Redirect will be handled by server
          window.location.href = "/edu/test/session-ended";
        } else {
          throw new Error("Submission failed");
        }
      })
      .catch((error) => {
        console.error("Error submitting test:", error);
        alert("Error submitting test. Please try again.");

        // Fallback: still try to update score with basic data
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/edu/test/update-score";

        const usernameInput = document.createElement("input");
        usernameInput.type = "hidden";
        usernameInput.name = "username";
        usernameInput.value = username;

        const scoreInput = document.createElement("input");
        scoreInput.type = "hidden";
        scoreInput.name = "score";
        scoreInput.value = userScore;

        form.appendChild(usernameInput);
        form.appendChild(scoreInput);
        document.body.appendChild(form);
        form.submit();
      });
  });

  // Timer functionality
  const timerContainer = document.getElementById("timer-container");

  function startTimer(startDate, endDate) {
    function updateTimer() {
      const now = new Date();
      const difference = endDate - now;
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      timerContainer.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      if (minutes === 1) {
        timerContainer.style.color = "red";
      }

      if (difference <= 0 || minutes <= 0) {
        clearInterval(timerInterval);
        timerContainer.textContent = "00:00";
        timerContainer.style.color = "black";
        alert("Test ended");
      }
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
  }

  // Set the start time to today at 6 PM
  const startDateTime = new Date();
  startDateTime.setHours(23, 0, 0, 0); // Set hours to 18 (6 PM), minutes and seconds to 0

  // Set the end time to today at 8 PM
  const endDateTime = new Date(startDateTime); // Use startDateTime as the basis
  endDateTime.setHours(24, 0, 0, 0); // Set hours to 20 (8 PM), minutes and seconds to 0

  // Check if the current time is within the specified time frame
  const now = new Date();
  if (now >= startDateTime && now <= endDateTime) {
    // Calculate the remaining time until the endDateTime
    const difference = endDateTime - now;
    const minutesRemaining = Math.floor(
      (difference % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Check if there is enough time remaining for a 20-minute timer
    if (minutesRemaining >= 20) {
      // Calculate the end time for the 20-minute timer
      const twentyMinutesLater = new Date(now);
      twentyMinutesLater.setMinutes(now.getMinutes() + 20);

      // Start the timer with the adjusted end time
      startTimer(now, twentyMinutesLater);
    } else {
      // Not enough time remaining for a 20-minute timer, show "Test ended" immediately
      timerContainer.textContent = "Test ended";
      // Calculate the user's score
      // const userScore = calculateScore();

      // TODO: Store the user's score (You can implement this part according to your backend logic)
      // console.log("User's score:", userScore);
    }
  } else {
    // Not within the specified time frame, show "Test ended" immediately
    timerContainer.textContent = "Test ended";
    // Calculate the user's score
    // const userScore = calculateScore();

    // TODO: Store the user's score (You can implement this part according to your backend logic)
    // console.log("User's score:", userScore); -->
  }
});
