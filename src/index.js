let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((toy) => {
        // Create a card for each toy
        const card = createToyCard(toy);

        // Append the card to the toy collection div
        toyCollection.appendChild(card);
      });
    })
    .catch((error) => {
      console.error(error);
    });

  const toyForm = document.querySelector(".add-toy-form");

  toyForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the input values from the form
    const nameInput = document.querySelector('input[name="name"]');
    const imageInput = document.querySelector('input[name="image"]');

    // Create a new toy object with the input values
    const newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0,
    };

    // Make the POST request to add the new toy
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here
        console.log(data);

        // Create a card for the new toy
        const card = createToyCard(data);

        // Append the card to the toy collection div
        toyCollection.appendChild(card);

        // Clear the input values after submitting the form
        nameInput.value = "";
        imageInput.value = "";
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });
  });

  toyCollection.addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
      event.preventDefault(); // Prevent any default click behavior

      // Get the toy card element
      const card = event.target.closest(".card");

      // Get the toy ID from the card's data-id attribute
      const toyId = card.dataset.id;

      // Get the current number of likes from the card
      const likesElement = card.querySelector(".likes");
      const currentLikes = parseInt(likesElement.textContent);

      // Calculate the new number of likes
      const newLikes = currentLikes + 1;

      // Prepare the data for the PATCH request
      const updatedToy = {
        likes: newLikes,
      };

      // Make the PATCH request to update the toy's likes
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(updatedToy),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response data here
          console.log(data);

          // Update the likes count in the DOM
          likesElement.textContent = newLikes + " Likes";
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          console.error(error);
        });
    }
  });
});

function createToyCard(toy) {
  // Create a card for the toy
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = toy.id;

  // Create h2 tag with toy's name
  const name = document.createElement("h2");
  name.textContent = toy.name;

  // Create img tag with toy's image
  const image = document.createElement("img");
  image.src = toy.image;
  image.className = "toy-avatar";

  // Create p tag with toy's likes
  const likes = document.createElement("p");
  likes.className = "likes";
  likes.textContent = toy.likes + " Likes";

  // Create button tag for like button
  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.textContent = "Like ❤️";

  // Append all the elements to the card div
  card.appendChild(name);
  card.appendChild(image);
  card.appendChild(likes);
  card.appendChild(likeBtn);

  return card;
}