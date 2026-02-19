import { Router } from "express";
import FornecedorCategoryManager from "../controllers/fornecedorCategory.js";
import {
  newFornecedorCategory,
  queryFornecedorCategory,
} from "../schemas/fornecedorCategory.js";

const fornecedorCategoryRoute = Router();

// POST / - Criar novo vínculo
fornecedorCategoryRoute.post("/", async (req, res) => {
  try {
    const data = await newFornecedorCategory.safeParseAsync(req.body);

    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Dados inválidos",
        details: data.error.issues,
      });
      return;
    }

    const vinculo = await FornecedorCategoryManager.newFornecedorCategory(
      data.data.fornecedorId,
      data.data.cndCategoryId,
    );

    res.status(201).json({
      success: true,
      data: vinculo,
    });
  } catch (error) {
    console.error("[POST /] Erro ao criar vínculo:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// POST /search - Busca avançada
fornecedorCategoryRoute.post("/search", async (req, res) => {
  try {
    const data = await queryFornecedorCategory.safeParseAsync(req.body);

    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Filtros inválidos",
        details: data.error.issues,
      });
      return;
    }

    const vinculos = await FornecedorCategoryManager.getFornecedorCategories(
      data.data,
    );

    res.json({
      success: true,
      data: vinculos,
      count: vinculos.length,
    });
  } catch (error) {
    console.error("[POST /search] Erro na busca:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// GET / - Listar com filtros
fornecedorCategoryRoute.get("/", async (req, res) => {
  try {
    const { fornecedorId, cndCategoryId, ativo } = req.query;
    const where: any = {};

    if (ativo !== undefined) where.ativo = ativo === "true";
    if (fornecedorId && typeof fornecedorId === "string")
      where.fornecedorId = fornecedorId;
    if (cndCategoryId && typeof cndCategoryId === "string")
      where.cndCategoryId = cndCategoryId;

    const vinculos = await FornecedorCategoryManager.getFornecedorCategories({
      where,
      include: {
        fornecedor: true,
        cndCategory: {
          include: { cndType: true },
        },
      },
    });

    res.json({
      success: true,
      data: vinculos,
      count: vinculos.length,
    });
  } catch (error) {
    console.error("[GET /] Erro ao listar:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// GET /:id - Buscar por ID
fornecedorCategoryRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const vinculos = await FornecedorCategoryManager.getFornecedorCategories({
      where: { id },
      include: {
        fornecedor: true,
        cndCategory: {
          include: { cndType: true },
        },
      },
    });

    if (vinculos.length === 0) {
      res.status(404).json({
        success: false,
        error: "Vínculo não encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: vinculos[0],
    });
  } catch (error) {
    console.error("[GET /:id] Erro ao buscar vínculo:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

export default fornecedorCategoryRoute;
