import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("nutrition.db");

/* -------------------------------------------------------
   INITIALIZE DATABASE
------------------------------------------------------- */
export function initNutritionDb() {
  db.transaction((tx) => {
    // Daily summary: calories, macros, weight
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS daily_summary (
        id INTEGER PRIMARY KEY NOT NULL,
        date TEXT UNIQUE NOT NULL,
        calories INTEGER DEFAULT 0,
        protein REAL DEFAULT 0,
        carbs REAL DEFAULT 0,
        fats REAL DEFAULT 0,
        weight REAL
      );`
    );

    // Meals (Breakfast, Lunch, Dinner, Snacks)
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        mealType TEXT NOT NULL
      );`
    );

    // Foods inside meals
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS meal_foods (
        id INTEGER PRIMARY KEY NOT NULL,
        mealId INTEGER NOT NULL,
        foodName TEXT NOT NULL,
        calories INTEGER DEFAULT 0,
        protein REAL DEFAULT 0,
        carbs REAL DEFAULT 0,
        fats REAL DEFAULT 0,
        FOREIGN KEY (mealId) REFERENCES meals(id) ON DELETE CASCADE
      );`
    );

    // Custom foods
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS custom_foods (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        calories INTEGER DEFAULT 0,
        protein REAL DEFAULT 0,
        carbs REAL DEFAULT 0,
        fats REAL DEFAULT 0
      );`
    );

    // Water intake
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS water_intake (
        id INTEGER PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        amountMl INTEGER NOT NULL
      );`
    );
  });
}

/* -------------------------------------------------------
   DAILY SUMMARY
------------------------------------------------------- */
export function getDailySummary(date, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM daily_summary WHERE date = ?;`,
      [date],
      (_, { rows }) => callback(rows._array[0] || null),
      (_, error) => {
        console.log("getDailySummary error:", error);
        return false;
      }
    );
  });
}

export function saveDailySummary(
  { date, calories, protein, carbs, fats, weight },
  callback
) {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO daily_summary (date, calories, protein, carbs, fats, weight)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(date) DO UPDATE SET
         calories = excluded.calories,
         protein = excluded.protein,
         carbs = excluded.carbs,
         fats = excluded.fats,
         weight = excluded.weight;`,
      [date, calories, protein, carbs, fats, weight],
      () => callback && callback(),
      (_, error) => {
        console.log("saveDailySummary error:", error);
        return false;
      }
    );
  });
}

/* -------------------------------------------------------
   MEALS + FOODS
------------------------------------------------------- */
export function getMealsByDate(date, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT 
        m.id AS mealId,
        m.mealType,
        f.id AS foodId,
        f.foodName,
        f.calories,
        f.protein,
        f.carbs,
        f.fats
       FROM meals m
       LEFT JOIN meal_foods f ON f.mealId = m.id
       WHERE m.date = ?
       ORDER BY m.mealType, f.id;`,
      [date],
      (_, { rows }) => {
        const raw = rows._array;
        const mealsMap = {};

        raw.forEach((row) => {
          if (!mealsMap[row.mealId]) {
            mealsMap[row.mealId] = {
              id: row.mealId,
              mealType: row.mealType,
              foods: [],
            };
          }

          if (row.foodId) {
            mealsMap[row.mealId].foods.push({
              id: row.foodId,
              foodName: row.foodName,
              calories: row.calories,
              protein: row.protein,
              carbs: row.carbs,
              fats: row.fats,
            });
          }
        });

        callback(Object.values(mealsMap));
      },
      (_, error) => {
        console.log("getMealsByDate error:", error);
        return false;
      }
    );
  });
}

export function addMealWithFoods(date, mealType, foods, callback) {
  db.transaction(
    (tx) => {
      tx.executeSql(
        `INSERT INTO meals (date, mealType) VALUES (?, ?);`,
        [date, mealType],
        (_, result) => {
          const mealId = result.insertId;

          foods.forEach((food) => {
            tx.executeSql(
              `INSERT INTO meal_foods 
                (mealId, foodName, calories, protein, carbs, fats)
               VALUES (?, ?, ?, ?, ?, ?);`,
              [
                mealId,
                food.foodName,
                food.calories || 0,
                food.protein || 0,
                food.carbs || 0,
                food.fats || 0,
              ]
            );
          });
        }
      );
    },
    (error) => console.log("addMealWithFoods error:", error),
    () => callback && callback()
  );
}

/* -------------------------------------------------------
   WATER
------------------------------------------------------- */
export function getWaterByDate(date, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT SUM(amountMl) AS total FROM water_intake WHERE date = ?;`,
      [date],
      (_, { rows }) => callback(rows._array[0]?.total || 0),
      (_, error) => {
        console.log("getWaterByDate error:", error);
        return false;
      }
    );
  });
}

export function addWater(date, amountMl, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO water_intake (date, amountMl) VALUES (?, ?);`,
      [date, amountMl],
      () => callback && callback(),
      (_, error) => {
        console.log("addWater error:", error);
        return false;
      }
    );
  });
}

/* -------------------------------------------------------
   CUSTOM FOODS
------------------------------------------------------- */
export function addCustomFood(
  { name, calories, protein, carbs, fats },
  callback
) {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO custom_foods (name, calories, protein, carbs, fats)
       VALUES (?, ?, ?, ?, ?);`,
      [name, calories || 0, protein || 0, carbs || 0, fats || 0],
      () => callback && callback(),
      (_, error) => {
        console.log("addCustomFood error:", error);
        return false;
      }
    );
  });
}

export function searchCustomFoods(query, callback) {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT * FROM custom_foods WHERE name LIKE ? ORDER BY name;`,
      [`%${query}%`],
      (_, { rows }) => callback(rows._array),
      (_, error) => {
        console.log("searchCustomFoods error:", error);
        return false;
      }
    );
  });
}
