import axios from "axios";

// GET PAYMOB ACCESS TOKEN
const authenticate = async () => {
  try {
    const url = `${process.env.PAYMOB_URL}/auth/tokens`;
    const headers = {
      "Content-Type": "application/json",
    };
    const data = {
      api_key: process.env.PAYMOB_API_KEY,
    };

    const response = await axios.post(url, data, { headers });

    const accessToken = response.data.token;

    return accessToken;
  } catch (error) {
    console.error("Error paymob authenticating:", error.response.data);
  }
};

// ORDER REGISTRATION
const orderRegistration = async (order_cart, amount_cents, accessToken) => {
  try {
    const orderUrl = `${process.env.PAYMOB_URL}/ecommerce/orders`;
    const headers = {
      "Content-Type": "application/json",
    };
    const orderData = {
      auth_token: accessToken,
      delivery_needed: "false",
      amount_cents,
      currency: "EGP",
      items: order_cart,
    };
    const order = await axios.post(orderUrl, orderData, { headers });
    console.log("order", order.data.id);

    return order.data.id;
  } catch (error) {
    console.error("Error paymob orderRegister", error.response.data);
  }
};

// GET PAYMENT KEY
const getPaymentToken = async (
  accessToken,
  orderId,
  billing_data,
  amount_cents,
) => {
  try {
    const paymentKeyUrl = `${process.env.PAYMOB_URL}/acceptance/payment_keys`;

    const headers = {
      "Content-Type": "application/json",
    };

    const paymentKeyData = {
      auth_token: accessToken,
      amount_cents,
      expiration: 3600,
      order_id: orderId,
      billing_data,
      currency: "EGP",
      integration_id: process.env.PAYMOB_INTEGRATION_ID,
    };

    const paymentKey = await axios.post(paymentKeyUrl, paymentKeyData, headers);

    return paymentKey.data.token;
  } catch (error) {
    console.error("Error paymob getPaymentToken:", error.data);
  }
};

// HANDLE PAYMENT CREATION
export const createPayment = async (req, res) => {
  try {
    const { order_cart, billing_data, amount_cents } = req.body;

    // AUTHENTICATE WITH PAYMOB TO GET ACCESS TOKEN - STEP 1
    const accessToken = await authenticate();

    // ORDER REGISTRATION TO GET ORDER ID - STEP 2
    const orderId = await orderRegistration(
      order_cart,
      amount_cents,
      accessToken,
    );

    // GET PAYMENT TOKEN - STEP 3
    const token = await getPaymentToken(
      accessToken,
      orderId,
      billing_data,
      amount_cents,
    );

    // CREATE PAYMENT LINK
    const link = `https://accept.paymob.com/api/acceptance/iframes/819896?payment_token=${token}`;

    // RESPOND WITH PAYMENT LINK
    res.status(200).json(link);
  } catch (error) {
    console.error("Error creating payment:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
