import { Router } from "express";
import CndManager from "../controllers/cnd.js";
import { newCnd, queryCnd } from "../schemas/cnd.js";

const cndRoute = Router();

// POST / - Emitir nova CND
cndRoute.post("/", async (req, res) => {
  try {
    const data = await newCnd.safeParseAsync(req.body);

    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Dados inválidos",
        details: data.error.issues,
      });
      return;
    }

    const cnd = await CndManager.newCnd(data.data.fornecedorCategoryId);

    res.status(201).json({
      success: true,
      data: cnd,
    });
  } catch (error) {
    console.error("[POST /cnd] Erro ao criar CND:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// POST /search - Busca avançada
cndRoute.post("/search", async (req, res) => {
  try {
    const data = await queryCnd.safeParseAsync(req.body);

    if (!data.success) {
      res.status(400).json({
        success: false,
        error: "Filtros inválidos",
        details: data.error.issues,
      });
      return;
    }

    const cnds = await CndManager.getCnd(data.data);

    res.json({
      success: true,
      data: cnds,
      count: cnds.length,
    });
  } catch (error) {
    console.error("[POST /cnd/search] Erro na busca:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// GET / - Listar com filtros
cndRoute.get("/", async (req, res) => {
  try {
    const { fornecedorId, cndTypeId, numero, validaAte, ativo } = req.query;
    const where: any = {};

    if (ativo !== undefined) where.ativo = ativo === "true";
    if (fornecedorId && typeof fornecedorId === "string")
      where.fornecedorId = fornecedorId;
    if (cndTypeId && typeof cndTypeId === "string") where.cndTypeId = cndTypeId;
    if (numero && typeof numero === "string") where.numero = numero;
    if (validaAte && typeof validaAte === "string")
      where.validaAte = new Date(validaAte);

    const cnds = await CndManager.getCnd({
      where,
      include: {
        fornecedorCategory: {
          include: {
            fornecedor: true,
            cndCategory: { include: { cndType: true } },
          },
        },
      },
    });

    res.json({
      success: true,
      data: cnds,
      count: cnds.length,
    });
  } catch (error) {
    console.error("[GET /cnd] Erro ao listar:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

// GET /:id - Buscar por ID
cndRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cnds = await CndManager.getCnd({
      where: { id },
      include: {
        fornecedorCategory: {
          include: {
            fornecedor: true,
            cndCategory: { include: { cndType: true } },
          },
        },
      },
    });

    if (cnds.length === 0) {
      res.status(404).json({
        success: false,
        error: "CND não encontrada",
      });
      return;
    }

    res.json({
      success: true,
      data: cnds[0],
    });
  } catch (error) {
    console.error("[GET /cnd/:id] Erro ao buscar:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  }
});

export default cndRoute;
