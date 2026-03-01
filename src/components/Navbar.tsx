import { Link, useLocation } from 'react-router-dom';
import { Home, FolderOpen, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'My Projects', icon: FolderOpen },
  { path: '/editor', label: 'Create Layout', icon: PenTool },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-md">
            <PenTool className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display text-xl font-bold text-foreground">FloorWise</span>
            <span className="hidden sm:block text-[10px] text-muted-foreground -mt-1">Design Smart. Live Better.</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
