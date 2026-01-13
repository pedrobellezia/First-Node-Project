import express from "express";
import fornecedorRoute from "./routes/fornecedor";
import cndtypeRoute from "./routes/cndtype";
import cndRoute from "./routes/cnd";


var app = express();
app.use(express.json());
app.use("/fornecedor", fornecedorRoute);
app.use("/cndtype", cndtypeRoute);
app.use("/cnd", cndRoute)

export default app;
