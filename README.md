-----------------------------------
Expense Tracker
-----------------------------------
Expense Tracker is a web application designed to help users manage their finances effectively. With features like expense tracking, budget monitoring, and visual analytics, it provides a comprehensive solution for financial organization.
-----------------------------------
Branch Structure
-----------------------------------
This repository uses a two-branch structure to separate concerns between the frontend and backend:
-----------------------------------
frontend branch: Contains the Angular application for the client-side user interface.
-----------------------------------
main branch: Contains the .NET 8 application for the server-side logic and REST API.
-----------------------------------
When working on the project, ensure you switch to the appropriate branch based on your task:
-----------------------------------

For frontend tasks:
-----------------------------------
git checkout frontend
-----------------------------------
For backend tasks:
-----------------------------------
git checkout main
-----------------------------------
Features
-----------------------------------
Frontend
-----------------------------------
User authentication (registration and login).
-----------------------------------
Add, view, edit, and delete expenses.
-----------------------------------
Categorize expenses for better tracking.
-----------------------------------
Dashboard with:
-----------------------------------
Visual charts to analyze spending by category.
-----------------------------------
Budget summary (monthly budget, total spent, remaining balance).
-----------------------------------
Progress bar to visualize budget consumption.
-----------------------------------
Responsive design for optimal usage on various devices.
-----------------------------------
Backend
-----------------------------------
Secure REST API built with .NET 8.
-----------------------------------
User authentication and session management.
-----------------------------------
Expense CRUD operations.
-----------------------------------
Data storage with a relational database.
-----------------------------------
Validation and error handling for user inputs.
-----------------------------------
Setup Instructions
-----------------------------------
1. Clone the Repository
   -----------------------------------

git clone https://github.com/hanane653/Expense-Tracker.git
-----------------------------------
cd Expense-Tracker
-----------------------------------
2. Setup the Frontend
   -----------------------------------
Switch to the frontend branch:
-----------------------------------

git checkout frontend
-----------------------------------
Navigate to the frontend directory:
-----------------------------------
cd frontend
-----------------------------------
Install dependencies:
-----------------------------------

npm install
-----------------------------------
Start the development server:
-----------------------------------

ng serve
-----------------------------------
Access the application in your browser at http://localhost:4200.
-----------------------------------
5. Setup the Backend
   -----------------------------------
Switch to the backend branch:
-----------------------------------

git checkout main
-----------------------------------
Navigate to the backend directory:
-----------------------------------

cd backend
-----------------------------------
Restore .NET dependencies:
-----------------------------------

dotnet restore
-----------------------------------
Update the database connection string in appsettings.json to match your environment.
-----------------------------------
Apply database migrations:
-----------------------------------

Add-Migration / Update-Database
-----------------------------------
Start the backend server:
-----------------------------------

dotnet run
-----------------------------------
7. Run the Application
-----------------------------------
Ensure both the frontend and backend servers are running.
-----------------------------------
Access the application via the frontend URL (http://localhost:4200).
-----------------------------------
Tech Stack
-----------------------------------
Frontend
-----------------------------------
Angular 18
-----------------------------------
Chart.js for data visualization
-----------------------------------
Bootstrap for styling
-----------------------------------
Font Awesome for icons
-----------------------------------
Backend
-----------------------------------
.NET 8
-----------------------------------
Entity Framework Core for database management
-----------------------------------
SQL Server (default; configurable)
-----------------------------------
Assumptions and Limitations
-----------------------------------
Assumptions:
-----------------------------------

Users have a monthly budget set before adding expenses.
-----------------------------------
Expenses are categorized for better tracking and reporting.
-----------------------------------
Authentication is required to access the application.
-----------------------------------

