import express from "express";
import fornecedorRoute from "./routes/fornecedor.js";
import cndtypeRoute from "./routes/cndtype.js";
import cndRoute from "./routes/fornecedorCnds.js";
import cors from "cors";

var app = express();
app.use(express.json());
app.use(cors());
app.set("query parser", "extended");

// Servir arquivos estáticos (PDFs) da pasta public
app.use("/public", express.static("public"));

app.use("/fornecedor", fornecedorRoute);
app.use("/cndtype", cndtypeRoute);
app.use("/cnd", cndRoute);

export default app;
