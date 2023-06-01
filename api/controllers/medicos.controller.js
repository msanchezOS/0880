import { pool } from "../../db.js";

export const getMedicos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM medicos m LEFT OUTER JOIN medicos_especialidades me ON (m.codigo = me.id_medico) LEFT OUTER JOIN especialidades es ON (me.id_especialidad = es.codigo) LEFT OUTER JOIN medicos_centros mc ON (m.codigo = mc.id_medico) LEFT OUTER JOIN centros cen ON(mc.id_centro = cen.codigo) LEFT OUTER JOIN medicos_direcciones md ON (m.codigo = md.id_medico)")
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something is wrong" });
  }
};
export const getEspecialidades = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM especialidades");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something is wrong" });
  }
};
export const getMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM medicos m LEFT OUTER JOIN medicos_especialidades me ON (m.codigo = me.id_medico) LEFT OUTER JOIN especialidades es ON (me.id_especialidad = es.codigo) LEFT OUTER JOIN medicos_centros mc ON (m.codigo = mc.id_medico) LEFT OUTER JOIN centros cen ON(mc.id_centro = cen.codigo) LEFT OUTER JOIN medicos_direcciones md ON (m.codigo = md.id_medico) LEFT OUTER JOIN medicos_telefonos mtel ON (m.codigo = mtel.id_medico) WHERE m.codigo = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "Centro not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};