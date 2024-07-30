// Date(year month day hour minutes seconds miliseconds)
// Date("year-month-dayThour:minutes:secondsZ")
// Z => UTC (Coordinated Universal Time)
const currentDate = new Date(); // OBJECT CONTAIN CURRENT DATE AND TIME
console.log(currentDate.toLocaleDateString());
console.log(currentDate.toLocaleTimeString());
console.log(currentDate.toDateString());
console.log(currentDate.toISOString());
console.log(currentDate.toString());
console.log(currentDate.toTimeString());
const customizedDate = new Date("2024-04-16T01:34:53.159Z");
console.log(customizedDate);
console.log(currentDate); // 2024-04-16T01:34:53.159Z

// Create an Intl.DateTimeFormat object with options for Egypt timezone
// Get the current date and time

// Create an Intl.DateTimeFormat object with options for Egypt timezone
const dateTimeFormatOptions = {
  timeZone: "Africa/Cairo",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric", // Include seconds component
  hour12: false, // 24-hour format
};

// Format the current date and time according to Egypt timezone
const formattedDate = new Intl.DateTimeFormat(
  "en-EG",
  dateTimeFormatOptions,
).format(currentDate);

// Split the formatted date string to extract the time part
const timePart = formattedDate.split(" ")[1]; // Assuming the time part comes after the date

// Extract the seconds component from the time part
const seconds = timePart.split(":")[2];

console.log(formattedDate); // Formatted date string
console.log(seconds); // Seconds component

// COMPARE

// if (currentDate > customizedDate) {
//   console.log("Current Date is greater than Customized Date");
// }
