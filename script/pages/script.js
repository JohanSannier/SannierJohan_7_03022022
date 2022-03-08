const userCardTemplate = document.querySelector('[data-user-template]');
const searchbar = document.querySelector('#searchbar');
const mainSection = document.getElementById('main-section');
const invalidSearchInput = document.querySelector('#invalid-search');
const url = '../data/recipes.json';

let allRecipes = [];

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    allRecipes = data.map((recipe) => {
      const card = userCardTemplate.content.cloneNode(true).children[0];
      const title = card.querySelector('[data-card-title]');
      const duration = card.querySelector('[data-card-duration]');
      const description = card.querySelector('[data-card-description]');
      const ul = card.querySelector('[data-card-ul]');
      title.textContent = recipe.name;
      duration.textContent = `${recipe.time} min`;
      description.textContent = recipe.description;

      recipe.ingredients.forEach((element) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-item');
        if (element.unit) {
          if (
            element.unit == 'cl' ||
            element.unit == 'g' ||
            element.unit == 'ml' ||
            element.unit == 'kg'
          ) {
            listItem.innerHTML = `<span class="fw-bold">${element.ingredient}:</span> ${element.quantity}${element.unit}`;
          } else {
            listItem.innerHTML = `<span class="fw-bold">${element.ingredient}:</span> ${element.quantity} ${element.unit}`;
          }
        } else if (element.quantity) {
          listItem.innerHTML = `<span class="fw-bold">${element.ingredient}:</span> ${element.quantity}`;
        } else {
          listItem.innerHTML = `<span class="fw-boldm">${element.ingredient}</span>`;
        }
        ul.appendChild(listItem);
      });

      mainSection.append(card);
      return {
        name: recipe.name,
        ingredients: recipe.ingredients,
        description: recipe.description,
        appliance: recipe.appliance,
        ustensils: recipe.ustensils,
        element: card,
      };
    });
  });

searchbar.addEventListener('input', (e) => {
  const value = e.target.value.toLowerCase();
  if (value.length > 2) {
    allRecipes.forEach((recipe) => {
      const isVisible =
        recipe.name.toLowerCase().includes(value) ||
        recipe.description.toLowerCase().includes(value) ||
        recipe.ingredients.some((ingr) =>
          ingr.ingredient.toLowerCase().includes(value)
        );
      recipe.element.classList.toggle('hide', !isVisible);
      invalidSearchInput.classList.replace('d-inline', 'd-none');
    });
  } else if (value.length == 0) {
    allRecipes.forEach((recipe) => {
      recipe.element.classList.remove('hide');
    });
    invalidSearchInput.classList.replace('d-inline', 'd-none');
  }
  const activeCards = mainSection.querySelectorAll('[data-id]');
  const cardsArray = Array.from(activeCards);
  if (cardsArray.every((element) => element.classList.contains('hide'))) {
    invalidSearchInput.classList.replace('d-none', 'd-inline');
  }
});
