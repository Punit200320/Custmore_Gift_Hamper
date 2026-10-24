# Free Cloud Deployment Guide for Surreal Treasures

This project is fully configured for **100% Free Full-Stack Deployment** (Frontend + Spring Boot Backend + PostgreSQL Database).

---

## Option 1: 1-Click Free Deployment on Render (Recommended)

Render provides free hosting for all 3 components using the included [render.yaml](file:///c:/Users/DELL/Desktop/Prototype2/render.yaml) blueprint:
- **Database**: Managed PostgreSQL (`free` tier)
- **Backend**: Spring Boot 3 Web Service (`free` tier)
- **Frontend**: React Vite Static Site with SSL & global CDN (`free` tier)

### Steps to Deploy:
1. Go to [https://dashboard.render.com](https://dashboard.render.com) and log in with your GitHub account.
2. Click **New +** in the top navigation bar and select **Blueprint**.
3. Connect your GitHub repository: `Punit200320/Custmore_Gift_Hamper`.
4. Render will automatically detect the [render.yaml](file:///c:/Users/DELL/Desktop/Prototype2/render.yaml) file and display the 3 services:
   - `surreal-treasures-db` (PostgreSQL)
   - `surreal-treasures-backend` (Spring Boot Web Service)
   - `surreal-treasures-frontend` (React Static Site)
5. Click **Apply**.
6. Render will provision the PostgreSQL database, build the backend Docker container, seed the database with verified demo products, and deploy the frontend.
7. Once finished, click on the `surreal-treasures-frontend` URL to view your live deployed site!

---

## Option 2: Railway Deployment

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select `Custmore_Gift_Hamper`.
4. Add a **PostgreSQL** service by clicking **+ New** > **Database** > **Add PostgreSQL**.
5. Railway automatically sets `DATABASE_URL` in your backend environment.
6. The application is now live.

---

## Option 3: Local or VPS Deployment with Docker Compose

If you have Docker Desktop or an Ubuntu/Debian VPS:
```bash
# Start all 3 services in background
docker compose up -d

# View status
docker compose ps

# View backend logs
docker compose logs -f backend
```
- Frontend will be accessible at: `http://localhost`
- Backend API at: `http://localhost:8081`
- PostgreSQL at: `localhost:5432`
