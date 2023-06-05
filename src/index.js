let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  })
  const toyCollection = document.getElementById('toy-collection');
  const toyUrl = 'http://localhost:3000/toys';
  //Add Toy Info to the Card
  fetch(toyUrl)
  .then(resp=>resp.json())
  .then(toys=>{
    toys.forEach(toy=>{
      const card = creatingToyCard(toy);
      toyCollection.appendChild(card);
    })
  })
  //Add a New Toy
  const form = document.querySelector('.add-toy-form');
  form.addEventListener('submit',(e)=>{
    e.preventDefault();

    fetch(toyUrl,data = {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(submitNewToy(form))
    })
    .then(resp=>resp.json())
    .then(toy =>{
      const card = creatingToyCard(toy);
      toyCollection.appendChild(card);
    })
  })
  //Increase a Toy's Like
  toyCollection.addEventListener('click',(e)=>{
    if (e.target.classList.contains('like-btn')) {
      const toyId = e.target.id;
      const likesElement = e.target.parentNode.querySelector('p');
      const currentLikes = parseInt(likesElement.textContent);
      const newLikes = currentLikes + 1;
    
      const updatedToy = {
        'likes': newLikes
      }
      const toyUrlId = `http://localhost:3000/toys/${toyId}`
      fetch(toyUrlId,{
        method: 'PATCH',
        headers: {
          'Content-Type':'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updatedToy)
      })
      .then(resp=>resp.json())
      .then(updatedToy=>{
        likesElement.textContent = `${updatedToy.likes} Likes`;
      })
    }
  })
}) 
//Orgainizing Functions
function creatingToyCard(toy){
  const card = document.createElement('div');
  card.className = 'card';

  const toyName = document.createElement('h2');
  toyName.textContent = toy.name;
  card.appendChild(toyName);

  const toyImage = document.createElement('img');
  toyImage.src = toy.image;
  toyImage.className = 'toy-avatar';
  card.appendChild(toyImage);

  const toyLikes = document.createElement('p');
  toyLikes.textContent = `${toy.likes} Likes`;
  card.appendChild(toyLikes);
  
  const toyButton = document.createElement('button');
  toyButton.className = 'like-btn';
  toyButton.textContent = 'Like ❤️'
  toyButton.setAttribute('id',toy.id);
  card.appendChild(toyButton);

  return card;
}
function submitNewToy(e){
  const nameInput = e.querySelector('input.input-text[name="name"]');
  const imageInput = e.querySelector('input.input-text[name="image"]');
  const inputs = {
    "name":nameInput.value,
    "image":imageInput.value,
    "likes": 0
  };
  return inputs;
}