// https://github.com/WiseLibs/better-sqlite3/issues/1389#issuecomment-3111776661
// pnpm disables build scripts. better-sqlite3's build script must be enabled
// for kysely-codegen (and drizzle-kit, for that matter)

import SQLite from "better-sqlite3";
import { Kysely, type Selectable, SqliteDialect } from "kysely";
import type { Composers, DB } from "kysely-codegen";

type Composer = Selectable<Composers>;
const dialect = new SqliteDialect({
  database: new SQLite("../composers.db"),
});

const d = new Date("1700-01-01").toISOString();

(async () => {
  const db = new Kysely<DB>({ dialect });
  const x = await db
    .selectFrom("composers")
    .selectAll()
    .where("dod", ">", d)
    .where("dob", "<", d)
    .execute();
  console.log(x);
})();
