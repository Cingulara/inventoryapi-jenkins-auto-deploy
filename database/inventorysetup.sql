-- clear out anything before we start to make the database
DROP DATABASE IF EXISTS inventory;

-- create the database
CREATE DATABASE inventory;

-- go to the database 'inventory' before we make any tables and insert data
\c inventory;

-- create the tables
CREATE TABLE inventory (
  Id SERIAL PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  price NUMERIC(11,3) DEFAULT 0.00,
  saleprice NUMERIC(11,3),
  quantity INTEGER,
  active SMALLINT DEFAULT 1,
  company INTEGER,
  created VARCHAR DEFAULT NOW(),
  updated VARCHAR
);

-- seed the database with at least something
INSERT INTO inventory (name, description, price, saleprice, quantity, company)
  VALUES ('10-speed Racing Bicycle', 'The SportPRO 10-speed racing bicycle is 15 lbs total and made of carbon fiber.', 2453.99, null, 7, 1);