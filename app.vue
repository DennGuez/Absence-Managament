<!-- App.vue -->
<template>
  <v-app>
    <!-- Header -->
    <Header />
    
    <!-- Main content -->
    <v-main>
      <div class="calendar-container">
        <div class="calendar-grid" :style="gridStyle" ref="calendarGrid">
          <!-- Header row -->
          <div class="header-cell employee-info">
            <v-icon class="me-2">mdi-account-hard-hat</v-icon>
            Employee Information
          </div>
          
          <div 
            v-for="date in visibleDates" 
            :key="date.dateString"
            class="header-cell cell date-header"
            :title="formatDateTitle(date.date)"
          >
            {{ formatDateHeader(date.date) }}
          </div>
          
          <!-- Employee rows -->
          <template v-for="employee in visibleEmployees" :key="employee.id">
            <div class="employee-info">
              <div>
                <div class="font-weight-bold">
                  {{ employee.firstName }} {{ employee.lastName }}
                </div>
                <div class="text-caption text-grey-600">
                  ID: {{ employee.personnelNumber }}
                </div>
              </div>
            </div>
            
            <div
              v-for="date in visibleDates"
              :key="`${employee.id}-${date.dateString}`"
              class="cell"
              :class="getCellClass(employee.id, date.date)"
              @click="handleCellClick(employee, date.date)"
              :title="getCellTooltip(employee, date.date)"
            >
            </div>
          </template>
        </div>
      </div>
    </v-main>

    <!-- Absence Management Dialog -->
    <AbsenceDialog 
      ref="absenceDialogRef"
      :absences="absences"
      @absence-changed="handleAbsenceChanged"
      @error="handleError"
      @success="handleSuccess"
    />
    
    <!-- Info Dialog -->
    <InfoDialog />
    
    <!-- Loading overlay -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64" />
    </v-overlay>

    <!-- Snackbar para mensajes -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
      location="top right"
    >
      {{ snackbar.message }}
      
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { today, yearDates } from './helpers/dateHelper';
import type { Employee, Absence, DateItem } from './types';
import InfoDialog from './components/InfoDialog.vue';
import AbsenceDialog from './components/AbsenceDialog.vue';

// Composables
const { employees, absences, loading, generateRandomData } = useRandomData();

// Referencias
const absenceDialogRef = ref<InstanceType<typeof AbsenceDialog>>();

// Estado del snackbar para mensajes
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
});

// Computed properties
const visibleEmployees = computed<Employee[]>(() => employees.value);
const visibleDates = computed<DateItem[]>(() => yearDates.value);

const gridStyle = computed<{ gridTemplateColumns: string; gridTemplateRows: string }>(() => ({
  gridTemplateColumns: `300px repeat(${visibleDates.value.length}, 40px)`,
  gridTemplateRows: `40px repeat(${visibleEmployees.value.length}, 40px)`
}));

// Get CSS classes for a calendar cell
const getCellClass = (employeeId: string, date: Date): string => {
  const classes: string[] = [];
  const dateString = date.toISOString().split('T')[0]!;
  const dayOfWeek = date.getDay();
  
  // Verificar si es hoy
  if (dateString === today.toISOString().split('T')[0]) {
    classes.push('today');
  }
  
  // Verificar si es fin de semana
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    classes.push('weekend');
    return classes.join(' ');
  }
  
  // Verificar ausencia
  const employeeAbsences = absences.value.get(employeeId) || [];
  const isAbsent = employeeAbsences.some((absence: Absence) => {
    return dateString >= absence.startDate && dateString <= absence.endDate;
  });
  
  if (isAbsent) {
    classes.push('absent');
  } else {
    classes.push('present');
  }
  
  return classes.join(' ');
};

//  Get tooltip for a calendar cell
const getCellTooltip = (employee: Employee, date: Date): string => {
  const dateString = date.toISOString().split('T')[0]!;
  const dayOfWeek = date.getDay();
  const formattedDate = date.toLocaleDateString();
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return `${employee.firstName} ${employee.lastName} - ${formattedDate} (Weekend)`;
  }
  
  const employeeAbsences: Absence[] = absences.value.get(employee.id) || [];
  const absence = employeeAbsences.find((abs: Absence) => 
    dateString >= abs.startDate && dateString <= abs.endDate
  );
  
  if (absence) {
    return `${employee.firstName} ${employee.lastName} - ${formattedDate} (${absence.type})`;
  } else {
    return `${employee.firstName} ${employee.lastName} - ${formattedDate} (Present)`;
  }
};

// format date for header
const formatDateHeader = (date: Date): string => {
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

// format date for title
const formatDateTitle = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Handle click on calendar cell
const handleCellClick = (employee: Employee, date: Date): void => {
  if (absenceDialogRef.value) {
    absenceDialogRef.value.open(employee, date);
  }
};

// Handle absence changes
const handleAbsenceChanged = (updatedAbsences: Map<string, Absence[]>): void => {
  // The state is updated by reference, but we can do additional actions like saving to an API
  // aditionals actions like saving to an API
  console.log('Absences updated:', updatedAbsences);
  
  // Here you could make a call to the API to persist the changes (GraphQL, REST API, etc.)
  // await saveAbsencesToAPI(updatedAbsences);
};

// handle errors in dialog
const handleError = (message: string): void => {
  snackbar.message = message;
  snackbar.color = 'error';
  snackbar.show = true;
};

// handle success in dialog
const handleSuccess = (message: string): void => {
  snackbar.message = message;
  snackbar.color = 'success';
  snackbar.show = true;
};

// Initialize data when mounted
onMounted((): void => {
  generateRandomData();
});
</script>

<style>
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
}

.calendar-container {
  height: 100vh;
  overflow: hidden;
}

.calendar-grid {
  display: grid;
  overflow: auto;
  height: calc(100vh - 64px);
}

.employee-row {
  display: contents;
}

.cell {
  min-width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.cell:hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.cell.present {
  background-color: #4caf50;
  color: white;
}

.cell.absent {
  background-color: #f44336;
  color: white;
}

.cell.weekend {
  background-color: #9e9e9e;
  color: white;
}

.cell.today {
  border: 3px solid #2196f3;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { border-color: #2196f3; }
  50% { border-color: #64b5f6; }
  100% { border-color: #2196f3; }
}

.header-cell {
  background-color: #1976d2;
  color: white;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 10;
}

.employee-info {
  color: #000;
  background-color: #f5f5f5;
  position: sticky;
  left: 0;
  z-index: 100;
  border-right: 2px solid #1976d2;
  min-width: 300px;
  padding: 8px;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.virtual-scroll-container {
  overflow: auto;
  height: 100%;
}

.date-header {
  writing-mode: vertical-lr;
  text-orientation: mixed;
  font-size: 10px;
  padding: 4px;
}
</style>