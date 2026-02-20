import { Router } from "express";
import CndTypeManager from "../controllers/cndType.js";
import { newCndType, queryCndType } from "../schemas/cndType.js";
import ApiResponseHandler from "../lib/response.js";
import { BaseError } from "../lib/error.js";

const cndTypeRoute = Router();

// POST / - Criar novo tipo de CND
cndTypeRoute.post("/", async (req, res) => {
  try {
    const data = await newCndType.safeParseAsync(req.body);

    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const cndType = await CndTypeManager.newCndType(data.data.tipo, data.data.diasRestantes);

    ApiResponseHandler.success(res, cndType, 201);
  } catch (error) {
    ApiResponseHandler.trycatchHandler(res, error as BaseError);
  }
});

cndTypeRoute.post("/search", async (req, res) => {
  try {
    const data = await queryCndType.safeParseAsync(req.body);

    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const cndTypes = await CndTypeManager.getCndTypes(data.data);

    ApiResponseHandler.success(res, cndTypes);
  } catch (error) {
    ApiResponseHandler.trycatchHandler(res, error as BaseError);
  }
});

cndTypeRoute.get("/", async (req, res) => {
  try {
    const { tipo, ativo } = req.query;
    const where: any = {};

    if (ativo !== undefined) where.ativo = ativo === "true";
    if (tipo && typeof tipo === "string") where.tipo = tipo;

    const cndTypes = await CndTypeManager.getCndTypes({ where });

    ApiResponseHandler.success(res, cndTypes);
  } catch (error) {
    ApiResponseHandler.trycatchHandler(res, error as BaseError);
  }
});

cndTypeRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cndTypes = await CndTypeManager.getCndTypes({
      where: { id },
    });

    if (cndTypes.length === 0) {
      ApiResponseHandler.notFound(res, "Tipo de CND");
      return;
    }

    ApiResponseHandler.success(res, cndTypes[0]);
  } catch (error) {
    ApiResponseHandler.trycatchHandler(res, error as BaseError);
  }
});
export default cndTypeRoute;
