import { Router } from "express";
import FornecedorManager from "../controllers/fornecedor.js";
import { newFornecedor, queryFornecedor } from "../schemas/fornecedor.js";

const fornecedorRoute = Router();

// POST / - Criar novo fornecedor
fornecedorRoute.post("/", async (req, res) => {
  try {
    const data = await newFornecedor.safeParseAsync(req.body);
    
    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Dados inválidos",
        details: data.error.issues
      });
      return;
    }

    const fornecedor = await FornecedorManager.newFornecedor(
      data.data.cnpj,
      data.data.name,
      data.data.uf,
      data.data.municipio
    );
    
    res.status(201).json({
      success: true,
      data: fornecedor
    });
  } catch (error) {
    console.error("[POST /fornecedor] Erro ao criar fornecedor:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});

// POST /search - Busca avançada
fornecedorRoute.post("/search", async (req, res) => {
  try {
    const data = await queryFornecedor.safeParseAsync(req.body);

    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Filtros inválidos",
        details: data.error.issues
      });
      return;
    }

    const fornecedores = await FornecedorManager.getFornecedores(data.data);

    res.json({
      success: true,
      data: fornecedores,
      count: fornecedores.length
    });
  } catch (error) {
    console.error("[POST /fornecedor/search] Erro na busca:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});

// GET / - Listar com filtros
fornecedorRoute.get("/", async (req, res) => {
  try {
    const { cnpj, name, uf, municipio, ativo } = req.query;
    const where: any = {};

    if (ativo !== undefined) where.ativo = ativo === 'true';
    if (cnpj && typeof cnpj === "string") where.cnpj = cnpj;
    if (name && typeof name === "string") where.name = name;
    if (uf && typeof uf === "string") where.uf = uf;
    if (municipio && typeof municipio === "string") where.municipio = municipio;

    const fornecedores = await FornecedorManager.getFornecedores({ where });

    res.json({
      success: true,
      data: fornecedores,
      count: fornecedores.length
    });
  } catch (error) {
    console.error("[GET /fornecedor] Erro ao listar:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});

// GET /:id - Buscar por ID
fornecedorRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const fornecedores = await FornecedorManager.getFornecedores({
      where: { id }
    });
    
    if (fornecedores.length === 0) {
      res.status(404).json({
        success: false,
        error: "Fornecedor não encontrado"
      });
      return;
    }

    res.json({
      success: true,
      data: fornecedores[0]
    });
  } catch (error) {
    console.error("[GET /fornecedor/:id] Erro ao buscar:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor"
    });
  }
});

export default fornecedorRoute;