class Tube{
    constructor(width, height, posX){
        this.width = width;
        this.height = height;
        this.posX = posX;
    }

    getHeight(){
        return this.height;
    }

    getWidth(){
        return this.width;
    }

    getPosX(){
        return this.posX;
    }

    setHeight(new_height){
        this.height = new_height;
    }

    setWidth(new_width){
        this.width = new_width;
    }

    setPosX(newPosX){
        this.posX = newPosX;
    }

    touched(){

    }

 
}