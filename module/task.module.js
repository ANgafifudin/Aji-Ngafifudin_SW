const config = require(`${__config_dir}/app.config.json`);
const { debug } = config;
const mysql = new (require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi = require('joi');

class _task {
    add(data, userId) {
        const schema = Joi.object({
            items: Joi.string().required(),
            userId: Joi.number().required() // Add validation for userId
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

        const sql = {
            query: `INSERT INTO task (items, user_id) VALUES (?, ?)`,
            params: [data.items, data.userId] // Use data.userId here
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

    getById(taskId, userId) {
        const sql = {
            query: `SELECT * FROM task WHERE id = ? AND user_id = ?`,
            params: [taskId, userId]
        };

        return mysql.query(sql.query, sql.params)
            .then(result => {
                if (result.length === 0) {
                    return null;
                }
                return {
                    status: true,
                    data: result[0]
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('get task by ID Error: ', error);
                }
                return {
                    status: false,
                    error
                };
            });
    }

    update(data, userId) {
        const sql = {
            query: `UPDATE task SET items = ? WHERE id = ? AND user_id = ?`,
            params: [data.items, data.id, userId]
        };

        return mysql.query(sql.query, sql.params)
            .then(result => {
                if (result.affectedRows === 0) {
                    return {
                        success: false,
                        message: 'Task not found'
                    };
                }
                return {
                    success: true,
                    message: 'Task updated successfully'
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('update task Error: ', error);
                }
                return {
                    success: false,
                    message: 'An error occurred while updating the task'
                };
            });
    }

    remove(taskId, userId) {
        const sql = {
            query: `DELETE FROM task WHERE id = ? AND user_id = ?`,
            params: [taskId, userId]
        };

        return mysql.query(sql.query, sql.params)
            .then(result => {
                if (result.affectedRows === 0) {
                    return {
                        success: false,
                        message: 'Task not found'
                    };
                }
                return {
                    success: true,
                    message: 'Task deleted successfully'
                };
            })
            .catch(error => {
                if (debug) {
                    console.error('delete task Error: ', error);
                }
                return {
                    success: false,
                    message: 'An error occurred while deleting the task'
                };
            });
    }
}

module.exports = new _task();
