const config = require(`${__config_dir}/app.config.json`);
const { debug } = config;
const mysql = new (require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi = require('joi');

class _task {
    // ...

    // Add data with userId
    add(data, userId) {
        // Validate data
        const schema = Joi.object({
            items: Joi.string().required()
        }).options({
            abortEarly: false
        });

        const validation = schema.validate(data);

        if (validation.error) {
            const errorDetails = validation.error.details.map(detail => detail.message);
            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            };
        }

        // Insert data to database with userId
        const sql = {
            query: `INSERT INTO task (items, user_id) VALUES (?, ?)`,
            params: [data.items, userId]
        };

        return mysql.query(sql.query, sql.params)
            .then(result => {
                return {
                    status: true,
                    data: result
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('add task Error: ', error);
                }
                return {
                    status: false,
                    error
                };
            });
    }

    // Get all tasks for a specific user
    getAllByUserId(userId) {
        const sql = {
            query: `SELECT * FROM task WHERE user_id = ?`,
            params: [userId]
        };

        return mysql.query(sql.query, sql.params)
            .then(result => {
                return {
                    status: true,
                    data: result
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('get all tasks Error: ', error);
                }
                return {
                    status: false,
                    error
                };
            });
    }

    // ...
}

module.exports = new _task();
