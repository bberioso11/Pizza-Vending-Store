const Order = require("../models/order");
const order = new Order();

exports.orderValidate = async (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid) {
    res.json({
      isSuccess: false,
      message: "UUID is missing",
    });
  } else {
    const response = await order.orderValidate(uuid);
    res.json(response);
  }
};

exports.orderCapture = async (req, res) => {
  const uuid = req.params.uuid;
  if (!uuid) {
    res.json({
      isSuccess: false,
      message: "UUID is missing",
    });
  } else {
    const response = await order.orderCapture(uuid);
    res.json(response);
  }
};

exports.orderFinish = async (req, res) => {
  const uuid = req.body.uuid;
  const status = req.body.status;
  if (!uuid) {
    res.json({
      isSuccess: false,
      message: "UUID is missing",
    });
  } else {
    const response = await order.orderFinish(uuid, status);
    res.json(response);
  }
};
