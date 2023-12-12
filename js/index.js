import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  push,
  ref,
  onValue,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBMJsVpnbOwVOiVNbTZScZdet9qlGigDL0",
  authDomain: "conexion-8ec0d.firebaseapp.com",
  databaseURL: "https://conexion-8ec0d-default-rtdb.firebaseio.com",
  projectId: "conexion-8ec0d",
  storageBucket: "conexion-8ec0d.appspot.com",
  messagingSenderId: "679910299749",
  appId: "1:679910299749:web:9800b464879628b4850e8c",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const tablaBody = document.getElementById("tabla");
const botonGuardarCambios = document.getElementById("boton-update");
const botonGuardar = document.getElementById("boton-crear");
let selectedKey = null;

// Obtener referencia a la lista de libros
const clientesRef = ref(database, "Santiago_Llambo");

// Escuchar cambios en los datos
onValue(clientesRef, (snapshot) => {
  tablaBody.innerHTML = "";

  // Recorrer los datos y agregarlos a la tabla
  snapshot.forEach((libroSnap) => {
    const libro = libroSnap.val();
    const row = `<tr>
                  <td>${libro.titulo}</td>
                  <td>${libro.autor}</td>
                  <td>${libro.isbn}</td>
                  <td>${libro.anio_publicacion}</td>
                  <td>${libro.genero}</td>
                  <td>${libro.numero_paginas}</td>
                    <td>
                        <button class="btn-modificar" onclick="seleccionarLibro('${libroSnap.key}')">Editar</button>
                        <button class="btn-eliminar" onclick="eliminarLibro('${libroSnap.key}')">Borrar</button>
                    </td>
                </tr>`;
    tablaBody.innerHTML += row;
  });
});

window.crearRegistro = async function () {
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const isbn = document.getElementById("isbn").value;
  const year = document.getElementById("year").value;
  const genero = document.getElementById("genero").value;
  const paginas = document.getElementById("paginas").value;
  const editorial = document.getElementById("editorial").value;

  // Validar los campos
  if (
    titulo === "" ||
    autor === "" ||
    isbn === "" ||
    year === "" ||
    genero === "" ||
    paginas === "" ||
    editorial === ""
  ) {
    alert("Todos los campos son obligatorios");
    return;
  }

  try {
    crearLibro(titulo, autor, isbn, year, genero, paginas, editorial);
  } catch (error) {
    alert("Usuario repetido");
  }
};

function crearLibro(titulo, autor, isbn, year, genero, paginas, editorial) {
  push(ref(database, "Santiago_Llambo"), {
    titulo,
    autor,
    isbn,
    anio_publicacion: year,
    genero,
    numero_paginas: paginas,
    editorial,
  });

  alert("Registro exitoso");
  limpiarCampos();
}

function limpiarCampos() {
  document.getElementById("titulo").value = "";
  document.getElementById("autor").value = "";
  document.getElementById("isbn").value = "";
  document.getElementById("year").value = "";
  document.getElementById("genero").value = "";
  document.getElementById("paginas").value = "";
  document.getElementById("editorial").value = "";
}

window.seleccionarLibro = function (key) {
  botonGuardarCambios.classList.add("d-block");
  botonGuardarCambios.classList.remove("d-none");
  botonGuardar.classList.add("d-none");
  botonGuardar.classList.remove("d-block");

  selectedKey = key;
  // Obtener el libro seleccionado
  const libroRef = ref(database, `Santiago_Llambo/${key}`);
  onValue(libroRef, (snapshot) => {
    const libro = snapshot.val();

    // Actualizar los valores del formulario
    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autor").value = libro.autor;
    document.getElementById("isbn").value = libro.isbn;
    document.getElementById("year").value = libro.anio_publicacion;
    document.getElementById("genero").value = libro.genero;
    document.getElementById("paginas").value = libro.numero_paginas;
    document.getElementById("editorial").value = libro.editorial;
  });
};

window.actualizarRegistro = function () {
  if (selectedKey) {
    // Obtener los nuevos valores del formulario
    const titulo = document.getElementById("titulo").value;
    const autor = document.getElementById("autor").value;
    const isbn = document.getElementById("isbn").value;
    const year = document.getElementById("year").value;
    const genero = document.getElementById("genero").value;
    const paginas = document.getElementById("paginas").value;
    const editorial = document.getElementById("editorial").value;

    // Validar los campos
    if (
      titulo === "" ||
      autor === "" ||
      isbn === "" ||
      year === "" ||
      genero === "" ||
      paginas === "" ||
      editorial === ""
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    // Actualizar los datos en Firebase
    set(ref(database, `Santiago_Llambo/${selectedKey}`), {
      titulo,
      autor,
      isbn,
      anio_publicacion: year,
      genero,
      numero_paginas: paginas,
      editorial,
    });

    botonGuardarCambios.classList.add("d-none");
    botonGuardarCambios.classList.remove("d-block");
    botonGuardar.classList.add("d-block");
    botonGuardar.classList.remove("d-none");

    alert("Registro actualizado exitosamente");
    limpiarCampos();
    selectedKey = null;
  } else {
    alert("Por favor, seleccione un libro para actualizar");
  }
};

window.eliminarLibro = function (key) {
  if (confirm("¿Estás seguro de que quieres eliminar este libro?")) {
    remove(ref(database, `Santiago_Llambo/${key}`))
      .then(() => {
        alert("Libro eliminado correctamente");
      })
      .catch((error) => {
        alert(`Error al eliminar el libro`);
      });
  }
};
