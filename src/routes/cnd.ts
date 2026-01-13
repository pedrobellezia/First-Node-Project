import { Router } from "express";
import { prisma } from "../lib/prisma";
import getCndfromApi from "../lib/call_cnd_api";
import FornecedorManager from "../controllers/fornecedor";
import CndTypeManager from "../controllers/cndtype";
import { getCnd, newCnd } from "../lib/schemas";
import CndManager from "../controllers/cnd";

const cndRoute = Router();

cndRoute.post("", async (req, res) => {
  let reqData = await newCnd.safeParseAsync(req.body);

  if (!reqData.success || reqData.data === undefined) {
    res.send(reqData.error.issues);
    return;
  }

  const response = await CndManager.newCnd(
    reqData.data.fornecedorid,
    reqData.data.cndtypeid
  );
  
  res.send(response);
});

cndRoute.get("", async (req, res) => {
  let reqData = await getCnd.safeParseAsync(req.body);

  if (!reqData.success) {
    res.send(reqData.error.issues);
    return;
  }

  res.send(
    await CndManager.getCnd(
      reqData.data.id,
      reqData.data.fornecedorid,
      reqData.data.cndtypeid
    )
  );
});

export default cndRoute;
