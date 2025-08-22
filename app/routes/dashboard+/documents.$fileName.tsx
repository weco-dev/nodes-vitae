import path from 'path'
import fs from 'fs/promises'
import { requireUserId } from '#app/utils/auth.server.ts'
import { type Route } from './+types/index'

export async function loader({ request, params }: Route.LoaderArgs) {
	// Check if user is authenticated
	await requireUserId(request)

	const { fileName } = params

	// Sanitize the filename to prevent directory traversal attacks
	const sanitizedFileName = path.basename(fileName)

	// Define the path to your protected files directory (outside of public)
	const filePath = path.join(
		process.cwd(),
		'data',
		'uploads',
		'documents',
		'files',
		sanitizedFileName,
	)

	try {
		// Check if file exists
		const stat = await fs.stat(filePath)

		if (!stat.isFile()) {
			throw new Error('Not a file')
		}

		// Read the file
		const file = await fs.readFile(filePath)

		// Create response with appropriate headers
		return new Response(file, {
			headers: {
				'Content-Type': 'application/pdf', // Adjust based on file type
				'Content-Disposition': `attachment; filename="${sanitizedFileName}"`,
				'Content-Length': stat.size.toString(),
			},
		})
	} catch (error) {
		throw new Response('File not found', { status: 404 })
	}
}
