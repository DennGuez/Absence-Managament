<!-- components/AbsenceDialog.vue -->
<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ dialogTitle }}</span>
      </v-card-title>
      
      <v-card-text>
        <v-container>
          <v-row>
            <!-- Employee Information -->
            <v-col cols="12">
              <div class="mb-4">
                <strong>Employee:</strong> 
                {{ selectedEmployee?.firstName }} {{ selectedEmployee?.lastName }}
                ({{ selectedEmployee?.personnelNumber }})
              </div>
            </v-col>
            
            <!-- Start Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="absenceForm.startDate"
                label="Start Date"
                type="date"
                required
                :max="absenceForm.endDate"
                variant="outlined"
                density="compact"
              />
            </v-col>
            
            <!-- End Date -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="absenceForm.endDate"
                label="End Date"
                type="date"
                required
                :min="absenceForm.startDate"
                variant="outlined"
                density="compact"
              />
            </v-col>
            
            <!-- Absence Type -->
            <v-col cols="12">
              <v-select
                v-model="absenceForm.type"
                :items="absenceTypes"
                label="Absence Type"
                required
                variant="outlined"
                density="compact"
              />
            </v-col>
            
            <!-- Reason -->
            <v-col cols="12">
              <v-textarea
                v-model="absenceForm.reason"
                label="Reason (Optional)"
                rows="3"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        
        <!-- Cancel Button -->
        <v-btn 
          color="grey" 
          variant="text" 
          @click="handleClose"
        >
          Cancel
        </v-btn>
        
        <!-- Delete Button (only in edit mode) -->
        <v-btn 
          v-if="isEditMode"
          color="red" 
          variant="text" 
          @click="handleDelete"
          :loading="deleteLoading"
        >
          Delete
        </v-btn>
        
        <!-- Save Button -->
        <v-btn 
          color="primary" 
          variant="elevated" 
          @click="handleSave"
          :loading="saveLoading"
        >
          {{ saveButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Absence } from '~/types';
import { absenceTypes } from '~/data/absenceTypes';

// Props
interface Props {
  absences: Map<string, Absence[]>;
}

const props = defineProps<Props>();

// Emits para comunicación con el padre
const emit = defineEmits<{
  absenceChanged: [absences: Map<string, Absence[]>];
  error: [message: string];
  success: [message: string];
}>();

// Usar el composable
const {
  dialog,
  selectedEmployee,
  selectedDate,
  dialogMode,
  editingAbsence,
  absenceForm,
  dialogTitle,
  saveButtonText,
  isEditMode,
  openDialog,
  closeDialog,
  saveAbsence,
  deleteAbsence,
  validateForm
} = useAbsenceDialog();

// Estado de loading para botones
const saveLoading = ref(false);
const deleteLoading = ref(false);

/**
 * Maneja el cierre del diálogo
 */
const handleClose = () => {
  closeDialog();
};

/**
 * Maneja el guardado de la ausencia
 */
const handleSave = async () => {
  saveLoading.value = true;
  
  try {
    const result = saveAbsence(props.absences);
    
    if (result.success) {
      emit('absenceChanged', props.absences);
      emit('success', 
        dialogMode.value === 'create' 
          ? 'Absence created successfully' 
          : 'Absence updated successfully'
      );
    } else {
      const errorMessage = result.errors?.join(', ') || 'Unknown error occurred';
      emit('error', errorMessage);
    }
  } catch (error) {
    console.error('Error in handleSave:', error);
    emit('error', 'An unexpected error occurred');
  } finally {
    saveLoading.value = false;
  }
};

/**
 * Maneja la eliminación de la ausencia
 */
const handleDelete = async () => {
  deleteLoading.value = true;
  
  try {
    const result = deleteAbsence(props.absences);
    
    if (result.success) {
      emit('absenceChanged', props.absences);
      emit('success', 'Absence deleted successfully');
    } else {
      emit('error', result.error || 'Error deleting absence');
    }
  } catch (error) {
    console.error('Error in handleDelete:', error);
    emit('error', 'An unexpected error occurred while deleting');
  } finally {
    deleteLoading.value = false;
  }
};

// Exponer método para abrir el diálogo desde el componente padre
const open = (employee: any, date: Date) => {
  openDialog(employee, date, props.absences);
};

// Exponer métodos al padre
defineExpose({
  open
});
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.v-card-title {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.v-card-text {
  padding-top: 16px;
}

.employee-info {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>