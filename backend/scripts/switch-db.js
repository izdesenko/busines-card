/**
 * Переключает схему Prisma между sqlite, mysql и postgresql.
 *
 * Использование:
 *   node scripts/switch-db.js sqlite    — переключиться на SQLite
 *   node scripts/switch-db.js mysql     — переключиться на MySQL
 *   node scripts/switch-db.js postgres  — переключиться на PostgreSQL
 *   node scripts/switch-db.js          — показать текущий драйвер
 *
 * Также читает переменную DATABASE_DRIVER из .env, если аргумент не передан.
 */

const fs = require('fs');
const path = require('path');

const DRIVERS = {
  mysql: 'schema.mysql.prisma',
  postgres: 'schema.postgresql.prisma',
  postgresql: 'schema.postgresql.prisma',
  sqlite: 'schema.sqlite.prisma',
};

const SCHEMA_DIR = path.join(__dirname, '..', 'prisma');
const ACTIVE_SCHEMA = path.join(SCHEMA_DIR, 'schema.prisma');
const ENV_FILE = path.join(__dirname, '..', '.env');

function readEnv() {
  try {
    return fs.readFileSync(ENV_FILE, 'utf-8');
  } catch {
    return '';
  }
}

function writeEnv(content) {
  fs.writeFileSync(ENV_FILE, content, 'utf-8');
}

function setEnvDriver(driver) {
  const env = readEnv();
  const driverLine = `DATABASE_DRIVER=${driver}`;

  if (/^DATABASE_DRIVER=/m.test(env)) {
    // Заменяем существующую строку
    const updated = env.replace(/^DATABASE_DRIVER=.*/m, driverLine);
    writeEnv(updated);
  } else {
    // Добавляем после DATABASE_URL
    const updated = env.replace(/^DATABASE_URL=(.*)$/m, `$1\n${driverLine}`);
    writeEnv(updated);
  }
}

function getCurrentDriver() {
  const env = readEnv();
  const match = env.match(/^DATABASE_DRIVER=(.*)$/m);
  return match ? match[1].trim() : 'sqlite';
}

function switchDb(target) {
  const driver = DRIVERS[target];
  if (!driver) {
    console.error(`❌ Неизвестный драйвер: "${target}"`);
    console.error('   Доступные: sqlite, mysql, postgres');
    process.exit(1);
  }

  const source = path.join(SCHEMA_DIR, driver);
  if (!fs.existsSync(source)) {
    console.error(`❌ Файл ${driver} не найден в папке prisma/`);
    process.exit(1);
  }

  // Проверяем, что файл не совпадает с текущим
  try {
    const current = fs.readFileSync(ACTIVE_SCHEMA, 'utf-8');
    const incoming = fs.readFileSync(source, 'utf-8');
    if (current === incoming) {
      console.log(`✅ Уже используется: ${target}`);
      setEnvDriver(target);
      return;
    }
  } catch {
    // Файл ещё не существует или не читается — переключаем
  }

  fs.copyFileSync(source, ACTIVE_SCHEMA);
  setEnvDriver(target);
  console.log(`✅ Переключено на: ${target}`);
  console.log(`   schema.prisma ← ${driver}`);
  console.log('');
  console.log('   Далее выполните:');
  console.log(`     npm run db:generate   # сгенерировать клиент`);
  console.log(`     npm run db:push       # синхронизировать схему с БД`);
}

const arg = process.argv[2];

if (!arg) {
  const current = getCurrentDriver();
  console.log(`Текущий драйвер: ${current}`);
  console.log('');
  console.log('Доступные драйверы: sqlite, mysql, postgres');
  console.log('Пример переключения: node scripts/switch-db.js mysql');
  process.exit(0);
}

switchDb(arg.toLowerCase());
