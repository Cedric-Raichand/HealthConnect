# HealthConnect 🏥

**A full-stack healthcare management platform connecting patients, doctors, and administrators through a centralized digital healthcare system.**

HealthConnect is a web-based healthcare platform designed to streamline essential healthcare workflows. It enables patients to manage appointments and access their medical information, doctors to manage appointments and clinical records, and administrators to oversee users and platform activities.

The project demonstrates full-stack web development, RESTful API design, authentication, role-based access control, healthcare data management, and secure handling of medical documents.

## ✨ Features

### 👤 Authentication & Authorization
- User registration and login.
- JWT-based authentication.
- Role-based access control for patients, doctors, and administrators.
- Protected frontend routes and backend endpoints.
- Password hashing and input validation.

### 🧑‍⚕️ Patient Portal
- Patient dashboard.
- Appointment booking and management.
- Access to personal medical records.
- View prescribed medications and prescriptions.
- Profile management.
- Access to authorized medical documents.

### 🩺 Doctor Portal
- Doctor dashboard.
- View and manage appointments.
- Update appointment statuses.
- Create and manage medical records for eligible appointments.
- Create prescriptions associated with medical records.
- Manage professional profile information.

### 🛡️ Administration Portal
- Administrative dashboard with platform statistics.
- View and manage registered users.
- View individual user details.
- Verify and unverify user accounts where supported.
- Manage appointments, medical records, and prescriptions.
- Administrative profile management.

### 📋 Medical Records Management
- Create and access medical records.
- Associate medical records with the appropriate patient and appointment.
- Manage clinical information such as diagnoses, treatments, and notes.
- Support medical document uploads with protected access controls.

### 💊 Prescription Management
- Create prescriptions associated with medical records.
- Enforce relevant doctor, patient, and record relationships.
- Allow patients to access their prescriptions.
- Validate prescription data on the backend.

### 🔒 Security Measures
- JWT-based authentication.
- Role-based authorization.
- Resource ownership checks.
- Protected access to medical documents.
- Input validation and request rate limiting.
- Helmet security headers.
- Configurable Cross-Origin Resource Sharing (CORS).
- Centralized error handling with reduced internal error exposure in production.

> Security features are implemented as part of the project; production readiness still depends on configuration, testing, and deployment verification.

## 🧰 Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| API documentation | Swagger / OpenAPI |
| API communication | REST API, Axios |
| Security | Helmet, CORS, rate limiting, validation middleware |
| Development tools | Git, GitHub, npm |

## 🏗️ System Architecture

HealthConnect uses a frontend-backend architecture.

1. **Frontend:** The React application provides the user interface and role-specific dashboards.
2. **Backend:** The Express API handles requests, authentication, authorization, validation, and business logic.
3. **Database:** MongoDB stores application data, including users, appointments, medical records, and prescriptions.
4. **Protected resources:** Backend authorization checks control access to private healthcare information and uploaded documents.

```text
Patient / Doctor / Admin
           |
           v
   React + Vite Frontend
           |
           | HTTP / REST API
           v
   Node.js + Express API
           |
           +---- Authentication & Authorization
           |
           +---- Appointments
           |
           +---- Medical Records
           |
           +---- Prescriptions
           |
           +---- User & Admin Management
           |
           v
        MongoDB
```

## 🔄 Example Healthcare Workflow

A typical workflow supported by HealthConnect is:

1. A patient registers and logs in.
2. The patient books an appointment with a doctor.
3. The doctor reviews and manages the appointment.
4. For an eligible appointment, the doctor creates a medical record.
5. The doctor creates a prescription associated with the medical record.
6. The patient accesses their available medical records and prescriptions.
7. Administrators oversee user accounts and other platform activities.

The backend enforces the relevant authorization and resource relationships for supported workflows.

## 📁 Project Structure

The project is organized into frontend and backend applications. Your exact filenames may differ slightly depending on the current repository structure.

```text
HealthConnect/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── app.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

*Note: Adjust this tree to match the actual folders and filenames in your repository before publishing.*

## ⚙️ Getting Started

Follow these instructions to run HealthConnect locally.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/) — a supported LTS version.
- npm, included with Node.js.
- [MongoDB](https://www.mongodb.com/) — a local instance or MongoDB Atlas account.
- Git.

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd HealthConnect
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Configure the backend

Open a terminal in the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory.

Example configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Replace the example values with your own configuration. Use a strong, randomly generated JWT secret and a valid MongoDB connection string.

**Important:** Never commit `.env` files, database credentials, JWT secrets, or other sensitive configuration to GitHub.

Start the backend using the development script defined in `backend/package.json`. If it uses `dev`, run:

```bash
npm run dev
```

Otherwise, use the script configured in your project.

The API should start on the configured port, typically `5000`.

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Configure the frontend API base URL according to the variable name used by your Axios configuration. For a Vite application, an example is:

```env
VITE_API_URL=http://localhost:5000/api
```

Use the exact variable name and API base path expected by your existing frontend code.

Start the frontend:

```bash
npm run dev
```

Vite commonly serves the application at:

```text
http://localhost:5173
```

Keep the backend running in its terminal while using the frontend.

### 4. Open the application

Visit the local frontend URL shown in the Vite terminal.

Log in using accounts configured for your development environment. Registration, account roles, and administrator access depend on the application's current configuration.

## 📚 API Documentation

HealthConnect includes Swagger / OpenAPI documentation for exploring the backend API.

Once the backend is running, open the Swagger documentation route configured in your project.

For example, if Swagger is mounted at `/api-docs`, visit:

```text
http://localhost:5000/api-docs
```

The exact URL depends on your backend configuration.

The API supports functionality across authentication, users, appointments, medical records, prescriptions, and dashboard data. Consult the live API documentation and route definitions for the available endpoints and required permissions.

## 🔐 Authorization Overview

HealthConnect uses role-based access controls to separate the responsibilities of its three user roles.

| Capability | Patient | Doctor | Admin |
|---|---|---|---|
| Access personal dashboard | Yes | Yes | Yes |
| Manage own profile | Yes | Yes | Yes |
| Book appointments | Yes | No | Management access |
| Manage assigned appointments | No | Yes | Management access |
| Access medical records | Own authorized records | Authorized clinical workflows | Management access |
| Create clinical records | No | Yes, for eligible workflows | Management access |
| Create prescriptions | No | Yes, for eligible workflows | Management access |
| Manage registered users | No | No | Yes |

Actual permissions are determined by the backend authorization rules and individual resource ownership checks.

## 🧪 Testing & Verification

The application has undergone manual functional checks across patient, doctor, and administrator workflows.

Testing has covered areas including:

- Authentication and protected routes.
- Role-based access control.
- Appointment booking and status management.
- Medical record creation and access.
- Prescription creation and patient access.
- Profile management.
- Administrative user management.
- Medical document access restrictions.
- Input validation and rate limiting.
- Security headers and CORS behavior.

The project is still subject to final performance investigation, production configuration checks, and deployment verification. This README does not claim that automated test coverage or production deployment is complete.

## 🚀 Deployment

HealthConnect is intended to be deployable as a separate frontend and backend application.

Before deploying:

1. Choose hosting providers for the frontend and backend.
2. Configure a production MongoDB database.
3. Set production environment variables and a strong JWT secret.
4. Configure the frontend API URL to point to the deployed backend.
5. Set CORS to allow only the intended production frontend origin.
6. Ensure uploaded medical documents are stored and served securely.
7. Verify authentication, authorization, and resource ownership in the deployed environment.
8. Test all three roles against the deployed application.
9. Confirm that production error handling does not expose internal details.
10. Verify HTTPS, logging, backups, and operational monitoring.

**Deployment status:** Update this section once the application has been successfully deployed and verified.

## 🔮 Future Improvements

Potential future improvements include:

- Automated unit, integration, and end-to-end tests.
- Appointment reminders and notification workflows.
- More advanced appointment scheduling.
- Improved analytics and reporting.
- Further performance optimization and monitoring.
- Expanded accessibility and responsive design checks.
- Production deployment automation.
- More comprehensive audit logging for sensitive clinical operations.

These are possible enhancements, not claims that the features are already implemented.

## 🎓 Project Purpose

HealthConnect was developed as a full-stack software engineering project to explore how modern web technologies can support healthcare administration and patient-doctor workflows.

The project emphasizes maintainable application structure, RESTful API development, authentication, authorization, database integration, and protection of sensitive healthcare information.

## 👨‍💻 Author

**Cedrick Dzodzodzi**

- GitHub: [@Cedric-Raichand](https://github.com/Cedric-Raichand)

## 📄 License

A license has not been specified yet. If you intend to publish the project as open source, add a `LICENSE` file and update this section accordingly.

---

**HealthConnect — Connecting patients, doctors, and healthcare management through technology.**
