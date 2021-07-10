const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const users = JSON.parse(localStorage.getItem('favoriteUsers')) ;
let filteredUserList = [];

const dataPanel = document.querySelector("#data-panel");

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3 col-lg-2">
      <div class="card">
        <img src="${item.avatar}" class="btn card-img-top btn-show-info w-75" alt="user picture" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
        <div class="card-body ">
          <p class="card-text">${item.surname} ${item.name}</p>
        </div>
         <div class="card-footer">
              <button type="button" class="btn btn-danger btn-xs btn-remove-favorite" data-id=${item.id}>X</button>
          </div>
      
 </div>
    </div>`
  })
  dataPanel.innerHTML = rawHTML;
}

//設置modal 的函示
function showUserModal(id) {
  const userName = document.querySelector("#user-modal-title");
  const userAge = document.querySelector("#user-age");
  const userGender = document.querySelector("#user-gender");
  const userRegion = document.querySelector("#user-region");
  const userBirthday = document.querySelector("#user-birthday");
  const userEmail = document.querySelector("#user-email");

  axios.get(INDEX_URL + id).then((response) => {
    //設data，因為後面會重複出現這一段，因此把它精簡化
    const data = response.data;
    userName.innerText = `${data.surname} ${data.name}`;
    userAge.innerText = `Age: ${data.age}`;
    userGender.innerText = `Gender:${data.gender}`;
    userRegion.innerText = `Region: ${data.region}`;
    userBirthday.innerText = `Birthday:${data.birthday}`;
    userEmail.innerText = `Email:${data.email}`;
  });
}

function removeFromFavorite(id){
  //要找到user的index位置
  const userIndex = users.findIndex((user) => user.id === id)
  
  users.splice(userIndex,1)

  localStorage.setItem("favoriteUsers", JSON.stringify(users))
  renderUserList(users)
}

//設置一個點擊的指令
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-info")) {
    showUserModal(Number(event.target.dataset.id))
    //把id用成 數字屬性
  } else if (event.target.matches('.btn-remove-favorite')) { removeFromFavorite(Number(event.target.dataset.id)) }
});



renderUserList(users)