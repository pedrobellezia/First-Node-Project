import { Router } from "express";
import CndTypeManager from "../controllers/cndtype.js";
import { newCndType, queryCndType } from "../schemas/cndtype.js";

const cndtypeRoute = Router();

// new
cndtypeRoute.post("", async (req, res) => {
  let data = await newCndType.safeParseAsync(req.body);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const cnd = await CndTypeManager.newCndType(
    data.data.uf,
    data.data.municipio,
    data.data.tipo,
    data.data.instructions,
  );

  res.json({
    success: true,
    data: cnd,
  });
});

// complex query
cndtypeRoute.post("/search", async (req, res) => {
  let data = await queryCndType.safeParseAsync(req.query);

  if (!data.success) {
    res.json({
      success: false,
      data: data.error.issues,
    });
    return;
  }

  const cndtype = await CndTypeManager.getCndType(data.data);

  res.json({ success: true, data: cndtype });
});

// many with filter
cndtypeRoute.get("", async (req, res) => {
  const { tipo, uf, municipio } = req.query;

  const where: any = { ativo: true };

  if (tipo && typeof tipo === "string") {
    where.tipo = tipo;
  }
  if (uf && typeof uf === "string") {
    where.uf = uf;
  }
  if (municipio && typeof municipio === "string") {
    where.municipio = municipio;
  }

  const cndtype = await CndTypeManager.getCndType({ where });

  if (cndtype.length === 0) {
    res.json({
      success: false,
      data: "CndType not found",
    });
    return;
  }

  res.json({ success: true, data: cndtype });
});

// only one
cndtypeRoute.get("/:id", async (req, res) => {
  const id = req.params.id;

  if (typeof id !== "string") {
    res.json({
      success: false,
      data: "CndType not found",
    });
    return;
  }

  const cndtype = await CndTypeManager.getCndType({
    where: { ativo: true, id: id },
  });
  if (cndtype.length === 0) {
    res.json({
      success: false,
      data: "CndType not found",
    });
    return;
  }

  res.json({ success: true, data: cndtype[0] });
});

export default cndtypeRoute;
