import { pool } from "../../db.js";

export const getProvincias = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM provincias");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something is wrong" });
  }
};
export const getMunicipios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM municipios");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something is wrong" });
  }
};