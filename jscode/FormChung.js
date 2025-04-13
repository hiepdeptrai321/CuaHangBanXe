$(document).ready(function () {
    // Lắng nghe sự kiện click trên các liên kết trong dropdown-content
    $(".dropdown-content a").click(function (e) {
        e.preventDefault();
        const selectedValue = $(this).data("value");
        localStorage.setItem("selectedCategory", selectedValue);
        startLoadingBar(() => {
            document.body.classList.add("fade-out"); // Thêm hiệu ứng fade-out
            setTimeout(() => {
                window.location.href = "DanhSachSanPham.html"; // Chuyển hướng sau khi fade-out hoàn tất
            }, 200); // Thời gian khớp với CSS transition
        });
    });

    // Lắng nghe sự kiện click trên tất cả các liên kết
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            // Kiểm tra nếu href không phải là "#" và không trống
            if (href && href !== "#") {
                event.preventDefault(); // Ngăn chặn hành động mặc định
                startLoadingBar(() => {
                    document.body.classList.add("fade-out"); // Thêm hiệu ứng fade-out
                    setTimeout(() => {
                        window.location.href = href; // Chuyển hướng sau khi fade-out hoàn tất
                    }, 200); // Thời gian khớp với CSS transition
                });
            }
        });
    });
    $("#searchbar").on("keydown", function (event) {
        const searchTerm = $(this).val().trim(); 
    
        // Kiểm tra nếu phím Enter được nhấn
        if (event.key === "Enter") {
            event.preventDefault(); // Ngăn chặn hành động mặc định (nếu cần)
    
            // Lưu productCategory là "All Products" vào localStorage
            localStorage.setItem("selectedCategory", "All Products");
    
            // Lưu nội dung tìm kiếm vào localStorage
            if (!searchTerm) {
                localStorage.removeItem("searchRegex");
                localStorage.removeItem("searchTerm");
            } else {
                const regex = new RegExp(searchTerm, "i");
                localStorage.setItem("searchRegex", regex.toString());
                localStorage.setItem("searchTerm", searchTerm); // Lưu nội dung tìm kiếm
            }
    
            // Chuyển hướng sang trang danh sách sản phẩm
            window.location.href = "DanhSachSanPham.html";
        }
    });
});

// Hàm điều khiển thanh tải
function startLoadingBar(callback) {
    const loadingBar = document.getElementById("loading-bar");
    loadingBar.style.width = "0%"; // Đặt lại về 0%
    loadingBar.style.transition = "none"; // Loại bỏ hiệu ứng để reset
    setTimeout(() => {
        loadingBar.style.transition = "width 1s ease-out"; // Thêm lại hiệu ứng với thời gian 1 giây
        loadingBar.style.width = "100%"; // Tăng chiều rộng lên 100%
    }, 10);

    // Lắng nghe sự kiện khi hiệu ứng kết thúc
    loadingBar.addEventListener("transitionend", function handleTransitionEnd() {
        loadingBar.removeEventListener("transitionend", handleTransitionEnd); // Xóa sự kiện để tránh lặp lại
        if (typeof callback === "function") {
            callback(); // Gọi hàm callback sau khi hiệu ứng hoàn tất
        }
    });
}