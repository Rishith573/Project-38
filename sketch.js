var dog, dogImg, happydogImg;
var foodS, foodStock, database;
var foodObj;
var fedTime, lastFed, feed, addFood;
var bedRoomImg, gardenImg, washRoomImg, livingRoomImg;
var Bath, Sleep, Play, PlayInGarden;

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

  Bath = createButton("I want to take bath");
  Bath.position(580, 125);

  Sleep = createButton("I am very sleepy");
  Sleep.position(710, 125);

  Play = createButton("Lets play !");
  Play.position(500, 160);

  PlayInGarden = createButton("Lets play in park");
  PlayInGarden.position(585, 160);

  getGameState();

  feed = createButton("Feed the dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);


}


function draw() {  
background(46, 139, 87);
currentTime = hour();
if(currentTime ==(lastFed + 1)){
  gameState = "Playing";
  updateGameState();
  foodObj.garden();
}else if(currentTime ==(lastFed + 2)){
  gameState = "Sleeping";
  updateGameState();
  foodObj.bedroom();
}else if(currentTime ==(lastFed + 3)){
  gameState = "Bathing";
  updateGameState();
  foodObj.washroom();
}else {
  gameState = "Hungry";
  updateGameState();
  foodObj.display();
}

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

if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}else {
  feed.show();
  addFood.show();
  dog.addImage(dogImg);
}

if(gameState === 1){
  dog.changeImage(happyDog);
  dog.scale = 0.175;
  dog.y = 250;
}

if(gameState === 2){
  dog.changeImage(dogImg);
  dog.scale = 0.175;
  foodObj.visible = false;
  dog.y = 250;
}


if(gameState === 3){
  dog.addImage(washRoomImg);
  dog.scale = 1;
  foodObj.visible = false;
}


if(Sleep.mousePressed(function(){
  gameState = 4;
  database.ref('/').update({'gameState' :gameState});
}));
if(gameState === 4){
  dog.addImage(bedRoomImg);
  dog.scale = 1;
  foodObj.visible = false;
}


if(Play.mousePressed(function(){
  gameState = 5;
  database.ref('/').update({'gameState' :gameState});
}));
if(gameState === 5){
  dog.addImage(livingRoomImg);
  dog.scale = 1;
  foodObj.visible = false;
}


if(PlayInGarden.mousePressed(function(){
  gameState = 6;
  database.ref('/').update({'gameState' :gameState});
}));
if(gameState === 6){
  dog.y = 175;
  dog.addImage(gardenImg);
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

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
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

function updateGameState(){
  database.ref("/").update({
    gameState: gameState
  });
}