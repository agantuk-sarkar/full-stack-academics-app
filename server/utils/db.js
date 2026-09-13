import fs from "fs";
import path from "path";

const db_path = path.join(import.meta.dirname, "../db.json");

export function readDatabase() {
  const data = fs.readFileSync(db_path, "utf-8");
  return JSON.parse(data);
}

export function writeDatabase(data) {
  fs.writeFileSync(db_path, JSON.stringify(data));
}
