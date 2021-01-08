const app = require('express')()
const bodyParser = require('body-parser')
const FedexService = require('./index')

const service = new FedexService()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/fetchOrderID', async (req,res,next) => {
    const {nrDocumento, nrIdentificacao} = req.body
    try {
        let orderID = await service.fetchOrderID(nrIdentificacao,nrDocumento)
        res.json({
            'orderID':orderID
        })
        next()
    } catch (error) {
        res.json(error)
        next()
    }
})

app.get('/fetchDocumentID', async (req,res,next) => {
    const {orderID} = req.query
    try {
        let documentID = await service.fetchDocumentID(orderID)
        res.json({
            'documentID':documentID
        }) 
    } catch (error) {
        res.json(error)
    }
})

app.get('/fetchStatusOrder', async (req,res,next) => {
    const {documentID} = req.query
    try {
        let actualStatus = await service.actualStatusOrder(documentID)
        res.json({
            'status':actualStatus
        })
    } catch ( error ) {
        res.json(error)
    }
})


app.get('/', (req,res,next) => {
    res.send({
        "good luck":"have fun"
    })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});