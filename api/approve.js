export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  try {

    const { paymentId } = req.body

    if (!paymentId) {
      return res.status(400).json({
        error: 'paymentId missing'
      })
    }

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

    console.log('APPROVE RESPONSE:', text)

    return res.status(200).json({
      success: true,
      raw: text
    })

  } catch (error) {

    console.log(error)

    return res.status(500).json({
      error: error.message
    })
  }
}
