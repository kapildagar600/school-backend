const pool = require('./config/db')

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT DATABASE();");
    console.log("Connected to database:", rows[0]['DATABASE()']);
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }  
}
testConnection();