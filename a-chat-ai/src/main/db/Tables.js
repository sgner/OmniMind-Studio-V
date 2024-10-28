const add_tables = [
  "CREATE TABLE IF NOT EXISTS answers (" +
  "   answer_robot_id INTEGER NOT NULL," +
  "   answer_robot_name VARCHAR(255) NOT NULL," +
  "   id INTEGER PRIMARY KEY AUTOINCREMENT," +
  "   conversation_id INTEGER NOT NULL," +
  "   answer TEXT," +
  "   create_time TEXT NOT NULL," +  // 使用 TEXT 类型来存储 datetime
  "   status INTEGER," +
  "   file_size VARCHAR," +
  "   file_name VARCHAR(255)," +
  "   file_path VARCHAR(255)," +
  "   file_type INTEGER," +
  "   answer_type INTEGER," +
  "   session_id VARCHAR(255) NOT NULL," +
  "   answer_robot_type INTEGER,"+
  "   group_id INTEGER"+
  ");",

  "CREATE TABLE IF NOT EXISTS conversations (" +
  "   id INTEGER PRIMARY KEY AUTOINCREMENT," +
  "   question TEXT," +
  "   user_id VARCHAR(255) NOT NULL," +
  "   user_name VARCHAR(255) NOT NULL," +
  "   create_time TEXT NOT NULL," +  // 使用 TEXT 类型来存储 datetime
  "   status INTEGER," +
  "   question_type INTEGER," +
  "   session_id VARCHAR(255) NOT NULL," +
  "   files TEXT"+
  ");",

  "CREATE TABLE IF NOT EXISTS session (" +
  "   session_id VARCHAR(255) PRIMARY KEY," +
  "   no_read_count INTEGER,"+
  "   user_id VARCHAR(255) NOT NULL," +
  "   robot_id INTEGER," +
  "   robot_type INTEGER," +
  "   status INTEGER NOT NULL," +
  "   robot_name VARCHAR(255)," +
  "   last_message VARCHAR(255)," +
  "   last_time TEXT NOT NULL," +  // 使用 TEXT 类型来存储 datetime
  "   robot_number INTEGER,"+
  "   top_type INTEGER DEFAULT 0"+
  ");",

  "CREATE TABLE IF NOT EXISTS user_setting("+
  "   user_id VARCHAR(255) PRIMARY KEY,"+
  "   email VARCHAR(255),"+
  "   sys_setting VARCHAR(255),"+
  "   contact_no_read INTEGER,"+
  "   server_port VARCHAR(255)"+
  ");"
];

const alter_tables = [
  //
];

const add_index = [
  "CREATE INDEX IF NOT EXISTS idx_session_id " +
  "ON conversations (" +
  "   session_id ASC" +
  ");"
];

export {
  add_tables,
  add_index,
  alter_tables
}
