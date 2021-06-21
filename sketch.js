var dog, dogImg, happydogImg;
var foodS, foodStock, database;
var foodObj;
var fedTime, lastFed, feed, addFood;
var bedRoomImg, gardenImg, washRoomImg, livingRoomImg;
var Bath, Sleep, Play, PlayInGarden;
var gameState

function preload()
{
	dogImg = loadImage("images/dog.png");
  happydogImg = loadImage("images/happydog.png");
  
  bedRoomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washRoomImg = loadImage("images/Wash Room.png");
  livingRoomImg = loadImage("images/Living Room.png");
}

function setup() {
  
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  dog = createSprite(800, 250, 20, 20)
  dog.addImage(dogImg)
  dog.addImage("happyDog", happydogImg);
  dog.scale = 0.25;

  

  getGameState();

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  Bath = createButton("I want to take bath");
  Bath.position(580, 125);

  Sleep = createButton("I am very sleepy");
  Sleep.position(710, 125);

  Play = createButton("Lets play !");
  Play.position(500, 160);

  PlayInGarden = createButton("Lets play in park");
  PlayInGarden.position(585, 160);

 


}


function draw() {  
background(46, 139, 87);
foodObj.display();
//writeStock(foodS);
currentTime = hour();
/*if(currentTime ==(lastFed + 1)){
  updateGameState("Playing");
  foodObj.garden();
}else if(currentTime ==(lastFed + 2)){
  updateGameState("Sleeping");
  foodObj.bedroom();
}else if(currentTime ==(lastFed + 3)){
  updateGameState("Bathing");
  foodObj.washroom();
}else {
  updateGameState("Hungry");
  
}*/



if(foodS == 0){
  dog.addImage(dogImg);
  foodObj.visible = false;
}else{
  dog.changeImage("happyDog");
  foodObj.visible = true;
}


fedTime = database.ref('FeedTime');
fedTime.on("value", function (data){
  lastFed = data.val();
})

/*if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else {
  feed.show();
  addFood.show();
  dog.addImage(dogImg);
}*/

if(gameState === 1){
  dog.changeImage("happyDog");
  dog.scale = 0.175;
  dog.y = 250;
}

if(gameState === 2){
  dog.changeImage(dogImg);
  dog.scale = 0.175;
  foodObj.visible = false;
  dog.y = 250;
}

Bath.mousePressed(function(){
  database.ref('/').update({'gameState' :3});
})

if(gameState === 3){
  foodObj.washroom();
  dog.scale = 1;
  dog.visible = false;
}

Sleep.mousePressed(function(){
  database.ref('/').update({'gameState' :4});
})

if(gameState === 4){
  foodObj.bedroom();
  dog.scale = 1;
  dog.visible = false;
}


Play.mousePressed(function(){
  database.ref('/').update({'gameState' :5});
});

if(gameState === 5){
  foodObj.livingroom();
  dog.scale = 1;
  dog.visible = false;
}


PlayInGarden.mousePressed(function(){
  database.ref('/').update({'gameState' :6});
});

if(gameState === 6){
  dog.y = 175;
  foodObj.garden();
  dog.scale = 1;
  foodObj.visible = false;
}


fill(255, 255, 254);
textSize(15);
if(lastFed >= 12){
  text("Last Feed : " + lastFed%12 + "PM", 350, 30);
}
else if(lastFed == 0){
  text ("Last Feed : 12AM", 350, 30);
}
else{
  text("Last Feed : " + lastFed + "AM", 350, 30)
}

text("Time since last fed: " + (currentTime - lastFed), 550, 30);

drawSprites();

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happydogImg);
  dog.visible = true;
  updateGameState(1);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  dog.visible = true;
  updateGameState(2);
  foodS++
  database.ref('/').update({
    Food : foodS
  })
}

function getGameState(){
  gameStateRef = database.ref("gameState");
  gameStateRef.on("value", function(data){
    gameState = data.val();
  });
}

function updateGameState(value){
  database.ref("/").update({
    gameState: value
  });
}