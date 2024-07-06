module.exports.obtenerLogsPorUsuario = async function (req, res, db) {
  const username = req.params.username;

  try {
    const logs = await db
      .collection("log")
      .find({ username: username })
      .toArray();

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener logs.", details: err });
  }
};

module.exports.login_user = async function (req, res, db) {
  const { username, password } = req.body;

  try {
    // Buscar el usuario en la base de datos por el nombre de usuario
    const user = await db
      .collection("usuarios")
      .findOne({ correoElectronico: username });

    if (user) {
      // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Las credenciales son válidas

        // Registrar evento de inicio de sesión en la colección de logs
        await logsController.registrarEvento(
          db,
          username,
          "Inicio de sesión en el portal"
        );

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

module.exports.logout_user = async function (req, res, db) {
  const { username } = req.body;

  try {
    // Realizar cualquier lógica de logout necesaria

    // Registrar evento de cierre de sesión en la colección de logs
    await logsController.registrarEvento(
      db,
      username,
      "Cierre de sesión en el portal"
    );

    res.json({ mensaje: "Cierre de sesión exitoso" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error al realizar el cierre de sesión", details: err });
  }
};
