
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ProjectGenerationDialog } from "@/components/ProjectGenerationDialog";
import { useState } from "react";
import { Plus } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

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

        {/* Add Project Button and Auth Buttons */}
        <div className="flex items-center gap-2">
          {session && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          )}
          {!session && (
            <>
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
            </>
          )}
        </div>
      </div>
      
      <ProjectGenerationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </header>
  );
};
