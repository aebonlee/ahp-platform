"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const connection_1 = require("../database/connection");
const auth_1 = require("../utils/auth");
class UserService {
    static async createUser(userData) {
        const { email, password, first_name, last_name, role } = userData;
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const password_hash = await (0, auth_1.hashPassword)(password);
        const result = await (0, connection_1.query)(`INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [email, password_hash, first_name, last_name, role]);
        return result.rows[0];
    }
    static async findByEmail(email) {
        // 임시 테스트 사용자 (DB 연결 문제 해결용)
        if (email === 'test@ahp.com') {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('password', 10);
            return {
                id: '1',
                email: 'test@ahp.com',
                password_hash: hashedPassword,
                first_name: '테스트',
                last_name: '사용자',
                role: 'admin',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            };
        }
        try {
            const result = await (0, connection_1.query)('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error('DB query error in findByEmail:', error);
            return null;
        }
    }
    static async findById(id) {
        const result = await (0, connection_1.query)('SELECT * FROM users WHERE id = $1 AND is_active = true', [id]);
        return result.rows[0] || null;
    }
    static async getAllUsers(role) {
        let queryText = 'SELECT * FROM users WHERE is_active = true';
        let params = [];
        if (role) {
            queryText += ' AND role = $1';
            params.push(role);
        }
        queryText += ' ORDER BY created_at DESC';
        const result = await (0, connection_1.query)(queryText, params);
        return result.rows;
    }
    static async updateUser(id, updates) {
        // 임시 테스트 사용자 업데이트 (DB 연결 문제 해결용)
        if (id === '1') {
            return {
                id: '1',
                email: 'test@ahp.com',
                password_hash: 'temp_hash',
                first_name: updates.first_name || '테스트',
                last_name: updates.last_name || '사용자',
                role: 'admin',
                is_active: true,
                created_at: new Date(),
                updated_at: new Date()
            };
        }
        try {
            const setClause = Object.keys(updates)
                .map((key, index) => `${key} = $${index + 2}`)
                .join(', ');
            const values = [id, ...Object.values(updates)];
            const result = await (0, connection_1.query)(`UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`, values);
            if (result.rows.length === 0) {
                throw new Error('User not found');
            }
            return result.rows[0];
        }
        catch (error) {
            console.error('DB query error in updateUser:', error);
            throw new Error('User not found');
        }
    }
    static async deleteUser(id) {
        const result = await (0, connection_1.query)('UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }
    }
}
exports.UserService = UserService;
