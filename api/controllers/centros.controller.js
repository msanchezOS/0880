import { pool } from "../../db.js";

export const getCentros = async (req, res) => {
  try {
const [rows] = await pool.query(`
    SELECT * 
    FROM centros c 
    LEFT OUTER JOIN centros_tipos ct ON (c.id_tipo = ct.codigo) 
    LEFT OUTER JOIN centros_direcciones cd ON (cd.id_centro = c.codigo)
    ORDER BY c.nombre ASC
`);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ messages: error });
  }
};


export const getCentro = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM centros c LEFT OUTER JOIN centros_tipos ct ON (c.id_tipo = ct.codigo) LEFT OUTER JOIN centros_direcciones cd ON (cd.id_centro = c.codigo) LEFT OUTER JOIN centros_telefonos tel ON(c.codigo = tel.id_centro) WHERE c.codigo = ?", [
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

// Tipos de centros
export const getTiposCentros = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM centros_tipos");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something is wrong" });
  }
};

export const getCentrosDistinct = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT nombre FROM medicos_centros m LEFT OUTER JOIN centros c ON (m.id_centro = c.codigo) WHERE nombre IS NOT NULL");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something is wrong" });
  }
};

