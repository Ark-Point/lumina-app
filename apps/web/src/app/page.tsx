// import Image from "next/image";
// import styles from "./page.module.css";

import HomeContents from "@/web/components/home";
import GlobalLayout from "@/web/layout/global";

export default async function Home() {
  return (
    <GlobalLayout>
      <HomeContents />
    </GlobalLayout>
  );
}

// 'use client';
// import { Button } from '@/components/button/button';
// // import { Button } from '@/components/button/base';
// import Link from 'next/link';
// import './global.css';

// export default function LuminaLanding() {
//   return (
//     <div className="min-h-screen bg-[#4318FF] text-white">
//       {/* Header */}
//       <header className="container mx-auto px-6 py-6">
//         <nav className="flex items-center justify-between">
//           <div className="flex items-center gap-12">
//             {/* Logo */}
//             <Link href="/" className="flex items-center">
//               <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
//                 <div className="w-4 h-4 bg-[#4318FF] rounded-sm" />
//               </div>
//             </Link>

//             {/* Navigation Links */}
//             <div className="hidden md:flex items-center gap-8">
//               <Link
//                 href="#"
//                 className="text-white hover:text-white/80 transition-colors font-medium"
//               >
//                 Home
//               </Link>
//               <Link
//                 href="#"
//                 className="text-white hover:text-white/80 transition-colors font-medium"
//               >
//                 Docs
//               </Link>
//             </div>
//           </div>

//           {/* Sign In Button */}
//           <Button variant="ghost" className="text-white hover:bg-white/10 gap-2">
//             <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
//               <div className="w-3 h-3 bg-[#4318FF] rounded-sm" />
//             </div>
//             Sign In
//           </Button>
//         </nav>
//       </header>

//       {/* Hero Section */}
//       <main className="container mx-auto px-6">
//         <div className="max-w-5xl mx-auto text-center pt-12 pb-16">
//           <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-balance">
//             Illuminate the Base Ecosystem.
//           </h1>

//           <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-balance leading-relaxed">
//             Lumina is your AI Research Agent that unifies on-chain, social, and ecosystem data into
//             one intelligence layer.
//           </p>

//           <Button
//             size="lg"
//             className="bg-[#CDFF00] hover:bg-[#CDFF00]/90 text-black font-bold px-8 py-6 text-lg rounded-lg"
//           >
//             Launch the Lumina Agent
//           </Button>
//         </div>

//         {/* Video/Dashboard Section */}
//         <div className="max-w-5xl mx-auto mb-20">
//           <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
//             <div className="space-y-6">
//               {/* Dashboard Header */}
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="text-black font-bold text-xl mb-4">
//                     Lumina Project Review Call Preparation - Agent
//                   </h3>
//                   <div className="text-gray-700 space-y-2 text-sm">
//                     <p className="font-semibold">AI FYI: 3 ALERTS</p>
//                     <ul className="list-disc list-inside space-y-1 ml-2">
//                       <li>{'Significant TVL decline detected: $5.2M to $4.8M (-8%) in 24hrs'}</li>
//                       <li>{'Social sentiment shift: Positive mentions down 15% week-over-week'}</li>
//                       <li>{'Competitor activity: Similar protocol launched incentive program'}</li>
//                     </ul>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="sm" className="text-gray-600">
//                   ⋮ More
//                 </Button>
//               </div>

//               {/* Key Metrics */}
//               <div className="border-t border-gray-200 pt-6">
//                 <p className="text-gray-700 text-sm mb-3">
//                   <span className="font-semibold">Protocol Metrics:</span> TVL: $4.8M (+2.1% 7d) |
//                   APY: 12.5% | Users: 1,247
//                 </p>
//                 <p className="text-gray-700 text-sm mb-3">
//                   <span className="font-semibold">Momentum score:</span> 7.2/10 (-0.8 vs last week)
//                 </p>
//               </div>

//               {/* YouTube Video Embed */}
//               <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
//                 <iframe
//                   className="absolute inset-0 w-full h-full"
//                   src="https://www.youtube.com/embed/dQw4w9WgXcQ"
//                   title="YouTube video player"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 />
//               </div>

//               {/* Builder & Ecosystem Context */}
//               <div className="border-t border-gray-200 pt-6 space-y-4">
//                 <div>
//                   <h4 className="text-black font-semibold mb-2">🏗️ Builder & Ecosystem Context</h4>
//                   <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
//                     <li>{'Previous funding: $2M seed led by Base Ecosystem Fund'}</li>
//                     <li>
//                       {'ETHDenver: 2 core team members attending (Feb 28-Mar 3); Base Booth #42'}
//                     </li>
//                     <li>
//                       {'Recent github activity: 47 commits last week, 3 open critical issues'}
//                     </li>
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="text-black font-semibold mb-2">💡 Strategic Priorities</h4>
//                   <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-2">
//                     <li>{'Fix issues this week to hit $10M TVL and qualify for Base grant'}</li>
//                   </ul>
//                 </div>
//               </div>

//               {/* Action Items */}
//               <div className="border-t border-gray-200 pt-4">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="text-gray-700 border-gray-300 bg-transparent"
//                 >
//                   + Add action
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Sections */}
//         <div className="max-w-4xl mx-auto text-center space-y-20 pb-20">
//           <div>
//             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
//               The intelligence layer accelerating Base&apos;s creator-builder cycle.
//             </h2>
//           </div>

//           <div>
//             <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-balance">
//               Be part of Base&apos;s intelligence layer.
//             </h3>
//             <p className="text-xl md:text-2xl mb-8 text-balance">
//               Lumina accelerates the creator-builder flywheel of Base
//             </p>
//             <Button
//               size="lg"
//               className="bg-[#CDFF00] hover:bg-[#CDFF00]/90 text-black font-bold px-8 py-6 text-lg rounded-lg"
//             >
//               Launch the Lumina Agent
//             </Button>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="container mx-auto px-6 py-8">
//         <div className="flex items-center justify-end gap-6">
//           <Link href="#" className="text-white hover:text-white/80 transition-colors">
//             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//               <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//             </svg>
//             <span className="sr-only">X (Twitter)</span>
//           </Link>
//           <Link href="#" className="text-white hover:text-white/80 transition-colors">
//             <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
//               <div className="w-3 h-3 bg-[#4318FF] rounded-sm" />
//             </div>
//             <span className="sr-only">Base</span>
//           </Link>
//         </div>
//       </footer>
//     </div>
//   );
// }
