const config = require(`${__config_dir}/app.config.json`);
const { debug } = config;
const mysql = new (require(`${__class_dir}/mariadb.class.js`))(config.db);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class _auth {
    async register(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const sql = {
                query: `INSERT INTO users (username, password) VALUES (?, ?)`,
                params: [userData.username, hashedPassword]
            };

            const result = await mysql.query(sql.query, sql.params);

            return {
                success: true,
                message: 'User registered successfully'
            };
        } catch (error) {
            if (debug) {
                console.error('register user Error: ', error);
            }
            return {
                success: false,
                message: 'An error occurred while registering user'
            };
        }
    }

    async login(credentials) {
        try {
            const sql = {
                query: `SELECT * FROM users WHERE username = ?`,
                params: [credentials.username]
            };

            const user = await mysql.query(sql.query, sql.params);

            if (user.length === 0) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }

            const passwordMatch = await bcrypt.compare(credentials.password, user[0].password);

            if (!passwordMatch) {
                return {
                    success: false,
                    message: 'Incorrect password'
                };
            }

            const token = jwt.sign({ userId: user[0].id }, config.jwtSecret, { expiresIn: '1h' });

            return {
                success: true,
                token
            };
        } catch (error) {
            if (debug) {
                console.error('login user Error: ', error);
            }
            return {
                success: false,
                message: 'An error occurred while logging in'
            };
        }
    }
}

module.exports = new _auth();
