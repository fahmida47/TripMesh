# 🌍 TripMesh

A web-based tourism marketplace platform that connects tourists with local guides, tour packages, and unique travel experiences.

TripMesh helps tourists discover personalized travel services while allowing local guides to showcase and manage their offerings.

---

## 📌 Project Overview

TripMesh is a Tourist-as-a-Service marketplace where users can:

- Explore destinations and tour packages
- Find and connect with local guides
- Book personalized travel experiences
- Manage tourist and guide profiles
- Share reviews and ratings

The platform focuses on creating a trusted connection between tourists and local service providers.

---

# 🚀 Application Flow Diagram

The following diagram represents the planned navigation flow, user roles, and major features of TripMesh.

```
docs/tripmesh-application-flow.mmd
```

---

# 👥 User Roles

## 🧳 Tourist

Features:

- Register and login
- Browse tour packages
- Search destinations
- View guide profiles
- Book tours
- Give reviews and ratings
- Manage profile


## 🧭 Guide

Features:

- Register as a guide
- Manage guide profile
- Create tour packages
- Manage booking requests
- Receive tourist reviews


---

# 📂 Project Structure

```
TripMesh/

├── frontend/        # React frontend
├── backend/         # Laravel backend
├── docs/            # Documentation
└── README.md
```

---

# 🛠️ Technology Stack

## Frontend

- React.js
- Vite
- Tailwind CSS


## Backend

- Laravel
- PHP


## Database

- MySQL


## Tools

- Git & GitHub
- VS Code
- Postman

---

# ⚙️ Backend Setup

Backend is developed using Laravel and located inside the `backend` folder.

## Requirements

- PHP 8.2+
- Composer
- MySQL
- Laravel


## Installation

Navigate to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
composer install
```

Create environment file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Configure database information in `.env`.

Run migrations:

```bash
php artisan migrate
```

Start Laravel server:

```bash
php artisan serve
```

---

# 🗄️ Database Structure

## Entities

### User Management

- Users
- Roles
- Tourist Profiles
- Guide Profiles


### Tourism Management

- Tour Packages
- Destinations
- Categories


### Booking Management

- Bookings
- Payments


### Engagement

- Reviews
- Ratings
- Favorites


---

# 🔗 Database Relationships

- One Role has many Users
- One User belongs to one Role
- One User can have one Tourist Profile
- One User can have one Guide Profile

- One Guide can create many Tour Packages
- One Destination has many Tour Packages
- One Category contains many Tour Packages

- One Tourist can create many Bookings
- One Tour Package can have many Bookings

- One Tourist can write many Reviews
- One Package can receive many Reviews

---

# 🌐 API Route Plan

## Authentication

| Method | Route |
|--------|-------|
| POST | /api/register |
| POST | /api/login |
| POST | /api/logout |
| GET | /api/profile |


## Guides

| Method | Route |
|--------|-------|
| GET | /api/guides |
| POST | /api/guides |
| GET | /api/guides/{id} |
| PUT | /api/guides/{id} |
| DELETE | /api/guides/{id} |


## Tour Packages

| Method | Route |
|--------|-------|
| GET | /api/packages |
| POST | /api/packages |
| GET | /api/packages/{id} |
| PUT | /api/packages/{id} |
| DELETE | /api/packages/{id} |


## Bookings

| Method | Route |
|--------|-------|
| GET | /api/bookings |
| POST | /api/bookings |
| GET | /api/bookings/{id} |
| PUT | /api/bookings/{id} |


## Reviews

| Method | Route |
|--------|-------|
| GET | /api/reviews |
| POST | /api/reviews |
| DELETE | /api/reviews/{id} |


---

# 🧪 Migration Status

Planned Laravel migrations:

- create_roles_table
- create_users_table
- create_tourist_profiles_table
- create_guide_profiles_table
- create_destinations_table
- create_categories_table
- create_tour_packages_table
- create_bookings_table
- create_payments_table
- create_reviews_table
- create_favorites_table


Run migrations:

```bash
php artisan migrate:fresh
```

---

# 🔮 Future Enhancements

- Real-time chat between tourists and guides
- Online payment system
- AI-based travel recommendations
- Location-based guide matching
- Mobile application support

---

# 🤝 Contribution

1. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

2. Commit changes

```bash
git commit -m "Add feature"
```

3. Push branch

```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

---

# 📄 License

This project is developed for academic purposes.
