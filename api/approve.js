export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Only POST allowed'
    })
  }

  try {
    return res.status(200).json({
      success: true,
      message: 'Payment approved'
    })
  } catch (error) {
    return res.status(500).json({
      error: error.message
    })
  }
}
