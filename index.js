const axios = require("axios");
const qs = require("qs");

class FedexService {
  fetchOrderID(nrIdentificao, nrDocumento) {
    return new Promise((resolve, reject) => {
      const data = {
        remDest: "D",
        nrIdentificacao: nrIdentificao,
        idFilial: "",
        tpDocumento: "NF",
        nrDocumento: nrDocumento,
      };

      const BASE_URL_ID =
        "https://radar.tntbrasil.com.br/radar/public/localizacaoSimplificada/search";

      axios({
        method: "post",
        url: BASE_URL_ID,
        data: qs.stringify(data),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
        .then((response) => {
          console.log(response);
          if (response.data.aaData.length > 0) {
            const orderID = response.data.aaData[0];
            resolve(orderID.id)
          } else {
            reject('Credenciais invalidas')
          }
        })
        .catch((error) => reject(error));
    });
  }

  fetchDocumentID(orderID) {
    return new Promise((resolve, reject) => {
      axios
      .get(
        `https://radar.tntbrasil.com.br/radar/public/localizacaoSimplificadaDetail/${orderID}`
      )
      .then((response) => {
        const html = response.data;
        let index = html.indexOf("idDocumento");
        let idDocumento = [];
        while (html[index] != ",") {
          idDocumento.push(html[index]);
          index++;
        }
        idDocumento = idDocumento.join("");
        let initialPosition = idDocumento.indexOf(":");
        let finalPosition = idDocumento.length;
        idDocumento = idDocumento.substring(initialPosition + 2, finalPosition);
        resolve(idDocumento)
      })
      .catch((error) => {
        reject(error)
      });
    })
  }

  actualStatusOrder(id) {
    return new Promise((resolve, reject) => {
      axios
      .get(
        `https://radar.tntbrasil.com.br/radar/service/tracking/findLinhaTempoEvento?idDoctoServico=${id}`
      )
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
        })
    })
  }
}

module.exports = FedexService;
