import { createContext, useContext, useState, ReactNode } from "react";

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState(() => {
        const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        return storedUser ? JSON.parse(storedUser) : null;
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
