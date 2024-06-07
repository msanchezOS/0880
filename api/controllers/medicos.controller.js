import { pool } from "../../db.js";

export const getMedicos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
    SELECT 
      m.id as finalId, 
      m.*, 
      me.*, 
      es.*, 
      mc.*, 
      cen.*, 
      md.*, 
      mt.*
    FROM medicos m 
    LEFT OUTER JOIN medicos_especialidades me ON m.codigo = me.id_medico 
    LEFT OUTER JOIN especialidades es ON me.id_especialidad = es.codigo 
    LEFT OUTER JOIN medicos_centros mc ON m.codigo = mc.id_medico 
    LEFT OUTER JOIN centros cen ON mc.id_centro = cen.codigo 
    LEFT OUTER JOIN medicos_direcciones md ON m.codigo = md.id_medico 
    LEFT OUTER JOIN medicos_telefonos mt ON m.codigo = mt.id_medico
  `);
  
  
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

export const createMedico = async (req, res) => {
  try {
    const {
      nombre,
      nombres,
      apellidos,
      sexo,
      email,
      url,
      tipo,
      provincia,
      municipio,
      direccion,
      especialidad,
      telefono,
      centro
    } = req.body;

    // Insertar datos en la tabla 'medicos'
    const [result] = await pool.query(
      `INSERT INTO medicos (nombre, nombres, apellidos, sexo, email, url) VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, nombres, apellidos, sexo, email, url]
    );

    const id_medico = result.insertId;

    // Actualizar el campo 'codigo' con el mismo valor que 'id'
    await pool.query(`UPDATE medicos SET codigo = ? WHERE id = ?`, [id_medico, id_medico]);

    // Insertar datos en la tabla 'medicos_direcciones'
    await pool.query(
      `INSERT INTO medicos_direcciones (id_medico, tipo, provincia, municipio, direccion) VALUES (?, ?, ?, ?, ?)`,
      [id_medico, tipo, provincia, municipio, direccion]
    );

    // Insertar datos en la tabla 'medicos_especialidades'
    await pool.query(
      `INSERT INTO medicos_especialidades (id_medico, id_especialidad) VALUES (?, ?)`,
      [id_medico, especialidad]
    );

    // Insertar datos en la tabla 'medicos_telefonos'
    await pool.query(
      `INSERT INTO medicos_telefonos (id_medico, tipo, telefono) VALUES (?, ?, ?)`,
      [id_medico, tipo, telefono]
    );

    // Insertar datos en la tabla 'medicos_centros'
    await pool.query(
      `INSERT INTO medicos_centros (id_medico, id_centro) VALUES (?, ?)`,
      [id_medico, centro]
    );

    res.status(201).json({
      id: id_medico,
      codigo: id_medico,
      nombre,
      nombres,
      apellidos,
      sexo,
      email,
      url,
      tipo,
      provincia,
      municipio,
      direccion,
      especialidad,
      telefono,
      centro
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};






export const updateMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      nombres,
      apellidos,
      sexo,
      email,
      url,
      tipo,
      provincia,
      municipio,
      direccion,
      especialidad,
      telefono,
      centro,
      status
    } = req.body;

    // Verificar si el médico existe
    const [existingMedico] = await pool.query(`SELECT * FROM medicos WHERE id = ?`, [id]);
    if (existingMedico.length === 0) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    // Actualizar datos en la tabla 'medicos'
    await pool.query(
      `UPDATE medicos SET nombre = ?, nombres = ?, apellidos = ?, sexo = ?, email = ?, url = ?, status = ? WHERE id = ?`,
      [nombre, nombres, apellidos, sexo, email, url, status, id]
    );

    // Actualizar datos en la tabla 'medicos_direcciones'
    await pool.query(
      `UPDATE medicos_direcciones SET tipo = ?, provincia = ?, municipio = ?, direccion = ? WHERE id_medico = ?`,
      [tipo, provincia, municipio, direccion, id]
    );

    // Actualizar datos en la tabla 'medicos_especialidades'
    await pool.query(
      `UPDATE medicos_especialidades SET id_especialidad = ? WHERE id_medico = ?`,
      [especialidad, id]
    );

    // Actualizar datos en la tabla 'medicos_telefonos'
    await pool.query(
      `UPDATE medicos_telefonos SET tipo = ?, telefono = ? WHERE id_medico = ?`,
      [tipo, telefono, id]
    );

    // Actualizar datos en la tabla 'medicos_centros'
    await pool.query(
      `UPDATE medicos_centros SET id_centro = ? WHERE id_medico = ?`,
      [centro, id]
    );

    res.status(200).json({ message: "Médico actualizado exitosamente" });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};


// Método para eliminar un médico con todas sus relaciones
export const deleteMedico = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el médico existe
    const [existingMedico] = await pool.query(`SELECT * FROM medicos WHERE id = ?`, [id]);
    if (existingMedico.length === 0) {
      return res.status(404).json({ message: "Médico no encontrado" });
    }

    // Eliminar datos en la tabla 'medicos_direcciones'
    await pool.query(`DELETE FROM medicos_direcciones WHERE id_medico = ?`, [id]);

    // Eliminar datos en la tabla 'medicos_especialidades'
    await pool.query(`DELETE FROM medicos_especialidades WHERE id_medico = ?`, [id]);

    // Eliminar datos en la tabla 'medicos_telefonos'
    await pool.query(`DELETE FROM medicos_telefonos WHERE id_medico = ?`, [id]);

    // Eliminar datos en la tabla 'medicos_centros'
    await pool.query(`DELETE FROM medicos_centros WHERE id_medico = ?`, [id]);

    // Eliminar datos en la tabla 'medicos'
    await pool.query(`DELETE FROM medicos WHERE id = ?`, [id]);

    res.status(200).json({ message: "Médico eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
