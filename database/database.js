import { openDatabaseSync } from "expo-sqlite";

const db = openDatabaseSync("nutrition.db");

export const initDatabase = () => {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      calories REAL,
      protein REAL,
      carbs REAL,
      fat REAL,
      servingSize TEXT,
      unit TEXT
    );

    CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      foodName TEXT,
      calories REAL,
      protein REAL,
      carbs REAL,
      fat REAL,
      servings REAL,
      mealType TEXT,
      date TEXT
    );
  `);
};

export const addMeal = async (meal, callback) => {
  const {
    foodName,
    calories,
    protein,
    carbs,
    fat,
    servings,
    mealType,
    date,
  } = meal;

  await db.runAsync(
    `INSERT INTO meals (foodName, calories, protein, carbs, fat, servings, mealType, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [foodName, calories, protein, carbs, fat, servings, mealType, date]
  );

  callback && callback();
};

export const getMealsByDate = async (date, callback) => {
  const result = await db.getAllAsync(
    `SELECT * FROM meals WHERE date = ?`,
    [date]
  );

  callback(result);
};
