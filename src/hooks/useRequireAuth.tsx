
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export function useRequireAuth(redirectTo = "/login") {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Akses ditolak",
        description: "Silakan login terlebih dahulu",
        variant: "destructive",
      });
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo]);

  return { user, loading };
}

export function useRequireAdmin(redirectTo = "/") {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast({
          title: "Akses ditolak",
          description: "Silakan login terlebih dahulu",
          variant: "destructive",
        });
        navigate("/login");
      } else if (user.role !== "admin") {
        toast({
          title: "Akses ditolak",
          description: "Anda tidak memiliki hak akses admin",
          variant: "destructive",
        });
        navigate(redirectTo);
      }
    }
  }, [user, loading, navigate, redirectTo]);

  return { user, loading, isAdmin: user?.role === "admin" };
}
