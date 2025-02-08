
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const handleLogoClick = () => {
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10 flex-1">
          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span className="font-bold text-xl">DIY Hub</span>
          </button>

          {/* Navigation Links */}
          <Button
            variant="ghost"
            onClick={() => navigate("/explore")}
            className="text-sm font-medium transition-colors"
          >
            Explore
          </Button>
        </div>

        {/* Auth Buttons */}
        {!session && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/auth/signin")}
              className="text-sm font-medium transition-colors"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/auth/signup")}
              className="text-sm font-medium transition-colors"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
