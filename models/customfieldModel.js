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