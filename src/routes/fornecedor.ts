import { Router } from "express";
import FornecedorManager from "../controllers/fornecedor.js";
import { getFornecedor, newFornecedor } from "../lib/schemas.js";

const fornecedorRoute = Router();

fornecedorRoute.post("", async (req, res) => {
  let data = await newFornecedor.safeParseAsync(req.body);

  if (!data.success) {
    res.send(data.error.issues);
    return;
  }
  // data.data pode ser undefined mas eu ja tomei conta dessa possibilidade na linha 10-12

  const fornecedor = await FornecedorManager.newFornecedor(
    data.data.cnpj,
    data.data.name,
    data.data.uf,
    data.data.municipio
  );
  res.send(fornecedor);
});

fornecedorRoute.get("", async (req, res) => {
  let data = await getFornecedor.safeParseAsync(req.body);

  if (!data.success) {
    res.send(data.error.issues);
    return;
  }
  const fornecedor = await FornecedorManager.getFornecedor(
    data.data.id,
    data.data.uf,
    data.data.municipio,
    data.data.name,
    data.data.cnpj
  );

  res.send(fornecedor);
});

export default fornecedorRoute;
