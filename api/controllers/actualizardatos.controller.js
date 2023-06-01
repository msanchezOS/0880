import { pool } from "../../db.js";


export const actualizar = async (req, res) => {
  try {
    // Personal
    const noPrestador = req.fields.noPrestador;
    const tipo = req.fields.tipo;
    const nombre = req.fields.nombre;

    // Direccion
    const provincia = req.fields.provincia;
    const municipio = req.fields.municipio;
    const calle = req.fields.calle;
    const edificio = req.fields.edificio;
    const casa = req.fields.casa;
    const local = req.fields.local;
    const sector = req.fields.sector;

    // Telefonos
    const telPersonal = req.fields.telPersonal;
    const celularPersonal = req.fields.celularPersonal;

    // Datos laborales
    const lugarTrabajo = req.fields.lugarTrabajo;
    const telefonoTrabajo = req.fields.telefonoTrabajo;
    const faxTrabajo = req.fields.faxTrabajo;
    const emailTrabajo = req.fields.emailTrabajo;

    // Direccion de correspondencia 
    const corrProvincia = req.fields.corrProvincia;
    const corrMunicipio = req.fields.corrMunicipio;
    const corrSector = req.fields.corrSector;
    const corrCalle = req.fields.corrCalle;
    const corrNo = req.fields.corrNo;
    const corrEdificio = req.fields.corrEdificio;
    const corrApto = req.fields.corrApto;

    const [rows] = await pool.query("INSERT INTO `actualizar_datos` (`id`, `tipo`, `nombre`, `provincia`, `dirMunicipio`, `dirCalle`, `dirEdificio`, `dirCasa`, `dirLocal`, `dirSector`, `telPersonal`, `celularPersonal`, `lugarTrabajo`, `telefonoTrabajo`, `faxTrabajo`, `emailTrabajo`, `corrProvincia`, `corrMunicipio`, `corrSector`, `corrCalle`, `corrNo`, `corrEdificio`, `corrApto`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [
      noPrestador,
      tipo,
      nombre,
      provincia,
      municipio,
      calle,
      edificio,
      casa,
      local,
      sector,
      telPersonal,
      celularPersonal,

      lugarTrabajo,
      telefonoTrabajo,
      faxTrabajo,
      emailTrabajo,
      corrProvincia,
      corrMunicipio,
      corrSector,
      corrCalle,
      corrNo,
      corrEdificio,
      corrApto
    ]);
    if (rows) {
      res.json({status: "success"});
    }
  } catch (error) {
    console.log(error);
  }
}
