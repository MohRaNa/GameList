"use strict";
const bcrypt = require("bcrypt");

module.exports.obtener_userps = async function (req, res, db) {
  try {
    const users = await db
      .collection("usuarios")
      .find({}, { projection: { _id: 0, username: 1, contraseña: 1 } })
      .toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios", details: err });
  }
};

module.exports.obtener_user = async function (req, res, db) {
  try {
    const user = await db.collection("usuarios").find({}).toArray();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios", details: err });
  }
};

module.exports.login_user = async function (req, res, db) {
  const { username, password } = req.body;
  try {
    // Buscar el usuario en la base de datos por el nombre de usuario
    const user = await db
      .collection("usuarios")
      .findOne({ correoElectronico: username });
    console.log(username);

    if (user) {
      // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
      console.log(password);
      console.log(user.password);
      const passwordMatch = password == user.password;

      if (passwordMatch) {
        // Las credenciales son válidas
        res.json({ mensaje: "Inicio de sesión exitoso", usuario: user });
      } else {
        // La contraseña no coincide
        res.status(401).json({ error: "Credenciales inválidas" });
      }
    } else {
      // El usuario no fue encontrado
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al realizar el inicio de sesión", details: err });
  }
};
