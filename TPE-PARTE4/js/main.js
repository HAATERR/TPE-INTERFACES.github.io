document.addEventListener('DOMContentLoaded', () => {
    const cant_movements = 31;
    const canvas_w = 800;
    const canvas_h = 800;
    const duration = 35000;
    const temp = document.getElementById('timer');

    const model = new Model(cant_movements);
    const view = new View('canvas', canvas_w, canvas_h, duration, temp, 7, 7);
    const controller = new Controller(model, view);
});
