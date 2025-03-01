import { treaty } from '@elysiajs/eden';
import type { App } from "../backend/";
import {assertNonNull, castTo} from "../shared/util";

const api = treaty<App>(document.location.host);

const ws = api.ws.index.subscribe(); // `ws.index` is required as `/ws` is the prefix of webSocketHandler

function outputToArea(message: string) {
    const outputArea = castTo(HTMLTextAreaElement, assertNonNull(document.getElementById("output"), "output textarea is null"));
    outputArea.value += message + "\n";
}

ws.subscribe(({data: message}) => {
    console.log("[ws] got " + JSON.stringify(message));
    if(message.type === "SESSION_CREATED") {
        outputToArea(`Session created with id "${message.session_id}" and player id "${message.player_id}"`);
    } else {
        outputToArea(`Unhandled message: "${JSON.stringify(message)}"`);
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