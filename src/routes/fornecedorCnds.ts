import { Router } from "express";
import FornecedorCndsManager from "../controllers/fornecedorCnds.js";
import { newFornecedorCnds, queryFornecedorCnds } from "../schemas/fornecedorCnds.js";

const fornecedorCndsRoute = Router();

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
    data.data.cndtypeid
  );
 
  res.json({
    success: true,
    data: response,
  });
});

fornecedorCndsRoute.get("", async (req, res) => {
  let data = await queryFornecedorCnds.safeParseAsync(req.query);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const response = await FornecedorCndsManager.getCnd(data.data);
  
  res.json({
    success: true,
    data: response,
  });
  
});

export default fornecedorCndsRoute;
