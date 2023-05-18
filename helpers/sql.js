const { BadRequestError } = require("../expressError");


/** Helper function used in the Company and User models.
 * It converts JS object data into SQL strings that are correctly formatted for making queries to the database. 
 * Arguments include:
 * data (table columns to be updated and the updated values)
 * jsToSQL(converion between JS column key-names to SQL table-name strings)
 * type (default is null, if "filter" the SQL strings are altered appropriately)

 * Returns {setCols, values} (to be deconstructed and included in SQL query)
 * */

function sqlConvert(data, jsToSql, type = null) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) throw new BadRequestError("No data");

  const equityIdx = keys.indexOf('hasEquity');
  if (equityIdx > -1) {
    if (!data['hasEquity']) {
      keys.splice(equityIdx, 1);
      values.splice(equityIdx, 1);
    } else {
      values[equityIdx] = "0"
    }
  }


  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) => {
    if (colName === "minEmployees" || colName === "minSalary") {
      return `${jsToSql[colName] || colName}>=$${idx + 1}`
    } else if (colName === "maxEmployees") {
      return `${jsToSql[colName] || colName}<=$${idx + 1}`
    } else if (colName === "nameLike") {
      return `"${jsToSql[colName] || colName}" ILIKE $${idx + 1}`
    } else if (colName === "hasEquity") {
      return `"${jsToSql[colName] || colName}"!=$${idx + 1}`
    } else {
      return `"${jsToSql[colName] || colName}"=$${idx + 1}`
    }
  });



  if (type === "filter") {
    return {
      setCols: cols.join(" AND "),
      values
    }
  } else {
    return {
      setCols: cols.join(", "),
      values
    }
  }

}



module.exports = { sqlConvert };
