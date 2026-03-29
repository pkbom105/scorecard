import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getStoredConfig, FlightConfig, DEFAULT_COURSE_PAR } from "@/lib/flightUtils";
import Header from "@/components/Header";

// Define the shape for our course data
interface CourseHole {
  hole: number;
  par: number;
}

export default function FlightManagement() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<FlightConfig[]>([]);
  const [coursePar, setCoursePar] = useState<CourseHole[]>(DEFAULT_COURSE_PAR);

  useEffect(() => {
    setConfig(getStoredConfig());
    // Load existing course data if available
    const savedCourse = localStorage.getItem("golf_course_par");
    if (savedCourse) {
      setCoursePar(JSON.parse(savedCourse));
    } else {
      // Set defaults if not present
      localStorage.setItem("golf_course_par", JSON.stringify(DEFAULT_COURSE_PAR));
    }
  }, []);

  const handleRangeChange = (index: number, field: 'min' | 'max', value: string) => {
    const newConfig = [...config];
    newConfig[index] = { ...newConfig[index], [field]: parseInt(value) || 0 };
    setConfig(newConfig);
    localStorage.setItem("golf_flight_config", JSON.stringify(newConfig));
  };

  const handleParChange = (index: number, value: string) => {
    const newCourse = [...coursePar];
    newCourse[index].par = parseInt(value) || 0;
    setCoursePar(newCourse);
    localStorage.setItem("golf_course_par", JSON.stringify(newCourse));
  };

  const totalPar = coursePar.reduce((sum, h) => sum + h.par, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto max-w-3xl p-6 space-y-8">
        {/* Section 1: Handicap Ranges */}
        <div className="bg-card border p-4 rounded-xl shadow-sm">
          <h2 className="font-bold mb-4 uppercase text-sm text-muted-foreground">Set Handicap Ranges</h2>
          <div className="grid grid-cols-3 gap-4">
            {config.map((item, idx) => (
              <div key={item.flight} className="space-y-2">
                <p className="text-xs font-bold">{item.label}</p>
                <div className="flex items-center gap-1">
                  <Input type="number" value={item.min} onChange={(e) => handleRangeChange(idx, 'min', e.target.value)} className="h-8 text-center" />
                  <span>-</span>
                  <Input type="number" value={item.max} onChange={(e) => handleRangeChange(idx, 'max', e.target.value)} className="h-8 text-center" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Golf Course Profile (18 Holes) */}
        <div className="bg-card border p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-bold uppercase text-sm text-muted-foreground">Course Par Profile</h2>
              <p className="text-2xl font-black text-golf-green">Total Par: {totalPar}</p>
            </div>
            <Button size="sm" onClick={() => toast.success("Course profile saved!")}>Save Profile</Button>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
            {coursePar.map((h, idx) => (
              <div key={h.hole} className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-center block text-muted-foreground">
                  Hole {h.hole}
                </label>
                <Input 
                  type="number" 
                  value={h.par} 
                  onChange={(e) => handleParChange(idx, e.target.value)}
                  className="h-10 text-center font-bold"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}