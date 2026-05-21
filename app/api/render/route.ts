import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { VSLScript } from '@/lib/types'

const execAsync = promisify(exec)

const REMOTION_PATH = path.join(process.cwd(), '..', 'remotion-demo')

export async function POST(request: NextRequest) {
  try {
    const { script }: { script: VSLScript } = await request.json()

    // Write the script JSON to the remotion project
    const scriptPath = path.join(REMOTION_PATH, 'src', 'script.json')
    await writeFile(scriptPath, JSON.stringify(script, null, 2))

    // Ensure output directory exists
    await mkdir(path.join(REMOTION_PATH, 'out'), { recursive: true })

    // Trigger Remotion render
    const outputFile = `out/vsl-${Date.now()}.mp4`
    const { stdout, stderr } = await execAsync(
      `npx remotion render VSLDynamic ${outputFile} --props='${JSON.stringify({ scriptPath: './src/script.json' })}'`,
      {
        cwd: REMOTION_PATH,
        timeout: 300000, // 5 min
      }
    )

    return NextResponse.json({
      success: true,
      output: outputFile,
      log: stdout,
    })
  } catch (error) {
    console.error('Render error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur de rendu' },
      { status: 500 }
    )
  }
}
