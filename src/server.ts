import express from "express";
import fornecedorRoute from "./routes/fornecedor.js";
import cndtypeRoute from "./routes/cndtype.js";
import cndRoute from "./routes/cnd.js";


var app = express();
app.use(express.json());
app.use("/fornecedor", fornecedorRoute);
app.use("/cndtype", cndtypeRoute);
app.use("/cnd", cndRoute)

export default app;
