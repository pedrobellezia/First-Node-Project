import { Router } from "express";
import FornecedorCategoryManager from "../controllers/fornecedorCategory.js";
import {
  newFornecedorCategory,
  queryFornecedorCategory,
} from "../schemas/fornecedorCategory.js";
import ApiResponseHandler from "../lib/response.js";

const fornecedorCategoryRoute = Router();

// POST / - Criar novo vínculo
fornecedorCategoryRoute.post("/", async (req, res) => {
  try {
    const data = await newFornecedorCategory.safeParseAsync(req.body);

    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const vinculo = await FornecedorCategoryManager.newFornecedorCategory(
      data.data.fornecedorId,
      data.data.cndCategoryId,
    );

    ApiResponseHandler.success(res, vinculo, 201);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[POST /fornecedorCategory]", error);
  }
});

// POST /search - Busca avançada
fornecedorCategoryRoute.post("/search", async (req, res) => {
  try {
    const data = await queryFornecedorCategory.safeParseAsync(req.body);

    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const vinculos = await FornecedorCategoryManager.getFornecedorCategories(
      data.data,
    );

    ApiResponseHandler.success(res, vinculos);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[POST /fornecedorCategory/search]", error);
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

    ApiResponseHandler.success(res, vinculos);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[GET /fornecedorCategory]", error);
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
      ApiResponseHandler.notFound(res, "Vínculo");
      return;
    }

    ApiResponseHandler.success(res, vinculos[0]);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[GET /fornecedorCategory/:id]", error);
  }
});

export default fornecedorCategoryRoute;
