document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  let addToy = false;

  addBtn.addEventListener("click", () => {
    // Toggle display of the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch existing toys and display them
  const collection = document.getElementById('toy-collection');

  fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(toys => {
    toys.forEach(toy => {
      addToyToDom(toy);
    });
  })
  .catch(error => console.error('Error fetching toys:', error));

  // Form submission for adding a new toy
  const form = document.querySelector('.add-toy-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const newName = document.getElementById('toy-name').value;
    const newImage = document.getElementById('toy-image').value;

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: newName,
        image: newImage,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(newToy => {
      addToyToDom(newToy);
      form.reset();
    })
    .catch(error => console.error('Error:', error));
  });

  // Helper function to create a toy card
  function addToyToDom(toy) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    collection.appendChild(card);

    // Adding like functionality
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      const currentLikes = parseInt(card.querySelector('p').textContent.split(' ')[0]);
      const newLikes = currentLikes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
      .then(response => response.json())
      .then(updatedToy => {
        card.querySelector('p').textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error updating likes:', error));
    });
  }
});
