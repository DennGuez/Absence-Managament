import type { Absence, AbsenceType, Employee } from "~/types";
import { currentYear } from "./dateHelper";
import { absenceTypes } from "~/data/absenceTypes";

export const generateRandomAbsences = (employees: Employee[], absences: Map<string, Absence[]>): void => {
    employees.forEach((employee: Employee) => {
        const numAbsences: number = Math.floor(Math.random() * 8) + 2; // 2-9 absences per employee

        for (let i = 0; i < numAbsences; i++) {
            const startDate = new Date(currentYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
            const duration: number = Math.floor(Math.random() * 5) + 1; // 1-5 days
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration - 1);

            const absence: Absence = {
            id: `abs-${employee.id}-${i}`,
            employeeId: employee.id,
            startDate: startDate.toISOString().split('T')[0]!,
            endDate: endDate.toISOString().split('T')[0]!,
            type: absenceTypes[Math.floor(Math.random() * absenceTypes.length)]!,
            reason: Math.random() > 0.7 ? 'Random generated absence' : ''
            };

            if (!absences.has(employee.id)) {
            absences.set(employee.id, []);
            }
            absences.get(employee.id)!.push(absence);
        }
    });
}