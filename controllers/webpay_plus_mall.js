const WebpayPlus = require("transbank-sdk").WebpayPlus;
const TransactionDetail = require("transbank-sdk").TransactionDetail;
const IntegrationCommerceCodes =
  require("transbank-sdk").IntegrationCommerceCodes;
const asyncHandler = require("../utils/async_handler");

exports.create = asyncHandler(async function (request, response, next) {
  let childCommerceCode;
  const amount = request.body.total;

  var commerce_code = request.body.commerce_code;

  const buy_order = request.body.buy_order;

  let buyOrderMall = "O-" + Math.floor(Math.random() * 10000) + 1;
  let sessionId = "S-" + Math.floor(Math.random() * 10000) + 1;

  //La variable child deberia llegar por query,body,params
  //Averiguar esto
  if (process.env.WPPM_CC && process.env.WPPM_KEY) {
    childCommerceCode = process.env.WPPM_C_CC;
  } else {
    childCommerceCode = IntegrationCommerceCodes.WEBPAY_PLUS_MALL_CHILD1;
  }
  let details = [new TransactionDetail(amount, childCommerceCode, buy_order)];
  let returnUrl = "https://elhne8-3001.csb.app/commit";
  // request.protocol + "://" + request.get("host") + "/webpay_plus_mall/commit";

  const createResponse = await new WebpayPlus.MallTransaction().create(
    buyOrderMall,
    sessionId,
    returnUrl,
    details
  );

  let token = createResponse.token;
  let url = createResponse.url;

  let viewData = {
    buyOrderMall,
    sessionId,
    returnUrl,
    details,
    token,
    url,
  };
  console.log("hola2", viewData);
  response.status(200).json(viewData);
});

exports.commit = asyncHandler(async function (request, response, next) {
  //Flujos:
  //1. Flujo normal (OK): solo llega token_ws
  //2. Timeout (más de 10 minutos en el formulario de Transbank): llegan TBK_ID_SESION y TBK_ORDEN_COMPRA
  //3. Pago abortado (con botón anular compra en el formulario de Webpay): llegan TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
  //4. Caso atipico: llega todos token_ws, TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA

  let params = request.body;

  console.log("params", params);

  let token = params.token_ws;
  let tbkToken = params.TBK_TOKEN;
  let tbkOrdenCompra = params.TBK_ORDEN_COMPRA;
  let tbkIdSesion = params.TBK_ID_SESION;

  let step = null;
  let stepDescription = null;
  let viewData = {
    token,
    tbkToken,
    tbkOrdenCompra,
    tbkIdSesion,
  };

  if (token && !tbkToken) {
    //Flujo 1
    const commitResponse = await new WebpayPlus.MallTransaction().commit(token);
    viewData = {
      token,
      commitResponse,
    };
    step = "Confirmar Transacción Mall diferida";
    stepDescription =
      "En este paso tenemos que confirmar la transacción con el objetivo de avisar a " +
      "Transbank que hemos recibido la transacción ha sido recibida exitosamente. En caso de que " +
      "no se confirme la transacción, ésta será reversada.";

    console.log(commitResponse);

    //     const transaccion = {
    //   OrdenComercio:  commitResponse.details[0].buy_order,
    //   OrdenGenerado: commitResponse.buy_order,
    //   TotalComprado: commitResponse.details[0].amount,
    //   ItemsComprados: 'Producto1, Producto2',
    //   FechaTransaccion: commitResponse.transaction_date,
    //   CodigoRespuestaComercio: commitResponse.details[0].response_code,
    //   CodigoComercio: commitResponse.details[0].commerce_code,
    //   TipoCompra:  commitResponse.details[0].payment_type_code,
    //   NumeroCuotas: commitResponse.details[0].installments_number,
    //   FinalNumeroTarjeta: commitResponse.card_detail.card_number,
    //   NombreUsuario: 'Usuario Ejemplo',
    //   TransaccionAceptada:commitResponse.details[0].response_code === 0? true:false ,
    //   ComentarioError: ''
    // };
    // insertarTransaccion(transaccion, function(err, result) {
    //   if (err) {
    //     console.error('Error al insertar transaccion:', err);
    //     return;
    //   }
    //   console.log('Transaccion insertada con éxito. ID:', result.insertId);
    // });

    response.status(200).json(viewData);
    return;
  } else if (!token && !tbkToken) {
    //Flujo 2
    step = "El pago fue anulado por tiempo de espera.";
    stepDescription =
      "En este paso luego de anulación por tiempo de espera (+10 minutos) no es necesario realizar la confirmación ";
  } else if (!token && tbkToken) {
    //Flujo 3
    step = "El pago fue anulado por el usuario.";
    stepDescription =
      "En este paso luego de abandonar el formulario no es necesario realizar la confirmación ";
  } else if (token && tbkToken) {
    //Flujo 4
    step = "El pago es inválido.";
    stepDescription =
      "En este paso luego de abandonar el formulario no es necesario realizar la confirmación ";
  }
  response.json(viewData);
});

exports.status = asyncHandler(async function (request, response, next) {
  let token = request.body.token;

  const statusResponse = await new WebpayPlus.MallTransaction().status(token);

  let viewData = {
    token,
    statusResponse,
  };

  response.status(200).json(viewData);
});

exports.refund = asyncHandler(async function (request, response, next) {
  let { token, amount } = request.body;
  let buyOrder = request.body.buy_order;
  let commerceCode = IntegrationCommerceCodes.WEBPAY_PLUS_MALL_CHILD1;

  const refundResponse = await new WebpayPlus.MallTransaction().refund(
    token,
    buyOrder,
    commerceCode,
    amount
  );

  let viewData = {
    token,
    amount,
    refundResponse,
  };

  response.status(200).json(viewData);
});
