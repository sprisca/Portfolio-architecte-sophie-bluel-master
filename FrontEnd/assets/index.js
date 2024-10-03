const gallery = document.querySelector(".gallery");
let works = [];
let categories = [];


// Récupération de l'API //
const fetchWorks = () => {
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => {
        works = data;
        createGallery(works);
      })
      
      .catch((error) => {
        console.log(error);
      });
  };
  fetchWorks();



  // Apparition des travaux sur le DOM et la modale// 

  function createGallery(objet) {
    let galleries = "";
    let galleryModale =""
    for (let work of objet) {
        galleries += `
        <figure data-id="${work.id}">
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
    </figure>`;  }

    
    for (let work of objet) {
      galleryModale += `
      
      <figure data-id="${work.id}" >
      <img src="${work.imageUrl}" alt="${work.title}">
      <i class="fa-solid fa-trash-can" name="${work.id}"></i>
      <figcaption>${work.title}</figcaption>
      </figure>
      </div>`;
    
    }
  gallery.innerHTML = galleries;
  document.getElementById("modalGallery").innerHTML = galleryModale

  // Fonction delete work //

  const deleteRequest = {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${token}`
    }
};
  
  document.querySelectorAll('.fa-trash-can').forEach((elem) => {
    elem.addEventListener('click', (e) => {
      e.preventDefault()
      console.log(e.target.parentElement.dataset.id)
      const workId = e.target.parentElement.dataset.id;
      fetch(`http://localhost:5678/api/works/${workId}`, deleteRequest)
      .then((respons) => {
        if (respons.ok) {
          console.log("Projet supprimé avec succès !");
          elem.parentElement.remove();
          const deleteFigure = document.querySelector(`figure[data-id="${workId}"]`);
          deleteFigure.remove();
        }
      })

    })
  })
  }


// Création des boutons filtres par catégorie //

const fetchCategories = () => {
  fetch('http://localhost:5678/api/categories')
  .then((response) => response.json())
  .then((data) => {
    data.forEach(category => {
      const btn = document.createElement('button')
      btn.innerHTML = category.name

      btn.addEventListener('click', () => {
        const workToDisplay = works.filter((work) => { // filtrage de travaux works//
          return work.category.id == category.id;
        });
        createGallery(workToDisplay);
      })
      document.querySelector('.filters-container').appendChild(btn) // ajouter filtre contener//

      // Filtre gallery modale //

      const option = document.createElement('option')
      option.innerHTML = category.name
      option.value = category.id
      document.querySelector("#categoryChoice").appendChild(option)
    });
  })
  .catch((error) => {
    console.log(error);
  });
};

fetchCategories()


document.getElementById('filterst').addEventListener('click', () => {
  createGallery(works);
});

// Si l'user est connecté //


const token = window.localStorage.getItem("token");
const btnLogin = document.querySelector(".btnLogin");
const btnLogout = document.querySelector(".btnLogout");
const editionBanner = document.querySelector(".edition");
const filtres = document.querySelector(".filters-container");
const modification = document.querySelector(".modification");
const modalButton = document.querySelector(".modal-button");

function EditMode() {
  btnLogout.classList.remove("inactive");
  btnLogin.classList.add("inactive");
  editionBanner.classList.remove("inactive");
  filtres.classList.add("inactive");
  modification.classList.remove("inactive");
}

function disableEditMode() {
  window.localStorage.removeItem("token");
  btnLogout.classList.add("inactive");
  btnLogin.classList.remove("inactive");
  editionBanner.classList.add("inactive");
  filtres.classList.remove("inactive");
  modification.classList.add("inactive")
}

if (token !== null) {
  EditMode();
  btnLogout.addEventListener("click", disableEditMode);  

}

//Preparation de l'appel de boite de dialogue Modale //
 
const dialog = document.getElementById("modal");
const btnEdition = document.querySelector(".btnEdition");
const modalGallery = document.getElementById("modalGallery")

btnEdition.addEventListener("click", function(){
  modal.showModal()
});

// l'ouverture de la modale  //

const addPicsBtn = document.getElementById("addPicsBtn");
const modalAdd = document.querySelector(".modalAdd");

addPicsBtn.addEventListener("click", function() {
  modalAdd.showModal()
});

// Retour vers la modale //

const returnModale = document.querySelector(".fa-arrow-left");

returnModale.addEventListener("click", function() {
  modal.showModal()
});

// Fermeture des modales //
const close1 = document.querySelector(".closeModal");
const close2 = document.querySelector(".closeModal2");

close1.addEventListener("click", function() {
  modal.close()
  modalAdd.close()
});


close2.addEventListener("click", function(){
  modalAdd.close()
});


// personnalisation du boutton input files //
const addPics = document.getElementById("addPics");
const fileChoice = document.getElementById("fileChoice");
const imagePreview = document.getElementById("fileSelected");

fileChoice.addEventListener("click", function(event) {
  event.preventDefault()
  addPics.click()
})

addPics.addEventListener("change", function(){
  const fileSelected = addPics.files[0]

  if (fileSelected){
    const reader = new FileReader();

    reader.onload = function(event) {
      imagePreview.src = event.target.result;
      imagePreview.style.display = "block";
    }
    reader.readAsDataURL(fileSelected)
  }
})

// Ajout des pics //

const form = document.getElementById("modalAddPics");
const addTitle = document.getElementById("addTitle");
const addCategory = document.getElementById("categoryChoice");
const btnValide = document.getElementById("validePics");
const addPhoto = document.getElementById("addPics");
const errorMessage_p = document.querySelector(".error-message-p");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (addPhoto.value !== "" && addTitle.value !== "" && addCategory.value !== "") {
          try {
              let formData = new FormData();
              formData.append("title", addTitle.value);
              formData.append("image", addPhoto.files[0]);
              formData.append("category", parseInt(addCategory.value));

              const response = await fetch(`http://localhost:5678/api/works`, {
                  method: "POST",
                  headers: { "Authorization": `Bearer ${token}`},
                  body: formData  // le corps de la requête contien objet Formdata//
              });

              if (response.ok) {
                  console.log("Succès");
                  form.reset();// reéinitialiser le formulaire//
                  imagePreview.src = ""; //supprimer l'aperçu de l'image//
                  imagePreview.style.display = "none"; //cacher l'aperçu//
                  gallery.innerHTML = "";// vider la galerie//
                  fetchWorks(); // recharger la galerie ou les éléments associés//
              } else {
                  console.log("Erreur");
                  
              }
          } catch (error) {
              console.error("Erreur lors de la requête :", error);
          }
      }
      // Message d'erreur sur le titre ajout photo//
      else{

        if(addTitle.value == "" )
        {
          errorMessage_p.style.display = "block";
        addTitle.style.border = "3px solid red";
        }
        else
        {
          errorMessage_p.style.display = "none";
          addTitle.style.border = "none";        
        }
        
        // Bordure rouge sur l'ajout de photo//
        if(addPhoto.value == "")
        {
          zoneAddPics.style.border = "3px solid red";
        }
        else
        {
          zoneAddPics.style.border = "none";
        }
        

      }
  } 
);
