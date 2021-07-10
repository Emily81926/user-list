const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";

const users = [];
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
              <button type="button" class="btn btn-danger btn-xs btn-add-favorite" data-id=${item.id}><i class="far fa-heart"></i></button>
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

function addToFavorite(id){

  const list = JSON.parse(localStorage.getItem("favoriteUsers")) || [ ]
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id )){ 
    return alert("已加入喜愛清單！")
  }
  list.push(user)
  localStorage.setItem("favoriteUsers",JSON.stringify(list))
}

//設置一個點擊的指令
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-info")) {
    showUserModal(Number(event.target.dataset.id))
    //把id用成 數字屬性
  } else if (event.target.matches('.btn-add-favorite')) 
  { addToFavorite(Number(event.target.dataset.id)) }
});

//在form設定search-form的監聽
const searchForm = document.querySelector("#search-form");

//要取得search form裡的文字

const searchInput = document.querySelector("#myInput");

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault(); //要加這個，才不會一直轉跳頁面
  
  //設定輸入的字詞
  const keyword = searchInput.value.trim().toLowerCase();
  //如果沒有輸入內容，會跳出'請輸入有效字串！'
  if (!keyword.length) {
    return alert("請輸入有效字串！");
  }
  //設定新的filteredUserList名單
  //如果keyword符合名單裡的surname 或是name
  filteredUserList = users.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) ||
      user.surname.toLowerCase().includes(keyword)
  );

  //優化！！錯誤處理：無符合條件的結果
  if (filteredUserList.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`);
  }
  //此處需要重新renderPagination
  renderPagination(filteredUserList.length)
  renderUserList(getUsersByPage(1));
});

//pagination
//先算一頁想要幾個名單，在算出總共需要幾頁

// let paginationLength = users.length / 12;

const paginator = document.querySelector(".pagination-panel");

const USERS_PER_PAGE = 36;

function getUsersByPage(page) {
  
  const data = filteredUserList.length ? filteredUserList : users
  const startIndex = (page - 1) * USERS_PER_PAGE;
  
  return data.slice(startIndex, startIndex + USERS_PER_PAGE);
}

//將getUsersByPage函數用axios帶入
axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results);
  renderPagination(users.length);
  renderUserList(getUsersByPage(1));
});

//製作新的pagination page  ，並在axios中呼叫！！
function renderPagination(amount) {
  let numberOfPage = Math.ceil(amount / USERS_PER_PAGE);
  //Math.ceil的用法多熟悉
  let rawHTML = "";
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `;
  }
  paginator.innerHTML = rawHTML;
}

//在paginator上設置監聽器
paginator.addEventListener("click", function onPaginatorClicked(event) {
  //如果按到的部分，不是<a>標籤，就不要有作為
  if (event.target.tagName !== "A") return;
  //頁數，就是按到的目標的內容裡面的page數字（要加Number才會變成數字屬性）
  const page = Number(event.target.dataset.page); //要在paginator的<li> 裡面加個 data-page="${page}" ，代表是dataset裡面的page 這樣才可以連動！！
  renderUserList(getUsersByPage(page));
});

