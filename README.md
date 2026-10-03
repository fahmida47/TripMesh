# TripMesh

**TripMesh** is a Tourist-as-a-Service marketplace that connects **Tourists** with **Guides and Guide Companies** for personalized travel experiences across Bangladesh.

The platform provides location-based discovery, guide/company profiles, travel requests, notifications, payment workflow, and role-based dashboards for Tourists, Guides, and Admins.

---

## ✨ Features

### 👤 Tourist

* Create and manage tourist profile
* Explore available guides and guide companies
* Search and discover experiences by location
* Send travel requests to guides
* Receive guide/company notifications
* Track travel request status
* Make payments after request approval
* View tourist dashboard
* Chat Option

### 🧭 Guide

* Create and manage guide profile
* Add travel experience information
* Receive travel requests
* Accept or manage requests
* Receive payment-related updates
* Manage guide dashboard
* Chat Option

### 🏢 Guide Company

* Manage company information
* Publish travel experiences and packages
* Receive tourist requests
* Manage company-side travel activities

### 🛡️ Admin

* Secure admin authentication
* Review and manage platform activities
* Review guide/company information
* Manage users and administrative operations
* Monitor platform data
* Chat Option

---

## 🏗️ Technology Stack

| Layer                     | Technology      |
| ------------------------- | --------------- |
| Frontend                  | React.js + Vite |
| Backend                   | Laravel / PHP   |
| Authentication            | JWT             |
| Database                  | MySQL 8         |
| Database Containerization | Docker          |
| Web Server                | Nginx           |
| Application Server        | PHP-FPM         |
| CI/CD                     | GitHub Actions  |
| API Testing               | Postman         |
| Version Control           | Git + GitHub    |

### Architecture Note

TripMesh does **not** containerize the frontend and backend.

The current deployment architecture uses:

* **React/Vite frontend** built as static assets
* **Laravel backend** running directly with PHP-FPM
* **MySQL** running inside Docker
* **Nginx** as the reverse proxy/web server
* **GitHub Actions** for automated deployment

---

# 📋 Prerequisites

Before setting up TripMesh locally, install the following software:

* Git
* PHP 8.4+
* Composer
* Node.js LTS
* npm
* Docker Desktop
* Docker Compose
* MySQL 8.x (or MySQL through Docker)
* Visual Studio Code
* Postman
* A modern web browser

### Verify Installation

```bash
git --version
php -v
composer --version
node -v
npm -v
docker --version
docker compose version
```

---

# 🚀 Local Development Setup

Follow these steps to run TripMesh from a fresh clone.

## 1. Clone the Repository

```bash
git clone https://github.com/fahmida47/TripMesh.git
cd TripMesh
```

---

## 2. Start MySQL

TripMesh uses Docker for the MySQL database.

From the project root:

```bash
docker compose up -d
```

Check the running containers:

```bash
docker ps
```

The backend and frontend are **not** started as Docker containers.

---

# 🔧 Backend Setup

## 3. Go to the Backend

```bash
cd backend
```

---

## 4. Create the Environment File

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Linux/macOS

```bash
cp .env.example .env
```

---

## 5. Install PHP Dependencies

```bash
composer install
```

---

## 6. Generate Laravel Application Key

```bash
php artisan key:generate
```

---

## 7. Configure the Database

Update the database configuration in:

```text
backend/.env
```

The configuration should point to the MySQL database running through Docker.

Do **not** commit the `.env` file or database credentials to GitHub.

---

## 8. Run Database Migrations

```bash
php artisan migrate
```

If the project requires seed data:

```bash
php artisan db:seed
```

---

## 9. Start the Laravel Backend

```bash
php artisan serve
```

The Laravel backend will be available through the local development server.

Keep this terminal running.

---

# 🎨 Frontend Setup

## 10. Open a New Terminal

From the project root:

```bash
cd frontend
```

---

## 11. Install Node Dependencies

```bash
npm install
```

---

## 12. Configure the API

Make sure the frontend API configuration points to the local Laravel backend.

The API configuration is maintained in the frontend configuration files.

---

## 13. Start the React Development Server

```bash
npm run dev
```

Vite will provide the local frontend development URL in the terminal.

Open that URL in a browser.

---

# 🧪 API Testing

TripMesh APIs can be tested using **Postman**.

Typical API verification includes:

* Authentication
* User registration/login
* Tourist requests
* Guide operations
* Company operations
* Notifications
* Payment-related APIs
* Admin APIs
* Health/API endpoints

---

# 📦 Production Deployment

TripMesh is deployed on a Linux VPS using the following architecture:

```text
                    Internet
                       │
                       ▼
              ┌─────────────────┐
              │      Nginx      │
              │ Reverse Proxy   │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │ Laravel Backend │
              │    PHP-FPM      │
              └────────┬────────┘
                       │
                       │ MySQL
                       ▼
              ┌─────────────────┐
              │ Docker MySQL    │
              │  cse3100-db     │
              └─────────────────┘
```

The React frontend is built into static production assets and served through the Laravel/Nginx deployment.

---

## 1. Connect to the VPS

```bash
ssh <deployment-user>@<server-ip>
```

SSH key-based authentication should be used for secure access.

---

## 2. Update the Server

```bash
sudo apt update
sudo apt upgrade -y
```

---

## 3. Install Required Server Packages

```bash
sudo apt install -y git nginx curl unzip tar acl
```

PHP 8.4 and PHP-FPM should also be installed and configured on the server.

Verify PHP:

```bash
php -v
```

Verify Nginx:

```bash
nginx -v
```

---

## 4. Install and Configure Docker

Verify Docker:

```bash
docker --version
docker compose version
```

The production MySQL database runs inside Docker.

Check the database container:

```bash
sudo docker ps
```

The production database container used by the project is:

```text
cse3100-db
```

---

## 5. Prepare the Laravel Application Directory

```bash
mkdir -p ~/laravel
```

For the initial server setup, the project can be cloned or the deployment package can be transferred to the server.

The GitHub Actions pipeline subsequently deploys the prepared release package automatically.

---

## 6. Configure Production Environment

Create the Laravel environment file:

```bash
cd ~/laravel
nano .env
```

Configure the production values for:

* Application environment
* Application URL
* Database connection
* Database host
* Database port
* Database name
* Database username
* Other required application settings

Production secrets must remain on the server and must **never be committed to GitHub**.

---

## 7. Install Laravel Dependencies

```bash
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
```

---

## 8. Configure Storage and Cache Permissions

```bash
mkdir -p storage
mkdir -p bootstrap/cache

chmod -R u+rwX storage bootstrap/cache
```

The web server must have the required access to Laravel's storage and cache directories.

---

## 9. Run Production Migrations

```bash
php artisan migrate --force
```

The `--force` option allows migrations to run in the production environment without an interactive confirmation.

---

## 10. Optimize Laravel

```bash
php artisan optimize
```

---

# 🌐 Nginx Configuration

Nginx is used as the web server and reverse proxy for the TripMesh application.

The production server uses a site configuration similar to:

```text
/etc/nginx/sites-available/tripmesh.austattendance.online
```

The site is enabled through:

```text
/etc/nginx/sites-enabled/
```

After updating the configuration, test Nginx:

```bash
sudo nginx -t
```

If the configuration is valid:

```bash
sudo systemctl reload nginx
```

---

# 🔐 HTTPS

The production domain is:

```text
tripmesh.austattendance.online
```

HTTPS should be configured using a valid TLS certificate.

Verify HTTPS:

```bash
curl -I https://tripmesh.austattendance.online
```

The browser should also display the secure HTTPS connection when accessing the production application.

---

# ⚙️ CI/CD Pipeline

TripMesh uses **GitHub Actions** for automated deployment.

The workflow is located at:

```text
.github/workflows/deploy.yml
```

## Deployment Trigger

The deployment pipeline runs when:

```text
push → main
```

It can also be started manually through GitHub Actions using:

```text
workflow_dispatch
```

---

## CI/CD Flow

```text
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Checkout source code
    │
    ├── Setup PHP 8.4
    │
    ├── Composer install
    │
    ├── Setup Node.js LTS
    │
    ├── npm ci
    │
    ├── npm run build
    │
    ├── Verify production assets
    │
    ├── Create release.tar.gz
    │
    ├── Transfer release using SCP
    │
    ▼
VPS
    │
    ├── Extract release
    ├── Run migrations
    ├── Optimize Laravel
    └── Serve through Nginx
```

---

## 🔑 Deployment Security

The CI/CD workflow uses GitHub repository secrets for SSH authentication.

The private deployment key is stored as:

```text
SSH_PRIVATE_KEY
```

The workflow does not store the private key directly in the repository.

Production `.env` files and secrets are excluded from the deployment package.

---

# 📁 Release Package

Before deployment, GitHub Actions creates:

```text
release.tar.gz
```

The package contains the Laravel application and required production dependencies.

The following are explicitly excluded:

```text
.git
.env
.env.*
node_modules
```

The workflow also verifies that:

```text
vendor/autoload.php
```

and

```text
public/app/index.html
```

exist before deployment.

---

# 🖥️ Production Server

Current production environment:

| Component           | Configuration                    |
| ------------------- | -------------------------------- |
| Operating System    | Ubuntu 24.04.5 LTS               |
| Web Server          | Nginx                            |
| Application Runtime | PHP 8.4 + PHP-FPM                |
| Database            | MySQL 8.0                        |
| Database Runtime    | Docker                           |
| Database Container  | `cse3100-db`                     |
| Application         | Laravel                          |
| Frontend            | React + Vite                     |
| CI/CD               | GitHub Actions                   |
| Domain              | `tripmesh.austattendance.online` |

---

# 🔍 Deployment Verification

After deployment, verify the following:

## 1. Check the Live Application

Open:

```text
https://tripmesh.austattendance.online
```

Verify that the application loads correctly.

---

## 2. Verify VPS Identity

```bash
whoami && hostname && date && echo "<Team IDs>"
```

---

## 3. Verify Running Services

Check the database container:

```bash
sudo docker ps
```

Check Nginx:

```bash
sudo systemctl status nginx
```

Check PHP-FPM:

```bash
sudo systemctl status php8.4-fpm
```

---

## 4. Verify API Health

Use the project's health endpoint:

```bash
curl https://tripmesh.austattendance.online/api/health
```

If the endpoint exposes the deployed commit SHA, verify that it matches the commit deployed by the latest successful GitHub Actions run.

---

## 5. Verify CI/CD

Open the repository's **Actions** tab and verify that the latest deployment workflow completed successfully.

---

## 6. Verify HTTPS Certificate

```bash
curl -I https://tripmesh.austattendance.online
```

A successful HTTPS response confirms that the domain is reachable over TLS.

---

# 🧑‍💻 Development Workflow

Recommended workflow for contributors:

```bash
git checkout main
git pull origin main
```

Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

After making changes:

```bash
git status
git add .
git commit -m "describe your change"
git push origin feature/your-feature-name
```

Create a Pull Request on GitHub.

After the approved changes are merged into `main`, the CI/CD workflow can deploy the latest production release.

---

# 📂 Project Structure

```text
TripMesh/
│
├── backend/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── docker-compose.yml
└── README.md
```

---

# 👥 Team

**TripMesh** was developed as a team project for **CSE 3100 – Software Development IV** at **Ahsanullah University of Science and Technology (AUST)**.

---

# 📄 License

This project was developed for academic purposes as part of the CSE 3100 Software Development IV course.
