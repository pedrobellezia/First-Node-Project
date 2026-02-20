import { Router } from "express";
import CndManager from "../controllers/cnd.js";
import { newCnd, queryCnd } from "../schemas/cnd.js";
import ApiResponseHandler from "../lib/response.js";

const cndRoute = Router();

// POST / - Emitir nova CND
cndRoute.post("/", async (req, res) => {
  try {
    const data = await newCnd.safeParseAsync(req.body);

    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const cnd = await CndManager.newCnd(data.data.fornecedorCategoryId);

    ApiResponseHandler.success(res, cnd, 201);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[POST /cnd]", error);
  }
});

// POST /search - Busca avançada
cndRoute.post("/search", async (req, res) => {
  try {
    const data = await queryCnd.safeParseAsync(req.body);

    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const cnds = await CndManager.getCnd(data.data);

    ApiResponseHandler.success(res, cnds);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[POST /cnd/search]", error);
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

    ApiResponseHandler.success(res, cnds);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[GET /cnd]", error);
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
      ApiResponseHandler.notFound(res, "CND");
      return;
    }

    ApiResponseHandler.success(res, cnds[0]);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[GET /cnd/:id]", error);
  }
});

export default cndRoute;
