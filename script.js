const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener('click', function () {
    updateCartModal();
    cartModal.style.display = 'flex';
});

// Fechar o modal do carrinho quando clicar fora
cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Fechar o modal do carrinho quando clicar no botão fechar
closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none';
});

// Adicionar um item ao carrinho

menu.addEventListener('click', function (event) {
    // console.log(event.target);

    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        console.log(name, price);

        // Adicionar ao carrinho
        addToCart(name, price);
    }
});

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // Se o item já existir no carrinho, adicionar 1 à quantidade
        existingItem.quanntity += 1;
 
    } else {

        cart.push({
            name,
            price,
            quanntity: 1,
        })

    }
    
    updateCartModal()
}

// Atualiza carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quanntity}</p>
                <p class="font-medium mt-2" >R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>

        </div>
        `

        total += item.price * item.quanntity;

        cartItemsContainer.appendChild(cartItemElement);

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    cartCounter.innerHTML = cart.length;

}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        if(item.quanntity > 1){
            item.quanntity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }

}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (inputValue !== "") {
        addressWarn.classList.add("hidden");
        addressInput.classList.remove("border-red-500");
    }
});

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {

        Toastify({
            text: "Ops!!! O restaurante está fechado. Volte mais tarde!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        
        return;
    }

    if (cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Enviar pedido para api do whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quanntity}) Preço: R$${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems);
    const phone = "21998666767"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    cart = [];
    updateCartModal();
})

// Verifica se o restaurante está aberto
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //true restaurante aberto, false restaurante fechado
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");    
}