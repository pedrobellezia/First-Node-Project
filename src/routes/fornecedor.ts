import { Router } from "express";
import FornecedorManager from "../controllers/fornecedor.js";
import { newFornecedor, queryFornecedor } from "../schemas/fornecedor.js";
import ApiResponseHandler from "../lib/response.js";
import { BaseError } from "../lib/error.js";

const fornecedorRoute = Router();

// POST / - Criar novo fornecedor
fornecedorRoute.post("/", async (req, res) => {
  try {
    const data = await newFornecedor.safeParseAsync(req.body);
    
    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const fornecedor = await FornecedorManager.newFornecedor(
      data.data.cnpj,
      data.data.name,
      data.data.uf,
      data.data.municipio
    );
    
    ApiResponseHandler.success(res, fornecedor, 201);
  } catch (error) {
    ApiResponseHandler.trycatchHandler(res, error as BaseError);
  }
});

// POST /search - Busca avançada
fornecedorRoute.post("/search", async (req, res) => {
  try {
    const data = await queryFornecedor.safeParseAsync(req.body);

    if (!data.success) {
      ApiResponseHandler.validationError(res, data.error);
      return;
    }

    const fornecedores = await FornecedorManager.getFornecedores(data.data);

    ApiResponseHandler.success(res, fornecedores);
  } catch (error) {
    ApiResponseHandler.trycatchHandler(res, error as BaseError);
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

    ApiResponseHandler.success(res, fornecedores);
  } catch (error) {
    ApiResponseHandler.trycatchHandler(res, error as BaseError);
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
      ApiResponseHandler.notFound(res, "Fornecedor");
      return;
    }

    ApiResponseHandler.success(res, fornecedores[0]);
  } catch (error) {
    ApiResponseHandler.trycatchHandler(res, error as BaseError);
  }
});

export default fornecedorRoute;