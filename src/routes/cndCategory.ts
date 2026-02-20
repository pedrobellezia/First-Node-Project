import { Router } from "express";
import CndCategoryManager from "../controllers/cndCategory.js";
import { newCndCategory, queryCndCategory } from "../schemas/cndCategory.js";
import ApiResponseHandler from "../lib/response.js";

const cndCategoryRoute = Router();

// POST / - Criar nova categoria
cndCategoryRoute.post("/", async (req, res) => {
  try {
    const data = await newCndCategory.safeParseAsync(req.body);

    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const cndCategory = await CndCategoryManager.newCndCategory(
      data.data.cndTypeId,
      data.data.uf,
      data.data.municipio,
      data.data.instructions,
    );

    ApiResponseHandler.success(res, cndCategory, 201);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[POST /cndCategory]", error);
  }
});

// POST /search - Busca avançada
cndCategoryRoute.post("/search", async (req, res) => {
  try {
    const data = await queryCndCategory.safeParseAsync(req.body);

    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const cndCategories = await CndCategoryManager.getCndCategories(data.data);

    ApiResponseHandler.success(res, cndCategories);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[POST /cndCategory/search]", error);
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

    ApiResponseHandler.success(res, cndCategories);
  } catch (error) {

    ApiResponseHandler.internalError(res, "[GET /cndCategory]", error);
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
      ApiResponseHandler.notFound(res, "Categoria de CND");
      return;
    }

    ApiResponseHandler.success(res, cndCategories[0]);
  } catch (error) {
    ApiResponseHandler.internalError(res, "[GET /cndCategory/:id]", error);
  }
});

export default cndCategoryRoute;
