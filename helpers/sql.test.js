const { sqlConvert } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlConvert", function () {
  test("works with same number of keys in both arguments", function () {
    const data = {
      firstName: "Phoenix",
      lastName: "Petterson",
      isAdmin: false,
    };
    const jsToSql =
    {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };
    const { setCols, values } = sqlConvert(data, jsToSql);
    expect(setCols).toEqual('"first_name"=$1, "last_name"=$2, "is_admin"=$3');
    expect(values).toEqual(["Phoenix", "Petterson", false]);
  });


  test("works with more data keys than JsToSQL keys", function () {
    const data = {
      firstName: "Phoenix",
      lastName: "Petterson",
      isAdmin: false,
    };
    const jsToSql =
    {
      lastName: "last_name",
      isAdmin: "is_admin",
    };
    const { setCols, values } = sqlConvert(data, jsToSql);
    expect(setCols).toEqual('"firstName"=$1, "last_name"=$2, "is_admin"=$3');
    expect(values).toEqual(["Phoenix", "Petterson", false])
  });


  test("works with more JsToSQL keys than data keys", function () {
    const data = {
      firstName: "Phoenix",
      lastName: "Petterson",
      isAdmin: false,
    };
    const jsToSql =
    {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
      birthDate: "05/28/1995"
    };
    const { setCols, values } = sqlConvert(data, jsToSql);
    expect(setCols).toEqual('"first_name"=$1, "last_name"=$2, "is_admin"=$3');
    expect(values).toEqual(["Phoenix", "Petterson", false])
  });


  test("works for filtering for companies", function () {
    const data = {
      nameLike: "Phoenix",
      minEmployees: 10,
      maxEmployees: 200
    };
    const jsToSql =
    {
      nameLike: "name",
      minEmployees: "num_employees",
      maxEmployees: "num_employees"
    };
    const { setCols, values } = sqlConvert(data, jsToSql, "filter");
    expect(setCols).toEqual('"name" ILIKE $1 AND num_employees>=$2 AND num_employees<=$3');
    expect(values).toEqual(["Phoenix", 10, 200]);
  });


  test("works for filtering for jobs, hasEquity=true", function () {
    const data = {
      title: 'test',
      minSalary: 2,
      hasEquity: true
    };
    const jsToSql =
    {
      minSalary: "salary",
      hasEquity: "equity"
    };
    const { setCols, values } = sqlConvert(data, jsToSql, "filter");
    expect(setCols).toEqual('"title"=$1 AND salary>=$2 AND "equity"!=$3');
    expect(values).toEqual(["test", 2, '0']);
  });

  test("works for filtering for jobs, hasEquity=false", function () {
    const data = {
      title: 'test',
      minSalary: 2,
      hasEquity: false
    };
    const jsToSql =
    {
      minSalary: "salary",
      hasEquity: "equity"
    };
    const { setCols, values } = sqlConvert(data, jsToSql, "filter");
    expect(setCols).toEqual('"title"=$1 AND salary>=$2');
    expect(values).toEqual(["test", 2]);
  });



  test("does not work with no data", function () {
    const data = {};
    const jsToSql =
    {
      nameLike: "name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };

    try {
      const { setCols, values } = sqlConvert(data, jsToSql)
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
