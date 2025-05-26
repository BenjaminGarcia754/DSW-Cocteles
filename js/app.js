// Mostrar coctel aleatorio
function mostrarCoctelAleatorio() {
  mostrarLoader(true);

  fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
      const bebida = data.drinks[0];
      mostrarBebida(bebida);
    })
    .catch(error => console.error('Error:', error))
    .finally(() => mostrarLoader(false));
}

// Buscar coctel por nombre
function buscarCoctelPorNombre(nombre) {
  mostrarLoader(true);

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nombre}`)
    .then(res => res.json())
    .then(data => {
      if (!data.drinks) {
        document.getElementById('resultado').innerHTML = `<p>No se encontró el coctel "${nombre}".</p>`;
        return;
      }
      mostrarBebida(data.drinks[0]);
    })
    .catch(error => console.error('Error:', error))
    .finally(() => mostrarLoader(false));
}

// Obtener cocteles por categoría
function obtenerCoctelesPorCategoria(categoria) {
  mostrarLoader(true);

  fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${categoria}`)
    .then(res => res.json())
    .then(data => {
      if (!data.drinks) return;

      const resultado = document.getElementById('resultado');
      resultado.innerHTML = `<h2>Cocteles en categoría: ${categoria}</h2>`;
      data.drinks.forEach(bebida => {
        resultado.innerHTML += `
          <div style="margin: 15px; display: inline-block;">
            <h4>${bebida.strDrink}</h4>
            <img src="${bebida.strDrinkThumb}" alt="${bebida.strDrink}" width="150">
          </div>
        `;
      });
    })
    .catch(error => console.error('Error:', error))
    .finally(() => mostrarLoader(false));
}

// Mostrar los datos de una bebida (uso compartido)
function mostrarBebida(bebida) {
  let ingredientes = '';

  for (let i = 1; i <= 15; i++) {
    const ingrediente = bebida[`strIngredient${i}`];
    const medida = bebida[`strMeasure${i}`];

    if (ingrediente) {
      ingredientes += `<li>${medida ? medida : ''} ${ingrediente}</li>`;
    }
  }

  const resultado = document.getElementById('resultado');
  resultado.classList.remove('visible');

  resultado.innerHTML = `
    <h2>${bebida.strDrink}</h2>
    <div class="contenedor-coctel">
      <img src="${bebida.strDrinkThumb}" alt="${bebida.strDrink}" width="250">
      <div class="contenido-coctel">
        <h3>🍸 Ingredientes:</h3>
        <ul>${ingredientes}</ul>
      </div>
    </div>
    <h3>📝 Instrucciones:</h3>
    <p>${bebida.strInstructions}</p>
  `;

  setTimeout(() => resultado.classList.add('visible'), 100);
}

// Mostrar/ocultar loader
function mostrarLoader(visible) {
  const loader = document.getElementById('loader');
  loader.style.display = visible ? 'block' : 'none';
}

// Asignar eventos
document.addEventListener('DOMContentLoaded', function () {
  const btnRandom = document.getElementById('btn-random');
  if (btnRandom) btnRandom.addEventListener('click', mostrarCoctelAleatorio);

  const btnBuscar = document.getElementById('btn-buscar');
  if (btnBuscar) {
    btnBuscar.addEventListener('click', function () {
      const nombre = document.getElementById('input-nombre').value;
      if (nombre.trim() !== '') {
        buscarCoctelPorNombre(nombre);
      }
    });
  }

  const btnCategoria = document.getElementById('btn-categoria');
  if (btnCategoria) {
    btnCategoria.addEventListener('click', function () {
      const categoria = document.getElementById('select-categoria').value;
      if (categoria.trim() !== '') {
        obtenerCoctelesPorCategoria(categoria);
      }
    });
  }
});
