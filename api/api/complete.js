export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Only POST allowed'
    })
  }

  try {
    const { paymentId, txid } = req.body || {}

    if (!paymentId || !txid) {
      return res.status(400).json({
        error: 'paymentId or txid missing'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Payment completed',
      paymentId,
      txid
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}
