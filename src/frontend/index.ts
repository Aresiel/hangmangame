import { treaty } from '@elysiajs/eden';
import type { App } from "../backend/";
import {assertNonNull, assertNonUndefined, castTo} from "../shared/util";
import * as assert from "node:assert";

(async () => {

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

    const api = treaty<App>(document.location.host).api;

    const ws = api.ws.subscribe(); // `ws.index` is required as `/ws` is the prefix of webSocketHandler

    function outputToArea(message: string) {
        const outputArea = castTo(HTMLTextAreaElement, assertNonNull(document.getElementById("output"), "output textarea is null"));
        outputArea.value += message + "\n";
    }

    ws.subscribe(({data: message}) => {
        console.log("[ws] got " + JSON.stringify(message));
        if (message.type == "PLAYER_LEFT") {

            if (message.name)
                outputToArea(`Player left: ${message.name}`);

        } else if (message.type === "MESSAGE_SENT") {

            outputToArea(`${message.name}: ${message.message}`);

        } else if (message.type === "PLAYER_JOINED") {

            outputToArea(`Player joined: ${message.name}`);

        } else if (message.type === "ERROR") {

            outputToArea(`Error: ${message.message}`);

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
    create_session_form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const max_guesses: number = castTo(HTMLInputElement, assertNonNull(create_session_form.querySelector("input[name='max_guesses']"))).valueAsNumber;

        const {data, error} = await api.session.new.post({
            type: "CREATE_SESSION",
            max_guesses: max_guesses,
        })

        if (error) {
            outputToArea("Error " + error.status + ": " + JSON.stringify(error.value))
            return
        }

        set_session_id(data.session_id);
        castTo(HTMLInputElement, assertNonNull(join_session_form.querySelector("input[name='session_id']"))).value = data.session_id;
        document.querySelector("#create_session_form>button[type='submit']")?.setAttribute("disabled", "disabled")
        outputToArea(`Created session with id ${data.session_id} and players [${data.players.map(p => p.name).join(", ")}]`)
    })

    const join_session_form = assertNonNull(document.getElementById("join_session_form"), "join_session_form is null") as HTMLFormElement;
    join_session_form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const session_id: string = castTo(HTMLInputElement, assertNonNull(join_session_form.querySelector("input[name='session_id']"))).value
        const player_name: string = castTo(HTMLInputElement, assertNonNull(join_session_form.querySelector("input[name='player_name']"))).value

        const {data, error} = await api.session.join.post({
            type: "JOIN_SESSION",
            session_id,
            name: player_name
        })

        if (error) {
            outputToArea("Error " + error.status + ": " + JSON.stringify(error.value))
            return
        }

        ws.send({"type": "SUBSCRIBE", "topic": `session-${session_id}`})

        set_session_id(session_id)
        set_player_ids(data.public_id, data.private_id)
        document.querySelector("#join_session_form>button[type='submit']")?.setAttribute("disabled", "disabled")
        document.querySelector("#leave_session_form>button[type='submit']")?.removeAttribute("disabled")
        document.querySelector("#create_session_form>button[type='submit']")?.setAttribute("disabled", "disabled")
        outputToArea(`Joined session with id ${session_id} and player name ${player_name}`)
    })

    const leave_session_form = assertNonNull(document.getElementById("leave_session_form"), "leave_session_form is null") as HTMLFormElement;
    leave_session_form.addEventListener("submit", async (event) => {
        event.preventDefault()

        const {error} = await api.session.leave.post({
            type: "LEAVE_SESSION",
            private_id: assertNonUndefined(player_private_id, "player_private_id is undefined"),
            session_id: assertNonUndefined(session_id, "session_id is undefined")
        })

        if (error) {
            outputToArea("Error " + error.status + ": " + JSON.stringify(error.value))
            return
        }

        outputToArea(`Left session with id ${session_id}.`)
    })

    const send_message_form = assertNonNull(document.getElementById("send_message_form"), "send_message_form is null") as HTMLFormElement;
    send_message_form.addEventListener("submit", async (event) => {
        event.preventDefault()
        const message: string = castTo(HTMLInputElement, assertNonNull(send_message_form.querySelector("input[name='message']"))).value

        const {error} = await api.session.chat.post({
            type: "SEND_MESSAGE",
            message,
            private_id: assertNonUndefined(player_private_id, "player_id is undefined"),
            session_id: assertNonUndefined(session_id, "session_id is undefined")
        })

        if (error) {
            outputToArea("Error " + error.status + ": " + JSON.stringify(error.value))
            return
        }
    })

})()