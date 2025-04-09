'use client';
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance, { setMemoryAccessToken, getMemoryAccessToken } from '@/lib/axiosInstance';
import { usePathname } from 'next/navigation'
import { ToastAction } from "@/components/ui/toast";
import { toast, useToast } from "@/components/ui/use-toast";

interface User {
  userName: string, password: string, role?: string
}
export interface UserResponse {
  _id:string;
    userName:string;
    password: string;
    name:string;
    Brithday:Date;
    createdAt: Date,
    role:string,
    refreshToken?: string;
   

}

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean; 
  login: (email: string, password: string) => Promise<void>;
  register: (dataSignUP :User) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(getMemoryAccessToken());
  const [loading, setLoading] = useState(true); 
  const [actionLoading, setActionLoading] = useState(false); 
  const router = useRouter();
  const pathname = usePathname()

  const performLogout = useCallback(async (shouldRedirect = true) => {
    setActionLoading(true); 
    try {
      
    } catch (e) { console.error("Logout API call failed:", e); }
    finally {
        setMemoryAccessToken(null);
        setAccessTokenState(null);
        setUser(null);
        if (shouldRedirect && pathname !== '/Login') {
            router.push('/Login');
        }
        setActionLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); 


  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      console.log("refresh token")
      try {
        console.log("Attempting initial token refresh...");
        const { data } = await axiosInstance.post('/api/authorization');
        const newAccessToken = data.accessToken;
        console.log(data,"data refresh token ");

        setMemoryAccessToken(newAccessToken);
        setAccessTokenState(newAccessToken);
      
       setUser(data.user);

      
     

      } catch (error: any) {
        console.log("Initial refresh failed, user likely not logged in:", error.response?.data || error.message);
        await performLogout(false); 
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performLogout]); 


  // ---  Login ---
  const login = async (userName: string, password: string) => {
    setActionLoading(true);
    try {
      const { data } = await axiosInstance.post('/api/Login', { userName, password });
      setMemoryAccessToken(data.accessToken);
      setAccessTokenState(data.accessToken);
    
      if (data?.success == false) {
        toast({
          variant: "custum",
          title: "Uh oh! Something went wrong.❌",
          description: (
            <p className="mt-2  rounded-md text-foreground/75 whitespace-pre-line p-4 w-full">
              {data.message}
            </p>
          ),
          action: <ToastAction altText="Goto schedule to undo">Yes</ToastAction>,
        });
      } else {
  
        toast({
          variant: "default",
          title: "Congratulations✅.",
          description: "Login Is Done",
        });
        if (data?.refreshToken) {
          router.push('/dashboard');      }
      }
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setActionLoading(false);
    }
  };

  // ---  Register ---
  const register = async (dataSignUP :User) => {
    setActionLoading(true);
    try {
      const { data } = await axiosInstance.post('/api/SignUp', dataSignUP);
      console.log(data ,"data")
      setMemoryAccessToken(data.accessToken);
      setAccessTokenState(data.accessToken);
      
    if (data?.success == false) {
      toast({
        variant: "custum",
        title: "Uh oh! Something went wrong.❌",
        description: (
          <p className="mt-2  rounded-md text-foreground/75 whitespace-pre-line p-4 w-full">
            {data.message}
          </p>
        ),
        action: <ToastAction altText="Goto schedule to undo">Yes</ToastAction>,
      });
    } else {

      toast({
        variant: "default",
        title: "Congratulations✅.",
        description: "Sign Up Is Done",
      });
      if (data?.refreshToken) {
        router.push('/dashboard');      }
    }
      
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  // ---  Logout ---
  const logout = async () => {
    setActionLoading(true); 
    console.log("logout")
    try {
      await axiosInstance.post('/api/logout'); 
      router.push('/Login'); 
    } catch (error) {
      console.error("Logout API call failed, proceeding with client logout:", error);
    } finally {
      await performLogout(true); 
    }
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };


  const contextValue: AuthContextType = {
    user,
    loading: loading || actionLoading,
    login,
    register,
    logout,
    isAuthenticated: !loading && !!user && !!accessToken, 
    hasRole,
    accessToken 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      { children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};