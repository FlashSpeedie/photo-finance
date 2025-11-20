💰 Photo Finance

💡 Project Description

Photo Finance is a modern tool built using the MERN(MongoDB, ExpressJS, ReactJS, NodeJS) stack and Gemini API key to help you easily manage your personal money.

It does three main things:

Tracks all your daily expenses and income.

Shows you exactly where your money goes using clear, beautiful charts.

Provides a secure and responsive design that works perfectly on your phone or desktop.

🚀 How to Use the App

1. Sign Up / Log In to secure your personal finance data.
2. Add Income when you get paid or receive money.
3. Add Expense every time you spend money. You can organize it by category and even add an emoji icon!
4. Check the Dashboard to instantly see your total balance and trends.

💻 How to Launch Code Locally (For Developers)

To run this project on your computer, follow these steps for the frontend and backend.

(Note: You need the backend API running for the app to work.)

Clone the Repository:

git clone [https://github.com/FlashSpeedie/photo-finance.git](https://github.com/FlashSpeedie/photo-finance.git)
# Note: In the file frontend/utils/apiPaths.js, 
# change the BASE_URL to "http://localhost:5000" 
# so the frontend connects to your local backend server.


1. Frontend

<pre> cd frontend </pre>

Install Dependencies:

<pre> npm install </pre>

Start the Server:

<pre> npm run dev </pre>


The application will open in your browser at a local address like http://localhost:5173.

2. Backend

<pre>cd backend</pre>


Install Dependencies:

<pre>npm install</pre>


Start the Server:

<pre>npm start</pre>


The server is now running and ready to handle requests from the frontend.

🚧 Issues I Ran Into

API Connection (CORS): I had to spend extra time setting up CORS (Cross-Origin Resource Sharing) on the backend. This was necessary to allow the frontend and backend to talk to each other correctly, since they run on different ports.

Chart Design: Making sure the Recharts graphs were responsive and resized without breaking the layout on small phone screens required custom CSS and careful component layout.
