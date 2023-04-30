const Modal = new bootstrap.Modal("#details");
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const viewDetails = () => {
  const btnsView = document.querySelectorAll(".view");

  btnsView.forEach((btnView) => {
    btnView.addEventListener("click", async () => {
      const tableRow = btnView.closest("tr");
      const userID = tableRow.querySelector(".child-chk").value;

      const api = await fetch(`/admin/api/accountdetails/${userID}`, {
        method: "GET",
      });
      const response = await api.json();
      document.querySelector(
        ".modal-title"
      ).innerText = `Details: ${response.firstname} ${response.lastname}`;
      document.querySelector("#userID").value = response.id;
      document.querySelector("#firstname").value = response.firstname;
      document.querySelector("#lastname").value = response.lastname;
      document.querySelector("#email").value = response.email;

      Modal.toggle();
    });
  });
};

const saveDetails = () => {
  const btnSave = document.querySelector("#save");
  btnSave.addEventListener("click", async (event) => {
    event.preventDefault();
    const form = document.querySelector("#accountForm");
    const formdata = new FormData(form);

    const api = await fetch("/admin/api/account-save", {
      method: "POST",
      body: formdata,
    });
    const response = await api.json();
    if (response.isSuccess) {
      Toast.fire({
        icon: "success",
        title: response.message,
      });
      dt.ajax.reload(null, false);
    } else {
      Toast.fire({
        icon: "warning",
        title: response.message,
      });
    }
    Modal.toggle();
  });
};
saveDetails();

const deleteAccount = async (userID) => {
  const api = await fetch(`/admin/api/accountdelete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID: [userID] }),
  });
  const response = await api.json();
  return response;
};

const initDeleteSingle = () => {
  const btnsDelete = document.querySelectorAll(".delete");
  btnsDelete.forEach((btnDelete) => {
    const tablerow = btnDelete.closest("tr");
    const userID = tablerow.querySelector(".child-chk").value;
    const userFullname = tablerow.querySelectorAll("td")[1].innerText;
    btnDelete.addEventListener("click", () => {
      Swal.fire({
        title: `Are you sure you want to delete ${userFullname}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteAccount([userID]);
          if (response.isSuccess) {
            Toast.fire({
              icon: "success",
              title: response.message,
            });
            dt.ajax.reload(null, false);
          } else {
            Toast.fire({
              icon: "error",
              title: response.message,
            });
          }
        }
      });
    });
  });
};

const initDeleteMulti = () => {
  const btnDelete = document.querySelector(".btn-delete-multi");

  btnDelete.addEventListener("click", () => {
    Swal.fire({
      title: `Are you sure you want to delete those selected accounts?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const chkBoxes = document.querySelectorAll(".child-chk:checked");
        let userIDs = [];
        chkBoxes.forEach((chkBox) => {
          userIDs.push(chkBox.value);
        });
        const response = await deleteAccount(userIDs);
        if (response.isSuccess) {
          Toast.fire({
            icon: "success",
            title: response.message,
          });
          dt.ajax.reload(null, false);
        } else {
          Toast.fire({
            icon: "error",
            title: response.message,
          });
        }
      }
    });
  });
};

const checkAll = () => {
  const chkParent = document.querySelector(".chk-parent");
  const chkChilds = document.querySelectorAll(".child-chk");
  chkParent.addEventListener("click", () => {
    chkChilds.forEach((chkChild) => {
      chkChild.checked = chkParent.checked;
    });
  });
};

const initTableBtnDelete = () => {
  const btndelete = document.querySelector(".btn-delete-container");
  btndelete.innerHTML =
    '<button type="button" class="btn btn-danger btn-delete-multi">Delete</button>';
};

const dt = $("#customers-list").DataTable({
  ajax: {
    url: "/admin/api/customers",
    dataSrc: "",
  },
  columns: [
    {
      data: null,
      width: "30px",
      className: "",
      render: function (data) {
        return `
                        <div class="form-check form-check-primary d-block new-control">
                            <input class="form-check-input child-chk" type="checkbox" id="form-check-default" value="${data.id}">
                        </div>`;
      },
    },
    {
      data: null,
      render: (data) => {
        if (data.image == null) {
          data.image = "profile-picture.png";
        }
        return `<div class="d-flex justify-content-left align-items-center">
                    <div class="avatar  me-3">
                        <img src="/profile-images/${data.image}" alt="Avatar" width="64"
                            height="64">
                    </div>
                    <div class="d-flex flex-column">
                        <span class="text-truncate fw-bold">${data.firstname} ${data.lastname}</span>
                    </div>
                </div>`;
      },
    },
    { data: "email" },
    {
      data: null,
      render: (data) => {
        return `<a class="badge badge-light-primary text-start me-2 view" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></a>
    
                    <a class="badge badge-light-primary text-start me-2" href="transactions?userid=${data.id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg></a>
    
                    <a class="badge badge-light-danger text-start delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>`;
      },
      createdCell: (td) => {
        $(td).addClass("text-center");
      },
    },
  ],
  drawCallback: () => {
    viewDetails();
    initTableBtnDelete();
    initDeleteSingle();
    initDeleteMulti();
    checkAll();
  },
  dom:
    "<'dt--top-section'<'row'<'col-12 col-sm-6 d-flex justify-content-sm-start justify-content-center'l><'col-12 col-sm-6 d-flex justify-content-sm-end justify-content-center mt-sm-0 mt-3'f<'btn-delete-container align-self-center ms-2'>>>>" +
    "<'table-responsive'tr>" +
    "<'dt--bottom-section d-sm-flex justify-content-sm-between text-center'<'dt--pages-count  mb-sm-0 mb-3'i><'dt--pagination'p>>",
  oLanguage: {
    oPaginate: {
      sPrevious:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
      sNext:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    },
    sInfo: "Showing page _PAGE_ of _PAGES_",
    sSearch:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    sSearchPlaceholder: "Search...",
    sLengthMenu: "Results :  _MENU_",
  },
  stripeClasses: [],
  lengthMenu: [7, 10, 20, 50],
  pageLength: 10,
  destroy: true,
});
