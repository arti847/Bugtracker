const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async() => {
    const doc = new GoogleSpreadsheet('1FYJ2HzuZme67BctmgGE1-Am-aG03BIkj9B5YMSRjrD0')
    await promisify(doc.useServiceAccountAuth)(credentials)    
    console.log('planilha aberta')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheet[0]
    await promisify(worksheet.addRow)
    ({nome: 'Paulo', email: 'test',issueType: 'test',
    howToReproduce: 'test', expectedOupu: 'test', receivedOuput: 'test'})
}
addRowToSheet()

/*
const doc = new GoogleSpreadsheet('1FYJ2HzuZme67BctmgGE1-Am-aG03BIkj9B5YMSRjrD0')
doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('nao foi possivel abrir a planilha')
    } else {
        console.log('planilha aberta')
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({
                name: 'Paulo', email: 'test', issueType: 'test',
                howToReproduce: 'test', expectedOupu: 'test', receivedOuput: 'test'
            },
                err => {
                    console.log('Linha inserida')
                })
        })
    }
})
*/
