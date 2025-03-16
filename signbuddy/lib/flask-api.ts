export async function detectSign(imageData: string) {
  try {
    const response = await fetch("/api/detect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageData }),
    })

    if (!response.ok) {
      throw new Error("Failed to detect sign")
    }

    return await response.json()
  } catch (error) {
    console.error("Error detecting sign:", error)
    throw error
  }
}

// Generic function to call any Flask endpoint
export async function callFlaskEndpoint(endpoint: string, data: any) {
  try {
    const response = await fetch("/api/flask-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint, data }),
    })

    if (!response.ok) {
      throw new Error(`Failed to call Flask endpoint: ${endpoint}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error calling Flask endpoint ${endpoint}:`, error)
    throw error
  }
}

