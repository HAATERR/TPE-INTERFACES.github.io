document.addEventListener('DOMContentLoaded', () => {
  
  const canvas_width = 800;

 
  const model = new Model(canvas_width, Tube, AltBird);

  const view = new View();

  const controller = new Controller(model, view);

});
