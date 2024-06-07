import { pool } from "../../db.js";

export const getCentros = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id AS id_centro,
        c.codigo,
        c.nombre,
        c.id_tipo,
        ct.descripcion AS tipo,
        c.tel1,
        c.tel2,
        c.tel3,
        c.tel4,
        c.url,
        cd.provincia,
        cd.municipio,
        cd.direccion
      FROM centros c 
      LEFT OUTER JOIN centros_tipos ct ON c.id_tipo = ct.codigo 
      LEFT OUTER JOIN centros_direcciones cd ON cd.id_centro = c.codigo
      ORDER BY c.nombre ASC
    `);

    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCentro = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM centros c LEFT OUTER JOIN centros_tipos ct ON (c.id_tipo = ct.codigo) LEFT OUTER JOIN centros_direcciones cd ON (cd.id_centro = c.codigo) LEFT OUTER JOIN centros_telefonos tel ON(c.codigo = tel.id_centro) WHERE c.codigo = ?",
      [id]
    );

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
    const [rows] = await pool.query(
      "SELECT DISTINCT nombre FROM medicos_centros m LEFT OUTER JOIN centros c ON (m.id_centro = c.codigo) WHERE nombre IS NOT NULL"
    );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something is wrong" });
  }
};

export const createCentro = async (req, res) => {
  try {
    const {
      nombre,
      id_tipo,
      tel1,
      tel2,
      tel3,
      tel4,
      url,
      id_provincia,
      id_municipio,
      direccion,
    } = req.body;

    // Insertar datos en la tabla 'centros'
    const [result] = await pool.query(
      `INSERT INTO centros (nombre, id_tipo, tel1, tel2, tel3, tel4, url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, id_tipo, tel1, tel2, tel3, tel4, url]
    );

    const id_centro = result.insertId;

    // Actualizar el campo 'codigo' con el mismo valor que 'id'
    await pool.query(`UPDATE centros SET codigo = ? WHERE id = ?`, [
      id_centro,
      id_centro,
    ]);

    // Insertar datos en la tabla 'centros_direcciones'
    await pool.query(
      `INSERT INTO centros_direcciones (id_centro, provincia, municipio, direccion) VALUES (?, ?, ?, ?)`,
      [id_centro, id_provincia, id_municipio, direccion]
    );

    res.status(201).json({
      id: id_centro,
      codigo: id_centro,
      nombre,
      id_tipo,
      tel1,
      tel2,
      tel3,
      tel4,
      url,
      id_provincia,
      id_municipio,
      direccion,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateCentro = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      id_tipo,
      tel1,
      tel2,
      tel3,
      tel4,
      url,
      id_provincia,
      id_municipio,
      direccion
    } = req.body;

    // Verificar si el centro existe
    const [existingCentro] = await pool.query(`SELECT * FROM centros WHERE id = ?`, [id]);
    if (existingCentro.length === 0) {
      return res.status(404).json({ message: "Centro not found" });
    }

    // Actualizar datos en la tabla 'centros'
    await pool.query(
      `UPDATE centros SET nombre = ?, id_tipo = ?, tel1 = ?, tel2 = ?, tel3 = ?, tel4 = ?, url = ? WHERE id = ?`,
      [nombre, id_tipo, tel1, tel2, tel3, tel4, url, id]
    );

    // Actualizar datos en la tabla 'centros_direcciones'
    await pool.query(
      `UPDATE centros_direcciones SET provincia = ?, municipio = ?, direccion = ? WHERE id_centro = ?`,
      [id_provincia, id_municipio, direccion, id]
    );

    res.status(200).json({ message: "Centro updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteCentro = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el centro existe
    const [existingCentro] = await pool.query(`SELECT * FROM centros WHERE id = ?`, [id]);
    if (existingCentro.length === 0) {
      return res.status(404).json({ message: "Centro not found" });
    }

    // Eliminar datos en la tabla 'centros_direcciones'
    await pool.query(`DELETE FROM centros_direcciones WHERE id_centro = ?`, [id]);

    // Eliminar datos en la tabla 'centros'
    await pool.query(`DELETE FROM centros WHERE id = ?`, [id]);

    res.status(200).json({ message: "Centro deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

