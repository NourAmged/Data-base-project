# SQL Query Executor – E-commerce Database Project

This project is a web-based SQL query executor and table manager for an e-commerce database, built with Node.js, Express, and Microsoft SQL Server. It provides a user-friendly interface to run SQL queries, view and edit table data, and manage records interactively.

## Features

- **Run Arbitrary SQL Queries:**
  - Enter and execute custom SQL queries directly from the web interface.
- **Table Data Viewer:**
  - Select from a list of e-commerce tables and view their contents in a dynamic table.
- **Add, Edit, and Delete Rows:**
  - Easily add new records, edit existing ones, or delete rows from any table.
- **Modern UI:**
  - Responsive and clean design for easy data management.

## Technologies Used

- **Frontend:**
  - HTML, CSS, JavaScript (vanilla)
  - Webpack for bundling
- **Backend:**
  - Node.js with Express
  - `mssql` for SQL Server connectivity
  - CORS and Body-Parser middleware

## Project Structure

```
├── package.json
├── webpack.config.js
├── src/
│   ├── index.html         # Main HTML page
│   ├── index.js           # Frontend logic (UI, fetch, table actions)
│   ├── server-mssql.js    # Express backend server
│   └── style.css          # Stylesheet
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- Access to a Microsoft SQL Server instance

### Installation
1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd dataBase-project
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

### Configuration
- Edit `src/server-mssql.js` to set your SQL Server credentials and database info in the `dbConfig` object:
  ```js
  const dbConfig = {
      user: "<username>",
      password: "<password>",
      server: "<server-ip>",
      database: "<database-name>",
      options: {
          encrypt: true,
          trustServerCertificate: true,
      },
  };
  ```

### Running the Application
1. **Start the backend server:**
   ```sh
   node src/server-mssql.js
   ```
2. **Build and serve the frontend:**
   ```sh
   npm run build
   # Serve the dist/ folder with your preferred static server, or use Live Server in VS Code
   ```
   - Or open `dist/index.html` in your browser after building.

### Usage
- Use the dropdown to select a table and view its data.
- Use the **Add** button to insert new records.
- Use **Edit** and **Delete** buttons to modify or remove records.
- Enter custom SQL queries in the textarea and click **Execute** to run them.

## Notes
- The backend server listens on `http://localhost:3000` by default.
- Ensure your SQL Server allows remote connections and the credentials are correct.
- For production, consider securing the API and sanitizing queries to prevent SQL injection.

## License
This project is licensed under the ISC License.
