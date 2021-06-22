class Food {
    constructor(){
        this.foodStock = 0;
        this.image = loadImage("images/milk.png");
        this.lastFed;

    }

    updateFoodStock(foodStock){
        if(foodStock>=0){
            this.foodStock = foodStock;
        }else{
            this.foodStock = 0;
        }
    }

    getFedTime(lastFed){
        this.lastFed = lastFed;
    }

    deductFood(){
        if(this.foodStock > 0){
            this.foodStock = this.foodStock-1
        }
    }

    getFoodStock(){
       return this.foodStock;
    }

    bedroom(){
        background(bedRoomImg);
    }

    garden(){
        background(gardenImg);
    }

    washroom(){
        background(washRoomImg);
    }

    livingroom(){
        background(livingRoomImg);
    }

    display(){
        var x = 80, y = 100;
        push();
        imageMode(CENTER);
        image(this.image, 720, 220, 70, 70);

        if(this.foodStock != 0){
            for (var i = 0; i < this.foodStock; i++){
                if(i%10 == 0){
                    x = 80;
                    y = y+50;
                }
                image(this.image, x, y, 50, 50);
                x = x+30
            }
        }
        pop();
    }
    
}