import {Elysia, t} from 'elysia'
import { staticPlugin } from "@elysiajs/static";
import {api} from "./api";


const app = new Elysia()
    .use(api)
    .use(staticPlugin({
        assets: "dist/frontend",
        prefix: "/"
    }))
    .onStart(({ server }) => console.log(`Started server on ${server?.hostname}:${server?.port}` + (server?.development ? " in development mode" : "") ))
    .listen(8080)

export type App = typeof app;