import { Router } from "express";
import CndTypeManager from "../controllers/cndtype";
import { newCndType, getCndType } from "../lib/schemas";

const cndtypeRoute = Router();

cndtypeRoute.post("", async (req, res) => {
  let data = await newCndType.safeParseAsync(req.body);

  if (!data.success) {
    res.send(data.error.issues);
    return;
  }

  // data.data pode ser undefined mas eu ja tomei conta dessa possibilidade na linha 10-12
  const cnd = await CndTypeManager.newCndType(
    data.data.uf,
    data.data.municipio,
    data.data.tipo,
    data.data.instructions
  );

  res.send({
    cnd: cnd,
  });
});

cndtypeRoute.get("", async (req, res) => {
  let data = await getCndType.safeParseAsync(req.body);

  if (!data.success) {
    res.send(data.error.issues);
    return;
  }

  const cnd = await CndTypeManager.getCndType(
    data.data.id,
    data.data.uf,
    data.data.municipio,
    data.data.tipo
  );
  res.send({
    cnd: cnd,
  });
});

export default cndtypeRoute;
