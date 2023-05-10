const Database = require("../config/database");
const Products = require("./products");
const Transactions = require("./transactions");
const axios = require("axios");

const transactions = new Transactions();

class Payments extends Products {
  async getTotalAmount(userID) {
    const userCarts = await this.myCart(userID);
    const totalAmount = userCarts.reduce(
      (total, cart) => total + cart.product_price * cart.quantity,
      0
    );
    return totalAmount;
  }

  // generate an access token using client id and app secret
  async paypalGenerateAccessToken() {
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_APP_SECRET
    ).toString("base64");
    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v1/oauth2/token`,
      {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    const data = await response.json();
    return data.access_token;
  }

  // use the orders api to create an order
  async paypalCreateOrder(userID) {
    const totalAmount = await this.getTotalAmount(userID);
    const accessToken = await this.paypalGenerateAccessToken();
    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders`;
    const { data } = await axios.post(
      url,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "PHP",
              value: totalAmount,
            },
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return data;
  }

  // use the orders api to capture payment for an order
  async paypalCapturePayment(userID, orderId) {
    const accessToken = await this.paypalGenerateAccessToken();
    const userCarts = await this.myCart(userID);
    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`;

    try {
      const { data } = await axios.post(url, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (data.status === "COMPLETED") {
        const transaction = await transactions.createTransaction(userID);
        const cartQuantityPromise = userCarts.map(async (cart) => {
          return await this.updateQuantity(cart.product_id, cart.quantity);
        });
        await Promise.all(cartQuantityPromise);
        await this.clearCart(userID);
        return {
          isSuccess: true,
          message: "Payment Succesful.",
          transactionID: transaction.transactionID,
        };
      } else {
        throw new Error("Payment Failed");
      }
    } catch (err) {
      return {
        isSuccess: false,
        message: "Something Wrong.",
        error: err.message,
      };
    }
  }
}

module.exports = Payments;
