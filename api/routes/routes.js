import { Router } from "express";
import {
  getCentros,
  getCentro,
  getTiposCentros,
  getCentrosDistinct
} from "../controllers/centros.controller.js";
import {
  getProvincias,
  getMunicipios
} from "../controllers/provincias.controller.js";
import {
  getMedicos,
  getEspecialidades,
  getMedico
} from "../controllers/medicos.controller.js";
import { actualizar } from "../controllers/actualizardatos.controller.js";

const router = Router();


// GET all Employees
router.get("/centros", getCentros);
router.get("/centros/:id", getCentro);
router.get("/tipos/centros/", getTiposCentros);
router.get("/tipos/centros/distinct", getCentrosDistinct);

router.get("/provincias", getProvincias);
router.get("/provincias/municipios", getMunicipios);
router.get("/medicos", getMedicos);
router.get("/medicos/especialidades", getEspecialidades);
router.get("/medico/:id", getMedico);

router.post("/actualizar/datos", actualizar);


export default router;
