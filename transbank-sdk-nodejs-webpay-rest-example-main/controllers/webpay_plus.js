const WebpayPlus = require("transbank-sdk").WebpayPlus;
const asyncHandler = require("../utils/async_handler");

exports.create = asyncHandler(async function (request, response, next) {
  let buyOrder = "O-" + Math.floor(Math.random() * 10000) + 1;
  let sessionId = "S-" + Math.floor(Math.random() * 10000) + 1;
  const { amount } = request.body;
  let returnUrl = "http://localhost:5173/exito";

  const createResponse = await new WebpayPlus.Transaction().create(
    buyOrder,
    sessionId,
    amount,
    returnUrl
  );

  const token = createResponse.token;
  const url = createResponse.url;

  response.json({ token, url });
});

exports.commit = asyncHandler(async function (request, response, next) {
  console.log(
    "================================================================================"
  );
  console.log("Request Method:", request.method);
  console.log("Request Body:", request.body);
  console.log("Request Query:", request.query);
  console.log(
    "================================================================================"
  );

  let params = request.body;
  let token = params.token_ws;
  let tbkToken = params.TBK_TOKEN;
  let tbkOrdenCompra = params.TBK_ORDEN_COMPRA;
  let tbkIdSesion = params.TBK_ID_SESION;

  console.log("Received parameters:", {
    token,
    tbkToken,
    tbkOrdenCompra,
    tbkIdSesion,
  });

  let step = null;
  let stepDescription = null;
  let viewData = {
    token,
    tbkToken,
    tbkOrdenCompra,
    tbkIdSesion,
  };

  if (token && !tbkToken) {
    // Flujo 1: Confirmar transacción
    try {
      const commitResponse = await new WebpayPlus.Transaction().commit(token);
      viewData = {
        token,
        commitResponse,
      };
      step = "Confirmar Transacción";
      stepDescription =
        "En este paso tenemos que confirmar la transacción con el objetivo de avisar a " +
        "Transbank que hemos recibido la transacción ha sido recibida exitosamente. En caso de que " +
        "no se confirme la transacción, ésta será reversada.";

      // Aquí podemos devolver una respuesta JSON en lugar de renderizar una vista
      response.json({
        step,
        stepDescription,
        viewData,
        status: "success",
      });
    } catch (error) {
      console.error("Error confirming transaction:", error);
      response
        .status(500)
        .json({ error: "Error confirming transaction", status: "failure" });
    }
    return;
  } else if (!token && !tbkToken) {
    // Flujo 2: Timeout
    step = "El pago fue anulado por tiempo de espera.";
    stepDescription =
      "En este paso luego de anulación por tiempo de espera (+10 minutos) no es necesario realizar la confirmación ";
  } else if (!token && tbkToken) {
    // Flujo 3: Pago abortado por el usuario
    step = "El pago fue anulado por el usuario.";
    stepDescription =
      "En este paso luego de abandonar el formulario no es necesario realizar la confirmación ";
  } else if (token && tbkToken) {
    // Flujo 4: Caso atípico
    step = "El pago es inválido.";
    stepDescription =
      "En este paso luego de abandonar el formulario no es necesario realizar la confirmación ";
  }

  // Enviar una respuesta JSON en caso de error o flujo diferente
  response.status(400).json({
    step,
    stepDescription,
    viewData,
    status: "failure",
  });
});

exports.status = asyncHandler(async function (request, response, next) {
  let token = request.body.token;

  const statusResponse = await new WebpayPlus.Transaction().status(token);

  let viewData = {
    token,
    statusResponse,
  };

  response.render("webpay_plus/status", {
    step: "Estado de Transacción",
    stepDescription:
      "Puedes solicitar el estado de una transacción hasta 7 días despues de que haya sido" +
      " realizada. No hay limite de solicitudes de este tipo, sin embargo, una vez pasados los " +
      "7 días ya no podrás revisar su estado.",
    viewData,
  });
});

exports.refund = asyncHandler(async function (request, response, next) {
  let { token, amount } = request.body;

  const refundResponse = await new WebpayPlus.Transaction().refund(
    token,
    amount
  );

  let viewData = {
    token,
    amount,
    refundResponse,
  };

  response.render("webpay_plus/refund", {
    step: "Reembolso de Transacción",
    stepDescription:
      "Podrás pedir el reembolso del dinero al tarjeta habiente, dependiendo del monto " +
      "y el tiempo transacurrido será una Reversa, Anulación o Anulación parcial.",
    viewData,
  });
});
