import { pool } from "../../db.js";

export const getMedicos = async (req, res) => {
 try {
    const query = `
    WITH TelefonosPivoteados AS (
        SELECT
            id_medico,
            MAX(CASE WHEN row_num = 1 THEN telefono ELSE NULL END) AS tel1,
            MAX(CASE WHEN row_num = 2 THEN telefono ELSE NULL END) AS tel2,
            MAX(CASE WHEN row_num = 3 THEN telefono ELSE NULL END) AS tel3,
            MAX(CASE WHEN row_num = 4 THEN telefono ELSE NULL END) AS tel4,
            MAX(CASE WHEN row_num = 5 THEN telefono ELSE NULL END) AS tel5
        FROM (
            SELECT
                id_medico,
                telefono,
                ROW_NUMBER() OVER (PARTITION BY id_medico ORDER BY telefono) AS row_num
            FROM medicos_telefonos
        ) AS Subconsulta
        WHERE row_num <= 5
        GROUP BY id_medico
    )

    SELECT 
        m.*,
        me.*,
        es.*,
        mc.*,
        cen.codigo AS centro_codigo, cen.nombre AS centro_nombre,
        md.*,
        tp.tel1,
        tp.tel2,
        tp.tel3,
        tp.tel4,
        tp.tel5
    FROM medicos m
    LEFT OUTER JOIN medicos_especialidades me ON m.codigo = me.id_medico
    LEFT OUTER JOIN especialidades es ON me.id_especialidad = es.codigo
    LEFT OUTER JOIN medicos_centros mc ON m.codigo = mc.id_medico
    LEFT OUTER JOIN centros cen ON mc.id_centro = cen.codigo
    LEFT OUTER JOIN medicos_direcciones md ON m.codigo = md.id_medico
    LEFT OUTER JOIN TelefonosPivoteados tp ON m.codigo = tp.id_medico;
    `;

    const [rows] = await pool.query(query);
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
