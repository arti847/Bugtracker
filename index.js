//Importações
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

//Configuracoes
const docId = '1FYJ2HzuZme67BctmgGE1-Am-aG03BIkj9B5YMSRjrD0'
const worksheetIndex = 0
const sendGridKey = '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'

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
    response.render('home')
})
app.post('/', async (request, response) => {
    try {
        const doc = new GoogleSpreadsheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({
            name: request.body.name,
            email: request.body.email,
            issueType: request.body.issueType,
            howToReproduce: request.body.howToReproduce,
            expectedOupu: request.body.expectedOupu,
            receivedOuput: request.body.receivedOuput,
            userAgent: request.body.userAgent,
            userDate: request.body.userDate,
            source: request.query.source || 'direct'
        })

        // Se for critico
        if (request.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey)
            const msg = {
                to: 'pr85196@gmail.com',
                from: 'pr85196@gmail.com',
                subject: 'BUG Critico reportado',
                text: `O usuário ${request.body.name} reportou um problema`,
                html: `O usuário ${request.body.name} reportou um problema`            
            }
            await sgMail.send(msg);
        }

        response.render('sucesso')
    } catch (err) {
        response.send('Erro ao enviar formulário.')
        console.log(err)
    }
})


app.listen(3000, (err) => {
    if (err) {
        console.log('aconteceu um erro', err)
    } else {
        console.log('bugtracker rodando na porta http://localhost:3000')
    }
})