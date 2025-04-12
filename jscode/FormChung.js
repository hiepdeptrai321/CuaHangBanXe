$(document).ready(function () {
    $(".dropdown-content a").click(function (e) {
        e.preventDefault(); 
        const selectedValue = $(this).data("value");
        localStorage.setItem("selectedCategory", selectedValue);
        window.location.href = "DanhSachSanPham.html";
    });
});