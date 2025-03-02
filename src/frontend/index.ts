import { treaty } from '@elysiajs/eden';
import type { App } from "../backend/";
import {assertNonNull, assertNonUndefined, castTo} from "../shared/util";
import * as assert from "node:assert";

let session_id: string | undefined = undefined;
let player_public_id: string | undefined = undefined;
let player_private_id: string | undefined = undefined;

function set_session_id(id: string) {
    session_id = id;
    castTo(HTMLInputElement, assertNonNull(document.getElementById("session_id"))).value = session_id;
}

function set_player_ids(public_id: string, private_id: string) {
    player_public_id = public_id;
    player_private_id = private_id;
    castTo(HTMLInputElement, assertNonNull(document.getElementById("player_public_id"))).value = player_public_id;
    castTo(HTMLInputElement, assertNonNull(document.getElementById("player_private_id"))).value = player_private_id;
}

function setFormsToInSessionState(){
    document.querySelector("#create_session_form>button[type='submit']")?.setAttribute("disabled", "disabled")
    document.querySelector("#join_session_form>button[type='submit']")?.setAttribute("disabled", "disabled")
    document.querySelector("#leave_session_form>button[type='submit']")?.removeAttribute("disabled")
}

const api = treaty<App>(document.location.host);

const ws = api.ws.index.subscribe(); // `ws.index` is required as `/ws` is the prefix of webSocketHandler

function outputToArea(message: string) {
    const outputArea = castTo(HTMLTextAreaElement, assertNonNull(document.getElementById("output"), "output textarea is null"));
    outputArea.value += message + "\n";
}

ws.subscribe(({data: message}) => {
    console.log("[ws] got " + JSON.stringify(message));
    if(message.type === "SESSION_OBTAINED") {

        set_session_id(message.session_id)
        setFormsToInSessionState()
        outputToArea(`Session obtained with id "${message.session_id}" and players [${message.players.map(p => p.name).join(", ")}]`);

    } else if(message.type === "PLAYER_OBTAINED") {

        document.title += " - " + message.name;
        set_player_ids(message.public_id, message.private_id)
        outputToArea(`Player ${message.name} obtained with public id "${message.public_id}" and private id "${message.private_id}"`);

    } else if(message.type == "PLAYER_LEFT") {

        if(message.name)
        outputToArea(`Player left: ${message.name}`);

    } else if(message.type === "MESSAGE_SENT") {

        outputToArea(`${message.name}: ${message.message}`);

    } else if(message.type === "PLAYER_JOINED"){

        outputToArea(`Player joined: ${message.name}`);

    } else if(message.type === "ERROR") {

        outputToArea(`Error: ${message.message}`);

    } else if(message.type === "ECHO") {

        outputToArea(`${message.message}`);

    } else if(message.type === "PONG") {

        outputToArea("Pong!");

    } else {
        const exhaustiveCheck: never = message;
    }
});

ws.on("open", () => {
    console.log("[ws] connected");
    outputToArea("Connected to server");
})

ws.on("close", () => {
    console.log("[ws] disconnected");
    outputToArea("Disconnected from server");
})

ws.on("error", (error) => {
    console.error("[ws] error " + error);
    outputToArea("Error: " + error);
})

const create_session_form = assertNonNull(document.getElementById("create_session_form"), "create_session_form is null") as HTMLFormElement;
create_session_form.addEventListener("submit", (event) => {
    event.preventDefault()
    const host_name: string = castTo(HTMLInputElement, assertNonNull(create_session_form.querySelector("input[name='player_name']"))).value
    const max_guesses: number = castTo(HTMLInputElement, assertNonNull(create_session_form.querySelector("input[name='max_guesses']"))).valueAsNumber;

    ws.send({
        type: "CREATE_SESSION",
        host_name,
        max_guesses
    })
})

const join_session_form = assertNonNull(document.getElementById("join_session_form"), "join_session_form is null") as HTMLFormElement;
join_session_form.addEventListener("submit", (event) => {
    event.preventDefault()
    const session_id: string = castTo(HTMLInputElement, assertNonNull(join_session_form.querySelector("input[name='session_id']"))).value
    const player_name: string = castTo(HTMLInputElement, assertNonNull(join_session_form.querySelector("input[name='player_name']"))).value

    ws.send({
        type: "JOIN_SESSION",
        session_id,
        name: player_name
    })
})

const leave_session_form = assertNonNull(document.getElementById("leave_session_form"), "leave_session_form is null") as HTMLFormElement;
leave_session_form.addEventListener("submit", (event) => {
    event.preventDefault()
    ws.send({
        type: "LEAVE_SESSION",
        private_id: assertNonUndefined(player_private_id, "player_private_id is undefined"),
        session_id: assertNonUndefined(session_id, "session_id is undefined")
    })
    outputToArea("Leaving session, refresh the page to start a new session.")
})

const send_message_form = assertNonNull(document.getElementById("send_message_form"), "send_message_form is null") as HTMLFormElement;
send_message_form.addEventListener("submit", (event) => {
    event.preventDefault()
    const message: string = castTo(HTMLInputElement, assertNonNull(send_message_form.querySelector("input[name='message']"))).value

    ws.send({
        type: "SEND_MESSAGE",
        message,
        private_id: assertNonUndefined(player_private_id, "player_id is undefined"),
        session_id: assertNonUndefined(session_id, "session_id is undefined")
    })
})