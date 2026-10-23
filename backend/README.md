# Surreal Treasures Backend

Spring Boot 3 backend service for the **Surreal Treasures Custom Gift Hamper Suggester**.

---

## 🛠 Tech Stack

- **Language:** Java 21+
- **Framework:** Spring Boot 3.3.5
- **Build Tool:** Apache Maven 3.9+
- **Database:** PostgreSQL (Driver + Spring Data JPA)
- **Validation:** Jakarta Validation (`spring-boot-starter-validation`)
- **Testing:** JUnit 5, MockMvc, Spring Boot Test, H2 In-Memory Database (for testing)
- **AI Integration:** OpenRouter API (configurable model)

---

## 📁 Package Architecture

```
backend/
├── pom.xml
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── main/
    │   ├── java/com/surrealtreasures/
    │   │   ├── SurrealTreasuresApplication.java
    │   │   ├── config/             # CORS, Security, OpenRouter configuration
    │   │   ├── controller/         # REST Controllers (e.g. HealthController)
    │   │   ├── dto/                # Data Transfer Objects (Request/Response)
    │   │   ├── entity/             # JPA Relational Entities
    │   │   ├── exception/          # Custom exceptions & GlobalExceptionHandler
    │   │   ├── integration/        # External clients (OpenRouter AI)
    │   │   ├── repository/         # Spring Data JPA Repositories
    │   │   └── service/            # Business & hamper suggestion services
    │   └── resources/
    │       ├── application.yml     # Application configuration with env bindings
    │       └── schema.sql          # Relational PostgreSQL DDL schema
    └── test/
        ├── java/com/surrealtreasures/
        │   ├── HealthControllerTest.java
        │   └── SurrealTreasuresApplicationTests.java
        └── resources/
            └── application-test.yml # In-memory H2 config for automated tests
```

---

## ⚙️ Prerequisites

1. **Java JDK 21 or higher**
   ```bash
   java -version
   ```
2. **Apache Maven 3.9 or higher**
   ```bash
   mvn -version
   ```
3. **PostgreSQL 14 or higher** (for local development/production database)
4. **OpenRouter API Key** (for AI gift hamper suggestion integration)

---

## 🚀 Getting Started

### 1. Environment Setup

Copy `.env.example` or export the required environment variables:

```bash
# PostgreSQL
export DB_URL=jdbc:postgresql://localhost:5432/surreal_treasures
export DB_USERNAME=postgres
export DB_PASSWORD=your_password

# CORS Allowed Origins
export CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# OpenRouter AI
export OPENROUTER_API_KEY=your_openrouter_api_key
export OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
export OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

*Note: On Windows PowerShell:*
```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/surreal_treasures"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your_password"
$env:OPENROUTER_API_KEY="your_key"
```

### 2. Run Tests

To compile the codebase and run all automated unit and integration tests (uses the in-memory H2 test profile):

```bash
mvn clean test
```

### 3. Run the Backend Locally

```bash
mvn spring-boot:run
```

By default, the server will start on port `8080`.

---

## 📡 API Endpoints (Foundation)

| Method | Endpoint | Description | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check | `{"status":"UP","service":"Surreal Treasures Backend","version":"1.0.0","timestamp":"..."}` |

---

## 🛡 Security & CORS

- CORS is pre-configured for the React frontend running on `http://localhost:5173` and `http://localhost:3000`.
- Origins can be customized via `CORS_ALLOWED_ORIGINS`.
- Real credentials and API keys should never be committed to git.
