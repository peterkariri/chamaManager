-- ============================================================
--  Chama Manager — MySQL database schema
--  Import this file in phpMyAdmin:
--    phpMyAdmin  →  Import  →  choose this file  →  Go
--
--  It creates the database "chama_manager" and three tables:
--    members, contributions, loans
--  If you already created/selected a database, delete the two
--  lines marked (A) and (B) below and import into it directly.
-- ============================================================

-- (A) create the database
CREATE DATABASE IF NOT EXISTS chama_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- (B) use it for everything below
USE chama_manager;


-- ------------------------------------------------------------
--  1. members — the people in the chama
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS members (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20),
  join_date  DATE NOT NULL DEFAULT (CURRENT_DATE)
) ENGINE=InnoDB;


-- ------------------------------------------------------------
--  2. contributions — money each member pays in
--     member_id links back to members.id
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contributions (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  member_id  INT NOT NULL,
  amount     DECIMAL(12,2) NOT NULL,
  month      VARCHAR(7) NOT NULL,          -- e.g. "2026-07"
  date_paid  DATE NOT NULL DEFAULT (CURRENT_DATE),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ------------------------------------------------------------
--  3. loans — money lent out to a member
--     status is 'active' or 'cleared'
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS loans (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  member_id      INT NOT NULL,
  principal      DECIMAL(12,2) NOT NULL,
  interest_rate  DECIMAL(5,2)  NOT NULL DEFAULT 10.00,
  amount_repaid  DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status         VARCHAR(10)   NOT NULL DEFAULT 'active',
  date_issued    DATE NOT NULL DEFAULT (CURRENT_DATE),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ------------------------------------------------------------
--  OPTIONAL: sample data so you have something to query.
--  Delete this whole block if you want to start empty.
-- ------------------------------------------------------------
INSERT INTO members (name, phone) VALUES
  ('Jane Wanjiku', '0712000001'),
  ('Peter Otieno', '0712000002'),
  ('Amina Hassan', '0712000003');

INSERT INTO contributions (member_id, amount, month) VALUES
  (1, 5000, '2026-07'),
  (2, 5000, '2026-07'),
  (3, 3000, '2026-07');

INSERT INTO loans (member_id, principal, interest_rate) VALUES
  (2, 4000, 10);


-- ============================================================
--  COMPATIBILITY NOTE
--  DEFAULT (CURRENT_DATE) needs MySQL 8.0.13+ or MariaDB 10.2+
--  (that covers current XAMPP / most phpMyAdmin setups).
--  If your MySQL is older and the import errors on the date
--  defaults, replace each line like:
--        join_date DATE NOT NULL DEFAULT (CURRENT_DATE)
--  with:
--        join_date DATE NULL
--  and set the date from your app code when you INSERT.
-- ============================================================
