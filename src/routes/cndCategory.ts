import { Router } from "express";
import CndCategoryManager from "../controllers/cndCategory.js";
import { newCndCategory, queryCndCategory } from "../schemas/cndCategory.js";

const cndCategoryRoute = Router();

// POST / - Criar nova categoria
cndCategoryRoute.post("/", async (req, res) => {
  try {
    const data = await newCndCategory.safeParseAsync(req.body);

    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Dados inválidos",
        details: data.error.issues,
      });
      return;
    }

    const cndCategory = await CndCategoryManager.newCndCategory(
      data.data.cndTypeId,
      data.data.uf,
      data.data.municipio,
      data.data.instructions,
    );

    res.status(201).json({
      success: true,
      data: cndCategory,
    });
  } catch (error) {
    console.error("[POST /cndCategory] Erro ao criar categoria:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// POST /search - Busca avançada
cndCategoryRoute.post("/search", async (req, res) => {
  try {
    const data = await queryCndCategory.safeParseAsync(req.body);

    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Filtros inválidos",
        details: data.error.issues,
      });
      return;
    }

    const cndCategories = await CndCategoryManager.getCndCategories(data.data);

    res.json({
      success: true,
      data: cndCategories,
      count: cndCategories.length,
    });
  } catch (error) {
    console.error("[POST /cndCategory/search] Erro na busca:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// GET / - Listar com filtros
cndCategoryRoute.get("/", async (req, res) => {
  try {
    const { uf, municipio, cndTypeId, ativo } = req.query;
    const where: any = {};

    if (ativo !== undefined) where.ativo = ativo === "true";
    if (uf && typeof uf === "string") where.uf = uf;
    if (municipio && typeof municipio === "string") where.municipio = municipio;
    if (cndTypeId && typeof cndTypeId === "string") where.cndTypeId = cndTypeId;

    const cndCategories = await CndCategoryManager.getCndCategories({
      where,
      include: { cndType: true },
    });

    res.json({
      success: true,
      data: cndCategories,
      count: cndCategories.length,
    });
  } catch (error) {
    console.error("[GET /cndCategory] Erro ao listar:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// GET /:id - Buscar por ID
cndCategoryRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cndCategories = await CndCategoryManager.getCndCategories({
      where: { id },
      include: { cndType: true },
    });

    if (cndCategories.length === 0) {
      res.status(404).json({
        success: false,
        error: "Categoria de CND não encontrada",
      });
      return;
    }

    res.json({
      success: true,
      data: cndCategories[0],
    });
  } catch (error) {
    console.error("[GET /cndCategory/:id] Erro ao buscar:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

export default cndCategoryRoute;
