export const normalizeWhitespace = (...fields) => {
  const result = fields.map((field) => field.trim().replace(/\s+/g, " "));
  console.log(result);

  return result;
};
