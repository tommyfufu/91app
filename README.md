# Batch Data Uploader - 91App
## Overview
This project implements a batch data upload system using Node.js and Express.js. It's designed to allow users to upload large datasets in batches, ensuring efficient data handling and processing. The project includes an API service for handling batch uploads and a utility script for generating and uploading test data.

## Features
* **API Service**: A RESTful API that supports creating upload sessions, uploading data in batches, and finalizing sessions while validating the total records uploaded.
* **Data Upload Utility**: A Node.js script to automatically generate and upload test data in specified batch sizes to the API.

## Architecture
The application is structured into two main components:
* **API Service** (`app/`): Contains the Express application that defines endpoints for batch data uploading.
* **Data Upload Utility** (`utils/`): Houses uploadTestData.js, a script for generating test data and uploading it to the API service in batches.

### API Endpoints ([Document](https://docs.google.com/document/d/1cRM8FWg4uiOtlUtg1KH4NvOdP2U-HkdqBFxTcq0GxS0/edit))
* `POST /api/upload/sessions`: Create a new upload session.
* `POST /api/upload/sessions/:sessionId`: Upload a batch of data for a given session.
* `POST /api/upload/sessions/:sessionId/finish`: Finalize the upload session and validate the data.

## Getting Started
### Prerequisites
* [Docker](https://www.docker.com/)
* [Node.js](https://nodejs.org/en)

### Running the Project
**1. Clone the Repository**
```bash=
git clone https://github.com/tommyfufu/91app.git
cd 91app
```
**2. Start the API Service**
Navigate to the project root directory and start the service using Docker Compose:
```bash=
docker-compose up --build
```
This command builds the Docker image for the API service and starts it. The API will be accessible at http://localhost:3000.

**3. Upload Test Data**
After the API service is running, you can use the data upload utility to generate and upload test data. First, ensure you have Node.js installed on your machine. Then, run:

```bash=
cd utils
node dataUploader.js
```
Follow the prompts to specify how many records you want to upload. The script will create an upload session, upload the data in batches, and finalize the session.

### Demo
[![Demo Video](https://img.youtube.com/vi/6vHIcJhai2Y/maxresdefault.jpg)](https://youtu.be/6vHIcJhai2Y)
