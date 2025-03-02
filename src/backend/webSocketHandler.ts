import {Elysia, t} from "elysia";
import {ClientMessage, ServerMessage} from "./messageTypes";
import {Session} from "../model/Session";
import {Player} from "../model/Player";

const sessions = new Map<string, Session>();

export const webSocketRoutes = new Elysia({ prefix: "/ws"})
    .ws("/", {
        body: ClientMessage,
        response: ServerMessage,
        message(ws, message) {
            if(message.type === "PING"){

                ws.send({type: "PONG" as const});
                return;

            } else if(message.type === "ECHO"){

                ws.send({type: "ECHO" as const, message: message.message});
                return;

            } else if(message.type === "CREATE_SESSION") {

                const player = new Player(message.host_name);
                const session = new Session(message.max_guesses, player);
                sessions.set(session.id, session);
                ws.subscribe(`session-${session.id}`);

                ws.send({
                    type: "PLAYER_OBTAINED",
                    name: player.name,
                    public_id: player.public_id,
                    private_id: player.private_id
                })

                ws.send({
                    type: "SESSION_OBTAINED",
                    session_id: session.id,
                    players: session.getPlayers().map(p => ({ public_id: p.public_id, name: p.name }))
                })

                ws.publish(`session-${session.id}`, {
                    type: "PLAYER_JOINED",
                    name: player.name,
                    public_id: player.public_id
                })

            } else if(message.type === "JOIN_SESSION"){

                const session = sessions.get(message.session_id);
                if(session === undefined) {
                    return {type: "ERROR" as const, message: "Session not found"};
                }

                const player = new Player(message.name);
                session.addPlayer(player);

                ws.subscribe(`session-${session.id}`);

                ws.send({
                    type: "PLAYER_OBTAINED",
                    name: player.name,
                    public_id: player.public_id,
                    private_id: player.private_id
                })

                ws.send({
                    type: "SESSION_OBTAINED",
                    session_id: session.id,
                    players: session.getPlayers().map(p => ({ public_id: p.public_id, name: p.name }))
                })

                ws.publish(`session-${session.id}`, {
                    type: "PLAYER_JOINED",
                    name: player.name,
                    public_id: player.public_id
                })

            } else if(message.type === "LEAVE_SESSION") {

                const session = sessions.get(message.session_id);
                if(session === undefined) {
                    return {type: "ERROR" as const, message: "Session not found"};
                }
                const player = session.getPlayerByPrivateId(message.private_id);
                if (player === undefined){
                    return {type: "ERROR" as const, message: "Player not found"};
                }
                session.removePlayer(player);

                ws.publish(`session-${session.id}`, {
                    type: "PLAYER_LEFT" as const,
                    name: player.name,
                    public_id: player.public_id
                });
                ws.unsubscribe(`session-${session.id}`); // It seems that publishing isn't possible if you're not subscribed?

            } else if(message.type === "SEND_MESSAGE"){

                const session = sessions.get(message.session_id);
                if(session === undefined) {
                    return {type: "ERROR" as const, message: "Session not found"};
                }
                const player = session.getPlayerByPrivateId(message.private_id);
                if (player === undefined){
                    return {type: "ERROR" as const, message: "Player not found"};
                }

                const response = {
                    type: "MESSAGE_SENT" as const,
                    message: message.message,
                    name: player.name,
                    public_id: player.public_id
                }

                ws.publish(`session-${session.id}`, response);
                ws.send(response);
            } else {
                const exhaustiveCheck: never = message;
            }
        }
    })