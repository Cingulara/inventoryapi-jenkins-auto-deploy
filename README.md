# Client API using NodeJS and PostgreSQL
This is a single Node API microservice with PostgreSQL backend as a POC. It is to show how to do a single API around a particular domain with a database that is its own in a separate programming language and database server. This requires Docker, NodeJS v 10.0 or later, and a web browser to run. Optionally you can use a SQL tool such as pgAdmin 4 to view the database if you so desire.

## Run the NodeJS Container
* run 'docker build -t inventoryapi .' from the inventoryapi directory to build the image
* run 'docker run -p xxxx:8080 -d --rm --name inventoryapi inventoryapi' to start the API by itself

## Database Container
* run the 'docker build -t inventoryapidb .' from within the database directory of inventoryapi
* run the database: 'docker run -d --rm --name inventoryapidb -p 5432:5432 inventoryapidb'

## Database Setup
```
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

INSERT INTO inventory (name, description, price, saleprice, quantity, company)
  VALUES ('10-speed Racing Bicycle', 'The SportPRO 10-speed racing bicycle is 15 lbs total and made of carbon fiber.', 2453.99, null, 7, 1);
```

## API Calls

http://localhost:xxxx/swagger is the Swagger 2.0 API Documentation for this.

GET http://localhost:xxxx/api/inventory/ gets back a JSON listing of the Inventory class.

GET http://localhost:xxxx/api/inventory/1 gets back a JSON listing of the Inventory class for the first record. You must add a record to view anything.

POST http://localhost:xxxx/api/inventory/ will add this Inventory item with the information below
```
{
	"name" : "Kids Bicycle Helmet - Medium", 
	"description": "Kids bicycle helmet with strap for medium sized head.", 
	"price": 15.09, 
	"saleprice": null,
	"quantity": 11, 
	"company" : 1
}
```
PUT http://localhost:xxxx/api/inventory/2 will update this Inventory item with the information below
```
{
	"name" : "Kids Bicycle Helmet - Medium", 
	"description": "Kids bicycle helmet with strap for medium sized head.", 
	"price": 15.99, 
	"saleprice": null,
	"quantity": 11, 
	"company" : 1
}
```
DELETE http://localhost:xxxx/api/inventory/2 will delete this Inventory item if found

## ToDo's

* Log events to an event stream
* better documentation
