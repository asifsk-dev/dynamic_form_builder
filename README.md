# FormBuilder API

FormBuilder is a RESTful API to create and manage forms, fields, and submissions. It includes user authentication, JWT security, and supports pagination, filtering, and CSV export for submissions.

---

## Table of Contents
- Installation
- Running the App
  - Without Docker
  - With Docker
- API Overview
- Swagger Documentation
- License

---

## Installation

1. Clone the repository:
```bash
git clone https://github.com/asifsk-dev/dynamic_form_builder.git
cd dynamic_form_builder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with required environment variables. Example:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/formbuilder
OR
MONGO_URI=mongodb://mongo:27017/formbuilder ## Incase of docker run
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

---

## Running the App

### Without Docker

1. Make sure MongoDB is running locally.
2. Start the server:
```bash
npm run dev
```
3. The API will be available at: `http://localhost:4000`

---

### With Docker Compose

1. Build and start the container:
```bash
docker-compose up --build
```

2. Stop the container:
```bash
docker-compose down
```

3. The API will be available at: `http://localhost:4000`

---

## API Overview

The API is organized into the following **tags**:

### Auth
- **Login**: Authenticate a user and get a JWT token.
- **Register**: Register a new user.

### Forms
- **Get All Forms**: Retrieve all forms with pagination.
- **Get Single Form**: Retrieve a specific form by ID.
- **Create Form**: Create a new form.
- **Update Form**: Update form details.
- **Delete Form**: Soft-delete a form.

### Fields
- **Add Field(s)**: Add fields to a form.
- **Update Field**: Update a specific field.
- **Reorder Fields**: Change the order of fields.
- **Delete Field**: Soft-delete a field.

### Submissions
- **Submit Answers**: Submit form responses.
- **Get All Submissions**: Retrieve submissions with filtering and pagination.
- **Export Submissions**: Export submissions in CSV format.

### Misc
- **Ping**: Check if the API is active.

---

## Swagger Documentation

You can explore the full API documentation and test endpoints using Swagger UI:

`http://localhost:4000/api-docs`

---

## License

This project is licensed under the MIT License.