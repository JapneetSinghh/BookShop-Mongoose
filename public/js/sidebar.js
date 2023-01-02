const toggleBtn = document.querySelector("#sidebarBtn");
const closeBtn = document.querySelector("#closeSidebarBtn");
const sidebar = document.querySelector("#navbar");

toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("show-sidebar");
});

closeBtn.addEventListener("click", function () {
    sidebar.classList.remove("show-sidebar");
});