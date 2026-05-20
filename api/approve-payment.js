export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Only POST allowed' })
  }

  const { paymentId } = req.body || {}

  if (!paymentId) {
    return res.status(400).json({ success: false, error: 'paymentId missing' })
  }

  if (!process.env.PI_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'PI_API_KEY missing in Vercel Environment Variables'
    })
  }

  try {
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const text = await response.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        status: response.status,
        error: data
      })
    }

    return res.status(200).json({
      success: true,
      paymentId,
      data
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Approve payment failed'
    })
  }
}
