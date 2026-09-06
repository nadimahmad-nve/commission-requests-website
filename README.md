# Commission Tracker

A full-stack web application designed to streamline, manage, and organise commission requests. The platform allows clients to submit project details and provides a secure admin dashboard to review, track, and update request statuses. 

## Features
* **Client Submission Form:** Users can submit project requests, including their Discord tag, budget, and project description.
* **Secure Admin Dashboard:** A password-protected interface to view and manage incoming commissions.
* **Status Tracking:** Organise requests by their current state (e.g., Pending, Accepted, Completed).
* **Automated CI Pipeline:** GitHub Actions workflow ensures all frontend and backend tests pass before deployment.
* **Full Containerisation:** Dockerised frontend (served via Nginx) and backend for seamless deployment and consistent local development.

## Tech Stack
* **Frontend:** React, Vite, Vitest, React Testing Library, Nginx
* **Backend:** Python 3.12, FastAPI, SQLAlchemy, Pytest, Uvicorn
* **Database:** PostgreSQL (production/local) & SQLite (for isolated testing)
* **DevOps:** Docker, Docker Compose, GitHub Actions

## Prerequisites
Ensure you have the following installed on your machine:
* [Docker and Docker Desktop](https://www.docker.com/products/docker-desktop/) (with WSL 2 enabled for Windows users)
* [Git](https://git-scm.com/)
* Node.js v20+ (for local frontend development without Docker)
* Python 3.12+ (for local backend development without Docker)

## Getting Started (Docker Compose)

The easiest way to run the application is via Docker Compose, which will automatically build the frontend, backend, and set up a local PostgreSQL database.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/commission-requests-website.git](https://github.com/your-username/commission-requests-website.git)
   cd commission-requests-website
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `backend` directory (or update the existing configuration) with your database credentials. For local Docker testing, the `docker-compose.yml` automatically injects the correct database URL.

3. **Build and spin up the containers:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   * **Frontend:** Open `http://localhost` in your web browser.
   * **Backend API / Swagger Docs:** Open `http://localhost:8000/docs`.

## Local Development (Without Docker)

If you prefer to run the servers directly on your machine for faster hot-reloading:

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Testing

The project uses isolated testing environments to ensure database interactions do not interfere with live data.

**Run Backend Tests (Pytest):**
Tests are run using a temporary SQLite database that automatically resets between tests via a Pytest fixture.
```bash
cd backend
python -m pytest
```

**Run Frontend Tests (Vitest):**
Tests use `jsdom` to simulate a browser environment and rigorously test UI rendering and state changes.
```bash
cd frontend
npx vitest run
```

## Continuous Integration (CI)

This repository enforces quality control via a GitHub Actions CI pipeline (`.github/workflows/ci.yml`). Upon every push to the `main` branch, GitHub spins up isolated Ubuntu runners to:
1. Set up Node.js and Python environments.
2. Install all dependencies.
3. Execute the Vitest and Pytest test suites in parallel.
4. Block deployments if any tests fail.