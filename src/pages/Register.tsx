import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock, Phone, AtSign } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        throw new Error('Username already taken');
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
            full_name: fullName,
            phone_number: phoneNumber,
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "You can now sign in with your credentials.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
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
                Create your account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-white">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
                        placeholder="Choose a unique username"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="fullName" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-white">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Choose a strong password"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-sm text-blue-300 hover:text-blue-200"
                    onClick={() => navigate("/login")}
                  >
                    Already have an account? Sign in
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