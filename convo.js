const chatslist = document.querySelector('.chatslist');
const tempo = document.querySelector('.tempo');
const newchat = document.getElementById('newchat');

document.addEventListener('DOMContentLoaded', function () {
    onpageloaddisplayconvo();
    addConvo();
})

function addConvo() {
    addEventListener('click', function (event) {
        if (event.target.matches('.chat')) {
            const convoPackage = event.target.getAttribute('data-user-id');

            fetch('convo.inc.php', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ convoPackage })

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
                            chatslist.innerHTML += displayconvo(userOneFriendData, convoId, currentLogedInUserId);
                            // const allChats = document.getElementsByClassName('onechat');
                            console.log('convo added successfully');

                            // console.log('convo displayed successfully')
                        })
                    } else if (response.status === 201) {

                        return response.json().then(function (data) {

                            const allChats = document.getElementsByClassName('onechat');

                            if (allChats !== 0) {
                                for (let onechat of allChats) {
                                    if (onechat.getAttribute("data-convor-id") === data["convor_id"]) {
                                        newchat.style.left = "-100%";
                                        onechat.click();
                                        onechat.classList.add('onechathighlighted');
                                        console.log('convo exist opening convo')

                                        setTimeout(() => {
                                            onechat.classList.remove('onechathighlighted');
                                        }, 1500)
                                    }
                                }
                            }


                        })
                    } else if (response.status === 202) {
                        return response.json().then(function (data) {
                            const convoId = data.convoId;
                            const userOneFriendData = data.userOneFriendData;
                            const currentLogedInUserId = data.currentLogedInUserId;

                            console.log(convoId);
                            console.log(data);
                            newchat.style.left = "-100%";
                            tempo.style.display = "none";
                            chatslist.style.display = "block";
                            chatslist.innerHTML += displayconvo(userOneFriendData, convoId, currentLogedInUserId);
                            console.log('Convo was already added by your friend')
                        })
                    }
                })
                .catch(function (error) {
                    console.log("Error fetching user data:", error);
                })

        }
    })
}


function displayconvo(userOneFriendData, convoId, currentLogedInUserId) {
    const onechat = document.createElement('div');
    onechat.classList.add('onechat')
    onechat.setAttribute('data-receiver-id', userOneFriendData["user_id"]);
    onechat.setAttribute('data-convor-id', convoId["convor_id"]);
    onechat.setAttribute('data-profilepic-id', userOneFriendData["profile_pic_id"]);
    onechat.setAttribute('data-receiver-username', userOneFriendData["username"]);
    onechat.setAttribute('data-currentLogedInUserId', currentLogedInUserId);

    const profpic = document.createElement('img');
    profpic.classList.add('profpic')
    profpic.src = userOneFriendData["profile_pic_id"];

    const details = document.createElement('div');
    details.classList.add('details')

    const jina = document.createElement('h3');
    jina.classList.add('jina')
    jina.textContent = userOneFriendData["username"];

    const message = document.createElement('div');
    message.classList.add('message')


    const text = document.createElement('p');
    text.classList.add('text');
    text.textContent = 'Open to Chat!......';

    const deletechat = document.createElement('input');
    deletechat.classList.add('deletechat');
    deletechat.textContent = "Delete";

    message.appendChild(text);
    details.appendChild(jina);
    details.appendChild(message);
    onechat.appendChild(profpic);
    onechat.appendChild(details);

    return onechat.outerHTML;
}


function onpageloaddisplayconvo() {

    fetch('convo.inc.php', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ convoPackage: 'initial_load' })

    })
        .then(function (response) {
            if (response.status === 203) {

                return response.json().then(function (data) {

                    const allUserFriendsData = data.allUserFriendsData;
                    const currentLoggedUserConvoIds = data.currentLoggedUserConvoIds;
                    const currentLogedInUserId = data.currentLogedInUserId;
                    console.log(`Convo data added after reload: `, data);
                    newchat.style.left = "-100%";
                    tempo.style.display = "none";
                    chatslist.style.display = "block";

                    let convocontainers = displayconvoonload(allUserFriendsData, currentLoggedUserConvoIds, currentLogedInUserId);
                    convocontainers.forEach(function (convocontainer) {
                        chatslist.appendChild(convocontainer);
                    })

                    console.log('after reload convo displayed successfully')
                })
            } else {
                console.log('friends displaying failed')
            }
        })
        .catch(function (error) {
            console.log("Error fetching user data:", error);
        })
}

function displayconvoonload(allUserFriendsData, currentLoggedUserConvoIds, currentLogedInUserId) {
    let convocontainers = [];

    for (let i = 0; i < allUserFriendsData.length; i++) {
        const oneUserFriendData = allUserFriendsData[i];

        for (let j = 0; j < currentLoggedUserConvoIds.length; j++) {
            const oneConvoId = currentLoggedUserConvoIds[j];

            if (doesConvorIdMatchFriendsIdFromDb(oneConvoId["convor_id"], oneUserFriendData["user_id"], currentLogedInUserId)) {

                const onechat = document.createElement('div');
                onechat.classList.add('onechat')
                onechat.setAttribute('data-receiver-id', oneUserFriendData["user_id"]);

                onechat.setAttribute('data-convor-id', oneConvoId['convor_id']);
                console.log(`This convo id: ${oneConvoId["convor_id"]} is for user ${oneUserFriendData["user_id"]}`);

                onechat.setAttribute('data-profilepic-id', oneUserFriendData["profile_pic_id"]);
                onechat.setAttribute('data-receiver-username', oneUserFriendData["username"]);
                onechat.setAttribute('data-currentLogedInUserId', currentLogedInUserId);

                const profpic = document.createElement('img');
                profpic.classList.add('profpic')
                profpic.src = oneUserFriendData["profile_pic_id"];

                const details = document.createElement('div');
                details.classList.add('details')

                const jina = document.createElement('h3');
                jina.classList.add('jina')
                jina.textContent = oneUserFriendData["username"];

                const message = document.createElement('div');
                message.classList.add('message')

                const text = document.createElement('p');
                text.classList.add('text');
                text.textContent = 'Open to Chat!.......';

                message.appendChild(text);
                details.appendChild(jina);
                details.appendChild(message);
                onechat.appendChild(profpic);
                onechat.appendChild(details);

                convocontainers.push(onechat);
            }

        }
    }

    return convocontainers;
}


function doesConvorIdMatchFriendsIdFromDb(convorId, friendsId, loggedUserId) {

    const trimmedConvorId = String(convorId).replace(new RegExp(`^${loggedUserId}|${loggedUserId}$`, 'g'), '');

    friendsIdstring = friendsId.toString();

    return trimmedConvorId === friendsIdstring;
}
