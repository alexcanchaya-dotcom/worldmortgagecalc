import assert from "node:assert/strict";
import test from "node:test";
import {
  amortizationToCsv,
  buildAmortization,
  getLoanAmount,
  getMonthlyPayment,
  summarizeLoan,
  validateLoanInputs,
} from "./mortgage.ts";

test("monthly payment uses the standard amortization formula", () => {
  const payment = getMonthlyPayment(400000, 100000, 6, 30, 12);
  assert.ok(Math.abs(payment - 1798.65) < 0.01);
});

test("zero interest splits principal evenly across the term", () => {
  const payment = getMonthlyPayment(120000, 0, 0, 10, 12);
  assert.ok(Math.abs(payment - 1000) < 0.0001);
});

test("zero down payment finances the full price", () => {
  assert.equal(getLoanAmount(250000, 0), 250000);
  const payment = getMonthlyPayment(250000, 0, 0, 25, 12);
  assert.ok(Math.abs(payment - 250000 / 300) < 0.0001);
});

test("term of zero does not divide by zero", () => {
  assert.equal(getMonthlyPayment(400000, 80000, 3.5, 0, 12), 0);
  assert.deepEqual(buildAmortization(400000, 80000, 3.5, 0, 12), []);
});

test("down payment above price produces a zero loan", () => {
  assert.equal(getLoanAmount(300000, 350000), 0);
  assert.equal(getMonthlyPayment(300000, 350000, 4, 30, 12), 0);
});

test("Canadian semi-annual compounding differs from monthly", () => {
  const monthly = getMonthlyPayment(400000, 80000, 5, 25, 12);
  const canadian = getMonthlyPayment(400000, 80000, 5, 25, 2);
  assert.ok(canadian < monthly);
  assert.ok(canadian > 0);
});

test("Loan A and Loan B summaries stay independent", () => {
  const loanA = summarizeLoan(400000, 80000, 3.5, 30, 12);
  const loanB = summarizeLoan(420000, 90000, 4.1, 25, 12);
  assert.notEqual(loanA.monthlyPayment, loanB.monthlyPayment);
  assert.notEqual(loanA.totalPaid, loanB.totalPaid);
});

test("validation allows a $0 down payment and blocks down > price", () => {
  const ok = validateLoanInputs({ price: 400000, down: 0, rate: 3.5, termYears: 30 });
  assert.equal(Object.keys(ok).length, 0);

  const tooMuchDown = validateLoanInputs({ price: 400000, down: 450000, rate: 3.5, termYears: 30 });
  assert.match(tooMuchDown.downPayment, /greater than the purchase price/);

  const badTerm = validateLoanInputs({ price: 400000, down: 80000, rate: 3.5, termYears: 0 });
  assert.match(badTerm.loanTerm, /at least 1 year/);
});

test("CSV export includes every amortization row, not just headers", () => {
  const schedule = buildAmortization(240000, 40000, 0, 2, 12);
  const csv = amortizationToCsv(schedule);
  const lines = csv.trim().split("\n");
  assert.equal(lines[0], "month,interest,principal,balance");
  assert.equal(lines.length, 25);
  assert.match(lines[1], /^1,/);
  assert.match(lines[24], /^24,/);
});
