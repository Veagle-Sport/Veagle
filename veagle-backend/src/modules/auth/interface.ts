import { CreateUserDto } from '../user/dto/create-user.dto';
import { User, UserDocument } from '../user/schema/schema';
export interface Auth {
    signUp: ( CreateUserDto:CreateUserDto) => any;
    signIn: (CreateUserDto:CreateUserDto) => any;
 //     isAuthenticated: () => Promise<boolean>;
//    resetPassword: (email: string) => Promise<void>;
//     verifyEmail: (email: string) => Promise<void>;
//     updateProfile: (profileData: object) => Promise<void>;
//     getUserProfile: () => Promise<object>;
//     deleteAccount: () => Promise<void>;
//     changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
//     sendVerificationEmail: () => Promise<void>;
} 