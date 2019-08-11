const knex = require('./connection');

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
    addTextFieldInstance: function(fields) {        
        
        return knex('textfieldinstance').insert(fields, 'id')
    },
    addNumberFieldInstance: function(fields) {

        return knex('numberfieldinstance').insert(fields, 'id')
    },
    addDateFieldInstance: function(fields) {
 
        return knex('datefieldinstance').insert(fields, 'id')
    }
}