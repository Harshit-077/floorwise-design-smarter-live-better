import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Clock, Trash2, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  rooms: number;
  updatedAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Modern Apartment', rooms: 5, updatedAt: '2 hours ago' },
    { id: '2', name: 'Studio Loft', rooms: 2, updatedAt: '1 day ago' },
    { id: '3', name: 'Family Home', rooms: 8, updatedAt: '3 days ago' },
  ]);

  const createProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: `New Project ${projects.length + 1}`,
      rooms: 0,
      updatedAt: 'Just now',
    };
    setProjects([newProject, ...projects]);
    navigate('/editor');
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">My Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your floor plan layouts</p>
          </div>
          <Button variant="hero" onClick={createProject} className="gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create new card */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={createProject}
            className="glass-card p-8 flex flex-col items-center justify-center gap-3 border-dashed border-2 hover:border-secondary hover:bg-muted/50 transition-colors min-h-[200px] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <span className="font-medium text-muted-foreground">Create New Layout</span>
          </motion.button>

          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 1) * 0.05 }}
              className="glass-card overflow-hidden group"
            >
              <div className="h-32 gradient-accent flex items-center justify-center">
                <PenTool className="w-10 h-10 text-primary/40" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-lg">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.rooms} rooms</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteProject(project.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {project.updatedAt}
                  </span>
                  <Link to="/editor">
                    <Button variant="outline" size="sm">Open</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
