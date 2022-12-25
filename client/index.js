import './style.css';
import israt_icon from './icons/bot.svg';
import user from './icons/user.svg';

const form = document.querySelector('form');
const chatcontainer = document.querySelector('#chat_container');

let loadInterval;

//function load message

function loader(element){
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....'){
            element.textContent = '';
        }
    }, 300)/* 300 milli second */ 
}
// Type Text function 

function typeText(element, text){
    let index = 0;

    let interval = setInterval(() =>{
        if(index < text.length){
            element.innerHTML += text.charAt(index);
            index++;
        }
        else{
            clearInterval(interval);
        }
    }, 20 /* 20 milli second*/)
}

// generate unique ID for  evry single message 
function generateUniqueId(){
    const timestamp = Date.now();
    const randomNumber = Math.random();

    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}` ;
}

//lets know who speeking now Israt or Human  ?
function chatStripe (isIsrat, value, uniqueId){
    return(
        /*create template strings*/
        
        `
            <div class="wrapper ${isIsrat && 'ai'}">
                <div class="chat>
                    <div class="profile">
                        <img 
                            src="${isIsrat ? israt_icon : user}"
                            alt= "${isIsrat ? 'israt_icon' : user}"
                        />
                    </div>
                    <div class= "message" id= ${uniqueId} > ${value}</div>> </div>
                </div>
            </div>
        
        `
    )
}

//ISRAT Generated response 
const handleSubmit = async(e)=>{
    e.preventDefault();
    /*Get the Data from the form*/

    const data = new FormData(form);

    //generate user chat Stripe 
    chatcontainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();

    //generate unique ID 
    const uniqueId = generateUniqueId();
    //generate  ISRAT chat stripe 
    chatcontainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatcontainer.scrollTop = chatcontainer.scrollHeight;
    const message_div = document.getElementById(uniqueId);

    loader(message_div);

    //fetch data from the israt server -> ISRAT response
    const response = await fetch('http://locathost:5000',{

        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },

        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })
    clearInterval(loadInterval);
    message_div.innerHTML = '';

    if(response.ok){
        const data = await response.json();
        const parseData = data.israt_icon.trim();

        typeText(message_div, parseData);
    }else{
        const err = await response.text();
        message_div.innerHTML = "Something is going wron";
        alert(err);
    }
}
form.addEventListener('submit', handleSubmit);
//get ENTER keyboard 
form.addEventListener('keyup', (e) =>{
    if( e.keyCode === 13){
        handleSubmit(e);
    }
})