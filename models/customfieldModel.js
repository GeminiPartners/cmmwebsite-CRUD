const knex = require('./connection');
const Shared = require('../shared')

module.exports = {
    deleteFieldInstances: function(ids) {  
        console.log('ids for delete: ', ids)  
        const textResults = knex('textfieldinstance').whereIn('textfielditem_id', ids).del()
        const numberResults = knex('numberfieldinstance').whereIn('numberfielditem_id', ids).del()
        const dateResults = knex('datefieldinstance').whereIn('datefielditem_id', ids).del()
        
        return Promise
            .all([textResults, numberResults, dateResults])
            .then(results => {
                console.log('deleted fields: ',results)
                return results
            })
    },
    addTextFieldInstance: function(field) {    
        field.id = Shared.UUID();
        return knex('textfieldinstance').insert(field, 'id')
    },
    addNumberFieldInstance: function(field) {
        field.id = Shared.UUID();
        return knex('numberfieldinstance').insert(field, 'id')
    },
    addDateFieldInstance: function(field) {
        field.id = Shared.UUID();
        return knex('datefieldinstance').insert(field, 'id')
    }
}