'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, Heart, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { AUTH_CONFIG, isSuperadminEmail, validateSuperadminCredentials } from '@/lib/config/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaResult, setCaptchaResult] = useState(0);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const router = useRouter();

  // Generate captcha question
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const { MIN_NUMBERS, MAX_NUMBERS, OPERATORS } = AUTH_CONFIG.SECURITY.CAPTCHA;
    const num1 = Math.floor(Math.random() * (MAX_NUMBERS - MIN_NUMBERS + 1)) + MIN_NUMBERS;
    const num2 = Math.floor(Math.random() * (MAX_NUMBERS - MIN_NUMBERS + 1)) + MIN_NUMBERS;
    const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
    
    let result;
    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '×':
        result = num1 * num2;
        break;
      default:
        result = num1 + num2;
    }
    
    setCaptchaQuestion(`${num1} ${operator} ${num2} = ?`);
    setCaptchaResult(result);
    setCaptchaAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Check if it's superadmin login
    if (isSuperadminEmail(email)) {
      setIsSuperadmin(true);
      
      // Validate captcha for superadmin
      if (parseInt(captchaAnswer) !== captchaResult) {
        setError('Incorrect captcha answer. Please try again.');
        setIsLoading(false);
        generateCaptcha();
        return;
      }

      // Validate superadmin credentials
      if (!validateSuperadminCredentials(email, password)) {
        setError('Invalid superadmin credentials.');
        setIsLoading(false);
        generateCaptcha();
        return;
      }

      // Superadmin login successful
      console.log('Superadmin login successful:', { email, role: AUTH_CONFIG.ROLES.SUPERADMIN });
      localStorage.setItem('userRole', AUTH_CONFIG.ROLES.SUPERADMIN);
      localStorage.setItem('userEmail', email);
      
      // Force a small delay and then navigate
      setTimeout(() => {
        console.log('Navigating to dashboard...');
        // Force a page reload to ensure auth state is updated
        window.location.href = '/dashboard';
      }, 200);
      return;
    }

    // Regular Firebase authentication for other users
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('userRole', AUTH_CONFIG.ROLES.ADMIN);
      localStorage.setItem('userEmail', email);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsSuperadmin(isSuperadminEmail(emailValue));
  };

  return (
    <div className="min-h-screen healthcare-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-primary rounded-full p-3">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">UniHealth</h1>
              <p className="text-sm text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure Administrative Access</span>
          </div>
        </div>

        {/* Login Form */}
        <Card className="card-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@unihealth.ph"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Captcha for superadmin */}
              {isSuperadmin && (
                <div className="space-y-2">
                  <Label htmlFor="captcha">Security Verification</Label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-muted rounded-lg text-center font-mono text-lg">
                      {captchaQuestion}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={generateCaptcha}
                      className="flex-shrink-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    id="captcha"
                    type="number"
                    placeholder="Enter the answer"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    required
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Please solve the math problem to verify you're human
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Superadmin indicator */}
            {isSuperadmin && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    Superadmin Access Detected
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Enhanced security verification required
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>This system is protected by advanced security measures</p>
          <p>Unauthorized access attempts will be logged and reported</p>
        </div>
      </div>
    </div>
  );
}