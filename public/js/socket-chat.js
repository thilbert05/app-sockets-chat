const socket = io();

const params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
  window.location = 'index.html';
  throw new Error('El Nombre y Sala es necesario')
}

const usuario = {
  nombre: params.get('nombre'),
  sala: params.get('sala')
}

//on escuchan sucesos
socket.on('connect', function() {
  console.log('Conectado al Servidor');

  socket.emit('entrarChat', usuario, resp => {
    console.log('Usuarios conectados', resp);
  });
});

socket.on('disconnect', function() {
  console.log('Se perdió conexión con el servidor');
})


//Emit se usan para enviar información
// socket.emit('enviarMensaje', {
//     usuario: 'Tomas',
//     mensaje: 'Hola Mundo'
//   }, function (resp) {
//     console.log('Respuesta del Servidor:', resp);
//   });


socket.on('crearMensaje', function(mensaje) {
  console.log('Servidor:', mensaje);
});

//escuchar cambios de usuarios
//cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(personas) {
  console.log(personas);
});

//Mensajes privados
socket.on('mensajePrivado', (mensaje) => {
  console.log('Mensaje privado: ', mensaje)
});
