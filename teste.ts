const text = "Validade:02/02/2026 a 03/03/2026";

const regex = /Validade:\s*\d{2}\/\d{2}\/\d{4}\s*a\s*(\d{2}\/\d{2}\/\d{4})/;

const match = text.match(regex);

if (match) {
  const segundaData = match[1];
  console.log("Segunda data:", segundaData);
} else {
  console.log("Data não encontrada");
}
