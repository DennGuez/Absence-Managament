<template>
    <v-dialog v-model="showInfo" max-width="500px">
        <v-card>
            <v-card-title>Application Info</v-card-title>
            <v-card-text>
                <v-list>
                    <v-list-item>
                        <v-list-item-title>🔴 Red Cell</v-list-item-title>
                        <v-list-item-subtitle>Employee is absent</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>🟢 Green Cell</v-list-item-title>
                        <v-list-item-subtitle>Employee is present</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>⚫ Grey Cell</v-list-item-title>
                        <v-list-item-subtitle>Weekend (non-working day)</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>🔵 Blue Border</v-list-item-title>
                        <v-list-item-subtitle>Today's date</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                <v-divider class="my-4"></v-divider>
                <p class="text-body-2">
                    Click on any cell to create or edit absences. 
                    Use the refresh button to generate new random data.
                </p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="showInfo = false">Got it</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup lang="ts">
import { useShowDialogs } from '~/store/useState';
const { showInfo } = useShowDialogs()
</script>