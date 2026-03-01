import { useState } from 'react';
import { Download, Save, FolderOpen, FileImage, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Room, FurnitureItem, DoorItem, ProjectData } from '@/types/editor';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  furniture: FurnitureItem[];
  doors: DoorItem[];
  onLoadProject: (data: ProjectData) => void;
}

export default function ExportTools({ isOpen, onClose, rooms, furniture, doors, onLoadProject }: Props) {
  const [projectName, setProjectName] = useState('My FloorPlan');

  const saveProject = () => {
    const data: ProjectData = {
      id: `proj-${Date.now()}`,
      name: projectName,
      rooms, furniture, doors,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${projectName.replace(/\s+/g, '_')}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Project saved successfully!');
    onClose();
  };

  const loadProject = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string) as ProjectData;
          if (!data.rooms || !data.furniture || !data.doors) throw new Error('Invalid project');
          onLoadProject(data);
          toast.success(`Loaded: ${data.name}`);
          onClose();
        } catch { toast.error('Invalid project file'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const exportPNG = async () => {
    const svg = document.querySelector('.canvas-grid') as SVGSVGElement;
    if (!svg) { toast.error('No canvas found'); return; }
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 2000; canvas.height = 1400;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 2000, 1400);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 2000, 1400);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${projectName.replace(/\s+/g, '_')}.png`; a.click();
        URL.revokeObjectURL(url);
        toast.success('PNG exported!');
      }, 'image/png');
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    onClose();
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF('landscape', 'mm', 'a4');

    // Title
    doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text('FloorWise Layout Report', 20, 20);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 28);
    doc.text(`Project: ${projectName}`, 20, 34);

    // Stats
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Layout Summary', 20, 48);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    const totalArea = rooms.reduce((s, r) => s + r.width * r.height, 0);
    const furnArea = furniture.reduce((s, f) => s + f.width * f.height, 0);
    const density = totalArea > 0 ? ((furnArea / totalArea) * 100).toFixed(1) : '0';

    const stats = [
      `Rooms: ${rooms.length}`, `Doors: ${doors.length}`, `Furniture: ${furniture.length}`,
      `Total Area: ${(totalArea / 50 * 1.5 * 50 * 1.5 / 50 / 50).toFixed(1)} m²`,
      `Furniture Density: ${density}%`,
    ];
    stats.forEach((s, i) => doc.text(`• ${s}`, 24, 56 + i * 6));

    // Room details
    if (rooms.length > 0) {
      doc.setFontSize(14); doc.setFont('helvetica', 'bold');
      doc.text('Room Details', 20, 92);
      doc.setFontSize(10); doc.setFont('helvetica', 'normal');
      rooms.forEach((r, i) => {
        const w = (r.width / 50 * 1.5).toFixed(1);
        const h = (r.height / 50 * 1.5).toFixed(1);
        doc.text(`${r.name}: ${w}m × ${h}m`, 24, 100 + i * 6);
      });
    }

    // Analysis scores
    const furnDensity = totalArea > 0 ? furnArea / totalArea : 0;
    doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    const yOff = 100 + rooms.length * 6 + 10;
    doc.text('Analysis Scores', 20, yOff);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    const scores = [
      `Circulation: ${Math.round(Math.min(98, Math.max(15, 85 - furnDensity * 30)))}`,
      `Space Efficiency: ${Math.round(Math.min(98, Math.max(10, 90 - Math.abs(furnDensity - 0.35) * 200)))}`,
      `Overall Livability: Good`,
    ];
    scores.forEach((s, i) => doc.text(`• ${s}`, 24, yOff + 8 + i * 6));

    doc.save(`${projectName.replace(/\s+/g, '_')}_report.pdf`);
    toast.success('PDF report exported!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Save & Export</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Project Name</label>
            <input
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2 h-auto py-3 flex-col" onClick={saveProject}>
              <Save className="w-5 h-5" />
              <span className="text-xs">Save JSON</span>
            </Button>
            <Button variant="outline" className="gap-2 h-auto py-3 flex-col" onClick={loadProject}>
              <FolderOpen className="w-5 h-5" />
              <span className="text-xs">Load Project</span>
            </Button>
            <Button variant="outline" className="gap-2 h-auto py-3 flex-col" onClick={exportPNG}>
              <FileImage className="w-5 h-5" />
              <span className="text-xs">Export PNG</span>
            </Button>
            <Button variant="outline" className="gap-2 h-auto py-3 flex-col" onClick={exportPDF}>
              <FileText className="w-5 h-5" />
              <span className="text-xs">PDF Report</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
