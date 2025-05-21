import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import ThemeToggle from "../theme-toggle";
import Sidebar from "./sidebar";
import { UserButton } from "@clerk/nextjs";

const TopNav = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:flex md:items-center md:space-x-4">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
