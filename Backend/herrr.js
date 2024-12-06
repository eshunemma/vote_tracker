import  xlsx from "xlsx";
import fs from "fs";

// Load the Excel file
const workbook = xlsx.readFile("./TAKORADI_WCO.xlsx");

// Get the names of the sheets
const sheetNames = workbook.SheetNames;

// Read data from the first sheet
const sheet = workbook.Sheets[sheetNames[0]];

// Convert the sheet data to JSON
const jsonData = xlsx.utils.sheet_to_json(sheet);

// Define the output JSON file path
const outputFilePath = "output.json";

// Save the JSON data to a file
fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), (err) => {
  if (err) {
    console.error("Error saving JSON file:", err);
  } else {
    console.log("JSON file saved successfully:", outputFilePath);
  }
});
