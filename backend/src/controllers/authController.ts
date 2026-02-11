import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth';

const generateToken = (id: string) => {
    try {
        return jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret_key_12345', {
            expiresIn: '30d',
        });
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }
};

export const registerUser = async (req: AuthRequest, res: Response) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'student',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register User Error:', error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const authUser = async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;

    // Hardcoded Admin Access
    if (email === 'admin@astu.edu.et' && password === 'admin123') {
        try {
            let adminUser = await User.findOne({ email: 'admin@astu.edu.et' });

            if (!adminUser) {
                adminUser = await User.create({
                    name: 'System Admin',
                    email: 'admin@astu.edu.et',
                    password: 'admin123', // This will be hashed by the pre-save hook
                    role: 'admin'
                });
            }

            return res.json({
                _id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
                avatar: adminUser.avatar,
                token: generateToken(adminUser._id.toString()),
            });
        } catch (error) {
            console.error('Admin Auth Error:', error);
            return res.status(500).json({ message: 'Internal server error during admin login' });
        }
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Auth User Error:', error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('GetMe Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
