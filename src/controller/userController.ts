import { Request, Response } from 'express';
import * as userService from '../service/userService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

// Add a new user
export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Get user by email
export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params; // Get email from request parameters
    try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Update user by email
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params; // Get email from request parameters
    try {
        const updatedUser = await userService.updateUserByEmail(email, req.body);
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Delete user by email
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.params; // Get email from request parameters
    try {
        const deletedUser = await userService.deleteUserByEmail(email);
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};


// controllers/authController.ts


export const register = async (req: Request, res: Response) => {
    const { org_id,username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ org_id,username, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
    return ;
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
         res.status(401).json({ message: 'Invalid credentials' });
         return;
    }
    const token = jwt.sign({ id: user.org_id, role: user.role }, "petdryfuygiuhi" as string, { expiresIn: '1h' });
    res.json({ token ,org_id:user.org_id });
    return; 
};
export const salogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists and if password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
         res.status(401).json({ message: 'Invalid credentials' });
         return;
    }

    // Check if the user's role is 'sa'
    if (user.role !== 'sa') {
        res.status(403).json({ message: 'Access denied' });
        return;
    }

    // Generate token if the role is 'sa'
    const token = jwt.sign(
        { id: user.org_id, role: user.role },
        "petdryfuygiuhi" as string,
        { expiresIn: '1h' }
    );
    
    res.json({ token});
};



export const validateToken = (req: Request, res: Response): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
         res.status(401).json({ message: 'Access token required' });
         return;
    }

    jwt.verify(token, "petdryfuygiuhi" as string, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Return the user information or any relevant data you need
        res.status(200).json({ user: decoded });
    });
};

// Get users by org_id
export const getUsersByOrgId = async (req: Request, res: Response): Promise<void> => {
    const orgId = parseInt(req.params.orgId, 10); // Get org_id from the request parameters

    try {
        const users = await userService.getUsersByOrgId(orgId);
        if (users.length === 0) {
            res.status(404).json({ message: 'No users found for this organization' });
            return;
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};
