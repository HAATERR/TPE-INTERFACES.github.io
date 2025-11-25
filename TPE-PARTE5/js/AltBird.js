class AltBird{
    constructor(width, height, posX, posY){
        this.width = width;
        this.height = height;
        this.posX = posX;
        this.posY = posY;
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

    getPosY(){
        return this.posY;
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
}