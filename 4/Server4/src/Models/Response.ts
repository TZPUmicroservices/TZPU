import { Cas } from "./Cas";
import { Student } from "./Student";

export interface StudentResponse{
    student:Student,
    casovi:Cas[],
}