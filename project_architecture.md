# HealHub: Doctor Booking Application Architecture

This document presents the comprehensive project architecture, database design, feature set, roles, and user flows for **HealHub**, a modern MERN-stack doctor booking application.

---

## 1. Technical Architecture

HealHub uses the **MERN (MongoDB, Express.js, React, Node.js)** stack. Below is the technical architecture diagram showing the relationship between the client, backend, database, and third-party integrations:

```mermaid
graph TD
    %% Styling
    classDef client fill:#e0f7fa,stroke:#00acc1,stroke-width:2px;
    classDef server fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef db fill:#e8f5e9,stroke:#4caf50,stroke-width:2px;
    classDef external fill:#ffebee,stroke:#e53935,stroke-width:2px;

    %% Client Layer
    subgraph Client ["Client Layer (React.js + Tailwind CSS)"]
        UI["React SPA Dashboard"]
        State["State Management (Redux/Context API)"]
        Axios["HTTP Client (Axios)"]
    end
    class Client,UI,State,Axios client;

    %% Backend Server Layer
    subgraph Server ["Server Layer (Node.js + Express.js)"]
        Routes["API Routes (Router)"]
        Auth["Auth Middleware (JWT)"]
        Controller["Controllers (Business Logic)"]
        Models["Mongoose Models (Data Layer)"]
    end
    class Server,Routes,Auth,Controller,Models server;

    %% Database Layer
    subgraph Database ["Database Layer"]
        MongoDB[("MongoDB Database")]
    end
    class Database,MongoDB db;

    %% External Services
    subgraph External ["External Services"]
        SMTP["Email/SMTP (Nodemailer)"]
        Gateway["Payment Gateway (Stripe/Razorpay)"]
    end
    class External,SMTP,Gateway external;

    %% Connections
    UI --> State
    State --> Axios
    Axios -- "HTTPS Requests (JSON / JWT)" --> Routes
    Routes --> Auth
    Auth --> Controller
    Controller --> Models
    Models -- "Mongoose queries" --> MongoDB
    Controller -- "Transactional Emails" --> SMTP
    Controller -- "Payment Checkouts" --> Gateway
```

---

## 2. ER Diagram (Database Model)

The MongoDB database model features schemas for **Users**, **Doctors**, **Appointments**, and **Reviews**. Since MongoDB is document-based, we reference relationships using ObjectIDs.

```mermaid
erDiagram
    USER {
        ObjectId id PK
        string name
        string email
        string password
        string role "patient | doctor | admin"
        string avatar
        string phone
        string gender
    }
    
    DOCTOR {
        ObjectId id PK
        ObjectId userId FK "Ref: USER"
        string specialization
        string qualification
        string bio
        number ticketPrice
        array ticketAvailability "Days & Hours"
        string status "pending | approved | rejected"
        number averageRating
        number totalRating
    }

    APPOINTMENT {
        ObjectId id PK
        ObjectId userId FK "Ref: USER (Patient)"
        ObjectId doctorId FK "Ref: DOCTOR"
        date date
        string timeSlot
        number ticketPrice
        string status "pending | approved | cancelled | completed"
        boolean isPaid
    }

    REVIEW {
        ObjectId id PK
        ObjectId userId FK "Ref: USER (Patient)"
        ObjectId doctorId FK "Ref: DOCTOR"
        string reviewText
        number rating "1 to 5"
    }

    USER ||--o| DOCTOR : "has details if role is doctor"
    USER ||--o{ APPOINTMENT : "books"
    DOCTOR ||--o{ APPOINTMENT : "receives"
    USER ||--o{ REVIEW : "writes"
    DOCTOR ||--o{ REVIEW : "receives"
```

---

## 3. Features

### Patient Features
*   **Authentication & Profile**: Signup, login (with secure passwords), and profile updates (avatar upload, gender, contact info).
*   **Doctor Search & Filter**: Search doctors by name, specialization, or filter by rating/price.
*   **Booking System**: Choose available time slots and schedule appointments.
*   **Ratings & Reviews**: Give feedback and ratings (1–5 stars) to doctors after consultations.
*   **My Bookings**: View booking history, booking status (pending/approved), and payment receipts.

### Doctor Features
*   **Application & Onboarding**: Fill out professional profiles (bio, qualifications, pricing, specializations, schedule) for admin approval.
*   **Dashboard**: View daily scheduled appointments, pending requests, total earnings, and reviews.
*   **Time Management**: Define and update work hours and availability slots.

### Admin Features
*   **Dashboard Analytics**: Overview of total users, active doctors, overall earnings, and appointments.
*   **Doctor Verification**: Approve/reject pending doctor applications.
*   **User & Review Management**: Monitor system reviews and manage patient/doctor accounts.

---

## 4. Roles and Responsibilities

| Role | Responsibilities | Key Actions | Access Level |
| :--- | :--- | :--- | :--- |
| **Patient** | Manages personal health profile, finds care, and reviews doctors. | Search, book appointments, make payments, write reviews. | Standard |
| **Doctor** | Manages availability, details, and schedules. | Set availability, view dashboards, accept/reject consultations. | Elevated |
| **Admin** | Moderates platforms, handles verification, and oversees analytics. | Approve/reject doctors, manage listings, view metrics. | Administrator |

---

## 5. User Flows

### A. Appointment Booking Flow (Patient Perspective)
```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant Frontend as Client (React)
    participant Backend as Server (Express)
    participant DB as MongoDB
    participant Stripe as Payment Gateway

    Patient->>Frontend: Select Doctor & Date/Time
    Frontend->>Backend: Request checkout session (doctorId, slot, userId)
    Backend->>DB: Verify Doctor availability
    DB-->>Backend: Availability confirmed
    Backend->>Stripe: Create checkout session
    Stripe-->>Backend: Session details & URL
    Backend-->>Frontend: Send Session URL
    Frontend->>Patient: Redirect to Payment Page
    Patient->>Stripe: Submit Payment Info
    Stripe-->>Backend: Webhook / Payment Success Event
    Backend->>DB: Create APPOINTMENT record (status: pending/approved, isPaid: true)
    Backend-->>Frontend: Redirect to Success Screen
    Frontend->>Patient: Display confirmation screen
```

### B. Doctor Onboarding & Approval Flow
```mermaid
graph TD
    A[Doctor Registers User Account] --> B[Doctor completes professional Profile]
    B --> C{Profile submitted}
    C -->|Status: Pending| D[Admin logs into Admin Dashboard]
    D --> E{Admin reviews profile}
    E -->|Approved| F[Status set to 'Approved' - Doctor visible to patients]
    E -->|Rejected| G[Status set to 'Rejected' - Doctor prompted to update details]
```

---

## 6. MVC (Model-View-Controller) Pattern

The backend is structured around the classic **MVC pattern** (with React serving as the "View" layer, and Node/Express representing the "Controller" and "Model" layers):

```
backend/
├── config/             # Configuration files (Database connection)
├── controllers/        # Controllers (Handles requests/responses and logic)
│   ├── authController.js
│   ├── userController.js
│   ├── doctorController.js
│   └── bookingController.js
├── models/             # Mongoose Models (Defines database schema structures)
│   ├── User.js
│   ├── Doctor.js
│   ├── Appointment.js
│   └── Review.js
├── routes/             # Routes (Maps URL endpoints to Controllers)
│   ├── auth.js
│   ├── users.js
│   ├── doctors.js
│   └── bookings.js
├── middleware/         # Middleware (Token verification, authorization roles)
│   └── authMiddleware.js
└── index.js            # Entry Point (Starts Express server)
```

### Core Architecture Responsibilities:
*   **Model**: Contains the schema validation logic and directly queries MongoDB via Mongoose.
*   **View (React Component)**: Renders the interface, reads the global state (Redux/Context), and fires requests via Axios.
*   **Controller**: Extracts parameters from the request, invokes models to fetch/update data, coordinates notifications/emails/payments, and returns JSON payloads.
