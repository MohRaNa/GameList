const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const { connectToDatabase } = require("./db"); // Import the connectToDatabase function
const app = express();
const port = 8585;

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function main() {
  try {
    const db = await connectToDatabase();
    routes(app, db);
    app.listen(port, () => {
      console.log("Servidor escuchando en puerto: " + port);
    });
  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);

// DEPRECATED: We used it for debugging purposes
async function listDatabases(db) {
  databasesList = await db.admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}
