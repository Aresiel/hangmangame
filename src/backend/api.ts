import {Elysia, error, t} from "elysia";
import {
    ClientMessage,
    CreateSession, Error,
    JoinSession, LeaveSession,
    PlayerObtained,
    SendMessage,
    ServerMessage,
    SessionObtained
} from "./messageTypes";
import {Session} from "../model/Session";
import {Player} from "../model/Player";
import {ok} from "../shared/util";
import {MessageDistributor} from "./MessageDistributor";

const sessions = new Map<string, Session>();
const messageDistributor = new MessageDistributor();

export const api = new Elysia({prefix: "/api"})
    .ws("/ws", {
        body: ClientMessage,
        response: ServerMessage,
        message(ws, message) {
            if(message.type === "SUBSCRIBE"){
                messageDistributor.subscribe(message.topic, (message) => { ws.send(message); })
            }
        }
    })
    .post(
        "/session/new",
        ({body}) => {
            const session = new Session(body.max_guesses)
            sessions.set(session.id, session);
            return {
                type: "SESSION_OBTAINED",
                session_id: session.id,
                players: session.getPlayers().map(p => ({public_id: p.public_id, name: p.name}))
            };
        }, {
            body: CreateSession,
            response: SessionObtained,
        })
    .post("/session/join", ({body}) => {
        const session = sessions.get(body.session_id);
        if (session === undefined) {
            throw error("Bad Request"); // Session not found
        }
        const player = new Player(body.name);

        const resultAddPlayer = session.addPlayer(player)
        if(!ok(resultAddPlayer)) {
            throw error("Bad Request") // Player is already in session
        }

        messageDistributor.publish(`session-${session.id}`, {
            type: "PLAYER_JOINED" as const,
            name: player.name,
            public_id : player.public_id
        })

        return {
            type: "PLAYER_OBTAINED",
            name: player.name,
            public_id: player.public_id,
            private_id: player.private_id
        }
    }, {
        body: JoinSession,
        response: PlayerObtained,
    })
    .post("/session/leave", ({body}) => {
        const session = sessions.get(body.session_id);
        if (session === undefined) {
            throw error("Bad Request"); // Session not found
        }

        const player = session.getPlayerByPrivateId(body.private_id);
        if (player === undefined) {
            throw error("Bad Request"); // Player not found
        }

        const resultRemovePlayer = session.removePlayer(player)
        if(!ok(resultRemovePlayer)) {
            throw error("Bad Request"); // Player is not in session
        }

        messageDistributor.publish(`session-${session.id}`, {
            type: "PLAYER_LEFT" as const,
            name: player.name,
            public_id : player.public_id
        })

    }, {
        body: LeaveSession,
        response: t.Void()
    })
    .post("/session/chat", ({body}) => {
        const session = sessions.get(body.session_id);
        if (session === undefined) {
            throw error("Bad Request"); // Session not found
        }

        const player = session.getPlayerByPrivateId(body.private_id);
        if (player === undefined) {
            throw error("Bad Request"); // Player not found
        }

        messageDistributor.publish(`session-${session.id}`, {
            type: "MESSAGE_SENT" as const,
            message: body.message,
            name: player.name,
            public_id: player.public_id
        })
    }, {
        body: SendMessage,
        response: t.Void()
    })