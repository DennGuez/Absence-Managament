import type { Absence, Employee } from "../types"
import { generateRandomAbsences } from "~/helpers/employeeHelper";
import { firstNames, lastNames } from "~/data/employees";

// Employees State
export const useRandomData = (): any => {

    // Global state
    const employees = useState<Employee[]>('employees', () => [])
    const absences = useState<Map<string, Absence[]>>('absences', () => new Map())
    const loading = useState<boolean>('loading', () => false)

    // Generate sample data
    const generateRandomData = async (): Promise<void> => {
    loading.value = true;
  
    // Clear existing data
    employees.value = [];
    absences.value = new Map();

    await nextTick();

    for (let i = 0; i < 50; i++) {
    employees.value.push({
        id: `emp-${i + 1}`,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)]!,
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)]!,
        personnelNumber: `P${String(i + 1).padStart(4, '0')}`
    });
    }

    // Generate random absences

    generateRandomAbsences(employees.value, absences.value);

    loading.value = false;
    };

    return { employees, absences, loading, generateRandomData }
}