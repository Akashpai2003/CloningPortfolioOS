import React, { useState, useEffect, useRef } from 'react';
import { Folder, FileText, Mail, Image as ImageIcon, X, Minus, Square, ArrowUpRight, Globe, ArrowLeft, Layers, PenTool, Search, Layout, Users, BarChart3, GitBranch, Palette, MousePointerClick, Smartphone, Quote } from 'lucide-react';

// --- Types ---

interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  content: React.ReactNode;
  zIndex: number;
  position: { x: number; y: number };
  size: { w: number; h: number };
}

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  role: string;
}

// --- Data ---

const PROJECTS: Project[] = [
  { 
    id: 1, 
    title: "Maison Margiela", 
    category: "E-Commerce", 
    year: "2023", 
    role: "Lead UX/UI",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2671&auto=format&fit=crop",
    description: "Redefining the digital flagship experience for a minimalist luxury fashion house. The goal was to translate the brand's deconstructivist philosophy into a seamless, high-conversion digital interface."
  },
  { 
    id: 2, 
    title: "Porsche 911", 
    category: "Interactive", 
    year: "2023", 
    role: "Interaction Designer",
    image: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2670&auto=format&fit=crop",
    description: "An immersive configurator experience for the new 911. Focusing on performance data visualization and tactile interaction patterns to mimic the physical driving experience."
  },
  { 
    id: 3, 
    title: "Aesop Skin", 
    category: "Web Design", 
    year: "2022", 
    role: "Visual Designer",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2574&auto=format&fit=crop",
    description: "A content-rich educational platform for skincare enthusiasts. The project focused on modular design systems and editorial typography to enhance readability and engagement."
  },
];

// --- Components ---

// 1. Desktop Icon
const DesktopIcon = ({ 
  label, 
  icon: Icon, 
  onDoubleClick, 
  className = "" 
}: { 
  label: string; 
  icon: React.ElementType; 
  onDoubleClick: () => void;
  className?: string;
}) => {
  // Handle touch/click for mobile where double click is rare
  const handleInteraction = () => {
    onDoubleClick();
  };

  return (
    <div 
      className={`flex flex-col items-center gap-2 w-20 md:w-24 p-2 md:p-4 cursor-pointer hover:bg-black/5 group transition-colors rounded-sm ${className}`}
      onDoubleClick={onDoubleClick}
      onClick={(e) => {
        // Simple heuristic for mobile tap: treated as open
        if (window.matchMedia('(pointer: coarse)').matches) {
          onDoubleClick();
        }
      }}
    >
      <div className="text-pure-black group-hover:scale-105 transition-transform duration-200">
        <Icon size={32} strokeWidth={1.5} className="md:w-10 md:h-10" />
      </div>
      <span className="text-[10px] md:text-xs font-medium text-pure-black text-center uppercase tracking-wide bg-off-white/80 px-1 select-none">
        {label}
      </span>
    </div>
  );
};

// 2. Window Component

interface WindowFrameProps {
  window: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ 
  window, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  onDragStart
}) => {
  if (!window.isOpen || window.isMinimized) return null;

  return (
    <div 
      className="absolute flex flex-col bg-off-white border border-pure-black shadow-hard overflow-hidden"
      style={{ 
        left: window.position.x, 
        top: window.position.y, 
        width: window.isMaximized ? '100vw' : window.size.w, 
        height: window.isMaximized ? 'calc(100vh - 40px)' : window.size.h, // Subtract taskbar height
        zIndex: window.zIndex,
        transition: window.isMaximized ? 'all 0.3s ease' : 'none',
        maxWidth: '100vw',
        maxHeight: 'calc(100vh - 40px)'
      }}
      onMouseDown={onFocus}
      onTouchStart={onFocus}
    >
      {/* Title Bar */}
      <div 
        className="h-10 bg-off-white border-b border-pure-black flex justify-between items-center px-3 select-none cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-pure-black rounded-full" />
           <span className="text-xs font-bold uppercase tracking-widest text-pure-black truncate max-w-[150px]">{window.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
           <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1 hover:bg-black/10 rounded-sm">
              <Minus size={14} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="p-1 hover:bg-black/10 rounded-sm">
              <Square size={12} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-pure-black hover:text-off-white rounded-sm transition-colors">
              <X size={14} />
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-off-white scroll-smooth">
        {window.content}
      </div>
    </div>
  );
};

// 3. Content Components

// --- Case Study View ---
const ProjectDetail = ({ project, onBack }: { project: Project; onBack: () => void }) => {
  return (
    <div className="p-4 md:p-12 max-w-5xl mx-auto">
      <button 
        onClick={onBack} 
        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-8 md:mb-12 hover:text-gray-600 transition-colors sticky top-0 bg-off-white py-4 z-10 w-full border-b border-transparent hover:border-black/5"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Index
      </button>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
        <div className="lg:col-span-8">
           <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-4 md:mb-6">{project.title}</h1>
           <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed opacity-80">{project.description}</p>
        </div>
        <div className="lg:col-span-4 space-y-6 pt-2">
           <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Role</h4>
              <span className="text-sm opacity-70">{project.role}</span>
           </div>
           <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Year</h4>
              <span className="text-sm opacity-70">{project.year}</span>
           </div>
           <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-1">Services</h4>
              <span className="text-sm opacity-70">{project.category}, UX Research</span>
           </div>
        </div>
      </div>

      <div className="w-full aspect-video overflow-hidden border border-black mb-16 md:mb-24">
         <img src={project.image} className="w-full h-full object-cover" alt="Hero" />
      </div>

      {/* 01. Research Phase */}
      <div className="mb-24 md:mb-32">
         <div className="flex items-center gap-4 mb-8 md:mb-12 border-b border-black pb-4">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold rounded-full shrink-0">01</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Discovery & Research</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16">
            {/* Primary Research Data */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={20} />
                <h3 className="text-lg font-bold uppercase tracking-widest">Primary Research</h3>
              </div>
              <p className="mb-6 opacity-70 leading-relaxed text-sm md:text-base">
                We analyzed 3 months of user session data to identify friction points in the existing checkout flow. The quantitative analysis revealed significant drop-off at the product configuration stage.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <div className="border border-black p-3 md:p-4">
                    <div className="text-2xl md:text-4xl font-bold mb-1">68%</div>
                    <div className="text-[10px] md:text-xs uppercase tracking-wide opacity-60">Cart Abandonment</div>
                 </div>
                 <div className="border border-black p-3 md:p-4">
                    <div className="text-2xl md:text-4xl font-bold mb-1">4.2s</div>
                    <div className="text-[10px] md:text-xs uppercase tracking-wide opacity-60">Avg Load Time</div>
                 </div>
                 <div className="border border-black p-3 md:p-4">
                    <div className="text-2xl md:text-4xl font-bold mb-1">12%</div>
                    <div className="text-[10px] md:text-xs uppercase tracking-wide opacity-60">Mobile Conversion</div>
                 </div>
                 <div className="border border-black p-3 md:p-4">
                    <div className="text-2xl md:text-4xl font-bold mb-1">3/5</div>
                    <div className="text-[10px] md:text-xs uppercase tracking-wide opacity-60">Satisfaction Score</div>
                 </div>
              </div>
            </div>

            {/* User Interviews */}
            <div>
               <div className="flex items-center gap-2 mb-6">
                <Users size={20} />
                <h3 className="text-lg font-bold uppercase tracking-widest">Stakeholder Interviews</h3>
              </div>
              <div className="space-y-8 md:space-y-6">
                 <div className="relative pl-6 md:pl-8 border-l-2 border-black">
                    <Quote className="absolute -left-3 -top-3 bg-off-white p-1" size={24} />
                    <p className="text-lg md:text-xl italic font-serif leading-relaxed mb-2">
                       "The navigation feels overwhelming. I just want to find my size and buy it, but I get lost in the editorial content."
                    </p>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">— Frequent Shopper, 24</span>
                 </div>
                 <div className="relative pl-6 md:pl-8 border-l-2 border-black">
                    <Quote className="absolute -left-3 -top-3 bg-off-white p-1" size={24} />
                    <p className="text-lg md:text-xl italic font-serif leading-relaxed mb-2">
                       "We need to balance the artistic vision of the brand with the functional needs of an e-commerce store."
                    </p>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50">— Brand Director</span>
                 </div>
              </div>
            </div>
         </div>
      </div>

      {/* 02. Strategy Phase (A/B Testing) */}
      <div className="mb-24 md:mb-32">
         <div className="flex items-center gap-4 mb-8 md:mb-12 border-b border-black pb-4">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold rounded-full shrink-0">02</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Validation Strategy</h2>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
               <div className="flex items-center gap-2 mb-6">
                  <GitBranch size={20} />
                  <h3 className="text-lg font-bold uppercase tracking-widest">A/B Testing</h3>
               </div>
               <p className="opacity-70 leading-relaxed mb-4 text-sm md:text-base">
                  To address the navigation issues, we proposed two variants for the menu structure. Variant B (The "Mega-Minimal" Menu) focused on reducing cognitive load by grouping categories.
               </p>
               <div className="inline-block bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Result: Variant B Won
               </div>
            </div>
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-0 border border-black">
               <div className="p-6 border-b md:border-b-0 md:border-r border-black bg-gray-100/50 grayscale opacity-60">
                  <h4 className="text-xs font-bold uppercase mb-4">Variant A (Control)</h4>
                  <div className="w-full h-32 border border-black/20 mb-4 bg-white"></div>
                  <div className="text-sm font-mono">Conversion: 2.4%</div>
               </div>
               <div className="p-6 bg-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-black text-white text-[10px] uppercase font-bold px-2 py-1">Winner</div>
                  <h4 className="text-xs font-bold uppercase mb-4">Variant B (Grouped)</h4>
                  <div className="w-full h-32 border border-black mb-4 bg-gray-50"></div>
                  <div className="text-sm font-bold font-mono">Conversion: 3.8% (+58%)</div>
               </div>
            </div>
         </div>
      </div>

      {/* 03. Design Phase */}
      <div className="mb-24 md:mb-32">
         <div className="flex items-center gap-4 mb-8 md:mb-12 border-b border-black pb-4">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold rounded-full shrink-0">03</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Visual Design</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
               <div className="flex items-center gap-2 mb-6">
                  <Palette size={20} />
                  <h3 className="text-lg font-bold uppercase tracking-widest">Color & Typography</h3>
               </div>
               <div className="border border-black p-6 flex flex-col gap-8">
                  {/* Type */}
                  <div>
                     <div className="text-6xl font-bold tracking-tighter mb-2">Aa</div>
                     <div className="text-xs font-mono uppercase opacity-50 border-b border-black pb-2 mb-2">Primary Font: Inter Tight</div>
                     <div className="space-y-1">
                        <div className="text-2xl md:text-3xl font-bold">Headline Large</div>
                        <div className="text-lg md:text-xl font-semibold">Subhead Medium</div>
                        <div className="text-sm md:text-base">Body Regular 16px</div>
                     </div>
                  </div>
                  {/* Color */}
                  <div className="grid grid-cols-4 gap-2">
                     <div className="aspect-square bg-[#111111]"></div>
                     <div className="aspect-square bg-[#333333]"></div>
                     <div className="aspect-square bg-[#F4F4F4] border border-black/10"></div>
                     <div className="aspect-square bg-white border border-black/10"></div>
                  </div>
               </div>
            </div>

            <div>
               <div className="flex items-center gap-2 mb-6">
                  <Layout size={20} />
                  <h3 className="text-lg font-bold uppercase tracking-widest">Wireframing</h3>
               </div>
               <p className="opacity-70 mb-6 text-sm md:text-base">
                  Low-fidelity wireframes focused on information architecture and spatial relationships before visual polish.
               </p>
               <div className="aspect-[4/3] border border-black p-4 bg-gray-50 flex flex-col gap-4 relative">
                  {/* Wireframe UI */}
                  <div className="flex justify-between">
                     <div className="w-12 h-4 bg-black/10"></div>
                     <div className="flex gap-2">
                        <div className="w-4 h-4 bg-black/10"></div>
                        <div className="w-4 h-4 bg-black/10"></div>
                     </div>
                  </div>
                  <div className="flex gap-4 h-full">
                     <div className="w-1/3 bg-black/5 border border-dashed border-black/20"></div>
                     <div className="flex-1 flex flex-col gap-2">
                        <div className="w-3/4 h-8 bg-black/10"></div>
                        <div className="w-full h-4 bg-black/5"></div>
                        <div className="w-full h-4 bg-black/5"></div>
                        <div className="mt-auto w-1/2 h-10 bg-black"></div>
                     </div>
                  </div>
                  {/* Annotation */}
                  <div className="absolute -right-4 top-1/4 bg-black text-white text-[10px] px-2 py-1">
                     Sidebar
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 04. Prototyping Phase */}
      <div className="mb-12">
         <div className="flex items-center gap-4 mb-8 md:mb-12 border-b border-black pb-4">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold rounded-full shrink-0">04</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Prototyping</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
               <div className="flex items-center gap-2 mb-6">
                  <Smartphone size={20} />
                  <h3 className="text-lg font-bold uppercase tracking-widest">Interactive Flow</h3>
               </div>
               <p className="opacity-70 mb-6 text-sm md:text-base">
                  We built high-fidelity prototypes in Figma to test complex interactions, specifically the product configuration animations and cart flyout logic.
               </p>
               <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm font-mono border-b border-black/10 pb-2">
                     <MousePointerClick size={14} /> <span>Hover Trigger -> 200ms delay</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-mono border-b border-black/10 pb-2">
                     <Layers size={14} /> <span>Z-Index Stacking Context</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-mono border-b border-black/10 pb-2">
                     <Smartphone size={14} /> <span>Touch Target > 44px</span>
                  </div>
               </div>
            </div>
            
            {/* Visual Flow Diagram */}
            <div className="md:col-span-8 border border-dashed border-black/30 bg-gray-50 p-4 md:p-8 relative overflow-hidden min-h-[200px]">
               <div className="absolute inset-0 grid grid-cols-6 gap-4 opacity-10 pointer-events-none">
                  {[...Array(24)].map((_, i) => <div key={i} className="border-r border-black h-full"></div>)}
               </div>
               
               <div className="relative z-10 flex items-center justify-between gap-2 md:gap-4 overflow-x-auto pb-4">
                  <div className="w-24 md:w-32 h-32 md:h-48 shrink-0 border-2 border-black bg-white shadow-lg flex flex-col items-center justify-center">
                     <div className="text-[10px] md:text-xs font-bold mb-2">Home</div>
                     <div className="w-16 h-2 bg-black/10 mb-1"></div>
                     <div className="w-12 h-2 bg-black/10"></div>
                  </div>
                  <div className="w-8 h-[2px] bg-black relative shrink-0"></div>
                  <div className="w-24 md:w-32 h-32 md:h-48 shrink-0 border-2 border-black bg-white shadow-lg flex flex-col items-center justify-center">
                     <div className="text-[10px] md:text-xs font-bold mb-2">Product</div>
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-black/5 rounded-full mb-2"></div>
                     <div className="w-12 md:w-16 h-4 md:h-6 bg-black text-white text-[8px] flex items-center justify-center">Add</div>
                  </div>
                  <div className="w-8 h-[2px] bg-black border-t border-black relative shrink-0"></div>
                   <div className="w-24 md:w-32 h-32 md:h-48 shrink-0 border-2 border-black bg-white shadow-lg flex flex-col items-center justify-center">
                     <div className="text-[10px] md:text-xs font-bold mb-2">Cart</div>
                     <div className="w-16 md:w-20 h-2 bg-black/10 mb-2"></div>
                     <div className="w-16 md:w-20 h-2 bg-black/10 mb-2"></div>
                     <div className="w-16 md:w-20 h-2 bg-black/10"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

// --- Main Projects Container ---
const ProjectsContent = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (selectedId !== null) {
    const project = PROJECTS.find(p => p.id === selectedId);
    return project ? <ProjectDetail project={project} onBack={() => setSelectedId(null)} /> : null;
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-8">Selected Works</h2>
      <div className="grid grid-cols-1 gap-8 md:gap-12">
        {PROJECTS.map(p => (
          <div key={p.id} className="group cursor-pointer" onClick={() => setSelectedId(p.id)}>
            <div className="relative overflow-hidden border border-pure-black mb-4 aspect-video bg-gray-200">
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
              <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0" alt={p.title} />
              
              <div className="absolute bottom-4 right-4 bg-white border border-black px-3 py-1 text-xs font-bold uppercase tracking-widest opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 z-20 flex items-center gap-2">
                View Case Study <ArrowUpRight size={12} />
              </div>
            </div>
            <div className="flex justify-between items-baseline border-b border-transparent group-hover:border-black pb-2 transition-colors">
              <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight">{p.title}</h3>
              <span className="text-xs font-medium opacity-60">{p.year}</span>
            </div>
            <p className="text-xs md:text-sm opacity-60 mt-1">{p.category} — {p.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutContent = () => (
  <div className="p-4 md:p-8 max-w-2xl mx-auto pt-8">
    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-[0.9]">
      VISUAL<br/>DESIGNER
    </h1>
    <div className="text-base md:text-lg leading-relaxed space-y-6 font-light">
      <p>
        I am a multidisciplinary designer focusing on the intersection of design and technology. 
        Based in Italy, working globally.
      </p>
      <p>
        My work is characterized by a rigorous typographic approach and a minimalist aesthetic, 
        drawing inspiration from Swiss style and brutalist web design.
      </p>
      
      <div className="pt-8 border-t border-black/10 mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Services</h4>
          <ul className="text-sm space-y-2 opacity-80">
            <li>Art Direction</li>
            <li>Interactive Design</li>
            <li>Development</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Contact</h4>
          <ul className="text-sm space-y-2 opacity-80">
            <li>hello@edoardo.dev</li>
            <li>@edoardolunardi</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const BrowserContent = () => (
  <div className="flex flex-col h-full">
    <div className="flex gap-2 mb-6 pb-4 border-b border-black/10 p-4 md:p-6">
      <div className="bg-black/5 px-3 py-1 text-xs rounded-sm flex-1 font-mono opacity-50 truncate">
        https://www.awwwards.com/
      </div>
      <Globe size={16} className="opacity-50" />
    </div>
    <div className="flex-1 flex items-center justify-center flex-col opacity-20 p-4 text-center">
       <Globe size={64} strokeWidth={1} />
       <p className="mt-4 text-sm font-medium uppercase tracking-widest">No Internet Connection</p>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [time, setTime] = useState(new Date());
  
  // Window Management State
  const [windows, setWindows] = useState<WindowState[]>([]); // Start empty, fill in useEffect

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [maxZ, setMaxZ] = useState(10);

  // Initialize window positions based on screen size
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const startX = isMobile ? 10 : 80;
    const startY = isMobile ? 10 : 60;
    
    setWindows([
      {
        id: 'about',
        title: 'About Me.txt',
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        content: <AboutContent />,
        zIndex: 1,
        position: { x: startX, y: startY },
        size: isMobile 
          ? { w: window.innerWidth - 20, h: window.innerHeight * 0.6 }
          : { w: 600, h: 500 }
      },
      {
        id: 'projects',
        title: 'Work',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        content: <ProjectsContent />,
        zIndex: 2,
        position: { x: isMobile ? 20 : 120, y: isMobile ? 40 : 100 },
        size: isMobile 
           ? { w: window.innerWidth - 40, h: window.innerHeight * 0.7 }
           : { w: 900, h: 700 }
      },
      {
        id: 'browser',
        title: 'Netscape',
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        content: <BrowserContent />,
        zIndex: 3,
        position: { x: isMobile ? 30 : 160, y: isMobile ? 70 : 140 },
        size: isMobile
           ? { w: window.innerWidth - 60, h: 400 }
           : { w: 700, h: 500 }
      }
    ]);

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const bringToFront = (id: string) => {
    setMaxZ(prev => prev + 1);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w));
  };

  const toggleWindow = (id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        if (w.isOpen && !w.isMinimized) {
             // If open, minimize it
             return { ...w, isMinimized: !w.isMinimized };
        }
        // Open or restore
        return { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 };
      }
      return w;
    }));
    // Increment Z if opening
    if (windows.find(w => w.id === id && !w.isOpen)) {
       setMaxZ(prev => prev + 1);
    }
  };
  
  const closeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const minimizeWindow = (id: string) => {
     setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  // Unified Dragging Logic
  const getClientCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY };
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    const win = windows.find(w => w.id === id);
    if (!win || win.isMaximized) return;
    
    // For touch, we might need to prevent default to stop scrolling
    // e.preventDefault(); 
    
    bringToFront(id);
    setDraggingId(id);
    
    const coords = getClientCoordinates(e);
    setDragOffset({
      x: coords.x - win.position.x,
      y: coords.y - win.position.y
    });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingId) {
      const coords = getClientCoordinates(e);
      setWindows(prev => prev.map(w => {
        if (w.id === draggingId) {
          return {
            ...w,
            position: {
              x: coords.x - dragOffset.x,
              y: coords.y - dragOffset.y
            }
          };
        }
        return w;
      }));
    }
  };

  const handleEnd = () => {
    setDraggingId(null);
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-off-white relative flex flex-col"
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {/* Background Text Overlay (Decorative) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none whitespace-nowrap">
        <h1 className="text-[20vw] font-black tracking-tighter">SYSTEM</h1>
      </div>

      {/* Desktop Icons Area */}
      <div className="flex-1 relative z-0 p-4 md:p-8 grid grid-cols-1 gap-2 md:gap-4 content-start justify-items-start w-max">
        <DesktopIcon 
          label="Work" 
          icon={Folder} 
          onDoubleClick={() => toggleWindow('projects')} 
        />
        <DesktopIcon 
          label="About Me.txt" 
          icon={FileText} 
          onDoubleClick={() => toggleWindow('about')} 
        />
        <DesktopIcon 
          label="Netscape" 
          icon={Globe} 
          onDoubleClick={() => toggleWindow('browser')} 
        />
        <DesktopIcon 
          label="Mail" 
          icon={Mail} 
          onDoubleClick={() => window.location.href = 'mailto:hello@edoardo.dev'} 
        />
      </div>

      {/* Windows Layer */}
      {windows.map(win => (
        <WindowFrame 
          key={win.id}
          window={win}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onMaximize={() => maximizeWindow(win.id)}
          onFocus={() => bringToFront(win.id)}
          onDragStart={(e) => handleDragStart(e, win.id)}
        />
      ))}

      {/* Taskbar */}
      <div className="h-10 bg-off-white border-t border-pure-black flex justify-between items-center px-2 md:px-4 z-50 relative shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
         
         {/* Start Button (Minimal) */}
         <button className="flex items-center gap-2 px-2 md:px-3 py-1 border border-transparent hover:border-pure-black transition-all group active:scale-95 shrink-0">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-pure-black group-hover:rotate-45 transition-transform" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider hidden md:inline">Start</span>
         </button>

         {/* Active Windows */}
         <div className="flex-1 flex px-2 md:px-4 gap-2 overflow-x-auto no-scrollbar">
            {windows.filter(w => w.isOpen).map(win => (
              <button 
                key={win.id}
                onClick={() => toggleWindow(win.id)}
                className={`
                  px-2 md:px-4 py-1 text-[10px] md:text-xs font-medium border transition-all flex items-center gap-2 min-w-[80px] md:min-w-[120px] max-w-[120px] md:max-w-[200px] truncate shrink-0
                  ${win.isMinimized || windows.some(w => w.zIndex > win.zIndex && !w.isMinimized && w.isOpen) 
                    ? 'border-transparent hover:bg-black/5 opacity-50' 
                    : 'border-pure-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-100'}
                `}
              >
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-pure-black rounded-full shrink-0" />
                <span className="truncate">{win.title}</span>
              </button>
            ))}
         </div>

         {/* Clock */}
         <div className="text-[10px] md:text-xs font-mono font-medium tracking-wider border-l border-black/10 pl-2 md:pl-4 shrink-0">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </div>
      </div>

    </div>
  );
}