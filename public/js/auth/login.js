const form = document.querySelector("#loginForm");
const btnSignIn = document.querySelector("#signIn");

btnSignIn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
  } else {
    const formdata = new FormData(form);
    try {
      const api = await fetch("/authlogin", {
        method: "POST",
        body: formdata,
      });
      const res = await api.json();
      if (res.isSuccess) {
        Swal.fire({
          icon: "success",
          title: "Login Success",
          confirmButtonText: "Ok",
          allowOutsideClick: () => (window.location.href = "/"),
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
        });
        form.reset();
        form.classList.remove("was-validated");
      }
    } catch (err) {
      console.log(err);
    }
  }
});
