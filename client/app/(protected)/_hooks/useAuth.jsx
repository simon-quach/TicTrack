import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const allowedRoles = ["supervisor", "trackee"];

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (userRole && allowedRoles.includes(userRole)) {
      setIsAuthenticated(true);
    } else {
      redirect("/login");
    }

    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
};

export default useAuth;
