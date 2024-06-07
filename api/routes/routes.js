import { Router } from "express";
import {
  getCentros,
  getCentro,
  getTiposCentros,
  getCentrosDistinct,
  createCentro,
  updateCentro,
  deleteCentro
} from "../controllers/centros.controller.js";
import {
  getProvincias,
  getMunicipios
} from "../controllers/provincias.controller.js";
import {
  getMedicos,
  getEspecialidades,
  getMedico,
  createMedico,
  updateMedico,
  deleteMedico
} from "../controllers/medicos.controller.js";
import { actualizar } from "../controllers/actualizardatos.controller.js";
import { register, login, authenticate } from "../controllers/auth.controller.js";


const router = Router();
router.post("/register", register);
router.post("/login", login);

// GET all Employees
router.get("/centros", getCentros);
router.post("/centros", createCentro); // Añadimos la nueva ruta POST
router.put("/centros/:id", updateCentro); // Añadimos la nueva ruta PUT
router.delete("/centros/:id", deleteCentro); // Añadir la nueva ruta DELETE

router.get("/centros/:id", getCentro);
router.get("/tipos/centros/", getTiposCentros);
router.get("/tipos/centros/distinct", getCentrosDistinct);

router.get("/provincias", getProvincias);
router.get("/provincias/municipios", getMunicipios);
router.get("/medicos", getMedicos);
router.get("/medicos/especialidades", getEspecialidades);
router.get("/medico/:id", getMedico);
router.post("/medicos", createMedico);
router.put("/medicos/:id", updateMedico);
router.delete("/medicos/:id", deleteMedico);

router.post("/actualizar/datos", actualizar);


export default router;
