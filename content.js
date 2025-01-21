function setupAutoFill() {
    const projectContainer = document.querySelector('[data-identifier="task-dialog-task-project"]');
    const taskNameContainer = document.querySelector('[data-identifier="task-dialog-task-name"]');
    const taskListContainer = document.querySelector('[data-identifier="task-dialog-task-list"]');

    if (projectContainer && taskNameContainer) {
        const projectInput = projectContainer.querySelector('input[type="text"]');
        const taskNameInput = taskNameContainer.querySelector('input.v-field__input'); // Selector preciso

        if (projectInput && taskNameInput) {
            let lastProjectName = "";

            // Actualizar el prefijo del nombre de la tarea
            const updateTaskNamePrefix = () => {
                const projectName = projectInput.value.replace(/^#\d{1,4}\.\s*/, "").toUpperCase().trim();

                if (!projectName || projectName === lastProjectName) return;

                const currentTaskName = taskNameInput.value.trim();
                const existingProjectPrefix = /^[^|]+\|\s*/.exec(currentTaskName);

                let newTaskName = currentTaskName;

                if (existingProjectPrefix) {
                    newTaskName = `${projectName} | ${currentTaskName.replace(existingProjectPrefix[0], "").trim()}`;
                } else {
                    newTaskName = `${projectName} | ${currentTaskName}`;
                }

                // Actualizar el valor y disparar el evento 'input' para reflejar el cambio en la UI
                taskNameInput.value = newTaskName.trim();
                taskNameInput.dispatchEvent(new Event('input', { bubbles: true }));
                lastProjectName = projectName;

                console.log("Nombre de la tarea actualizado:", taskNameInput.value);
            };

            // Actualizar al escribir en el campo del proyecto
            projectInput.addEventListener('input', updateTaskNamePrefix);

            // Observar cambios en el valor del campo del proyecto
            const projectObserver = new MutationObserver(() => {
                updateTaskNamePrefix();
            });

            projectObserver.observe(projectInput, { attributes: true, attributeFilter: ['value'] });

            // Listener global para clicks en botones o en task-list
            document.body.addEventListener('click', (event) => {
                const clickedElement = event.target;

                if (clickedElement.tagName === 'BUTTON' || (taskListContainer && taskListContainer.contains(clickedElement))) {
                    console.log("Clic detectado. Verificando nombre de la tarea...");
                    updateTaskNamePrefix();
                }
            });

            console.log("Listeners configurados para manejar el nombre de la tarea.");
        } else {
            console.warn("No se encontraron los inputs necesarios.");
        }
    } else {
        console.warn("No se encontraron los contenedores necesarios.");
    }
}

// Observar el DOM para detectar el modal con clase `shadow-dialog`
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const shadowDialog = document.querySelector('.shadow-dialog');
            if (shadowDialog) {
                console.log("Modal detectado, configurando listeners...");
                setupAutoFill();
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

console.log("Observador configurado para detectar el modal.");