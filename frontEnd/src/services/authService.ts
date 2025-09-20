import apiClient from "./api";
import type { User } from "../types/chat";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  // Login user
  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/login", request);
      const { user, token, refreshToken } = response.data;

      // Store tokens
      localStorage.setItem("auth_token", token);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_data", JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  }

  // Register user
  async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post("/auth/register", request);
      const { user, token, refreshToken } = response.data;

      // Store tokens
      localStorage.setItem("auth_token", token);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_data", JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Registration failed");
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear stored data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_data");
    }
  }

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiClient.post("/auth/refresh", { refreshToken });
      const {
        user,
        token: newToken,
        refreshToken: newRefreshToken,
      } = response.data;

      // Update stored tokens
      localStorage.setItem("auth_token", newToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      localStorage.setItem("user_data", JSON.stringify(user));

      return response.data;
    } catch (error) {
      console.error("Token refresh error:", error);
      this.logout();
      throw new Error("Token refresh failed");
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get("/auth/me");
      const user = response.data;
      localStorage.setItem("user_data", JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("Get current user error:", error);
      throw new Error("Failed to get current user");
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.patch("/auth/profile", updates);
      const user = response.data;
      localStorage.setItem("user_data", JSON.stringify(user));
      return user;
    } catch (error) {
      console.error("Profile update error:", error);
      throw new Error("Failed to update profile");
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  // Get stored user data
  getStoredUser(): User | null {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }

  // Get stored token
  getStoredToken(): string | null {
    return localStorage.getItem("auth_token");
  }
}

export const authService = new AuthService();
