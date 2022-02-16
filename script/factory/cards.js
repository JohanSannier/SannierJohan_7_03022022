function recipeFactory(data) {
  const {
    appliance,
    description,
    id,
    ingredients,
    name,
    servings,
    time,
    ustensils,
  } = data;

  function getRecipeCard(id) {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-id', data.id);
    wrapper.classList.add('col-12', 'col-lg-4', 'col-md-6');
    const card = document.createElement('div');
    card.classList.add('card', 'mb-5');
    wrapper.appendChild(card);
    const img = document.createElement('div');
    img.classList.add('bg-secondary', 'rounded-top');
    img.style.width = '100%';
    img.style.height = '180px';
    card.appendChild(img);
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'bg-light');
    cardBody.style.height = '260px';
    card.appendChild(cardBody);
    const row_1 = document.createElement('div');
    row_1.classList.add('row');
    cardBody.appendChild(row_1);
    const col_1 = document.createElement('div');
    col_1.classList.add('col', 'mb-2');
    row_1.appendChild(col_1);
    const cardTitle = document.createElement('h6');
    cardTitle.classList.add('card-title');
    cardTitle.innerText = name;
    col_1.appendChild(cardTitle);
    const col_2 = document.createElement('div');
    col_2.classList.add('col-auto');
    row_1.appendChild(col_2);
    const clockIcon = document.createElement('i');
    clockIcon.classList.add('bi', 'bi-clock', 'me-2');
    col_2.appendChild(clockIcon);
    const cookingTime = document.createElement('span');
    cookingTime.classList.add('cooking-time', 'fw-bold');
    cookingTime.innerText = `${time} min`;
    col_2.appendChild(cookingTime);
    const row_2 = document.createElement('div');
    row_2.classList.add('row');
    cardBody.appendChild(row_2);
    const col_3 = document.createElement('div');
    col_3.classList.add('col');
    row_2.appendChild(col_3);
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.style.fontSize = '12px';
    col_3.appendChild(cardText);
    const ingredientList = document.createElement('ul');
    ingredientList.classList.add('list-unstyled');
    ingredients.forEach((element) => {
      const listItem = document.createElement('li');
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
        listItem.innerHTML = `<span class="fw-bold">${element.ingredient}</span>`;
      }
      ingredientList.appendChild(listItem);
    });
    cardText.appendChild(ingredientList);
    const col_4 = document.createElement('div');
    col_4.classList.add('col');
    row_2.appendChild(col_4);
    const cardDescription = document.createElement('p');
    cardDescription.classList.add('card-text');
    cardDescription.style.fontSize = '12px';
    cardDescription.style.webkitBoxOrient = 'vertical';
    cardDescription.style.display = '-webkit-box';
    cardDescription.style.webkitLineClamp = '8';
    cardDescription.style.overflow = 'hidden';
    cardDescription.style.textOverflow = 'ellipsis';
    cardDescription.style.whiteSpace = 'normal';
    cardDescription.innerText = description;
    col_4.appendChild(cardDescription);
    return wrapper;
  }

  return {
    appliance,
    description,
    id,
    ingredients,
    name,
    servings,
    time,
    ustensils,
    getRecipeCard,
  };
}
