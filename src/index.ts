/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export interface Env {
// 	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
// 	// MY_KV_NAMESPACE: KVNamespace;
// 	//
// 	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
// 	// MY_DURABLE_OBJECT: DurableObjectNamespace;
// 	//
// 	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
// 	// MY_BUCKET: R2Bucket;
// }

// export default {
// 	async fetch(
// 		request: Request,
// 		env: Env,
// 		ctx: ExecutionContext
// 	): Promise<Response> {
// 		return new Response("Hello World!");
// 	},
// };

type BLOG = {
	id: number,
	title: string,
	content: string
}

const blogs: BLOG[] = []


app.get('/api/blogs', (c) => c.json(blogs))

app.get('/api/blogs/:id', (c) => {
	const { id } = c.req.param()
	const blog = blogs.filter(data => data.id === parseInt(id))
	return c.json(blog)
})

app.post('/api/blogs', async (c) => {
	const body = await c.req.parseBody() as BLOG;
	if (!body) return c.json({ status: 401, message: "The request payload is required" })
	const newBlog = {
		id: blogs.length + 1,
		title: body.title,
		content: body.content
	}
	blogs.push(newBlog)
	return c.json({ data: newBlog })
})

import { basicAuth } from 'hono/basic-auth'

app.use(
	'/api/*',
	basicAuth({
		username: 'ari',
		password: '12345'
	})
)