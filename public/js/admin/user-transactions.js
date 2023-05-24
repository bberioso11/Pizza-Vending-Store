const userID = window.location.pathname.split("/").pop();
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

document.querySelector(".breadcrumb-item.active").innerText =
  userID.charAt(0).toUpperCase() + userID.slice(1);

const deleteTransaction = async (transactionID) => {
  console.log(transactionID);
  const api = await fetch(`/admin/api/transactions-delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transactionID: [transactionID] }),
  });
  const response = await api.json();
  return response;
};

const initDeleteSingle = () => {
  const btnsDelete = document.querySelectorAll(".btn-delete");
  btnsDelete.forEach((btnDelete) => {
    const tablerow = btnDelete.closest("tr");
    const transactionID = tablerow.querySelectorAll("td")[1].innerText;
    btnDelete.addEventListener("click", () => {
      Swal.fire({
        title: `Are you sure you want to delete transaction ID "${transactionID}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteTransaction([transactionID]);
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
    const childsChk = document.querySelectorAll(
      "tbody [type='checkbox']:checked"
    );
    if (childsChk.length === 0) {
      Toast.fire({
        icon: "error",
        title: "Please select at least one checkbox",
      });
    } else {
      Swal.fire({
        title: `Are you sure you want to delete those selected transactions?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const chkBoxes = document.querySelectorAll(".child-chk:checked");
          let transactionIDs = [];
          chkBoxes.forEach((chkBox) => {
            transactionIDs.push(chkBox.value);
          });
          const response = await deleteTransaction(transactionIDs);
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
    }
  });
};

const initTableBtnDelete = () => {
  const btndelete = document.querySelector(".btn-delete-container");
  btndelete.innerHTML =
    '<button type="button" class="btn btn-danger btn-delete-multi">Delete</button>';
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

const dt = $("#transactions-list").DataTable({
  processing: true,
  serverSide: true,
  ajax: {
    url: `/admin/api/user-transactions-table/${userID}`,
    dataSrc: "data",
  },
  columns: [
    {
      data: null,
      width: "30px",
      orderable: !1,
      render: function (data, e, a, t, n) {
        return `
                <div class="form-check form-check-primary d-block new-control">
                    <input class="form-check-input child-chk" type="checkbox" id="form-check-default" value="${data.transaction_id}">
                </div>`;
      },
    },
    {
      data: null,
      render: (data) => {
        return `${data.transaction_id}`;
      },
    },
    {
      data: null,
      render: (data) => {
        return `<div class="d-flex">
                    <p class="align-self-center mb-0 user-name"> ${data.status} </p>
                </div>`;
      },
    },
    {
      data: "total_price",
      render: (data) => {
        return `<span>₱${data}</span>`;
      },
    },
    {
      data: null,
      render: (data) => {
        const date = new Date(data.purchase_date);
        const formattedDate = date.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        return formattedDate;
      },
    },
    {
      data: null,
      orderable: false,
      render: (data) => {
        return `
                    <a class="badge badge-light-primary text-start me-2" href="/invoice/${data.transaction_id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></a>
                    <a class="badge badge-light-danger text-start action-delete btn-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></a>`;
      },
      createdCell: (td) => {
        $(td).addClass("text-center");
      },
    },
  ],
  order: [[1, "asc"]],
  drawCallback: () => {
    checkAll();
    initTableBtnDelete();
    initDeleteSingle();
    initDeleteMulti();
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
