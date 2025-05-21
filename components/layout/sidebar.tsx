"use client";

import { FileText, Home, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navigationItems = [
  {
    title: "Beranda",
    icon: Home,
    href: "/dashboard",
    items: [],
  },
  {
    title: "Portofolio",
    icon: FileText,
    href: "/portfolio",
    items: [
      { title: "Kegiatan", href: "/portfolio/activity" },
      { title: "Prestasi", href: "/portfolio/achievement" },
    ],
  },
  {
    title: "Profil",
    icon: Users,
    href: "/profile",
    items: [],
  },
];

const Sidebar = ({ className = "" }: { className?: string }) => {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Helper function to check if a route is active
  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true;
    }

    if (href !== "/dashboard") {
      return pathname === href || pathname?.startsWith(`${href}/`);
    }

    return false;
  };

  // Check if any child route is active
  const hasActiveChild = (items: { href: string }[]) => {
    return items.some((item) => isActive(item.href));
  };

  // Toggle accordion item
  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Initialize open items based on active routes
  useEffect(() => {
    const newOpenItems: Record<string, boolean> = {};

    navigationItems.forEach((item, index) => {
      // If this item has children and either the parent or any child is active
      if (
        item.items.length > 0 &&
        (isActive(item.href) || hasActiveChild(item.items))
      ) {
        newOpenItems[`item-${index}`] = true;
      }
    });

    setOpenItems(newOpenItems);
  }, []);

  return (
    <div
      className={cn(
        "h-full flex flex-col bg-background border-r shadow-sm",
        className
      )}
    >
      {/* Logo and Brand */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-accent text-accent-foreground font-bold text-xl">
            EP
          </div>
          <h2 className="text-xl font-semibold tracking-tight">E-Portfolio</h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const itemId = `item-${index}`;
            const isItemActive =
              isActive(item.href) || hasActiveChild(item.items);
            const isOpen = openItems[itemId] || false;

            // Menu item without submenu
            if (item.items.length === 0) {
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                      isItemActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isItemActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            }

            return (
              <div key={item.href} className="space-y-1">
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex flex-1 items-center gap-3 rounded-md rounded-r-none px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                      isItemActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isItemActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                      )}
                    />
                    <span>{item.title}</span>
                  </Link>
                  <button
                    onClick={() => toggleItem(itemId)}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-md rounded-l-none hover:text-primary",
                      isItemActive ? "text-primary" : "text-muted-foreground"
                    )}
                    aria-label={`Toggle ${item.title} submenu`}
                  >
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen
                          ? "rotate-90 text-primary"
                          : "text-muted-foreground group-hover:text-primary"
                      )}
                    />
                  </button>
                </div>

                {/* Submenu */}
                {isOpen && (
                  <div className="ml-6 pl-3 border-l border-border/50 space-y-1 mt-1">
                    {item.items.map((subItem) => {
                      const subActive = isActive(subItem.href);
                      return (
                        <Link key={subItem.href} href={subItem.href}>
                          <div
                            className={cn(
                              "flex items-center rounded-md px-3 py-2 text-sm transition-all hover:text-primary relative",
                              subActive
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute -ml-3.5 h-1.5 w-1.5 rounded-full",
                                subActive
                                  ? "bg-primary"
                                  : "bg-muted-foreground/30"
                              )}
                            />
                            {subItem.title}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
