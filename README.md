## What does Yiniz *do*?

Yiniz is a multi-purpose web platform offering four major areas of functionality:

### 1. News & Blog (“Yiniz-Blog”)
- **Latest and Trending News:** Features timely updates across categories like Sports, Entertainment, Law, Crime, Economy, and many others.
- **Long-form Stories:** Encourages reading and sharing stories, keeping content fresh for returning visitors.
- **User Engagement:** Readers can stay informed and interact with posts.

### 2. Edu-Tech Portal (“Yiniz-Edu”)
- **Educational Resources:** Provides learning materials in video, article, and document formats.
- **Online Testing:** Organizations can set custom tests for students directly through Yiniz.
- **AI/ML Integration:** Uses machine learning to analyze student performance and question difficulty, clustering by comprehension, providing personalized feedback, and supporting adaptive scoring.
- **Teacher Dashboard:** Lets teachers track question stats, student progress, and model training.
  
### 3. E-commerce (“Yiniz-Merce”)
- **Product Showcase and Sales:** A section dedicated to businesses and entrepreneurs to list products or services for sale.
- **Social Integration:** Each product has direct “Connect on Instagram” features for marketing/communication.
- **Dynamic Listings:** Buyers can browse offerings and get business info.

### 4. Game Portal (“Yiniz-Games”)
- **Playable Games:** Users can play web-based games such as Carrush.
- **Win and Earn:** Certain games offer real money prizes, providing both relaxation and an earning opportunity.
- **Visual Effects:** Fun animations and interactive UI throughout the gaming section.

---

## Additional Features

- **Centralized Navigation:** Unified homepage connects users to News, Edu-Tech, E-Commerce, and Games.
- **Engaging Visuals:** Canvas-based animations, dynamic loading screens, and Bootstrap-powered responsive design.
- **Business Tools:** Businesses can list products/services, and users are encouraged to network and innovate.
- **Social/Contact:** Quick links to WhatsApp contacts and business Instagram accounts.

---

## Technical Highlights

- **EJS:** Templating for rendering dynamic content.
- **JavaScript & jQuery:** Page interactivity, real-time UI updates, and animation.
- **PHP:** Back-end integration for business logic and API endpoints.
- **MySQL:** Structured relational database for users, products, and tests.
- **Machine Learning:** ML-driven analytics for education.
- **API Gateway:** Organized endpoints to connect all modules.

---

## Yiniz is:

> A gateway to networking, information, education, business, gaming, and innovation—helping users connect, learn, buy, sell, play, and earn in one unified place!



## How Yiniz connects to Yinizai during e-tests

When a student takes an online test on Yiniz (the main Node.js/EJS web platform), the app actively integrates with Yinizai—the Python-based machine learning API service—to analyze answers and provide smart educational insights. Here’s how the connection works:

### 1. The Workflow

- **Student Experience:**
  - Students log into the Yiniz portal and start an e-test (`/edutech/etest`).
  - As students answer questions and submit their results, all their responses and timings are recorded.

- **Back-End Processing:**
  - Yiniz collects all submitted answers and sends them in real time to the Yinizai backend (which can run at `localhost:8000` or a remote URL like `https://yinizai.onrender.com`).
  - Using the ML API, Yinizai processes each question and answer:
    - Predicts *question difficulty* based on content and historic answer data.
    - Analyzes *student comprehension* and provides actionable feedback.
    - Calculates *real difficulty* from student performance, so difficulty levels become data-driven.

### 2. API Integration

Yiniz communicates with Yinizai via well-defined API endpoints. For example (see `helpers/mlService.js`):

```javascript
const ML_BASE_URL = "https://yinizai.onrender.com";

exports.analyzeQuestion = async (questionData) => {
  const mlRequest = {
    question_text: questionData.question,
    question_type: questionData.question_type,
    subject: questionData.subject,
    correct_answer: questionData.correct_answer,
  };
  const response = await fetch(`${ML_BASE_URL}/analyze/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mlRequest),
  });
  return response.json();
};
```

Key endpoints:
- `POST /analyze/question` – Predict the difficulty of each question.
- `POST /analyze/answer` – Analyze the comprehension and quality of each student’s answer.

### 3. Teacher Dashboard: AI Insights

After collecting answers and running ML analysis, Yiniz provides teachers/admins with an analytics dashboard (`/edutech/etest/ml-dashboard`). This dashboard (using data from Yinizai) displays:
- Question difficulty and success rates
- Student comprehension clusters
- Performance alerts (too easy/hard/confusing)
- Real-time metrics and trends

### 4. Benefits of Integration

- **Adaptive Testing:** As more students answer questions, difficulty predictions are refined, and future tests can be balanced for fairness.
- **Personalized Feedback:** Students see ML-generated suggestions and performance analytics immediately after their tests.
- **Teacher Tools:** Yiniz enables teachers to retrain models or get automated warnings about test questions needing correction.

### 5. Technical Details

- **Yinizai repo (Python/Shell):** Runs the ML service, exposes API endpoints and prediction models.
- **Yiniz repo (Node.js/EJS):** Consumes those endpoints via helper files and controllers, integrates ML output into the testing and results workflow.

### References

- [`helpers/mlService.js`](https://github.com/Marvellous-is-cool/yiniz/blob/main/helpers/mlService.js) – ML API client in Yiniz
- [`API_DOCUMENTATION.md`](https://github.com/Marvellous-is-cool/yiniz/blob/main/API_DOCUMENTATION.md) – Endpoints and request/response formats
- [`ML_INTEGRATION_README.md`](https://github.com/Marvellous-is-cool/yiniz/blob/main/ML_INTEGRATION_README.md) – Steps and architecture

---

**In summary:**  
> When a student takes an e-test, Yiniz collects and sends test data to Yinizai. Yinizai provides ML-powered feedback, insights, and adaptive difficulty, resulting in smarter testing, better feedback, and actionable teaching analytics—all live and automated!
