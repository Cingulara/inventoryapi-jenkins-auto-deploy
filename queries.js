var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp({
    host: 'inventoryapidb',
    port: 5432,
    database: 'inventory',
    user: 'postgres',
    password: 'Inventory@PI'
});

// add query functions

module.exports = {
    getAllInventory: getAllInventory,
    getSingleInventory: getSingleInventory,
    createInventory: createInventory,
    updateInventory: updateInventory,
    removeInventory: removeInventory
};

function getAllInventory(req, res, next) {
    db.any('select * from inventory order by name, price desc')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL Inventory'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function getSingleInventory(req, res, next) {
    var inventoryID = parseInt(req.params.id);
    db.one('select * from inventory where id = $1', inventoryID)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved one Inventory Item'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function createInventory(req, res, next) {
    req.body.quantity = parseInt(req.body.quantity);
    req.body.price = parseFloat(req.body.price);
    req.body.saleprice = parseFloat(req.body.saleprice);
    req.body.company = parseInt(req.body.company);
    db.none('insert into Inventory(name, description, price, saleprice, quantity, company) ' +
        'values(${name}, ${description}, ${price}, ${saleprice}, ${quantity}, ${company})',
      req.body)
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Inserted one Inventory Item'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function updateInventory(req, res, next) {
    db.none('update Inventory set name=$2, description=$3, price=$4, saleprice=$5, quantity=$6, company=$7, updated=NOW() where id=$1',
      [ parseInt(req.params.id), req.body.name, req.body.description, parseFloat(req.body.price), parseFloat(req.body.saleprice),
        parseInt(req.body.quantity), parseInt(req.body.company)])
      .then(function () {
        res.status(200)
          .json({
            status: 'success',
            message: 'Updated Inventory Item'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  function removeInventory(req, res, next) {
    var inventoryID = parseInt(req.params.id);
    db.result('delete from Inventory where id = $1', inventoryID)
      .then(function (result) {
        /* jshint ignore:start */
        res.status(200)
          .json({
            status: 'success',
            message: `Removed ${result.rowCount} Inventory`
          });
        /* jshint ignore:end */
      })
      .catch(function (err) {
        return next(err);
      });
  }
