import * as path from "path";
import fs from 'fs';
import sqlite3 from 'sqlite3';
import os from 'os';
import { add_index, add_tables, alter_tables } from "./Tables.js";

const userDir = os.homedir();
const dbFolder = path.join(userDir, '.a-chat-ai', 'db');

// 确保创建所有缺失的目录
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

const globalColumnsMap = {};
const db = new sqlite3.Database(path.join(dbFolder, 'data.db'));
const createTable = (sql) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const item of add_tables) {
        await new Promise((resolve, reject) => {
          db.run(item, (err) => err ? reject(err) : resolve());
        });
      }
      for (const item of add_index) {
        await new Promise((resolve, reject) => {
          db.run(item, (err) => err ? reject(err) : resolve());
        });
      }
      for (const item of alter_tables) {
        const fieldList = await queryAll(`PRAGMA table_info(${item.tableName})`, []);
        const field = fieldList.some(row => row.name === item.field);
        if (!field) {
          await new Promise((resolve, reject) => {
            db.run(sql, (err) => err ? reject(err) : resolve());
          });
        }
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

const initTableColumnsMap = async () => {
  try {

    let sql = `SELECT name FROM sqlite_master WHERE type= 'table' AND name!='sqlite'`;
    let tables = await queryAll(sql, []);
    for (let i = 0; i < tables.length; i++) {
      sql = `PRAGMA table_info(${tables[i].name})`;
      let columns = await queryAll(sql, []);
      const columnMapItem = {};
      for (let j = 0; j < columns.length; j++) {
        columnMapItem[toCamelCase(columns[j].name)] = columns[j].name;
      }
      globalColumnsMap[tables[i].name] = columnMapItem;
    }
    // console.log(globalColumnsMap);
  } catch (error) {
    console.error("Error initializing table columns map:", error);
  }
}

const queryAll = (sql, params) => {
  return new Promise((resolve, reject) => {
    const stmt  = db.prepare(sql)
     console.log(`执行的sql:${sql},params:${params}`);
    stmt.all(params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map(convert));
      }
    });
    stmt.finalize()
  });
}

const queryCount = (sql, params) => {
  return new Promise((resolve, reject) => {
    const stmt  = db.prepare(sql)
    stmt.get(params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? Object.values(row)[0] : 0);
      }
    });
    stmt.finalize();
  });
}

const queryOne = (sql, params) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(sql)
    stmt.get( params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
        console.log(`执行的sql:${sql},params:${params}`);
      }
    });
    stmt.finalize();
  });
}

const run = (sql, params) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(sql);
    console.log(`执行的sql:${sql}`);
    stmt.run(params, function(err) {
      if (err) {
        console.error(`执行的sql: ${sql}, params: ${params}, 执行失败: ${err}`);
        reject(err);
      } else {
        resolve(this.changes); // 返回受影响的行数
      }
    });
    stmt.finalize();
  });
}


const insert = (sqlPrefix, tableName, data) => {
  const columnsMap = globalColumnsMap[tableName];
  const dbColumns = [];
  const params = [];
  for (let item in data) {
    if (data[item] !== undefined && columnsMap[item] !== undefined) {
      dbColumns.push(columnsMap[item]);
      params.push(data[item]);
    }
  }
  const preper = "?".repeat(dbColumns.length).split("").join(",");
  const sql = `${sqlPrefix} ${tableName}(${dbColumns.join(",")}) VALUES(${preper})`;
  console.log(`执行的sql:${sql},params:${params}`);
  return run(sql, params);
}
const update = (tableName, data, paramData) => {
  const columnsMap = globalColumnsMap[tableName];
  const dbColumns = [];
  const params = [];
  const whereColumns = [];
  for (let item in data) {
    if (data[item] !== undefined && columnsMap[item] !== undefined) {
      dbColumns.push(`${columnsMap[item]} = ?`);
      params.push(data[item]);
    }
  }
  for (let item in paramData) {
    if (paramData[item]) {
      params.push(paramData[item]);
      whereColumns.push(`${columnsMap[item]} = ?`);
    }
  }
  const sql = `UPDATE ${tableName} SET ${dbColumns.join(",")} ${whereColumns.length > 0 ? 'WHERE' : ''} ${whereColumns.join(" AND ")}`;
  console.log(`执行的sql:${sql},params:${params}`);
  return run(sql, params);
}
const insertOrReplace = (tableName, data) => insert("INSERT OR REPLACE INTO", tableName, data);
const insertOrIgnore = (tableName, data) => insert("INSERT OR IGNORE INTO", tableName, data);



const convert = (data) => {
  if (!data) {
    return null;
  }
  const bizData = {};
  for (let item in data) {
    bizData[toCamelCase(item)] = data[item];
  }
  return bizData;
}

const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
}

const init = async () => {
  try {
    await createTable();
    await initTableColumnsMap();
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

init();

export {
  run,
  queryCount,
  queryOne,
  insertOrReplace,
  update,
  insertOrIgnore,
  queryAll,
  insert
}
