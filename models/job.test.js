"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "J3",
    salary: 1,
    equity: "0.2",
    companyHandle: "c3"
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({ id: 3, ...newJob });

    const result = await db.query(
      `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
WHERE id=3`)
    expect(result.rows).toEqual([{ id: 3, ...newJob }])

  })
});



/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: 1,
        title: "J1",
        salary: 1,
        equity: "0",
        companyHandle: "c1"
      },
      {
        id: 2,
        title: "J2",
        salary: 1,
        equity: "0.9",
        companyHandle: "c2"
      }
    ]);
  });
});

/************************************** filterAll */
describe("filterAll", function () {
  test("works with one parameter", async function () {
    let query = { title: "J1" }
    let jobs = await Job.filterAll(query);
    expect(jobs).toEqual([
      {
        id: 1,
        title: "J1",
        salary: 1,
        equity: "0",
        companyHandle: "c1"
      }
    ]);
  })

  test("can filter by minSalary", async function () {
    let query = { minSalary: 1 }
    let jobs = await Job.filterAll(query);
    expect(jobs).toEqual([
      {
        id: 1,
        title: "J1",
        salary: 1,
        equity: "0",
        companyHandle: "c1"
      },
      {
        id: 2,
        title: "J2",
        salary: 1,
        equity: "0.9",
        companyHandle: "c2"
      }
    ]);
  })

  test("can filter by hasEquity", async function () {
    let query = { hasEquity: true }
    let jobs = await Job.filterAll(query);
    expect(jobs).toEqual([
      {
        id: 2,
        title: "J2",
        salary: 1,
        equity: "0.9",
        companyHandle: "c2"
      }
    ]);
  })


  test("works with two parameters", async function () {
    let query = {
      minSalary: 2,
      hasEquity: true
    };

    let jobs = await Job.filterAll(query);
    expect(jobs).toEqual([]);
  })
})

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get("1");
    expect(job).toEqual({

      id: 1,
      title: "J1",
      salary: 1,
      equity: "0",
      companyHandle: "c1"
    });
  });

  test("not found if no such job", async function () {
    try {
      let job = await Job.get("300");

      fail();
    } catch (err) {

      expect(err instanceof NotFoundError).toBeTruthy();

    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: 100,
    equity: "0.7",
    companyHandle: "c2"
  };

  test("works", async function () {
    let job = await Job.update(1, updateData);
    expect(job).toEqual({
      id: 1,
      ...updateData,
    });

    const result = await db.query(
      `SELECT id,
      title,
      salary,
      equity,
      company_handle AS "companyHandle"
FROM jobs
WHERE id=1`);
    expect(result.rows).toEqual([{
      id: 1,
      title: "New",
      salary: 100,
      equity: "0.7",
      companyHandle: "c2"
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: "New2",
      salary: null,
      equity: null,
      companyHandle: "c2"
    };

    let job = await Job.update(1, updateDataSetNulls);
    expect(job).toEqual({
      id: 1,
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT id,
      title,
      salary,
      equity,
      company_handle AS "companyHandle"
FROM jobs
WHERE id=1`);
    expect(result.rows).toEqual([{
      id: 1,
      ...updateDataSetNulls,
    }]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(100, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

// /************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
      "SELECT id FROM jobs WHERE id=1")
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(100);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
