import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";

type AuthMode = "password" | "otp";
type OtpChannel = "email" | "phone";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [otpChannel, setOtpChannel] = useState<OtpChannel>("phone");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const canSubmitOtpCode = useMemo(() => otpCode.trim().length >= 6, [otpCode]);

  const resetOtpState = () => {
    setOtpSent(false);
    setOtpCode("");
  };

  const handlePasswordAuth = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;

    toast({
      title: "Account created",
      description: "Check your email to verify your account before signing in.",
    });
  };

  const sendOtp = async () => {
    const authMeta = !isLogin ? { full_name: fullName } : undefined;

    if (otpChannel === "email") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: !isLogin,
          emailRedirectTo: window.location.origin,
          data: authMeta,
        },
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "OTP sent",
        description: "Check your inbox for the 6-digit code.",
      });
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        shouldCreateUser: !isLogin,
        data: authMeta,
      },
    });

    if (error) throw error;

    setOtpSent(true);
    toast({
      title: "OTP sent",
      description: "Check your SMS for the 6-digit code.",
    });
  };

  const verifyOtp = async () => {
    const payload =
      otpChannel === "email"
        ? { email, token: otpCode, type: "email" as const }
        : { phone, token: otpCode, type: "sms" as const };

    const { error } = await supabase.auth.verifyOtp(payload);
    if (error) throw error;

    toast({
      title: "Verified",
      description: "You're logged in successfully.",
    });
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === "password") {
        await handlePasswordAuth();
      } else if (otpSent) {
        await verifyOtp();
      } else {
        await sendOtp();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  const showEmailInput = authMode === "password" || otpChannel === "email";
  const showPhoneInput = authMode === "otp" && otpChannel === "phone";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">CoFound</h1>
          <p className="mt-1 text-sm text-muted-foreground">From idea to company</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-center text-lg font-semibold">{isLogin ? "Welcome back" : "Create account"}</h2>

            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
              <Button
                type="button"
                variant={authMode === "password" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setAuthMode("password");
                  resetOtpState();
                }}
              >
                Password
              </Button>
              <Button
                type="button"
                variant={authMode === "otp" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setAuthMode("otp");
                  resetOtpState();
                }}
              >
                OTP
              </Button>
            </div>

            {authMode === "otp" && (
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
                <Button
                  type="button"
                  size="sm"
                  variant={otpChannel === "phone" ? "default" : "ghost"}
                  onClick={() => {
                    setOtpChannel("phone");
                    resetOtpState();
                  }}
                >
                  Phone OTP
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={otpChannel === "email" ? "default" : "ghost"}
                  onClick={() => {
                    setOtpChannel("email");
                    resetOtpState();
                  }}
                >
                  Email OTP
                </Button>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            {showEmailInput && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            )}

            {showPhoneInput && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919876543210"
                  required
                />
                <p className="text-xs text-muted-foreground">Use country code format (example: +919876543210).</p>
              </div>
            )}

            {authMode === "password" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            )}

            {authMode === "otp" && otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit code"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || (authMode === "otp" && otpSent && !canSubmitOtpCode)}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {authMode === "password"
                ? isLogin
                  ? "Sign In"
                  : "Sign Up"
                : otpSent
                  ? "Verify OTP"
                  : "Send OTP"}
            </Button>

            {authMode === "otp" && otpSent && (
              <Button type="button" variant="ghost" className="w-full" onClick={sendOtp} disabled={loading}>
                Resend OTP
              </Button>
            )}
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn}>
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-4 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-1 font-medium text-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure authentication
            </p>
            <p className="mt-1">Use Google, password, or OTP via phone/email for quick access.</p>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                resetOtpState();
              }}
              className="font-medium text-primary hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
