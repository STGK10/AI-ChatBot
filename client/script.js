import bot from './assets/bot.svg';
import user from './assets/user.svg';

//Let us target our elements manually 
const form =  document.querySelector('form'); //got the form by tag name because it is the only form in our index html
const chatContainer = document.querySelector('#chat_container') // got the chatContainer by ID

let loadInterval;

//function to load our message 
function loader(element){
  
  element.textContent =''; //to make sure it is empty at the start
  
  //every 300 milisec we want to do something
  loadInterval = setInterval(() => {
    //update the text content of the loading indicator
    element.textContent += '.';
    
    //If the loading indicator has reached three dots, reset it 
    if (element.textContent === '....'){
      element.textContent = '';
    }
  }, 300);
}

//Let create a function for the typing user experience so that the text won't just appear but the bot will write step by step every 20 milisex
function typeText(element, text){
  let index = 0;

  let interval = setInterval (() => {
    if (index < text.length){
      element.innerHTML += text.charAt(index); // get the character under a specific index
      index ++ ; //implement the index
    } else{
      clearInterval(interval); //if we have reach the end of the text we clear the interval
    }
  }, 20) 


}

//Let create a function to generate unique ID with the current time and date
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;

}
//here the value is going to be the AI generated message
function chatStrip (isAi, value, uniqueId){
  return (
    `
      <div class="wrapper ${isAi && 'ai'}"> 
       <div class="chat">
         <div className="profile">
           <img
              src="${isAi ? bot : user} "
              alt="${isAi ? 'bot' : 'user'}"
           />
         </div>
         <div class="message" id=${uniqueId}>${value}</div> 
       </div>
      </div>
    `
  )
}

//let create our handle submit function
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form); //pass the form element from our html

  //generate the user's chatstripe
  chatContainer.innerHTML += chatStrip(false, data.get('prompt')); //when we are typing

  form.reset();

  // generate a unique ID for each message from bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStrip(true, "", uniqueId); //when the Ai is typing 
  chatContainer.scrollTop = chatContainer.scrollHeight; //pu the new message in view

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode ===13){
    handleSubmit(e);
  }
})