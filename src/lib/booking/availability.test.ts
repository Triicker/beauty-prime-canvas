import assert from "node:assert/strict";
import test from "node:test";

import {
  type BookingBusinessHours,
  generateBookingTimesForDuration,
  getBookingBusinessHours,
  hasIntervalOverlap,
  isWithinBusinessHours,
  toMinutes,
} from "./availability";

const businessHours: BookingBusinessHours = {
  isOpen: true,
  openTime: "09:00",
  closeTime: "19:00",
};

test("permite serviço de 4 horas iniciado às 15:00 quando fecha às 19:00", () => {
  assert.equal(isWithinBusinessHours("15:00", 240, businessHours), true);
});

test("bloqueia serviço de 4 horas iniciado após o último horário compatível", () => {
  assert.equal(isWithinBusinessHours("15:30", 240, businessHours), false);
  assert.equal(isWithinBusinessHours("18:00", 240, businessHours), false);
});

test("permite serviço de 30 minutos às 18:30 e bloqueia às 19:00", () => {
  assert.equal(isWithinBusinessHours("18:30", 30, businessHours), true);
  assert.equal(isWithinBusinessHours("19:00", 30, businessHours), false);
});

test("permite terminar exatamente no fechamento e bloqueia um minuto depois", () => {
  assert.equal(isWithinBusinessHours("18:30", 30, businessHours), true);
  assert.equal(isWithinBusinessHours("18:31", 30, businessHours), false);
});

test("bloqueia início antes do expediente", () => {
  assert.equal(isWithinBusinessHours("08:30", 30, businessHours), false);
});

test("gera a grade considerando a duração do serviço", () => {
  const fourHourSlots = generateBookingTimesForDuration(240, businessHours);
  assert.equal(fourHourSlots.at(-1), "15:00");
  assert.equal(fourHourSlots.includes("15:30"), false);

  const thirtyMinuteSlots = generateBookingTimesForDuration(30, businessHours);
  assert.equal(thirtyMinuteSlots.at(-1), "18:30");
  assert.equal(thirtyMinuteSlots.includes("19:00"), false);
});

test("não gera horários em dia fechado ou quando a duração excede o expediente", () => {
  assert.deepEqual(generateBookingTimesForDuration(30, { ...businessHours, isOpen: false }), []);
  assert.deepEqual(generateBookingTimesForDuration(601, businessHours), []);
});

test("identifica domingo como dia fechado no fuso de Lisboa", () => {
  assert.equal(getBookingBusinessHours("2026-03-22").isOpen, false);
});

test("detecta conflitos por sobreposição parcial e contenção", () => {
  const existingStart = toMinutes("14:00");
  const existingEnd = toMinutes("15:30");

  assert.equal(
    hasIntervalOverlap(toMinutes("13:00"), toMinutes("15:00"), existingStart, existingEnd),
    true,
  );
  assert.equal(
    hasIntervalOverlap(toMinutes("14:15"), toMinutes("15:00"), existingStart, existingEnd),
    true,
  );
  assert.equal(
    hasIntervalOverlap(toMinutes("13:00"), toMinutes("16:00"), existingStart, existingEnd),
    true,
  );
});

test("não considera conflito quando os intervalos apenas encostam", () => {
  const existingStart = toMinutes("14:00");
  const existingEnd = toMinutes("15:30");

  assert.equal(
    hasIntervalOverlap(toMinutes("13:00"), existingStart, existingStart, existingEnd),
    false,
  );
  assert.equal(
    hasIntervalOverlap(existingEnd, toMinutes("16:00"), existingStart, existingEnd),
    false,
  );
});
