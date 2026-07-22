# START HERE — Chama Manager (MySQL / phpMyAdmin edition)

Every code file in this folder is **empty on purpose** — you fill them in yourself as
training. The only file with content is `database.sql`, which you import into phpMyAdmin.

> ✅ The SQL file has been **tested against a real MariaDB 10.11 server** — the same
> database engine XAMPP ships with. Import succeeded (exit code 0), all 3 tables created,
> sample data inserted, JOINs and cascade deletes all work. It will import cleanly in
> phpMyAdmin.

This guide tells you (1) how to set up the database, and (2) what belongs in each blank file.

---

## Part 1 — Set up the database in phpMyAdmin

1. Start MySQL (e.g. open XAMPP and start **Apache** + **MySQL**).
2. Open phpMyAdmin in your browser: `http://localhost/phpmyadmin`
3. Click the **Import** tab at the top.
4. Under "File to import", click **Choose File** and pick `database.sql` from this folder.
5. Scroll to the bottom and click **Go**.
6. You should see the green message: *"Import has been successfully finished, X queries executed."*
7. On the left sidebar you'll now see a database called **chama_manager** with three tables:
   `members`, `contributions`, `loans` (plus a little sample data).

That's your whole database ready. You can click any table → **Browse** to see rows,
or **SQL** to run your own queries for practice.

---

## Part 2 — Connect your Express app to MySQL

Because this version uses MySQL (not SQLite), when you fill in the code you'll use the
`mysql2` library instead of `better-sqlite3`. So your install command becomes:

```bash
npm init -y
npm install express ejs mysql2 method-override
npm install --save-dev nodemon
```

In `database.js` you'll create a connection pool pointing at the database you just
imported. The typical XAMPP defaults are: host `localhost`, user `root`, password `` (empty),
database `chama_manager`.

> Tip: `mysql2` gives you a `.promise()` pool so you can use `async/await` in your routes.
> Every query in your routes will then be `await pool.query('SELECT ...')`.

---

## Part 3 — What goes in each empty file

Fill them in roughly this order (top to bottom):

| File | What to put in it |
|------|-------------------|
| `package.json` | Project name, scripts (`start`, `dev`) and the dependency list from Part 2. |
| `database.js` | Create and export a `mysql2` connection pool to `chama_manager`. |
| `server.js` | The entry point: set EJS as the view engine, add middleware (`urlencoded`, `method-override`, `static`), mount the four route files, add a 404 handler, and `listen` on a port. |
| `routes/members.js` | Full CRUD for members (list, new-form, create, edit-form, update, delete). **Write this one first** — it's the pattern for everything else. |
| `routes/contributions.js` | List (with a JOIN to show member names), create, delete. |
| `routes/loans.js` | List (JOIN + interest calc), issue loan, record repayment, delete. Mark a loan `cleared` once fully repaid. |
| `routes/dashboard.js` | Summary queries using `SUM`, `COUNT`, `COALESCE` → member count, total savings, active loans, loaned out, cash on hand. |
| `views/partials/header.ejs` | Opening HTML, `<head>`, the nav bar. Link `/css/style.css`. |
| `views/partials/footer.ejs` | Closing HTML, footer, `<script src="/js/main.js">`. |
| `views/dashboard.ejs` | The summary cards. |
| `views/members/index.ejs` | Members table + delete buttons (forms using `?_method=DELETE`). |
| `views/members/form.ejs` | One form reused for both add and edit. |
| `views/contributions/index.ejs` | Add-contribution form + table. |
| `views/loans/index.ejs` | Issue-loan form, loans table, repay form. |
| `views/404.ejs` | Simple "page not found" message. |
| `public/css/style.css` | Your styling. |
| `public/js/main.js` | Small client-side touches (e.g. default the month input to this month). |

---

## Part 4 — The request flow to keep in mind

```
Browser → server.js → routes/*.js → database.js (MySQL query) → views/*.ejs → HTML back
```

Static files (CSS, JS) come straight from `public/` and skip the routes.

---

## Key differences from a SQLite version (so you don't get stuck)

- Queries run through a **connection pool** and are **asynchronous** — use `async/await`.
- `mysql2` returns results as `const [rows] = await pool.query(...)` — note the array destructuring; the rows are the first element.
- SQL is almost identical, but MySQL uses `AUTO_INCREMENT` and `DECIMAL` (see `database.sql`).
- Dates are real `DATE` columns now, not text.

---

## What was tested (proof the SQL works)

Before you got this folder, `database.sql` was imported into a fresh MariaDB 10.11
server and the following was confirmed:

- ✓ Import returned exit code 0 (no syntax errors)
- ✓ Database `chama_manager` created with utf8mb4 charset
- ✓ All 3 tables created with correct columns (INT, VARCHAR, DECIMAL, DATE)
- ✓ Sample data inserted correctly (3 members, 3 contributions, 1 loan)
- ✓ Dashboard aggregate query returned: 3 members, 13,000 total savings, 1 active loan, 4,000 loaned out
- ✓ JOIN between contributions and members returned rows with member names
- ✓ `ON DELETE CASCADE` works — deleting a member auto-deletes their contributions/loans

Start at Part 1. Import the SQL first, then fill in the files from the table in Part 3.
