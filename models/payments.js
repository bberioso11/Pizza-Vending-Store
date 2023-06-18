const Database = require("../config/database");
const Products = require("./products");
const Transactions = require("./transactions");
const axios = require("axios");
const https = require("https");

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const transactions = new Transactions();

class Payments extends Products {
  async getTotalAmount(userID) {
    const userCarts = await this.filteredCart(userID);
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
    const { data } = await instance.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return data.access_token;
  }

  // use the orders api to create an order
  async paypalCreateOrder(userID) {
    const totalAmount = await this.getTotalAmount(userID);
    const accessToken = await this.paypalGenerateAccessToken();
    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders`;
    const { data } = await instance.post(
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
    const userCarts = await this.filteredCart(userID);
    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`;

    try {
      const { data } = await instance.post(url, null, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (data.status === "COMPLETED") {
        const transaction = await transactions.createTransaction(userID);
        // const cartQuantityPromise = userCarts.map(async (cart) => {
        //   return await this.updateQuantity(cart.product_id, cart.quantity);
        // });
        // await Promise.all(cartQuantityPromise);
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

  async paymongoRetrieveCheckout(userID, id) {
    try {
      const { data } = await instance.get(
        `https://api.paymongo.com/v1/checkout_sessions/${id}`,
        {
          headers: {
            accept: "application/json",
            authorization: "Basic c2tfdGVzdF9GOEFkNWliY2N1YU5VUEYxRU1FOHB6NXY6",
          },
        }
      );
      if (
        data.data.attributes.payment_intent.attributes.status === "succeeded"
      ) {
        const userCarts = await this.filteredCart(userID);
        const transaction = await transactions.createTransaction(userID);
        // const cartQuantityPromise = userCarts.map(async (cart) => {
        //   return await this.updateQuantity(cart.product_id, cart.quantity);
        // });
        // await Promise.all(cartQuantityPromise);
        await this.clearCart(userID);
        return {
          isSuccess: true,
          message: "This transaction is paid",
          transactionID: transaction.transactionID,
        };
      }
      return data;
    } catch (err) {
      return {
        isSuccess: false,
        message: "Something Wrong.",
        error: err.message,
      };
    }
  }

  async paymongoCreateCheckout(userID, hostname) {
    const userCarts = await this.filteredCart(userID);
    const lineItems = userCarts.map((cart) => ({
      currency: "PHP",
      amount: cart.product_price * 100,
      name: cart.product_name,
      quantity: cart.quantity,
    }));
    try {
      const { data } = await instance.post(
        "https://api.paymongo.com/v1/checkout_sessions",
        {
          data: {
            attributes: {
              line_items: lineItems,
              payment_method_types: ["gcash", "paymaya"],
              send_email_receipt: false,
              show_description: true,
              show_line_items: true,
              description: "Pizza Vendo",
              success_url: `http://${hostname}:3000/payments/retrive-paymongo-checkout`,
            },
          },
        },
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Basic c2tfdGVzdF9GOEFkNWliY2N1YU5VUEYxRU1FOHB6NXY6",
          },
        }
      );
      return data;
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
