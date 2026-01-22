import { Router } from "express";
import FornecedorManager from "../controllers/fornecedor.js";
import { newFornecedor, queryFornecedor } from "../schemas/fornecedor.js";

const fornecedorRoute = Router();

// new
fornecedorRoute.post("", async (req, res) => {
  let data = await newFornecedor.safeParseAsync(req.body);
  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }
  const fornecedor = await FornecedorManager.newFornecedor(
    data.data.cnpj,
    data.data.name,
    data.data.uf,
    data.data.municipio,
  );
  res.json({
    success: true,
    data: fornecedor,
  });
});

// complex query
fornecedorRoute.post("/search", async (req, res) => {
  let data = await queryFornecedor.safeParseAsync(req.body);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const fornecedores = await FornecedorManager.getFornecedor(data.data);

  if (fornecedores.length === 0) {
    res.json({
      success: false,
      data: "Fornecedor not found",
    });
    return;
  }

  res.json({ success: true, data: fornecedores });
});

// many with filter
fornecedorRoute.get("", async (req, res) => {
  const { cnpj, name, uf, municipio } = req.query;

  const where: any = { ativo: true };

  if (cnpj && typeof cnpj === "string") {
    where.cnpj = cnpj;
  }
  if (name && typeof name === "string") {

    where.name = name;
  }
  if (uf && typeof uf === "string") {
    where.uf = uf;
  }
  if (municipio && typeof municipio === "string") {
    where.municipio = municipio;
  }

  const fornecedores = await FornecedorManager.getFornecedor({ where });

  if (fornecedores.length === 0) {
    res.json({
      success: false,
      data: "Fornecedor not found",
    });
    return;
  }

  res.json({ success: true, data: fornecedores });
});

// only one
fornecedorRoute.get("/:id", async (req, res) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.json({
      success: false,
      data: "ID must be a string",
    });
    return;
  }

  const fornecedores = await FornecedorManager.getFornecedor({
    where: { ativo: true, id: id },
  });
  if (fornecedores.length === 0) {
    res.json({
      success: false,
      data: "Fornecedor not found",
    });
    return;
  }

  res.json({ success: true, data: fornecedores[0] });
});

export default fornecedorRoute;
