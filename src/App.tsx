import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { JourneyProvider } from "@/context/JourneyContext";
import { Landing } from "@/pages/Landing";
import { Questionnaire } from "@/pages/Questionnaire";
import { PersonalityReveal } from "@/pages/PersonalityReveal";
import { Recommendations } from "@/pages/Recommendations";
import { Compare } from "@/pages/Compare";
import { DecisionSummary } from "@/pages/DecisionSummary";
import { Goodbye } from "@/pages/Goodbye";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/reveal" element={<PersonalityReveal />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/summary" element={<DecisionSummary />} />
        <Route path="/goodbye" element={<Goodbye />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <JourneyProvider>
        <AnimatedRoutes />
      </JourneyProvider>
    </BrowserRouter>
  );
}

export default App;
