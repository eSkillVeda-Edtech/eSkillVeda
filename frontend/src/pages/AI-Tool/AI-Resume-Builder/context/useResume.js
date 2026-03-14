import { useContext } from "react";
import { ResumeContext } from "./ResumeContext";

export const useResume = () => useContext(ResumeContext);

