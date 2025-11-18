export function createUserCard(user) {
    // Gebruik de getLabel() methode van het User object
    const label = user.getLabel();


    return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${user.name}
            <span class="badge bg-primary rounded-pill">
                ${label}
            </span>
        </li>
    `;
}