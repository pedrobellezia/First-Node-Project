import { Router } from "express";
import FornecedorCndsManager from "../controllers/fornecedorCnds.js";
import {
  newFornecedorCnds,
  queryFornecedorCnds,
} from "../schemas/fornecedorCnds.js";

const fornecedorCndsRoute = Router();

// new
fornecedorCndsRoute.post("", async (req, res) => {
  let data = await newFornecedorCnds.safeParseAsync(req.body);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const response = await FornecedorCndsManager.newCnd(
    data.data.fornecedorid,
    data.data.cndtypeid,
  );

  res.json({
    success: true,
    data: response,
  });
});

// complex query  
fornecedorCndsRoute.post("/search", async (req, res) => {
  let data = await queryFornecedorCnds.safeParseAsync(req.body);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const cnd = await FornecedorCndsManager.getCnd(data.data);

  res.json({ success: true, data: cnd });
});

// many with filter
fornecedorCndsRoute.get("", async (req, res) => {
  const { fornecedorid, cndtypeid } = req.query;

  const where: any = { ativo: true };

  if (fornecedorid && typeof fornecedorid === "string") {
    where.fornecedorid = fornecedorid;
  }
  if (cndtypeid && typeof cndtypeid === "string") {
    where.cndtypeid = cndtypeid;
  }

  const cnd = await FornecedorCndsManager.getCnd({ where });

  if (cnd.length === 0) {
    res.json({
      success: false,
      data: "cnd not found",
    });
    return;
  }

  res.json({ success: true, data: cnd });
});

// only one
fornecedorCndsRoute.get("/:id", async (req, res) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.json({
      success: false,
      data: "ID must be a string",
    });
    return;
  }

  const cnd = await FornecedorCndsManager.getCnd({
    where: { ativo: true, id: id },
  });
  if (cnd.length === 0) {
    res.json({
      success: false,
      data: "cnd not found",
    });
    return;
  }

  res.json({ success: true, data: cnd[0] });
});

export default fornecedorCndsRoute;
