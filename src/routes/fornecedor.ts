import { Router } from "express";
import FornecedorManager from "../controllers/fornecedor.js";
import { newFornecedor, queryFornecedor } from "../schemas/fornecedor.js";

const fornecedorRoute = Router();

fornecedorRoute.post("", async (req, res) => {
  let data = await newFornecedor.safeParseAsync(req.body);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
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
  console.log(req.query);
  let data = await queryFornecedor.safeParseAsync(req.query);
  console.log(data);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const fornecedor = await FornecedorManager.getFornecedor(data.data);

  res.json({ success: true, data: fornecedor });
});

export default fornecedorRoute;
