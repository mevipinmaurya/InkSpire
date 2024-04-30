(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


// Searching functionality code
let searchInp = document.getElementById("searchInp");
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", (e)=>{
  // console.log(searchInp.value);
  let key = searchInp.value;
  console.log(key);

  e.preventDefault();
})



// category code
let food = document.getElementById("food");
food.addEventListener("click", ()=>{
  window.location.replace("http://localhost:8080/blogs/food");
})
let exercise = document.getElementById("exercise");
exercise.addEventListener("click", ()=>{
  window.location.replace("http://localhost:8080/blogs/exercise");
})
let travel = document.getElementById("travel");
travel.addEventListener("click", ()=>{
  window.location.replace("http://localhost:8080/blogs/travel");
})
let mindTherapy = document.getElementById("mindTherapy");
mindTherapy.addEventListener("click", ()=>{
  window.location.replace("http://localhost:8080/blogs/mindTherapy");
})
let nature = document.getElementById("nature");
nature.addEventListener("click", ()=>{
  window.location.replace("http://localhost:8080/blogs/nature");
})
let health = document.getElementById("health");
health.addEventListener("click", ()=>{
  window.location.replace("http://localhost:8080/blogs/health");
})
