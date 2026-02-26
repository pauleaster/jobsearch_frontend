# jobsearch_frontend

React.js front end for the jobsearch database allowing for editing job details and saving to backend MS SQL Server database.

## Project Structure

This project follows an MVC (Model-View-Controller) architecture:

### Controller
- [`AppController.js`](src/controller/AppController.js) - Main application controller managing state and orchestrating interactions between model and view

### Model
- [`api.js`](src/model/api.js) - API layer for communicating with the backend server, including functions to fetch jobs, search terms, and job details

### View
- [`App.js`](src/view/App.js) - Main application view component
- [`App.css`](src/view/App.css) - Application-wide styles

#### Components
- [`DataTable.js`](src/view/components/DataTable.js) - Displays the list of jobs with matching terms
- [`FetchButtons.js`](src/view/components/FetchButtons.js) - Buttons for fetching and filtering job data
- [`JobDetailsTable.js`](src/view/components/JobDetailsTable.js) - Displays detailed information for a selected job with inline editing capabilities
- [`JobTypeControl.js`](src/view/components/JobTypeControl.js) - Control for filtering by current/applied job status
- [`SaveConfirmationDialog.js`](src/view/components/SaveConfirmationDialog.js) - Modal dialog for confirming save operations
- [`SearchTerms.js`](src/view/components/SearchTerms.js) - Displays and manages search term selection

### Utils
- [`transform.js`](src/utils/transform.js) - Utility functions for data transformation and date formatting

### Other Files
- [`index.js`](src/index.js) - Application entry point
- [`index.css`](src/index.css) - Global styles
- [`App.test.js`](src/App.test.js) - Test file for the App component
- [`setupTests.js`](src/setupTests.js) - Test configuration
- [`reportWebVitals.js`](src/reportWebVitals.js) - Performance monitoring

## Features

- Fetch and display job listings from the backend database
- Filter jobs by search terms
- Filter jobs by current/applied status
- View detailed job information
- Edit job details with inline editing
- Date field support with format conversion (dd/MM/yyyy ↔ ISO format)
- Save changes to the backend database with confirmation dialog
- Responsive table layout with scrolling support

## Available Scripts

In the project directory, you can run:

- `npm start` - Runs the app in development mode
- `npm run start-http` - Runs the app on port 3000
- `npm run start-https` - Runs the app on port 3003 with HTTPS
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

