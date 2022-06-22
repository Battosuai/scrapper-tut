import express, { Request, Response, NextFunction } from "express";
import mysql from "mysql";

const app = express();

const connectionString = process.env.DATABASE_URL || "";
const connection = mysql.createConnection(connectionString);
connection.connect();

app.use(express.json());

app.get("/api/characters", (req: Request, res: Response) => {
  const query = "Select * from Characters";
  try {
    connection.query(query, (err, rows) => {
      if (err) {
        res.json({
          success: false,
          payload: null,
        });
      } else {
        res.json({
          success: true,
          payload: rows,
        });
      }
    });
  } catch (error) {
    res.json({
      success: false,
      payload: null,
    });
  }
});

app.get("/api/character/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const query = `Select * from Characters Where ID=${id} Limit 1`;
  try {
    connection.query(query, (err, rows) => {
      if (err) {
        res.json({
          success: false,
          payload: null,
        });
      } else {
        res.json({
          success: true,
          payload: rows,
        });
      }
    });
  } catch (error) {
    res.json({
      success: false,
      payload: null,
    });
  }
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log("App running");
});
