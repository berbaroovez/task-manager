import React, { useContext, useState, useEffect } from "react";
import { supabase } from "./initSupabase";
import Router from "next/router";
const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session();

    setUser(session?.user ?? null);
    setLoading(false);

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("event");
        const tempUser = session?.user;
        if (event === "SIGNED_IN") {
          console.log("SIGNED_IN");
          try {
            setLoading(true);
            // const user = supabase.auth.user()
            const updates = {
              id: tempUser.id,
              username: tempUser.user_metadata?.full_name,
              email: tempUser.email,
            };
            let { data, error } = await supabase.from("profiles").upsert(
              updates // Don't return the value after inserting
            );
            // console.log("AUTHJ DATa", data);
            if (error) {
              console.log(error);
              throw error;
            }
          } catch (error) {
            supabase.auth.signOut();
            alert(error.message);
          } finally {
            console.log("finally");
            setLoading(false);
          }
        }
        setUser(tempUser ?? null);
        Router.push("/dashboard");
        setLoading(false);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    const test = await supabase.auth.signIn({
      provider: "twitch",
    });
    console.log("TEST", test);
  };

  // Will be passed down to Signup, Login and Dashboard components
  const value = {
    signIn,
    signOut: () => supabase.auth.signOut(),
    user,
    signingIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
