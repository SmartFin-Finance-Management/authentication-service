import User, { IUser } from '../models/userModel';

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
    const user = new User(userData);
    return await user.save();
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email });
};

// Update user by email
export const updateUserByEmail = async (email: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    return await User.findOneAndUpdate({ email }, updateData, { new: true });
};

// Delete user by email
export const deleteUserByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOneAndDelete({ email });
};

export const getAllUsers = async (): Promise<IUser[]> => {
    return await User.find();
};

export const getUsersByOrgId=async(orgId:number)=>{
    return await User.find({org_id:orgId});
}
