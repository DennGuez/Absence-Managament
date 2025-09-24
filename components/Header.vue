<template>
    <v-app-bar color="primary" dark>
        <v-app-bar-title>
            <v-icon class="me-2">mdi-calendar-account</v-icon>
            Employee Absence Calendar
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="generateRandomData">
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon @click="showInfo = true">
            <v-icon>mdi-information</v-icon>
        </v-btn>
    </v-app-bar>
</template>
<script setup lang="ts">
import { useShowDialogs } from '~/store/useState';
const { showInfo } = useShowDialogs()
const { generateRandomData } = useRandomData()
</script>   