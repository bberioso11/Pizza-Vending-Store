const updateCart = async (productID, quantity) => {
  const api = await fetch(`/api/updatecart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productID: productID,
      quantity: quantity,
    }),
  });
};

const myCart = async () => {
  const api = await fetch(`/api/mycart`, {
    method: "GET",
  });
  const carts = await api.json();
  return carts;
};

const table = async () => {
  const tbody = document.querySelector("tbody");
  let item = "";
  const carts = await myCart();

  if (carts.length === 0) {
    const btnCheckout = document.querySelector(".btn-checkout");
    btnCheckout.classList.add("disabled");
  }

  carts.forEach((cart) => {
    const totalPrice = cart.product_price * cart.quantity;
    item += `
    <tr>
        <td>
            <img src="/product-images/${cart.product_img}" alt="${cart.product_name}" style="width: 100px;">
            <span class="fw-semibold">${cart.product_name}</span>
            <input type="hidden" class="productID" value="${cart.product_id}">
        </td>
        <td class="fw-semibold">
            <span class="stocks">${cart.product_quantity}</span>
        </td>
        <td class="fw-semibold">
            <input class="quantity" type="text" value="${cart.quantity}" name="quantity">
        </td>
        <td class="fw-semibold">₱${cart.product_price}</td>
        <td class="fw-semibold">₱${totalPrice}</td>
        <td>
            <button class="btn btn-outline-danger btn-rounded btn-remove">x</button>
        </td>
    </tr>
    `;
  });

  tbody.innerHTML = item;
};

const touchspin = () => {
  $("input[name='quantity']")
    .TouchSpin({
      min: 1,
      max: 99,
      step: 1,
      // decimals: 2,
      boostat: 5,
      maxboostedstep: 1,
      // postfix: '%',
      buttondown_class: "btn btn-primary btn-down",
      buttonup_class: "btn btn-primary btn-up",
    })
    .on("change", async (event) => {
      const parent = event.target.closest("tr");
      const productID = parent.querySelectorAll("td .productID")[0].value;
      const quantity = parent.querySelectorAll("td div>.quantity")[0].value;
      await updateCart(productID, quantity);
      updateAmount();
    });
};

const removeCart = () => {
  const btnsRemove = document.querySelectorAll(".btn-remove");
  btnsRemove.forEach((btnRemove) => {
    btnRemove.addEventListener("click", async () => {
      const parent = btnRemove.closest("tr");
      console.log("1");
      const productID = parent.querySelectorAll("td .productID")[0].value;

      const api = await fetch(`/api/removecart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productID: productID,
        }),
      });
      const response = await api.json();
      initTable();
    });
  });
};

const updateAmount = async () => {
  const tableRows = document.querySelectorAll("tbody tr");
  const carts = await myCart();
  carts.forEach((cart, index) => {
    const totalPrice = cart.product_price * cart.quantity;
    tableRows[index].querySelectorAll("td")[3].innerText = `₱${totalPrice}`;
  });
};

const initTable = async () => {
  await table();
  touchspin();
  removeCart();
};
initTable();
