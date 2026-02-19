import { Router } from "express";
import CndTypeManager from "../controllers/cndType.js";
import { newCndType, queryCndType } from "../schemas/cndType.js";

const cndTypeRoute = Router();

// new
cndTypeRoute.post("/", async (req, res) => {
  try {
    const data = await newCndType.safeParseAsync(req.body);

    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Dados inválidos",
        details: data.error.issues,
      });
      return;
    }

    const cndType = await CndTypeManager.newCndType(data.data.tipo, data.data.diasRestantes);

    res.status(201).json({
      success: true,
      data: cndType,
    });
  } catch (error) {
    console.error("[POST /cndType] Erro ao criar tipo:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

cndTypeRoute.post("/search", async (req, res) => {
  try {
    const data = await queryCndType.safeParseAsync(req.body);

    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Filtros inválidos",
        details: data.error.issues,
      });
      return;
    }

    const cndTypes = await CndTypeManager.getCndTypes(data.data);

    res.json({
      success: true,
      data: cndTypes,
      count: cndTypes.length,
    });
  } catch (error) {
    console.error("[POST /cndType/search] Erro na busca:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

cndTypeRoute.get("/", async (req, res) => {
  try {
    const { tipo, ativo } = req.query;
    const where: any = {};

    if (ativo !== undefined) where.ativo = ativo === "true";
    if (tipo && typeof tipo === "string") where.tipo = tipo;

    const cndTypes = await CndTypeManager.getCndTypes({ where });

    res.json({
      success: true,
      data: cndTypes,
      count: cndTypes.length,
    });
  } catch (error) {
    console.error("[GET /cndType] Erro ao listar:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

cndTypeRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cndTypes = await CndTypeManager.getCndTypes({
      where: { id },
    });

    if (cndTypes.length === 0) {
      res.status(404).json({
        success: false,
        error: "Tipo de CND não encontrado",
      });
      return;
    }

    res.json({
      success: true,
      data: cndTypes[0],
    });
  } catch (error) {
    console.error("[GET /cndType/:id] Erro ao buscar:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});
export default cndTypeRoute;
