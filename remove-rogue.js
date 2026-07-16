const fs = require("fs");
const lines = fs.readFileSync("style.css", "utf8").split("\n");
const targetIndex = lines.findIndex((line) =>
  line.includes("PROPER MOBILE RESPONSIVENESS (NATIVE STACK)"),
);

if (targetIndex !== -1) {
  const sliceIndex = targetIndex - 2;
  const newContent = lines.slice(0, sliceIndex).join("\n");
  fs.writeFileSync("style.css", newContent, "utf8");
  console.log("Successfully removed rogue append block from style.css");
} else {
  console.log("Could not find the rogue block.");
}
