const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});
const paypalContainer = document.querySelector("#paypal-button-container");
const paymentnowBtn = document.querySelector("#paynow-button-container");

const selectPaymentRadio = () => {
  const radios = document.querySelectorAll("input[type='radio']");
  radios.forEach((radio) => {
    radio.addEventListener("click", () => {
      if (radio.id === "paypal") {
        paypalContainer.style.display = "block";
        paymentnowBtn.classList.add("d-none");
      } else {
        paypalContainer.style.display = "none";
        paymentnowBtn.classList.remove("d-none");
      }
    });
  });
};
selectPaymentRadio();

const paypalRender = async () => {
  paypal
    .Buttons({
      createOrder() {
        return fetch("/payments/create-paypal-order", {
          method: "POST",
        })
          .then((response) => response.json())
          .then((order) => order.id);
      },
      onApprove(data) {
        return fetch("/payments/capture-paypal-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: data.orderID,
          }),
        })
          .then((response) => response.json())
          .then((orderData) => {
            if (orderData.isSuccess) {
              window.location.href = `/invoice/${orderData.transactionID}`;
            } else {
              Toast.fire({
                icon: "error",
                title: orderData.message,
              });
              console.log(orderData);
            }
          });
      },
    })
    .render("#paypal-button-container");
  paypalContainer.style.display = "none";
};
paypalRender();

paymentnowBtn.addEventListener("click", async () => {
  document
    .querySelector("[role='spinner']")
    .classList.remove("visually-hidden");
  document.querySelector("#paynowbtn").classList.add("disabled");
  try {
    const api = await fetch("/payments/create-paymongo-checkout", {
      method: "POST",
    });
    const response = await api.json();
    window.location.replace(response);
  } catch (err) {
    console.log("catch error: ", err);
  }
});
