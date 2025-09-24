// composables/useAbsenceDialog.ts
import type { Employee, Absence, DialogMode, AbsenceForm } from '~/types';

export const useAbsenceDialog = () => {
  // Dialog state
  const dialog = ref<boolean>(false);
  const selectedEmployee = ref<Employee | null>(null);
  const selectedDate = ref<Date | null>(null);
  const dialogMode = ref<DialogMode>('create');
  const editingAbsence = ref<Absence | null>(null);

  // Reactive form
  const absenceForm = reactive<AbsenceForm>({
    startDate: '',
    endDate: '',
    type: 'Sick Leave',
    reason: ''
  });

  // Open the dialog to create or edit an absence
  const openDialog = (
    employee: Employee, 
    date: Date, 
    absences: Map<string, Absence[]>
  ): void => {
    selectedEmployee.value = employee;
    selectedDate.value = date;
    
    const dateString = date.toISOString().split('T')[0]!;
    const employeeAbsences = absences.get(employee.id) || [];
    const existingAbsence = employeeAbsences.find((abs: Absence) => 
      dateString >= abs.startDate && dateString <= abs.endDate
    );
    
    if (existingAbsence) {
      // Modo edición
      dialogMode.value = 'edit';
      editingAbsence.value = existingAbsence;
      absenceForm.startDate = existingAbsence.startDate;
      absenceForm.endDate = existingAbsence.endDate;
      absenceForm.type = existingAbsence.type;
      absenceForm.reason = existingAbsence.reason;
    } else {
      // Modo creación
      dialogMode.value = 'create';
      editingAbsence.value = null;
      absenceForm.startDate = dateString;
      absenceForm.endDate = dateString;
      absenceForm.type = 'Sick Leave';
      absenceForm.reason = '';
    }
    
    dialog.value = true;
  };

  // Close the dialog and clean up state
  const closeDialog = (): void => {
    dialog.value = false;
    selectedEmployee.value = null;
    selectedDate.value = null;
    editingAbsence.value = null;
    
    // Resetear formulario
    Object.assign(absenceForm, {
      startDate: '',
      endDate: '',
      type: 'Sick Leave',
      reason: ''
    });
  };

  // Validate form data
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!selectedEmployee.value) {
      errors.push('No employee selected');
    }

    if (!absenceForm.startDate) {
      errors.push('Start date is required');
    }

    if (!absenceForm.endDate) {
      errors.push('End date is required');
    }

    if (absenceForm.startDate && absenceForm.endDate) {
      if (new Date(absenceForm.startDate) > new Date(absenceForm.endDate)) {
        errors.push('Start date must be before or equal to end date');
      }
    }

    if (!absenceForm.type) {
      errors.push('Absence type is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

// Save the absence (create or update)
  const saveAbsence = (
    absences: Map<string, Absence[]>
  ): { success: boolean; errors?: string[] } => {
    const validation = validateForm();
    
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    if (!selectedEmployee.value) {
      return { success: false, errors: ['No employee selected'] };
    }

    const employeeId = selectedEmployee.value.id;

    // Asegurar que existe el array de ausencias para el empleado
    if (!absences.has(employeeId)) {
      absences.set(employeeId, []);
    }

    try {
      if (dialogMode.value === 'edit' && editingAbsence.value) {
        // Actualizar ausencia existente
        const employeeAbsences = absences.get(employeeId);
        if (employeeAbsences) {
          const index = employeeAbsences.findIndex(
            (abs: Absence) => abs.id === editingAbsence.value!.id
          );
          
          if (index !== -1) {
            employeeAbsences[index] = {
              ...editingAbsence.value,
              startDate: absenceForm.startDate,
              endDate: absenceForm.endDate,
              type: absenceForm.type,
              reason: absenceForm.reason
            };
          }
        }
      } else {
        // Crear nueva ausencia
        const newAbsence: Absence = {
          id: `abs-${employeeId}-${Date.now()}`,
          employeeId,
          startDate: absenceForm.startDate,
          endDate: absenceForm.endDate,
          type: absenceForm.type,
          reason: absenceForm.reason
        };

        absences.get(employeeId)!.push(newAbsence);
      }

      closeDialog();
      return { success: true };

    } catch (error) {
      console.error('Error saving absence:', error);
      return { 
        success: false, 
        errors: ['An error occurred while saving the absence'] 
      };
    }
  };

  // Delete the absence in edit mode
  const deleteAbsence = (
    absences: Map<string, Absence[]>
  ): { success: boolean; error?: string } => {
    if (!editingAbsence.value || !selectedEmployee.value) {
      return { success: false, error: 'No absence selected for deletion' };
    }

    try {
      const employeeId = selectedEmployee.value.id;
      const employeeAbsences = absences.get(employeeId) || [];
      const index = employeeAbsences.findIndex(
        (abs: Absence) => abs.id === editingAbsence.value!.id
      );

      if (index !== -1) {
        employeeAbsences.splice(index, 1);
        closeDialog();
        return { success: true };
      } else {
        return { success: false, error: 'Absence not found' };
      }
    } catch (error) {
      console.error('Error deleting absence:', error);
      return { 
        success: false, 
        error: 'An error occurred while deleting the absence' 
      };
    }
  };

  // Computed for the dialog title
  const dialogTitle = computed(() => {
    return dialogMode.value === 'create' ? 'Create Absence' : 'Edit Absence';
  });

  // Computed for the save button text
  const saveButtonText = computed(() => {
    return dialogMode.value === 'create' ? 'Create' : 'Update';
  });

  // Computed to show if in edit mode
  const isEditMode = computed(() => dialogMode.value === 'edit');

  return {
    // Estado
    dialog: readonly(dialog),
    selectedEmployee: readonly(selectedEmployee),
    selectedDate: readonly(selectedDate),
    dialogMode: readonly(dialogMode),
    editingAbsence: readonly(editingAbsence),
    absenceForm,
    
    // Computed
    dialogTitle,
    saveButtonText,
    isEditMode,
    
    // Métodos
    openDialog,
    closeDialog,
    saveAbsence,
    deleteAbsence,
    validateForm
  };
};