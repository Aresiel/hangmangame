import {Static, t, TSchema} from 'elysia'


/**
 * BOTH CLIENT AND SERVER MESSAGES
 */
export const Error = t.Object({
    type: t.Literal("ERROR"),
    message: t.String()
})
export type Error = Static<typeof Error>

/**
 * MESSAGES CLIENT SENDS TO SERVER
 */

export const CreateSession = t.Object({
    type: t.Literal("CREATE_SESSION"),
    max_guesses: t.Number()
})
export type CreateSession = Static<typeof CreateSession>

export const JoinSession = t.Object({
    type: t.Literal("JOIN_SESSION"),
    session_id: t.String(),
    name: t.String()
})
export type JoinSession = Static<typeof JoinSession>

export const LeaveSession = t.Object({
    type: t.Literal("LEAVE_SESSION"),
    session_id: t.String(),
    private_id: t.String()
})
export type LeaveSession = Static<typeof LeaveSession>

export const SendMessage = t.Object({
    type: t.Literal("SEND_MESSAGE"),
    message: t.String(),
    private_id: t.String(),
    session_id: t.String()
})
export type SendMessage = Static<typeof SendMessage>

export const Subscribe = t.Object({
    type: t.Literal("SUBSCRIBE"),
    topic: t.String()
})

export const ClientMessage = t.Union([
    Subscribe
])
export type ClientMessage = Static<typeof ClientMessage>

/**
 * MESSAGES SERVER SENDS TO CLIENT
 */

export const SessionObtained = t.Object({
    type: t.Literal("SESSION_OBTAINED"),
    session_id: t.String(),
    players: t.Array(t.Object({
        name: t.String(), public_id: t.String()
    }))
})
export type SessionObtained = Static<typeof SessionObtained>

export const PlayerObtained = t.Object({
    type: t.Literal("PLAYER_OBTAINED"),
    name: t.String(),
    public_id: t.String(),
    private_id: t.String()
})
export type PlayerObtained = Static<typeof PlayerObtained>

export const PlayerJoined = t.Object({
    type: t.Literal("PLAYER_JOINED"),
    name: t.String(),
    public_id: t.String()
})
export type PlayerJoined = Static<typeof PlayerJoined>

export const PlayerLeft = t.Object({
    type: t.Literal("PLAYER_LEFT"),
    name: t.String(),
    public_id: t.String()
})
export type PlayerLeft = Static<typeof PlayerLeft>

export const MessageSent = t.Object({
    type: t.Literal("MESSAGE_SENT"),
    message: t.String(),
    name: t.String(),
    public_id: t.String()
})
export type MessageSent = Static<typeof MessageSent>

export const ServerMessage = t.Union([
    PlayerJoined,
    PlayerLeft,
    MessageSent,
    Error
])
export type ServerMessage = Static<typeof ServerMessage>