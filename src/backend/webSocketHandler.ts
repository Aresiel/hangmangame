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
                const session = new Session(message.max_guesses, [player]);
                sessions.set(session.id, session);
                ws.subscribe(`session-${session.id}`);
                return {
                    type: "SESSION_CREATED" as const,
                    session_id: session.id,
                    player_id: player.id
                };

            } else if(message.type === "JOIN_SESSION"){

                const session = sessions.get(message.session_id);
                if(session === undefined) {
                    return {type: "ERROR" as const, message: "Session not found"};
                }
                const player = new Player(message.player_name);
                session.addPlayer(player);
                ws.subscribe(`session-${session.id}`);
                return {
                    type: "SESSION_JOINED" as const,
                    session_id: session.id,
                    player_id: player.id
                };

            } else if(message.type === "SEND_MESSAGE"){

                const session = sessions.get(message.session_id);
                if(session === undefined) {
                    return {type: "ERROR" as const, message: "Session not found"};
                }
                const player = session.players.find(p => p.id === message.player_id);
                if (player === undefined){
                    return {type: "ERROR" as const, message: "Player not found"};
                }

                const response = {
                    type: "MESSAGE_SENT" as const,
                    message: message.message,
                    player_name: player.name
                }

                ws.publish(`session-${session.id}`, response);
                return response;
            }
        }
    })