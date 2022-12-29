const jobs = document.querySelector(".jobs");
const filters = document.querySelector(".filters");
const searchBar = document.getElementById("search-bar")
const submitBtn = document.getElementById("submit-btn")
const body = document.body
let jobArray = [];
let spread = [];
let filtersArray = [];
let searched = 0
const getJsonData = async function () {
  const response = await fetch("./data.json");
  jobArray = await response.json();
  spread = [...jobArray];
  populateDOM(jobArray);

};

getJsonData();

function addToDom(array) {
  array.forEach((item) => {
    const jobElement = `<div class="job" id=${item.id}>
        <div class="about-job">
          <img src=${item.logo} class="company-img" alt="" />
          <div class="company-name company-name-${item.id}">
            <h3>${item.company}</h3>
            
          </div>
          <h3 class="role">${item.position}</h3>
          <div class="timing">
            <span class="time">${item.postedAt}</span>
            <span class="type">${item.contract}</span>
            <span class="region">${item.location}</span>
          </div>
        </div>
        <div class="job-tags-${item.id} job-tags">
        <span class="tag">${item.role}</span>
        <span class="tag">${item.level}</span>
        </div>
      </div>`;
    jobs.insertAdjacentHTML("beforeend", jobElement);
  });
}

function addNewFeatured(array) {
  array.forEach((item) => {
    const companyName = document.querySelector(`.company-name-${item.id}`);
    if (item.new) {
      const newElement = `<span class="new">NEW</span>`;
      companyName.insertAdjacentHTML("beforeend", newElement);
    }
    if (item.featured) {
      const featuredElement = `<span class="featured">FEATURED</span>`;
      companyName.insertAdjacentHTML("beforeend", featuredElement);
    }
  });
}

function addTags(array) {
  array.forEach((item) => {
    const tagsElement = document.querySelector(`.job-tags-${item.id}`);
    const childTag = [...item.languages, ...item.tools];
    for (let i = 0; i < childTag.length; i++) {
      const tagElement = ` <span class="tag">${childTag[i]}</span>`;
      tagsElement.insertAdjacentHTML("beforeend", tagElement);
    }
  });
}

function populateDOM(array) {
  addToDom(array);
  addNewFeatured(array);
  addTags(array);
}

function filter(text) {
  jobArray = jobArray.filter((item) => {
    if (
      [...item.languages, ...item.tools, item.level, item.role].includes(text)
    ) {
      return item;
    }
  });
  jobs.innerHTML = "";
  populateDOM(jobArray);
}

function updateDOM() {
  jobs.innerHTML = "";
  const filterChildElement = filters.querySelectorAll(".filter");
  [...filterChildElement].forEach((item) => {
    filter(item.children[0].textContent);
  });
}

function addToFiltersDOM(text) {
  const filterElement = `<div class="filter">
    <span>${text}</span>
    <img src="images/icon-remove.svg" class="remove" alt="" />
  </div>`;
  filters.insertAdjacentHTML("beforeend", filterElement);
}

jobs.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("tag")) {
    filters.classList.add("active");
    if (!filtersArray.includes(target.textContent.toUpperCase())){
      addToFiltersDOM(target.textContent);
      filtersArray.push(target.textContent.toUpperCase());
      console.log(filtersArray);
      searched++
    }
    updateDOM();
  }
});
body.addEventListener('click', ()=> console.log(searched))
filters.addEventListener("click", (e) => {
  const target = e.target;
  console.log(searched)
  if (target.classList.contains("remove")) {
    target.parentElement.remove();
    searched--
    if (filters.childElementCount > 1) {
      jobArray = [...spread];
      const filterChildElement = filters.querySelectorAll(".filter");
      [...filterChildElement].forEach((item) => {
        filter(item.children[0].textContent);
        
      });
      filtersArray = []
      updateDOM();
      if(searched === 0){
        getJsonData()
      }
    } 
    else {
      filtersArray = []
      updateDOM();
      getJsonData();
      
    }
   } 
  else if (target.classList.contains("clear")) {
      const filterChilds = filters.querySelectorAll(".filter");
      [...filterChilds].forEach((item) => item.remove());
      jobs.innerHTML = "";
      filtersArray = []
      getJsonData();
      searchBar.value = ""
      searched = 0
  }
});

submitBtn.addEventListener("click", (e)=>{
  e.preventDefault()
  let searchStringCheck = searchBar.value.toLowerCase()
  if (searchStringCheck === "frontend" || 
      searchStringCheck === "backend" ||
      searchStringCheck === "react" ||
      searchStringCheck === "javascript" || 
      searchStringCheck === "html" ||
      searchStringCheck === "css" ||
      searchStringCheck === "python" ||
      searchStringCheck === "fullstack" ||
      searchStringCheck === "junior" ||
      searchStringCheck === "senior" || 
      searchStringCheck === "sass" ||
      searchStringCheck === "ruby" ||
      searchStringCheck === "ror" ||
      searchStringCheck === "vue" ||
      searchStringCheck === "django" ||
      searchStringCheck === "midweight"){
        let searchString = capitalize(searchBar.value)
        if (!filtersArray.includes(searchString.toUpperCase())){
          filtersArray.push(searchString.toUpperCase());
          if (searchStringCheck === "frontend" ||
              searchStringCheck === "backend" ||
              searchStringCheck === "react" ||
              searchStringCheck === "junior" ||
              searchStringCheck === "senior" ||
              searchStringCheck === "fullstack" ||
              searchStringCheck === "python" || 
              searchStringCheck === "midweight" || 
              searchStringCheck === "sass" || 
              searchStringCheck === "ruby" ||
              searchStringCheck === "vue" ||
              searchStringCheck === "django"
            ){
              addToFiltersDOM(capitalize(searchString))
              updateDOM();
              searched++
            }
          else if(searchStringCheck === "html" || searchStringCheck === "css"){
            addToFiltersDOM(searchString.toUpperCase())
            updateDOM();
            searched++
          }
          else if(searchStringCheck === "javascript"){
            addToFiltersDOM("JavaScript")
            updateDOM();
            searched++
          }
          else if(searchStringCheck === "ror"){
            addToFiltersDOM("RoR")
            updateDOM();
            searched++
          }
        }
        searchBar.value = ""
  }
})

function capitalize(text){
  const str = text
  const str2 = str.charAt(0).toUpperCase() + str.slice(1);
  return str2
}
