// Handle cart modal (for all page: index, cart, detail, auth)
document.addEventListener("DOMContentLoaded", function () {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount();

    // Handle Cart Button Click
    const cartButton = document.getElementById("cartButton");
    cartButton.addEventListener("click", function (event) {
        event.preventDefault();
        renderCart();

        const cartModalElement = document.getElementById("cartModal");
        if (cartModalElement) {
            const cartModal = new bootstrap.Modal(cartModalElement);
            cartModal.show();
        } else {
            console.error("Cart modal element not found");
        }
    });


    // Clear Cart Button
    const clearCartButton = document.getElementById("clearCart");
    if (clearCartButton) {
        clearCartButton.addEventListener("click", function () {
            cart = [];
            localStorage.removeItem("cart");
            renderCart();
            updateCartCount();
        });
    }

    // Function to Render Cart Items
    function renderCart() {
        const cartItems = document.getElementById("cartItems");
        if (!cartItems) {
            console.error("Cart items container not found");
            return;
        }

        cartItems.innerHTML = "";
        if (cart.length === 0) {
            cartItems.innerHTML = "<li class='list-group-item text-center'>Giỏ hàng trống</li>";
            return;
        }

        cart.forEach(item => {
            let li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.thumbnail}" class="img-thumbnail me-2" style="width: 50px; height: 50px; object-fit: cover;" alt="${item.name}">
                    <div>
                        <p class="mb-0"><strong>${item.name}</strong></p>
                        <p class="mb-0">Size: ${item.size}</p>
                        <p class="mb-0">Quantity: ${item.quantity}</p>
                        <p class="mb-0">${formatPrice(item.price)} ₫</p>
                    </div>
                </div>
                <button class="btn btn-transparent btn-sm remove-item" data-id="${item.id}" data-size="${item.size}">🗑️</button>
            `;

            cartItems.appendChild(li);
        });

        // Attach remove event listeners
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                let id = this.getAttribute("data-id");
                let size = this.getAttribute("data-size");
                removeItem(id, size);
            });
        });
    }

    // Function to Remove Item from Cart
    function removeItem(id, size) {
        cart = cart.filter(item => !(item.id === id && item.size === size));
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }

    // Function to Update Cart Count Badge
    function updateCartCount() {
        const cartCountElement = document.getElementById("cartCount");
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    // Function to Format Price
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Add to Cart Button Click Event
    document.querySelectorAll(".addToCart").forEach(button => {
        button.addEventListener("click", function () {
            let id = this.getAttribute("data-id");
            let name = this.getAttribute("data-name");
            let price = parseFloat(this.getAttribute("data-price"));
            let thumbnail = this.getAttribute("data-thumbnail");
            let type = this.getAttribute("data-type");
            let quantity = parseInt(document.getElementById("quantityInput").value, 10);

            // Get selected size
            const selectedSize = document.querySelector(`input[name="sizeOptions-${id}"]:checked`);
            let size = selectedSize ? selectedSize.value : "No Size";

            if (!quantity || quantity < 1) {
                alert("Vui lòng nhập số lượng hợp lệ.");
                return;
            }

            if (type !== "Accessories" && size === "No Size") {
                alert("Please select size !")
                return;
            }

            // Find if the product with the same ID & size exists
            let existingProduct = cart.find(item => item.id === id && item.size === size);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.push({ id, name, price, size, quantity, thumbnail });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            renderCart(); // Update the modal immediately

            alert("Sản phẩm đã được thêm vào giỏ hàng!");
        });
    });
});

// Handle quantity box (for detail.ejs)
document.addEventListener("DOMContentLoaded", function () {
    // Increase/Decrease quantity buttons
    document.getElementById("increaseQuantity").addEventListener("click", function () {
        let qty = document.getElementById("quantityInput");
        qty.value = parseInt(qty.value) + 1;
    });

    document.getElementById("decreaseQuantity").addEventListener("click", function () {
        let qty = document.getElementById("quantityInput");
        if (parseInt(qty.value) > 1) {
            qty.value = parseInt(qty.value) - 1;
        }
    });
})

// Handle image sliding (for detail.ejs)
document.addEventListener("DOMContentLoaded", function () {
    const sliderContainer = document.getElementById("imageSlider");
    const sliderItems = document.querySelectorAll(".slider-item");
    const prevButton = document.getElementById("prevSlide");
    const nextButton = document.getElementById("nextSlide");
    const thumbnails = document.querySelectorAll(".thumbnail");

    let currentIndex = 0;

    function updateSlider() {
        const offset = -currentIndex * 100; // Move the slider
        sliderContainer.style.transform = `translateX(${offset}%)`;
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle("active", index === currentIndex);
        });
    }

    nextButton.addEventListener("click", function () {
        if (currentIndex < sliderItems.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    prevButton.addEventListener("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener("click", function () {
            currentIndex = index;
            updateSlider();
        });
    });
})

// Handle cart logic (for cart.ejs)
document.addEventListener("DOMContentLoaded", function () {
    // Get cart from localStorage
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Tìm phần tử chứa danh sách sản phẩm trong giỏ hàng
    let cartItemsContainer = null;
    document.querySelectorAll(".card").forEach(card => {
        const header = card.querySelector(".card-header");
        if (header && header.textContent.trim() === "Cart Items") {
            cartItemsContainer = card.querySelector(".card-body");
        }
    });

    // Tìm phần tử chứa tổng kết đơn hàng
    let orderSummaryContainer = null;
    document.querySelectorAll(".card").forEach(card => {
        const header = card.querySelector(".card-header");
        if (header && header.textContent.trim() === "Order Summary") {
            orderSummaryContainer = card.querySelector(".card-body");
        }
    });

    // Kiểm tra nếu tìm thấy container và có sản phẩm trong giỏ hàng
    if (cartItemsContainer && localCart.length > 0) {
        // Clear nội dung cũ
        cartItemsContainer.innerHTML = "";

        // Thêm từng sản phẩm từ localStorage
        localCart.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "row mb-3";
            itemElement.innerHTML = `
        <div class="col-md-3">
            <img src="${item.thumbnail}" class="img-fluid" alt="${item.name}">
        </div>
        <div class="col-md-6">
            <h5>${item.name}</h5>
            <p>Size: ${item.size}</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: ${formatPrice(item.price)} ₫</p>
        </div>
        <div class="col-md-3 d-flex align-items-center">
            <button class="btn btn-danger remove-item" data-id="${item.id}">Remove</button>
        </div>
    `;
            cartItemsContainer.appendChild(itemElement);

            // Thêm đường kẻ ngang
            const divider = document.createElement("hr");
            cartItemsContainer.appendChild(divider);
        });

        // Thêm sự kiện cho nút "Remove"
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", function () {
                const id = this.getAttribute("data-id");
                removeItem(id);
            });
        });

        // Cập nhật tổng kết đơn hàng
        if (orderSummaryContainer) {
            const totalItems = localCart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            orderSummaryContainer.innerHTML = `
        <p>Total Items: ${totalItems}</p>
        <p>Total Price: ${formatPrice(totalPrice)}</p>
        <a href="/checkout" class="btn btn-primary btn-block">Proceed to Checkout</a>
    `;
        }
    }

    // Hàm xóa sản phẩm khỏi giỏ hàng
    function removeItem(id) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem("cart", JSON.stringify(cart));

        // Làm mới trang để cập nhật giỏ hàng
        window.location.reload();
    }

    // Helper function to format price
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }

});

document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length > 0) {
        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;

            const itemHTML = `
                <div class="row mb-3">
                    <div class="col-md-3">
                        <img src="${item.thumbnail}" class="img-fluid" alt="${item.name}">
                    </div>
                    <div class="col-md-6">
                        <h5>${item.name}</h5>
                        ${item.size && item.size !== 'No Size' ? `<p>Size: ${item.size}</p>` : ''}
                        <p>Quantity: ${item.quantity}</p>
                        <p>${formatPrice(item.price)}</p>
                    </div>
                </div>
                <hr>
            `;
            cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
        });

        const summaryHTML = `
            <p>Total Items: ${totalItems}</p>
            <p>Total Price: ${formatPrice(totalPrice)}</p>
            <button class="btn btn-success w-100 mt-3" id="placeOrderBtn">Place Order</button>
        `;
        cartItemsContainer.insertAdjacentHTML("beforeend", summaryHTML);
    } else {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", function () {
            const confirmOrder = confirm("Bạn có chắc chắn thông tin bạn nhập chính xác chưa?");
            if (!confirmOrder) return;

            // Lấy thông tin từ form
            const email = document.getElementById("email").value.trim();
            const fullName = document.getElementById("fullName").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const address = document.getElementById("address").value.trim();
            const district = document.getElementById("district").value.trim();
            const city = document.getElementById("city").value.trim();

            // Lấy shippingMethod (select)
            const shippingSelect = document.querySelector(".form-select");
            const shippingMethod = shippingSelect ? shippingSelect.value : "";

            // Lấy paymentMethod (radio)
            const paymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
            const paymentMethod = paymentRadio ? paymentRadio.id : "";

            // Lấy cart từ localStorage (hoặc session):
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            // Tính tổng tiền
            let totalPrice = 0;
            cart.forEach(item => {
                totalPrice += item.price * item.quantity;
            });

            // Gửi request POST đến /place-order
            fetch('/place-order', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    fullName,
                    phone,
                    address,
                    district,
                    city,
                    shippingMethod,
                    paymentMethod,
                    cartItems: cart,
                    totalPrice
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        alert('Đặt hàng thành công!');
                        // Xóa cart localStorage hoặc chuyển hướng
                        localStorage.removeItem('cart');
                        window.location.href = '/';
                    } else {
                        alert('Đặt hàng thất bại: ' + data.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Có lỗi xảy ra khi đặt hàng.');
                });
        });
    }
});

// Helper function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}