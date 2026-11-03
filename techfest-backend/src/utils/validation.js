function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function isValidPhone(value) {
  return /^[6-9]\d{9}$/.test(String(value || "").trim());
}

function isValidEventPayload(value) {
  if (!value || typeof value !== "object") return false;
  const nameOk = typeof value.name === "string" && value.name.trim().length >= 2 && value.name.trim().length <= 100;
  const categoryOk = ["technical", "cultural"].includes(value.category);
  const feeOk = Number.isFinite(Number(value.fee)) && Number(value.fee) >= 0;
  const seatsOk = Number.isInteger(Number(value.seats)) && Number(value.seats) >= 0;
  return nameOk && categoryOk && feeOk && seatsOk;
}

module.exports = { isValidEmail, isValidPhone, isValidEventPayload };
