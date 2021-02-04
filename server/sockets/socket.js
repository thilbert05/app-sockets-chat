const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
  
  client.on('entrarChat', (usuario, callback) => {
    if (!usuario.nombre || !usuario.sala) {
      return callback({
        err: true,
        mensaje: 'El nombre/sala es necesario',
      });
    }

    client.join(usuario.sala);

    usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

    callback(usuarios.getPersonasPorSala(usuario.sala));

    client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));
  });

  client.on('disconnect', () => {
    const personaBorrada = usuarios.eliminarPersona(client.id);
    client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));

    client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
  });

  client.on('crearMensaje', (data) => {
    const persona = usuarios.getPersona(client.id);
    const mensaje = crearMensaje(persona.nombre, data.mensaje);
    client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
  });

  //mensajes privados
  client.on('mensajePrivado', (data) => {
    const persona = usuarios.getPersona(client.id);

    client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
  });
});