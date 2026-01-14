import app from "./server.js";

const PORT = 3000;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
} else if (!process.env.CAPTCHA_API_KEY) {
  throw new Error("CAPTCHA_API_KEY is not defined");
} else if (!process.env.CND_API_URL) {
  throw new Error("CND_API_URL is not defined");
}

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
