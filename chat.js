// "use strict";

const activechatspace = document.getElementById("activechatspace");
const messagespace = document.querySelector(".messagespace");
const noactivechat = document.getElementById("noactivechat");

const textInput = document.getElementById("textInput");
const receiverprof = document.getElementById("receiverprof");
const friendprof = document.querySelector(".friendprof");
const friendname = document.querySelector(".friendname");
const sendbuton = document.getElementById("sendbuton");
const deletechat = document.querySelector(".deletechat");

const tumapicha = document.getElementById("submitcontainer");

let receiverData = [];
let messageLoaded = false;
let chatMessages = {};

document.addEventListener("click", function (event) {
  let receiverId, receiverName, receiverProfilePic, convorId, senderId;
  let target = event.target;
  let onechat = target.closest(".onechat");

  if (onechat) {
    messagespace.innerHTML = "";
    receiverId = onechat.getAttribute("data-receiver-id");
    receiverName = onechat.getAttribute("data-receiver-username");
    receiverProfilePic = onechat.getAttribute("data-profilepic-id");
    convorId = onechat.getAttribute("data-convor-id");
    senderId = onechat.getAttribute("data-currentLogedInUserId");

    activechatspace.style.right = "0";
    noactivechat.style.display = "none";
    friendprof.src = receiverProfilePic;
    friendname.textContent = receiverName;

    receiverData = [receiverId, senderId, convorId];

    console.log(receiverData)

    if (chatMessages[convorId]) {
      chatMessages[convorId].forEach(function (oneMessageContainer) {
        messagespace.appendChild(oneMessageContainer);
        console.log('messeges')
      });
    } else {
      addExistingMessage(convorId);
      console.log("what's wrong here");
    }

    // console.log(`receiverData: ${receiverData}`)
  }
});

sendbuton.addEventListener("click", sendMessage);
textInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  let sentMessage = textInput.value.trim();
  let receiverId = receiverData[0];
  let senderId = receiverData[1];
  let convorId = receiverData[2];

  if (sentMessage !== "") {
    let messagePackage = {
      sentMessage: sentMessage,
      receiverId: receiverId,
      senderId: senderId,
      convorId: convorId,
      onloadFlag: "not real",
    };

    textInput.value = "";

    fetch("chatsendmessage.php", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ messagePackage }),
    }).then(function (response) {
      if (response.status === 200) {
        return response.json().then(function (data) {
          // console.log(data);
          messagespace.innerHTML += displayRecentSentMessage(data);
          messagespace.scrollTop = messagespace.scrollHeight;

          // let newMessagehtmlstring = displayRecentSentMessage(data);
          // let newMessageArray = htmlStringToArray(newMessagehtmlstring)
          // chatMessages[convorId].push(newMessageArray);
        });
      }
    });
  }
}

function sendPhoto() {
  let receiverId = receiverData[0];
  let senderId = receiverData[1];
  let convorId = receiverData[2];
  let formData = new FormData(tumapicha);

  formData.append("receiverId", receiverId);
  formData.append("senderId", senderId);
  formData.append("convorId", convorId);

  fetch("multimedia.php", {
    method: "POST",
    body: formData,
  }).then(function (response) {
    console.log(formData);
    if (response.status === 201) {
      return response.json().then(function (data) {
        console.log(data);
        messagespace.innerHTML += displayRecentSentPhoto(data);
        messagespace.scrollTop = messagespace.scrollHeight;
      });
    }
  });
}

tumapicha.addEventListener("submit", function (event) {
  event.preventDefault();
  sendPhoto();
  console.log("oyaaaaaaaaaaaaaaaaaaaa");
});

function addExistingMessage(convoId) {
  if (!chatMessages[convoId]) {
    chatMessages[convoId] = [];
  }
  let onloadFlag = "initial_load";
  let convorId = convoId;
  let senderId = receiverData[1];

  let messagePackage = {
    onloadFlag: onloadFlag,
    convorId: convorId,
  };

  // console.log(messagePackage)

  fetch("chatsendmessage.php", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({ messagePackage }),
  }).then(function (response) {
    if (response.status === 201) {
      return response.json().then(function (data) {
        let allMessageContainers = displayExistingMessages(data, senderId);

        // console.log(data);

        chatMessages[convoId].length = 0;

        allMessageContainers.forEach(function (oneMessageContainer) {
          chatMessages[convorId].push(oneMessageContainer); // Store messages in the array
        });

        chatMessages[convorId].forEach(function (oneMessageContainer) {
          messagespace.appendChild(oneMessageContainer);
        });
      });
    }
  });
}

function displayExistingMessages(data, senderId) {
  let allMessageContainers = [];

  console.log(data);

  data.forEach(function (message) {
    // outgoing message container
    const outgoingMain = document.createElement("div");
    outgoingMain.classList.add("outgoing");

    const outgoingContainer = document.createElement("div");
    outgoingContainer.classList.add("outgoingmessage");

    const actualoutgoingmessage = document.createElement("p");
    actualoutgoingmessage.classList.add("actualoutgoingmessage");

    // incoming message container
    const incomingMain = document.createElement("div");
    incomingMain.classList.add("incoming");

    const incomingContainer = document.createElement("div");
    incomingContainer.classList.add("incomingmessage");

    const actualincomingmessage = document.createElement("p");
    actualincomingmessage.classList.add("actualincomingmessage");

    //
    //
    //
    //
    const outgoingmultmedia = document.createElement("div");
    outgoingmultmedia.classList.add("outgoingmultmedia");

    const outgoingmultimediacontainer = document.createElement("div");
    outgoingmultimediacontainer.classList.add("outgoingmultimediacontainer");

    const actualoutgoingmultmedia = document.createElement("img");
    actualoutgoingmultmedia.classList.add("actualoutgoingmultmedia");

    // incoming Multimedia container
    const incomingmultmedia = document.createElement("div");
    incomingmultmedia.classList.add("incomingmultmedia");

    const incomingmultimediacontainer = document.createElement("div");
    incomingmultimediacontainer.classList.add("incomingmultimediacontainer");

    const actualincomingmultmedia = document.createElement("img");
    actualincomingmultmedia.classList.add("actualincomingmultmedia");

    console.log(message);
    console.log(senderId);

    if (message.sender_id == senderId && message.multimedia_status == 0) {
      actualoutgoingmessage.textContent = message.message;

      outgoingContainer.appendChild(actualoutgoingmessage);
      outgoingMain.appendChild(outgoingContainer);

      allMessageContainers.push(outgoingMain);
      console.log(`outgoing: ${message.multimedia_status}`)
    } else if (message.sender_id != senderId && message.multimedia_status == 0) {
      actualincomingmessage.textContent = message.message;

      incomingContainer.appendChild(actualincomingmessage);
      incomingMain.appendChild(incomingContainer);

      allMessageContainers.push(incomingMain);
    } else if (message.sender_id == senderId && message.multimedia_status == 1) {
      actualoutgoingmultmedia.src = message.message;

      outgoingmultimediacontainer.appendChild(actualoutgoingmultmedia);
      outgoingmultmedia.appendChild(outgoingmultimediacontainer);

      allMessageContainers.push(outgoingmultmedia);
    } else if (message.sender_id != senderId && message.multimedia_status == 1) {
      actualincomingmultmedia.src = message.message;

      incomingmultimediacontainer.appendChild(actualincomingmultmedia);
      incomingmultmedia.appendChild(incomingmultimediacontainer);

      allMessageContainers.push(incomingmultmedia);
    }
  });

  console.log(allMessageContainers);

  return allMessageContainers;
}

function displayRecentSentMessage(data) {
  // console.log(data);

  // Outgoing Messages Containers
  const outgoingMain = document.createElement("div");
  outgoingMain.classList.add("outgoing");

  const outgoingContainer = document.createElement("div");
  outgoingContainer.classList.add("outgoingmessage");

  const actualoutgoingmessage = document.createElement("p");
  actualoutgoingmessage.classList.add("actualoutgoingmessage");
  actualoutgoingmessage.textContent = data.message;

  outgoingContainer.appendChild(actualoutgoingmessage);
  outgoingMain.appendChild(outgoingContainer);

  return outgoingMain.outerHTML;
}

function displayRecentSentPhoto(data) {
  // console.log(data);

  // Outgoing Multimedia Containers
  const outgoingmultmedia = document.createElement("div");
  outgoingmultmedia.classList.add("outgoingmultmedia");

  const outgoingmultimediacontainer = document.createElement("div");
  outgoingmultimediacontainer.classList.add("outgoingmultimediacontainer");

  const actualoutgoingmultmedia = document.createElement("img");
  actualoutgoingmultmedia.classList.add("actualoutgoingmultmedia");
  actualoutgoingmultmedia.src = data.message;

  outgoingmultimediacontainer.appendChild(actualoutgoingmultmedia);
  outgoingmultmedia.appendChild(outgoingmultimediacontainer);

  return outgoingmultmedia.outerHTML;
}

document.addEventListener("contextmenu", function (event) {
  let receiverId, receiverName, receiverProfilePic, convorId, senderId;
  let target = event.target;
  let onechat = target.closest(".onechat");

  if (onechat) {
    deletechat.style.display = "block";
    receiverId = onechat.getAttribute("data-receiver-id");
    receiverName = onechat.getAttribute("data-receiver-username");
    receiverProfilePic = onechat.getAttribute("data-profilepic-id");
    convorId = onechat.getAttribute("data-convor-id");
    senderId = onechat.getAttribute("data-currentLogedInUserId");

    receiverData = [receiverId, senderId, convorId];

    // console.log(receiverData)

    if (chatMessages[convorId]) {
      chatMessages[convorId].forEach(function (oneMessageContainer) {
        messagespace.appendChild(oneMessageContainer);
        // console.log('messeges')
      });
    } else {
      addExistingMessage(convorId);
    }

    // console.log(`receiverData: ${receiverData}`)
  }
});

document.addEventListener("click", function (event) {
  if (event.target.matches(".deletechat")) {
  }
});

function deleteConvo() {
  let receiverId = receiverData[0];
  let senderId = receiverData[1];
  let convorId = receiverData[2];

  let convoPackage = {
    receiverId: receiverId,
    senderId: senderId,
    convorId: convorId,
    chatflag: "deleteChat",
  };

  fetch("convo.inc.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ convoPackage }),
  })
    .then(function (response) {
      if (response.status === 200) {
        return response.json().then(function (data) {
          const convoId = data.convoId;
          const userOneFriendData = data.userOneFriendData;
          const currentLogedInUserId = data.currentLogedInUserId;

          newchat.style.left = "-100%";
          tempo.style.display = "none";
          chatslist.style.display = "block";
          chatslist.innerHTML += displayconvo(
            userOneFriendData,
            convoId,
            currentLogedInUserId
          );
          const allChats = document.getElementsByClassName("onechat");
          // console.log('convo added successfully');

          // console.log('convo displayed successfully')
        });
      } else if (response.status === 201) {
        return response.json().then(function (data) {
          const allChats = document.getElementsByClassName("onechat");

          if (allChats !== 0) {
            for (let onechat of allChats) {
              if (
                onechat.getAttribute("data-convor-id") === data["convor_id"]
              ) {
                newchat.style.left = "-100%";
                onechat.click();
                onechat.classList.add("onechathighlighted");
                // console.log('convo exist opening convo')

                setTimeout(() => {
                  onechat.classList.remove("onechathighlighted");
                }, 1500);
              }
            }
          }
        });
      } else if (response.status === 202) {
        return response.json().then(function (data) {
          const convoId = data.convoId;
          const userOneFriendData = data.userOneFriendData;
          const currentLogedInUserId = data.currentLogedInUserId;

          // console.log(convoId);
          // console.log(data);
          newchat.style.left = "-100%";
          tempo.style.display = "none";
          chatslist.style.display = "block";
          chatslist.innerHTML += displayconvo(
            userOneFriendData,
            convoId,
            currentLogedInUserId
          );
          // console.log('Convo was already added by your friend')
        });
      }
    })
    .catch(function (error) {
      console.log("Error fetching user data:", error);
    });
}

// function htmlStringToArray(htmlString) {

//     const tempContainer = document.createElement('div');
//     tempContainer.innerHTML = htmlString;
//     const elementsArray = Array.from(tempContainer.children);

//     return elementsArray;
// }

// function checkForNewMessages() {

//     fetch('checkformessages.php')
