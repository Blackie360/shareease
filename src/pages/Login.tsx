import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: error.message,
        });
        throw error;
      }
      
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-4 lg:p-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center">
        {/* Image container - hidden on very small screens */}
        <div className="hidden sm:block lg:flex-1 w-full max-w-xl lg:max-w-none mb-8 lg:mb-0">
          <img
            src="/lovable-uploads/d250d3cc-030e-410c-a4a1-f5f2bd6eea8a.png"
            alt="Developer coding"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>

        {/* Form container */}
        <div className="w-full lg:flex-1 max-w-md">
          <Card className="backdrop-blur-sm bg-white/10 border-none shadow-xl w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl md:text-3xl font-bold text-white text-center">
                Sign in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                <div className="flex flex-col space-y-4 text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-blue-300 hover:text-blue-200"
                    onClick={() => navigate("/register")}
                  >
                    Don't have an account? Sign up
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}