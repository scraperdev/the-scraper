function timestamp(number) {
  let id = parseInt(number);

  let binary = id.toString(2);
  binary = binary.padStart(64, "0");

  let excerpt = binary.substring(0, 42);

  let decimal = parseInt(excerpt, 2);

  let unix = parseInt(decimal) + 1420070400000;

  const date = new Date(unix);
  const timestamp = date.toLocaleString();
  return timestamp;
}

module.exports = {
  timestamp,
};
