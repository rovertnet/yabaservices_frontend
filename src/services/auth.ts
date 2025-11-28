import api from './api';

export interface RegisterData {
  name: string;
  email: string;
  password?: string;
  role: 'CLIENT' | 'PROVIDER';
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

const authService = {
  register: (data: RegisterData) => {
    return api.post('/auth/register', data);
  },

  verifyEmail: (data: VerifyEmailData) => {
    return api.post('/auth/verify-email', data);
  },

  resendVerificationCode: (email: string) => {
    return api.post('/auth/resend-verification', { email });
  },

  login: (data: LoginData) => {
    return api.post('/auth/login', data);
  },

  forgotPassword: (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: (data: ResetPasswordData) => {
    return api.post('/auth/reset-password', data);
  },
};

export default authService;
