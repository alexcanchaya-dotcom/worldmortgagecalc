import assert from "node:assert/strict";
import test from "node:test";
import {
  countryPresets,
  getCountryPreset,
  getFieldHelpers,
  getStampDutyNote,
  isIllustrativeRateCopy,
} from "./countryPresets.ts";
import { countryOptions, getCountryOption, summarizeLoan } from "./mortgage.ts";

const requiredIds = ["IE", "GB", "US", "ES", "PT"] as const;

test("presets exist for Ireland, UK, US, Spain, and Portugal", () => {
  assert.deepEqual(
    countryPresets.map((preset) => preset.id),
    [...requiredIds],
  );
  assert.equal(getCountryPreset("IE")?.shortLabel, "Ireland");
  assert.equal(getCountryPreset("GB")?.shortLabel, "UK");
  assert.equal(getCountryPreset("US")?.shortLabel, "US");
  assert.equal(getCountryPreset("ES")?.shortLabel, "Spain");
  assert.equal(getCountryPreset("PT")?.shortLabel, "Portugal");
});

test("each preset fills sensible starter numbers and an educational rate band", () => {
  for (const preset of countryPresets) {
    assert.ok(preset.price > 0, `${preset.id} needs a purchase price`);
    assert.ok(preset.down >= 0 && preset.down < preset.price, `${preset.id} down payment`);
    assert.ok(preset.termYears >= 15 && preset.termYears <= 30, `${preset.id} term`);
    assert.ok(preset.illustrativeRate > 0 && preset.illustrativeRate < 15, `${preset.id} rate`);
    assert.ok(isIllustrativeRateCopy(preset.rateBandLabel), `${preset.id} rate copy`);
    assert.doesNotMatch(preset.rateBandLabel, /guaranteed|approved|live quote from/i);
    assert.equal(getCountryOption(preset.country).currency, preset.currency);
    assert.ok(countryOptions.some((item) => item.code === preset.country));
  }
});

test("stamp-duty notes stay honest and do not invent a calculated tax", () => {
  for (const preset of countryPresets) {
    const note = getStampDutyNote(preset.country);
    assert.ok(note.title.length > 0);
    assert.match(note.body, /does not (add|estimate)|check (local|the rules)/i);
    assert.doesNotMatch(note.body, /guaranteed approval|exact statutory table/i);
    assert.ok(note.guidanceUrl, `${preset.id} should link to official guidance`);
    assert.match(note.guidanceUrl ?? "", /^https:\/\//);
  }

  const generic = getStampDutyNote("CA");
  assert.match(generic.body, /check local rules/i);
  assert.equal(generic.guidanceUrl, undefined);
});

test("Ireland helpers talk about stamp duty and cash to close, not US PMI", () => {
  const ireland = getCountryPreset("IE");
  assert.ok(ireland);
  const copy = [
    ireland.helpers.depositLabel,
    ireland.helpers.priceHint,
    ireland.helpers.priceHelper,
    ireland.helpers.downHint,
    ireland.helpers.downHelper,
    ireland.helpers.termHint,
  ].join(" ");
  assert.match(copy, /stamp duty/i);
  assert.match(copy, /cash to close|solicitor|deposit/i);
  assert.doesNotMatch(copy, /PMI|\$0|US target/i);
  assert.equal(ireland.helpers.depositLabel, "Deposit");
  assert.equal(getFieldHelpers("IE").downHelper, ireland.helpers.downHelper);
});

test("preset totals still use the shared amortization math", () => {
  const ireland = getCountryPreset("IE");
  assert.ok(ireland);
  const summary = summarizeLoan(
    ireland.price,
    ireland.down,
    ireland.illustrativeRate,
    ireland.termYears,
    12,
  );
  assert.ok(summary.monthlyPayment > 0);
  assert.ok(summary.totalInterest > 0);
  assert.ok(summary.totalPaid > summary.principal);
  assert.ok(Math.abs(summary.totalInterest - (summary.totalPaid - summary.principal)) < 0.01);
});
