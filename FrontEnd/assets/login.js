const inputs = document.querySelectorAll("input");
const errorMessage = document.querySelector(".error-message");
const loginBtn = document.querySelector(".input-position");
 const form = document.querySelector("input-position");
;

loginBtn.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = e.target.email.value
    const password = e.target.password.value

    const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Ajoute les informations d'identification dans le corps de la requête
    body: JSON.stringify({ email, password }),
  });
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token);
    window.location.href = "./index.html"
  } else {
    errorMessage.style.visibility = "visible";
}
});

