const knex = require('./connection');

module.exports = {
    deleteFieldInstances: function(id) {    
        const textResults = knex('textfieldinstance').where({'textfielditem_id' : id}).del()
        const numberResults = knex('numberfieldinstance').where({'numberfielditem_id' : id}).del()
        const dateResults = knex('datefieldinstance').where({'datefielditem_id' : id}).del()
         
        return Promise
            .all([textResults, numberResults, dateResults])
            .then(results => {
                console.log(results)
                return results
            })
    },
    addTextFieldInstance: function(field) {
        const addField = {
            textfield_id: field.textfield_id,
            textfieldvalue: field.textfieldvalue,
            textfielditem_id: field.textfielditem_id,
            created_at: new Date()
        }
        return knex('textfieldinstance').insert(addField, 'id')
    },
    addNumberFieldInstance: function(field) {
        const addField = {
            numberfield_id: field.numberfield_id,
            numberfieldvalue: field.numberfieldvalue,
            numberfielditem_id: field.numberfielditem_id,
            created_at: new Date()
        }
        return knex('numberfieldinstance').insert(addField, 'id')
    },
    addDateFieldInstance: function(field) {
        const addField = {
            datefield_id: field.datefield_id,
            datefieldvalue: field.datefieldvalue,
            datefielditem_id: field.datefielditem_id,
            created_at: new Date()
        }
        return knex('datefieldinstance').insert(addField, 'id')
    }
}