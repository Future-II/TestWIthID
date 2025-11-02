type DateInput = Date | string | number | null | undefined;

function parseDate(input: DateInput): Date | null {
  if (!input) return null;
  const date = input instanceof Date ? input : new Date(input);
  return isNaN(date.getTime()) ? null : date;
}

export const formatTime = (input: DateInput, isRTL: boolean) => {
  const date = parseDate(input);
  if (!date) return "";

  return new Intl.DateTimeFormat(isRTL ? "ar-EG" : "en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

export const formatDateTime = (input: DateInput, isRTL: boolean) => {
  const date = parseDate(input);
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat(isRTL ? "ar-EG" : "en-US", {
      year: "numeric",
      month: isRTL ? "long" : "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  } catch (err) {
    console.error("Date formatting failed:", err, input);
    return "";
  }
};
