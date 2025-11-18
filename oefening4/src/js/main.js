//import van onze custom css
import '../scss/styles.scss'
//import all of bootstrap zijn js
import * as bootstrap from 'bootstrap'

// js/main.js

// --- Imports ---
import User from './components/userModel';
import { createUserCard } from './components/userCard';

// --- DOM-elementen & State ---
const nameInput = document.getElementById("ex4_name");
const ageInput = document.getElementById("ex4_age");
const addButton = document.getElementById("ex4_btn");
const statusBox = document.getElementById("ex4_status");
const userList = document.getElementById("ex4_list");

/** @type {User[]} */
let users = [];

// --- Functies ---

/**
 * Update de statusmelding op basis van het aantal gebruikers.
 */
function updateStatus() {
    if (users.length === 0) {
        statusBox.textContent = "Nog geen gebruikers toegevoegd.";
        statusBox.className = "alert alert-secondary mb-3";
    } else {
        statusBox.textContent = `${users.length} gebruiker(s) succesvol toegevoegd aan de lijst.`;
        statusBox.className = "alert alert-success mb-3";
    }
}

/**
 * Rendert de volledige lijst van gebruikerskaarten in de DOM.
 */
function renderList() {
    // Genereer de HTML string voor alle users
    const listHtml = users.map(user => createUserCard(user)).join('');

    // Update de DOM in één keer
    userList.innerHTML = listHtml;

    // Update ook de status
    updateStatus();
}

/**
 * Handelt het 'toevoegen gebruiker' event af.
 */
function handleAddUser() {
    const name = nameInput.value.trim();
    const ageString = ageInput.value.trim();
    const age = parseInt(ageString);

    // --- Validatie ---
    if (name === "") {
        statusBox.textContent = "Fout: Naam mag niet leeg zijn.";
        statusBox.className = "alert alert-danger mb-3";
        return;
    }

    if (isNaN(age) || age <= 0) {
        statusBox.textContent = "Fout: Leeftijd moet een positief getal zijn.";
        statusBox.className = "alert alert-danger mb-3";
        return;
    }

    // --- Nieuw User Object aanmaken ---
    const newUser = new User(name, age);

    // Bewaar de user in de array
    users.push(newUser);

    // --- UI Opschonen en Renderen ---
    nameInput.value = ''; // Input leegmaken
    ageInput.value = '';

    // Focus terug op de naam voor snelle invoer
    nameInput.focus();

    // Lijst en status updaten
    renderList();
}

// --- Init (Event Listener) ---
document.addEventListener("DOMContentLoaded", () => {
    // Event afhandeling via addEventListener
    addButton.addEventListener("click", handleAddUser);

    // Optioneel: Toestaan om toe te voegen met 'Enter' in het leeftijd-veld
    ageInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            handleAddUser();
        }
    });

    // Zorg dat de initiële status correct is
    updateStatus();
});