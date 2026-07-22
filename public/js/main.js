// Auto-fill the "month" input with the current month (e.g. 2026-07)
document.addEventListener('DOMContentLoaded', () => {
  const monthInput = document.querySelector('input[type="month"]');
  if (monthInput && !monthInput.value) {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    monthInput.value = `${now.getFullYear()}-${mm}`;
  }
});
